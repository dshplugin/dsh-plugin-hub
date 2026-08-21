# 架构

DSH-Plugin Hub 是 DeepSeek Harness（Cordis 体系）的一个插件，提供插件中心功能。
它分两部分运行：

| 部分    | 源码               | 构建   | 产物      |
| ------- | ------------------ | ------ | --------- |
| 服务端  | `src/server/`      | `tsc`  | `lib/`    |
| 浏览器  | `src/client/`      | `tsdown` | `client/` |

服务端跑在 Harness 进程内，负责所有副作用；浏览器端是设置页里的一个组件，
通过同源 HTTP 与服务端通信。

## 服务端（`src/server/`）

```
index.ts              插件入口：apply() 注入宿主 web server，挂载路由
http/routes.ts        本地 HTTP API：/install /uninstall /status /installed /restart
services/install.ts   后台任务执行器：调用官方 dsh CLI 装/卸插件
services/progress.ts  纯函数工具：cleanLine() + estimateProgress()（有单测）
```

- **`http/routes.ts`** 先校验所有变更请求（profile 命名、仓库/包名格式、来源检查、
  同一时刻只允许一个任务），再交给 `services/install.ts`。`readInstalled()` 从
  profile 清单里列出非官方依赖。
- **`services/install.ts`** 异步执行 `dsh plugin --profile <p> <add|remove> <target>`。
  插件运行在已启动的 Harness 入口内时，复用该入口（`process.argv[1]`），
  即使 `dsh` 不在 `PATH` 里也能工作。每个操作都是一个被跟踪的任务：调用方立刻
  拿到 `id`，轮询 `/status` 看进度。
- **`services/progress.ts`** 把 CLI 原始输出整理成干净行和 0-100 的进度估算。
  pnpm 用回车符原地刷新 `Progress:` 行，所以按 `\n` 和 `\r` 都切分、去掉
  ANSI 转义；进度估算是一个只升不降的下限。

### 进度模型

```
Progress: resolved N, reused X, downloaded Y, added Z   → (done/total)，上限 90
dependencies: / Packages:                               → 92
Done in …                                              → 96
[exit 0]                                               → 100
```

CLI 不说话时有两个兜底让进度条不卡死：每输出一行进度上浮（最多 85%），
外加一个 500ms 定时器每次加 1 点（封顶 85）。

### 重启

`POST /restart` 启动一个脱离的 `/bin/sh -c` 脚本：找到监听请求端口的进程，
发 `TERM`，等端口释放，再用 `nohup` 重启 `dsh web`。脚本不依赖当前 Harness
进程存活，所以宿主能干净地自我重启。

## 浏览器端（`src/client/`）

```
index.tsx  入口：apply() → slots + 语言
types.ts   客户端共享类型
locales.ts zh/en 文案
components/   PluginHubSection（状态）· 弹窗 · 进度视图 · 图标
lib/         catalog（接口数据归一化）· format
styles/      Section.module.css（哈希类名映射，注入 <style>）
```

浏览器包由 tsdown 打包，包一层 `window.__ModuleLoader__.load`（见
`tsdown.config.ts`）。CSS Modules 用 lightningcss 编译内联：import
`Section.module.css` 得到哈希类名映射，并自动注入 `<style data-plugin-css>`。
`react` 和 `react/jsx-runtime` 运行时从宿主 loader 解析。

### 安装流程（端到端）

1. 用户点 **安装** → 弹出 `InstallModal`，显示命令和进度。
2. `POST /dsh-plugin-hub/install {repo}` → 服务端返回 `{task}`。
3. 弹窗每 600ms 轮询 `GET /status?task=<id>`；终端面板渲染最新输出，
   进度条渲染 `task.progress`。
4. `done` 后弹窗切换为结果视图：**立即重启** 调 `POST /restart`（宿主自动刷新），
   **稍后** 只关闭弹窗。
