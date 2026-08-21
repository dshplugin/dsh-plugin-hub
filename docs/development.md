# 开发

DSH-Plugin Hub 的本地构建、测试与迭代指南。

> **写代码前先读 [reference.md](reference.md)**——它是基于官方 DeepSeek Harness
> 文档（loader、client-modules、profile/bundle、已知坑）的开发规范。
> 遇到异常行为，先查官方文档和源码，不要猜。

## 前提

- Node.js >= 22.6（测试运行器用到了类型剥离）。
- npm（lockfile 已提交；加依赖时保持同步）。
- 一个启动中的 DeepSeek Harness，才能看到插件实际效果。

## 常用命令

| 命令                  | 作用                                          |
| --------------------- | --------------------------------------------- |
| `npm run build`       | 编译服务端（`lib/`）+ 浏览器（`client/`）     |
| `npm run typecheck`   | 类型检查（客户端、服务端、测试）              |
| `npm test`            | 跑单测（Node 内置 runner）                    |
| `npm run check`       | typecheck + test + build（和 CI 一致）        |
| `npm run reload`      | 重启 7923 端口的 Harness                     |
| `npm run readme:stats`| 刷新 README 里的市场统计                      |
| `npm run verify:release` | 发布前校验包                              |

## 开发循环

Harness 是常驻进程，启动时加载插件 bundle，所以每次改动后：

```sh
npm run build && npm run reload
```

`reload` 会停掉 7923 端口的 `dsh web`，等端口释放，再脱离地重启。
开发版通过 `file:` 依赖链接到 `~/.dsh/profiles/web/package.json`。

## 测试

测试放在 `tests/`，针对纯服务端逻辑——目前是 `src/server/progress.ts`
的进度估算辅助函数。用 Node 内置测试运行器，不需要额外框架。

```sh
npm test              # 跑一次
npm run test:watch    # 监听模式
```

新增有明确输入/输出的行为（解析、校验、估算）时，在旁边加测试。

## 发布

1. 升级 `package.json` 版本（以及本项目的 `CHANGELOG.md`）。
2. 跑 `npm run check` 和 `npm run verify:release`。
3. `npm publish`——`prepublishOnly` 会重新校验，`prepack` 重新构建。

## 目录结构

```
src/server/    服务端运行时 + 本地 HTTP API
src/client/    设置页组件（浏览器 bundle）
scripts/run/    启动/重载脚本（dev-dsh、reload-dsh）
scripts/tools/  工具脚本（banner 检查、统计同步、发布校验）
tests/         单测
docs/          架构与开发文档
```

完整图景见 [architecture.md](architecture.md)。
