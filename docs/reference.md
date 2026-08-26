# 开发规范与官方参考（第一更新来源）

> 本文档是 dsh-plugin-hub 的**开发前必读**。核心规则：**遇到问题先查官方文档与官方源码，禁止凭空猜测。**
> 每个结论都标注出处（官方 URL 或本机全局安装的源码路径），方便复核与更新。

## 0. 第一原则：先查官方，再查源码，最后才实验

遇到问题、想加功能、怀疑行为不对时，按以下顺序排查，**不允许跳步**：

1. **官方文档站**：<https://deepseek-harness.github.io/deepseek-harness/reference/>
   —— 架构总览、子系统（web-server / client-modules / storage / settings 等）、Cordis 入门、配置目录（config-catalog）。
2. **官方源码仓库**：<https://github.com/deepseek-ai/deepseek-harness>
   —— `packages/` 下每个包的真实实现与 README；`docs/event-producer-consumer.md` 是事件映射总表。
   **建议克隆到本地（浅克隆即可，只读不改），配合文档站边学习边开发**：
   `git clone --depth 1 https://github.com/deepseek-ai/deepseek-harness.git bbzc-suite/dsh-harness-official`
   （详见 [docs/README.md](./README.md)）。
3. **本机全局安装源码**（与当前运行的 dsh 版本一致，离线可查）：
   - dsh 主程序：`/opt/homebrew/lib/node_modules/@deepseek-ai/dsh/lib/`
   - loader：`/opt/homebrew/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/cordis-plugin-loader/lib/index.js`
   - client-modules：`/opt/homebrew/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-client-modules/lib/index.js`
4. **运行时实况**：`dsh --profile web --dump-config`（打印实际启动的配置树）、`curl http://127.0.0.1:7923/`（看 `__DSH_BOOT__` 图）、`lsof -ti tcp:7923`（找宿主进程）。
5. **实验验证**：只有前三步都查过仍无答案时，才允许用最小实验验证；结论必须回填到本文档"已知结论"一节。

**写代码前的硬约束**：本插件只使用官方暴露的 seam（`ctx.webServer` / `ctx.loader` / `ctx.clientModules` 等），**不改官方内部**。所有与宿主交互的行为，先在本节出处里确认 API 语义。

---

## 1. 官方核心机制速查

### 1.1 运行中的 dsh = 一棵插件树（Cordis）

- 官方原话：*"运行中的 `dsh` 是一棵插件树，由启动时按序叠加的各层组合而成。"*
- 出处：reference 首页「Profile 与组合包」；Cordis 入门 <https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer>
- 插件向共享上下文贡献服务、类型化事件和可逆副作用；**一切注册都是副作用，插件卸载时自动撤销**。

### 1.2 Profile 与组合包（bundle）

- **profile**：存放在 Harness home（默认 `~/.dsh/profiles/<name>`）的具名组装，列出自己叠放的组合包，存放树外插件，保存用户 `cordis.patch.yml`。
- **组合包 bundle**：Cordis 配置项 + 挂载代码的分发格式，通过 `package.json` 的 `dsh` 字段声明：
  - `dsh.profile.bundles`：profile 列出要叠放的组合包（我们的 `package.json` 里就是 `@deepseek-ai/dsh-base`、`@deepseek-ai/dsh-web-app`、`dsh-plugin`）。
  - `dsh.bundle.patch`：组合包指向自己的 patch 文件（我们的是 `./cordis.patch.yml`）。
- **层叠顺序**：profile 列出的组合包 → profile 的 `cordis.patch.yml` → home 级 patch → `--patch` overlay。
- 查看本机实际配置树：`dsh --profile web --dump-config`——打印出的任何条目都可以用 patch 替换。
- 出处：reference 首页；app-boot <https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/app-boot/README.md#profiles>

### 1.3 loader（`ctx.loader`）—— 插件树的服务端管理员

官方 API（`cordis-plugin-loader`，源码 `lib/index.js`）：

| API | 语义 | 源码位置 |
| --- | --- | --- |
| `ctx.loader.entries()` | 遍历整棵树的全部条目（含嵌套子树） | `EntryTree.entries()` L160-166 |
| `ctx.loader.create({ name, config })` | 动态装载一个插件条目 | `EntryTree.create()` L215-222 |
| `ctx.loader.remove(id)` | 停止并移除一个条目（官方推荐入口） | `Loader.remove()` L224-228 |
| `entry.id` | 条目标识；嵌套条目带 `父id:子id` 前缀 | `Entry.get id()` L344-348 |
| `entry.options.name` | 条目名 == npm 包名 | `Entry.options` L331 |
| `entry.parent.remove(id)` | 底层移除：`_dispose` → unlink → 删 store → emit `loader/partial-dispose` | `EntryGroup.remove()` L68-75 |

**关键结论（本项目卸载修复的依据）**：
- `Loader.remove(id)` 内部还会调 `tree.write()`，但 `EntryTree.write()` 默认是 **no-op**（官方注释："Persistent is supplied by subclasses"，而 `Loader` 本身没有子类化它）。所以 **`ctx.loader.remove` 是纯运行时操作，不会把配置树写进 cordis.yml**——下次重启配置树仍由 patch 重新合成。
- 条目被移除时 fiber 会被 dispose，官方机制随之触发 client-modules 对账（见 1.4）。

### 1.4 client-modules（`ctx.clientModules`）—— Web 插件表

官方文档：<https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/client-modules>
源码：`dsh-client-modules/lib/index.js`（Node 半）+ `packages/client/modules/src/client/manifest.ts`

- 扫描宿主 loader 的 entry，找出声明了 `dsh.client` 的包，组合出 `window.__DSH_BOOT__` 图，在 `/plugins/<id>/client.js` 提供各 bundle。
- 每行 entry 形如：`{ id（==包名）, url: '/plugins/<id>/client.js?rev=<rev>', rev（bundle 内容哈希）, inject?, immediately?, external? }`；整图还有 `rev`（对所有行再哈希，任何行变化图就变）。
- **`rev` 是缓存失效锚点**（基于内容哈希，不是 HTTP 缓存）。
- **包元数据按名缓存且永不过期**，插件集合的变更在重启后生效；fiber 重启复用其行与 rev。
- **增量扫描 + 对账**（这是本项目"卸载即时生效"的机制基础）：
  - fiber 构造或 dispose 时发出 cordis `internal/plugin` 事件 → 该 entry 名被标脏 → 一次微任务 flush 把脏名与**实时 loader entry** 对账。
  - 对账逻辑（`processOne()` L281-297）：若实时 loader 里已无该 entry（`entry.fiber` 为 null / entry 不存在）→ `table.delete(name)` → 该行从 `__DSH_BOOT__` 图移除。
  - 因此：**从 loader 移除条目 → fiber dispose → 对账 → 刷新页面就不再加载它**。这正是 `src/server/services/install.ts` 的 `removeLoadedEntry()` 依赖的官方机制。
- 官方 API：`graph()` / `clientPath(id)` / `rebuilt(id)`（HMR 用，内容变才改 rev）/ `onRebuilt(listener)` / `onGraphChanged(listener)`。
- **404 是大声失败**：`GET /plugins/<id>/client.js` 对未知 id 或不可读 bundle 返回 404，不可读 bundle 不会表现为假成功 —— 这就是第三方插件卸载后刷新报 "failed to import loader entry" 的来源。

### 1.5 web-server（`ctx.webServer`）—— 本插件的挂载点

官方文档：<https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/web-server>

- 本插件通过 `ctx.inject(['webServer'], cb)` 在 web server 就绪后注册 `/dsh-plugin-hub/*` 路由。
- 浏览器 bundle 通过同源 HTTP 与这些路由通信（本插件 `src/server/http/routes.ts`）。

---

## 2. 本项目开发规范（落地规则）

1. **先查官方，禁止瞎猜**：任何涉及宿主行为的功能（loader、client bundle、patch、重启、存储），实现前必须完成第 0 节的排查路径，并在 PR/提交说明里标注出处。
2. **只用官方 seam**：注入 `webServer`、`loader`、`clientModules` 等服务，不修改官方包、不打内部补丁、不依赖未公开的私有字段。
3. **机制结论必须带出处**：在代码注释或本文档中写明"官方 API / 源码 Lxxx"，方便后来者复核与升级 dsh 后重新验证。
4. **HTTP 接口一律 `cache: no-store`**：`dsh-client-modules` 的 index 注入图、本插件的 `/dsh-plugin-hub/*` 接口，都依赖实时状态；浏览器 HTTP 缓存会给出过期数据（本项目曾因此"插件不显示版本"）。
5. **改动 profile 相关文件要小心**：`~/.dsh/profiles/web/` 下的 `cordis.yml`（每次启动被重写为 `[]`）、`package.json`、`cordis.patch.yml`、`pnpm-workspace.yaml` 都是宿主命脉；沙箱/脚本不得私自改动，调试由用户在自己终端执行 `bash scripts/run/restart-dev.sh`。
6. **测试先行**：纯输入/输出逻辑（解析、校验、估算）必须配单测（`tests/`，Node 内置 runner）。

---

## 3. 已知结论与踩坑记录（每个都标了出处，非猜测）

| 结论 | 出处 | 影响 |
| --- | --- | --- |
| 插件集合变更在重启后生效（loader 树是运行时的唯一真源） | reference client-modules「扫描」 | 安装后需重启才挂载 —— 我们的「待重启」提示 |
| 卸载后运行中的 loader 仍持有旧条目，刷新会因 client.js 404 崩 | `processOne()` 对账 + 「404 大声失败」 | 卸载成功后必须 `ctx.loader.remove` 条目即时生效（本项目 `removeLoadedEntry`），移除失败才提示待重启 |
| `ctx.loader.remove` 不持久化（`tree.write()` 是 no-op） | cordis-plugin-loader `Loader.remove` L224-228、L656 | 移除是纯运行时操作，重启后由 patch 重新合成配置树 |
| fiber dispose → `internal/plugin` → 对账移除 client 行 | dsh-client-modules L140-152、L281-297 | 卸载移除 loader 条目后刷新页面不再加载该插件 |
| 浏览器 HTTP 缓存导致接口数据过期 | 实际踩坑（dsh-plugin-hub） | 所有 `/dsh-plugin-hub/*` 与在线 API 必须 `cache: 'no-store'` |
| profile 目录每次启动 `cordis.yml` 被重写为 `[]` | dsh `lib/profile-boot-*.js` `prepareProfile()` | 持久化配置要写在 patch 文件，不是 cordis.yml |
| `dsh plugin remove` 只改 package.json / lock / node_modules，不动运行中 loader | 官方 CLI 行为 + 本项目排查 | 卸载即时生效必须由本插件主动 `loader.remove` |

---

## 4. 本机环境速查（debug 常用）

```sh
# 宿主进程与端口
lsof -ti tcp:7923 -sTCP:LISTEN

# 运行时插件树（__DSH_BOOT__ 图）
curl -s http://127.0.0.1:7923/ | grep -o 'DSH_BOOT__ = .*'

# 实际启动的配置树
dsh --profile web --dump-config

# 全局安装（与运行版本一致，离线查源码）
/opt/homebrew/lib/node_modules/@deepseek-ai/dsh/lib/
/opt/homebrew/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/cordis-plugin-loader/lib/index.js
/opt/homebrew/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-client-modules/lib/index.js

# profile 目录（宿主命脉，调试只读）
~/.dsh/profiles/web/{cordis.yml,package.json,cordis.patch.yml,pnpm-workspace.yaml,.dsh-market/}
```

---

## 5. 出处清单（随时可点）

- 官方文档站根：<https://deepseek-harness.github.io/deepseek-harness/reference/>
- Cordis 入门：<https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer>
- Client 模块子系统：<https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/client-modules>
- Web 服务器子系统：<https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/web-server>
- 配置目录：<https://deepseek-harness.github.io/deepseek-harness/reference/config-catalog>
- 官方源码仓库：<https://github.com/deepseek-ai/deepseek-harness>
- 事件映射总表：<https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/event-producer-consumer.md>
- app-boot（profile 组装机制）：<https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/app-boot/README.md#profiles>
