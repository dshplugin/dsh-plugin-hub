# DSH-Plugin Hub 文档

DSH-Plugin Hub 是 DeepSeek Harness 的插件中心（cordis 插件）。本目录集中存放
开发相关的规范、架构与操作指南。

## 目录结构

```
docs/
├── README.md        本入口：目录导览、阅读顺序、开发建议
├── reference.md     官方机制与开发规范（开发前必读）
├── architecture.md  插件架构
├── development.md   构建 / 测试 / 发布
└── assets/          素材（logo、截图）
```

## 目录导览

| 文档 | 内容 | 何时读 |
| --- | --- | --- |
| [reference.md](reference.md) | **开发前必读**：官方机制速查（loader / client-modules / profile）、问题排查顺序、已知结论与踩坑记录 | 写代码前必读；遇到问题先查这里 |
| [architecture.md](architecture.md) | 插件整体架构：server / client 职责划分、安装与重启流程 | 想了解系统全貌时 |
| [development.md](development.md) | 构建、测试、发布、日常开发循环 | 动手开发时 |

## 阅读顺序

1. **reference.md** —— 先建立官方心智模型：运行中的 dsh 是插件树、profile 是 patch 组合层、
   `ctx.loader` 管理树、`ctx.clientModules` 生成 `__DSH_BOOT__`。**遇到问题先查官方，禁止瞎猜。**
2. **architecture.md** —— 看本插件的两半（server 任务执行器 + client 设置页组件）如何协作。
3. **development.md** —— 按它的命令清单构建、测试、发布。

## 开发建议：克隆官方源码，边学习边开发

DeepSeek Harness 是开源仓库（MIT）。强烈建议把官方源码克隆到本地，配合官方文档站
一起阅读——文档讲"是什么"，源码讲"为什么/怎么做"：

- 官方文档站（第一更新来源）：<https://deepseek-harness.github.io/deepseek-harness/reference/>
- 官方源码仓库：<https://github.com/deepseek-ai/deepseek-harness>
- 本地克隆示例（浅克隆即可）：

  ```sh
  git clone --depth 1 https://github.com/deepseek-ai/deepseek-harness.git bbzc-suite/dsh-harness-official
  ```

为什么建议本地克隆：

- 文档只给结论，实现细节（事件流、对账逻辑、配置组合）都在源码里，读代码才能真懂。
- 离线可检索、可跟读关键路径，排查问题不靠猜。例如"卸载后刷新崩溃"这类问题，
  顺着 `ctx.loader.remove` → fiber dispose → `internal/plugin` → client-modules 对账，
  在源码里一步步确认，比反复实验快得多。
- 本地克隆只是"读"，不改官方代码，随时 `git pull` 同步上游；改官方代码永远不必要。

遇到问题的排查顺序（与 reference.md 第 0 节一致，不允许跳步）：

1. 官方文档站
2. 本地克隆的官方源码（`bbzc-suite/dsh-harness-official`）
3. 本机全局安装源码（`/opt/homebrew/lib/node_modules/@deepseek-ai/dsh/`，与运行版本一致）
4. 运行时实况（`__DSH_BOOT__` 图、`--dump-config`、宿主日志）
5. 最小实验验证（结论必须回填 reference.md）

## 素材（`assets/`）

> README 中展示的截图已全部改为官网 URL 引用（`https://dsh-plugin.org/screenshots/...`，走 CDN 加速），
> 本地不再维护 README 用图副本；`assets/` 仅保留 logo 与历史素材。

- `logo.svg`：项目标识。
- `screenshot-hub-main.png`：插件中心主界面截图（历史素材；README 主图现引用 `dsh-plugin-hub-home-en.png`（英文）/ `dsh-plugin-hub-home-zh.png`（中文））。
- `screenshot-install-uninstall.png`：可视化安装/卸载过程截图（历史素材；README 功能一览现引用 `dsh-plugin-hub-install-en/zh.png`、`dsh-plugin-hub-uninstall-en/zh.png`、`dsh-plugin-hub-update-en/zh.png`）。
- `screenshot-notifications.png`：可视化消息通知截图（历史素材；README 现引用 `dsh-plugin-hub-notifications-en.png`（英文）/ `dsh-plugin-hub-notifications-zh.png`（中文））。
