# 开发

DSH Plugin Hub 的本地构建、测试与迭代指南。

> **写代码前先读 [reference.md](reference.md)**——它是基于官方 DeepSeek Harness
> 文档（loader、client-modules、profile/bundle、已知坑）的开发规范。
> 遇到异常行为，先查官方文档和源码，不要猜。

## 前提

- Node.js >= 22.6（`engines` 要求；测试运行器也用到类型剥离）。
- npm（lockfile 已提交；加依赖时保持同步）。
- 一个启动中的 DeepSeek Harness，才能看到插件实际效果。

## 常用命令

| 命令                     | 作用                                              |
| ------------------------ | ------------------------------------------------- |
| `npm run build`          | 编译服务端（`lib/`）+ 浏览器（`client/`）         |
| `npm run build:server`   | 只编译服务端（`tsc -p tsconfig.server.json`）     |
| `npm run build:client`   | 只打包浏览器端（`tsdown` + banner 归一化）        |
| `npm run typecheck`      | 类型检查（客户端、服务端、测试三套 tsconfig）     |
| `npm test`               | 跑单测（Node 内置 runner）                        |
| `npm run check`          | typecheck + test + build（和 CI 一致）            |
| `npm run reload`（别名 `dev`） | 重启 7923 端口的 Harness（默认先构建）      |
| `npm run readme:stats`   | 刷新 README 里的市场统计                          |
| `npm run verify:release` | 发布前校验包名 / semver / 版本是否递增            |

`npm publish` 时会自动跑两个钩子：`prepublishOnly` → `verify:release`，
`prepack` → `build`。

## 开发循环

Harness 是常驻进程，启动时加载插件 bundle，所以每次改动后：

```sh
npm run reload
```

`reload`（= `scripts/run/restart-dev.sh`）做四件事：**构建 → 停掉 7923 端口上的
现有实例 → 把构建产物同步进 profile 的插件拷贝 → 重新拉起**。

- 只想复用当前构建、跳过构建步骤：`npm run reload -- --skip-build`。
- 换端口 / profile：`--port=8080 --profile=dev`。
- 为什么必须同步：profile 里的 `node_modules/dsh-plugin` 是 pnpm **拷贝**出来的，
  重新构建不会刷新那份拷贝 —— 不同步就会继续跑旧代码，或在文件改名后直接
  `ERR_MODULE_NOT_FOUND` 启动失败。脚本用 `rsync -a --delete` 把 `lib/`、`client/`
  与 `package.json` 覆盖过去，任何一步失败都立即中止，不留半同步的残缺拷贝。
- 跑官方 npm 包（不覆盖为本地构建，模拟真实用户）：`scripts/run/restart-prod.sh`。
- 停掉实例：`scripts/run/stop-dev.sh` / `stop-prod.sh`。

## 测试

测试放在 `tests/`，用 Node 内置测试运行器，不需要额外框架：

```sh
npm test              # 跑一次
npm run test:watch    # 监听模式
```

覆盖的是有明确输入/输出的纯逻辑与关键服务端行为：

| 文件 | 覆盖 |
| --- | --- |
| `progress.test.ts` | 进度估算与输出清洗 |
| `preflight.test.ts` · `package-entry.test.ts` | 装前预检与入口路径推导 |
| `npm-resolve.test.ts` | npm 反查与元数据校验 |
| `release-target.test.ts` | release 直链解析与安全校验 |
| `install-target.test.ts` | 安装目标语法解析 |
| `installed-versions.test.ts` | 版本信号读写 |
| `desktop-cli.test.ts` | 桌面端 CLI 引导路径推导 |
| `routes.test.ts` | 路由注册与同源校验 |
| `catalog.test.ts` · `render-markdown.test.ts` · `failures.test.ts` | 客户端归一化 / Markdown 渲染 / 失败归类 |
| `probe.test.ts` | 代理解析等探测辅助 |

新增有明确输入/输出的行为（解析、校验、估算）时，在旁边加测试。

## 发布

1. 升级 `package.json` 版本（以及本项目的 `CHANGELOG.md`）。
2. 跑 `npm run check` 和 `npm run verify:release`。
3. `npm publish`——`prepublishOnly` 会重新校验，`prepack` 重新构建。
4. 在 GitHub 建 Release，并把发布说明归档到 `docs/releases/{VERSION}.md`。

发布说明从简：每条一行讲清「更新 / 修复了什么」，只写用户可见能力、不写内部实现手段
（架构细节、脚本、路由等）；外部贡献者必须致谢。写法照既有文件
`docs/releases/` 里的历史版本。

## 持续集成

`.github/workflows/ci.yml` 在 push 到 `main` 与所有 PR 上跑
`typecheck → test → build`，矩阵为 Node 22 / 24。

## 目录结构

```
src/server/    服务端运行时 + 本地 HTTP API（见 architecture.md）
src/client/    设置页组件（浏览器 bundle）
scripts/run/   启动 / 重启 / 停止本机实例（restart-dev · restart-prod · stop-dev · stop-prod）
scripts/tools/ 工具脚本
               · normalize-client-banner.mjs  构建后归一化已提交的 client.js 头
               · sync-readme-stats.mjs        把 README 统计数字同步为在线真实值
               · check-stats.mjs              校验 README 统计数字（本地手动跑）
               · verify-release.mjs           发布前版本规范校验
               · queue-persist-loop.mjs       任务队列持久化回归脚本（手动跑）
tests/         单测
docs/          架构与开发文档
```

完整图景见 [architecture.md](architecture.md)。
