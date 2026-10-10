# 架构

DSH Plugin Hub 是 DeepSeek Harness（Cordis 体系）的一个插件，提供插件市场功能。
它分两部分运行：

| 部分    | 源码               | 构建     | 产物      |
| ------- | ------------------ | -------- | --------- |
| 服务端  | `src/server/`      | `tsc`    | `lib/`    |
| 浏览器  | `src/client/`      | `tsdown` | `client/` |

服务端跑在 Harness 进程内，负责所有副作用；浏览器端是设置页里的一个 section
（挂到宿主 `settings.section`），通过同源 HTTP 与服务端通信。

---

## 服务端（`src/server/`）

```
index.ts                    插件入口：apply() → ctx.inject(['webServer']) → 挂载路由
http/routes.ts              本地 HTTP API：/dsh-plugin-hub/* 全量路由 + 同源校验
services/install/
  install.ts                对外统一出口（纯 re-export，聚合下面的模块）
  install-types.ts          公共类型与常量（InstallTask / InstallResult / 上限值）
  task-queue.ts             后台任务：内存注册表 + FIFO 串行 worker + 子进程生命周期
  preflight.ts              装前预检：拉 GitHub tarball 核对入口文件是否真的在分发里
  npm-resolve.ts            按 repository 反查官方 npm 包（git 分发残缺时切 npm 通道）
  npm-check.ts              识别「本机 npm 版本过低」导致的失败并打标记
  package-entry.ts          从 package.json 推入口文件路径（预检与装后校验共用口径）
  release-target.ts         目录下发的 release 直链解析与安全校验
services/profile/
  profile.ts                profile 解析、目标语法校验、pnpm allowBuilds 白名单写入
  progress.ts               纯函数：cleanLine() + estimateProgress()（有单测）
  installed-versions.ts     已装插件版本信号（磁盘 JSON，用于判断「有更新」）
  pending-restart.ts        「待重启」内存清单（宿主重启即自然清空）
services/loader.ts          运行中 loader：读取 / live-disable / 热挂载
services/log.ts             系统日志：JSONL 追加 + 分页读取 + 清空
services/probe.ts           连通性探测：curl / git ls-remote / 系统代理探测
services/settings.ts        设置持久化：profiles/<p>/hub-settings.json
```

### 路由（`http/routes.ts`）

全部挂在 `/dsh-plugin-hub/` 下，只监听本机回环：

| 方法 | 路径 | 作用 |
| --- | --- | --- |
| GET/POST | `/settings` · `/settings/reset` | 读写 / 重置 Hub 设置 |
| GET | `/catalog` | 代理拉取目录（`?lang=` 列表 / `?stats=1` 统计），带 1h 磁盘缓存 |
| POST | `/install` · `/uninstall` | 校验入参后入队安装 / 卸载任务 |
| GET | `/status?task=<id>` · `/active` | 单任务状态 / 整个队列 + 待重启快照 |
| POST | `/cancel` | 取消排队中或运行中的任务 |
| GET | `/installed` | 已装清单 + 版本信号 + 路径 + 是否已加载 + 是否 dsh 插件 |
| POST | `/installed-version` | 记录 / 清除某仓库的安装版本信号 |
| GET/POST | `/logs` · `/clear-log` · `/open-log` · `/choose-log-dir` | 系统日志读写与定位 |
| POST | `/diagnostics` · `/proxy-check` | 连通性自检（NDJSON 流式）/ 代理可用性试连 |
| POST | `/restart` | 重启宿主（桌面端不自行重启，返回 `{desktop:true}`） |
| POST | `/open-path` | 打开已装插件目录（只接受已装包名，路径由服务端拼） |
| GET | `/env` | 宿主环境快照（提 Issue 时随附） |
| GET | `/debug/loader-entries` | dump 运行中 loader 条目（诊断用） |

**安全校验**：所有变更请求先过 `requireTrustedPost` —— `Host` 头必须是回环
（`localhost` / `127.0.0.1` / `[::1]`，顺带挡 DNS rebinding），再比较归一化后的
`主机名:端口` 是否同源（缺 `Origin` 头按桌面原生客户端放行，`dsh-app:` 协议显式放行）。
请求体上限 4KB，`profile` 名走白名单正则。

### 安装流水线（`services/install/`）

一次安装要过五道关，`task-queue.ts` 是执行主体：

1. **校验与解析**（`routes.ts` → `profile.ts`）：仓库/包名格式、profile 名、
   同目标去重（`hasQueuedTarget`）、包名冲突检测。
2. **装前预检**（`preflight.ts`）：GitHub 源先 `git ls-remote` 定位 commit、
   下载 `codeload` tarball，核对 `package.json` 声明的入口文件是否真在分发里 ——
   git 分发经常不提交构建产物，这类残缺包在动手安装前就拦下。
3. **npm 反查**（`npm-resolve.ts`）：预检不通过时按 `repository` 字段反查该仓库的
   官方 npm 包，命中就切到 npm 通道安装。
4. **串行执行**（`task-queue.ts`）：同一时刻只跑一个变更任务（FIFO 队列）。
   子进程为 `dsh plugin --profile <p> <add|remove> <target>`；更新实际走
   `add <target>@latest`。失败有两条自动恢复路径：pnpm 构建脚本被拦
   （`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` / `ERR_PNPM_IGNORED_BUILDS`）时写入
   profile 的 `pnpm-workspace.yaml` 后重试一次；全局 npm 安装撞上 npm arborist
   peer-set 崩溃时带 `--legacy-peer-deps` 重试一次。
5. **装后校验与收尾**（`task-queue.ts` + `loader.ts`）：校验入口文件真实存在
   （缺失即判失败并撤销待重启，避免重启时加载残缺包直接崩溃），再尝试热挂载 /
   停用 loader 条目，最后判定「是否需要刷新 / 是否需要重启」（见下）。

任务状态通过 `/status?task=<id>` 轮询，`/active` 返回整个队列 —— 页面刷新后
前端据此把进度条和待重启提醒恢复回来。

### 进度模型（`services/profile/progress.ts`）

```
Progress: resolved N, reused X, downloaded Y, added Z   → 8~30（按已处理/已解析比值，压在低区间）
dependencies: / Packages:                               → 85
Running / prepare / build scripts                       → 60
Done in …                                               → 96
[exit 0]                                                → 100
```

pnpm 用回车符原地刷新 `Progress:` 行，所以按 `\n` 和 `\r` 都切分、去掉 ANSI 转义，
进度估算只升不降（`Math.max`）。fetch 阶段的 resolved 与 handled 几乎总是相等，比值没有区分度，
因此压在 8~30 缓步推进，把中段留给真正的安装/构建阶段。
CLI 不说话时有两个兜底让进度条不卡死：每输出一行按行数推进（封顶 85），
外加一个 500ms 定时器每次加 1 点（封顶 85）。

### 生效语义：刷新 or 重启（`services/loader.ts`）

「装完即生效」靠对**运行中 loader** 做热操作，而不是等宿主重启：

- **安装成功** → `mountLoadedEntry()` 在 loader 根组新建条目并启动（等价 profile
  bundle patch 的 `- insert: - name: <pkg>`；`Loader.write()` 是空实现，不写盘，
  重启后由 bundles 清单重新挂载，不会重复）。挂上后：
  - 该插件带客户端 UI（`package.json` 的 `dsh.client`）→ `needsReload`：**刷新页面**即渲染；
  - 不带 UI → 服务端侧已即时生效，无需任何操作。
  - 挂不上 / 不是 dsh 插件 / 定位不到包名 → 回退 `needsRestart`，登记「待重启」。
- **卸载成功** → `removeLoadedEntry()` 对匹配条目做 live-disable
  （`entry.update({ disabled: true })`，而非 `loader.remove(id)` —— disable 不触发
  `tree.write()`，不会把运行态条目烘焙回配置文件，也不依赖嵌套子树的 id 解析）。
  带 UI 的插件面板需刷新页面摘除；disable 失败 / 超时（5s）才登记「待重启」。
- **更新**走 ESM 缓存，热挂载取不到新代码 → 一律登记「待重启」。
- **全局 npm 安装**（`npm install -g`）不进任何 profile → 无需重启。

「待重启」是**纯内存**清单（`pending-restart.ts`）：宿主一重启它自然清空，
正好等于「重启后提醒消失」的语义，所以不需要任何重启探测，也不落盘。
客户端从 `/active` 的 `pendingRestarts` 字段恢复展示。

### 重启（`POST /restart`）

孵化一个脱离的跨平台脚本：找到监听目标端口的进程、发 `TERM`、等端口释放，
再用 `nohup` 拉起 `dsh web`。脚本不依赖当前 Harness 进程存活，所以宿主能干净地
自我重启。**桌面端（Electron）不自行重启**，直接返回 `{ desktop: true }`，
由客户端提示用户手动处理。

### 系统日志（`services/log.ts`）

JSONL 追加到 `~/.dsh/profiles/<profile>/hub.log`（设置里可改 `logPath`）。
每条含 `level`（debug/info/success/warn/error）× `category`
（install/uninstall/update/diagnostics/settings/system）+ 事件码 + 文案。
安装/卸载/更新在入队与终态各写一条，前端通知中心与日志查看器都读它。

### 诊断（`services/probe.ts`）

探测用系统 `curl` / `git`，注入设置里的代理（缺省回退系统代理 → 环境变量 → 直连）：

- `npm`：探 registry 上的 `dsh-plugin`；
- `github`：`git ls-remote` 打一个小仓库，测的是「克隆握手」本身；
- `catalog`：探目录站点；
- `proxy`：配了代理时追加一条，验证代理能把请求带出去。

Windows 下有 Schannel 证书吊销失败的兜底重试。`/env` 另行给出宿主环境快照
（dsh / node / pnpm / npm / git 版本、平台、架构、profile、DSH home）。

---

## 浏览器端（`src/client/`）

```
index.tsx                    入口：apply() → locale 注册 + slots 注册（settings.section）
types.ts                     客户端共享类型（零依赖）
locales.ts                   zh/en 文案字典
components/
  PluginHubSection.tsx       根组件：把数据管线、任务队列、反馈状态接在一起
  views/                     六个一级视图
    MarketView               插件市场：分类 + 搜索/排序/安装态筛选 + 列表
    InstalledView            已安装管理：目录插件 + 目录外自定义安装混合列表
    CustomInstallView        目录外安装：NPM 包 / GitHub 源码 / DSH 命令三张卡片
    SettingsView             设置：左侧分组导航 + 右侧设置行
    LogsView                 系统日志入口：路径定位 + 最近预览
    DiagnosticsView          连通性诊断：逐通道状态徽标，可单行重探
  catalog/                   CatalogList（虚拟增量列表）· PluginCard
  layout/                    CatalogHeader · CatalogControls · CategoryTabs · SectionTabs
  modals/                    InstallModal · UninstallModal · ErrorModal · RestartConfirmModal
                             AboutModal · ConfirmDialog · HubUpdateModal ·
                             InstalledDetailModal · LogsModal · LogsPathModal ·
                             NotificationsModal · ProgressView · Toast
  ui/                        Dropdown · Toggle · icons
data/                        catalog（目录/统计，经服务端代理）· host（宿主路由）· hub（Worker 接口）
hooks/                       useCatalog · useTaskQueue · useSettings · useLanguage · useIncrementalList
logic/                       constants · format · normalize · installed · failures ·
                             install-command · renderMarkdown · urls · ensure-plugin-css
styles/                      *.module.css（CSS Modules）
```

浏览器包由 tsdown 打包，包一层 `window.__ModuleLoader__.load`（见
`tsdown.config.ts`）。CSS Modules 用 lightningcss 编译内联：import
`Section.module.css` 得到哈希类名映射，并自动注入 `<style data-plugin-css>`；
`logic/ensure-plugin-css.ts` 会把缺失的样式标签补回来（模块级清单与实时 DOM 对账）。
`react` 和 `react/jsx-runtime` 运行时从宿主 loader 解析。

### 数据来源

- **目录与统计**：浏览器不直连官网，经服务端 `/dsh-plugin-hub/catalog` 代理拉取
  `api.dsh-plugin.org`（1h 磁盘缓存 + 任意年龄兜底），`logic/normalize.ts` 把
  在线 API 的短键载荷映射成 `HubPlugin`。
- **宿主本地事实**：`data/host.ts` 打 `/dsh-plugin-hub/installed` 等路由，拿已装清单、
  版本信号、安装路径、是否已加载（`loaded`）、是否 dsh 插件（`dshCapable`）。
- **Hub 自身**：`data/hub.ts` 打 Worker 的 `hub.json` / `about.json`（拼时间戳绕 CDN 缓存），
  用于自我更新检查与「关注我们」。

所有读接口一律 `cache: 'no-store'` —— 这些数据反映实时状态，浏览器 HTTP 缓存会给出过期结果
（本项目曾因此「插件不显示版本」）。

### 安装流程（端到端）

1. 用户点 **安装** → `useTaskQueue` 调 `POST /dsh-plugin-hub/install {repo}`，服务端返回 `{task}`。
2. 弹窗每轮轮询 `GET /status?task=<id>`（以及 `/active` 恢复整个队列）；
   进度条渲染 `task.progress`，失败全文在 `ErrorModal` 展示。
3. 任务 `done` 后按服务端返回的 `needsReload` / `needsRestart` 分流：
   - 需要刷新 → 关闭弹窗后自动 `window.location.reload()`（或给提示）；
   - 需要重启 → 结果视图只给一个「立即重启」；关闭弹窗即视为「稍后」，
     该条进入通知中心的「待重启」列表持续提醒；
   - 都不需要 → 只提示完成。
4. 桌面端点「立即重启」时服务端回 `{desktop:true}`，客户端改为提示用户手动重启。

### 通知中心

`logic/failures.ts` 把每次任务的结算结果持久化到 `localStorage`
（成功/失败各一条记录，失败保留复制 / 修复 / 提 Issue 动作）；
`useTaskQueue` 另外提供进行中任务与待重启项，一起在 `NotificationsModal` 渲染。
标签页上的红圈计数 = 通知记录数 + 进行中任务数 + 待重启项数。
`logic/failures.ts` 也负责把安装输出归类成失败原因（本机环境问题 vs 插件分发问题），
让错误提示指向真正的原因。
