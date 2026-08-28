<div align="center">

<p>
  <img src="docs/assets/logo.svg" alt="DSH Plugin Hub" width="96" height="96" />
</p>

# DSH Plugin 插件中心 - DeepSeek Harness Plugin (DSH) 下载与安装 · 插件大全

**DeepSeek Harness Plugin（DSH）插件中心与插件大全，收录 8000+ 插件、人工精选 4500+、每日更新，免费浏览、搜索并按分类发现、下载与安装 DSH 插件，人工验证、来源可溯。**

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/v/dsh-plugin.svg?style=flat-square)](https://www.npmjs.com/package/dsh-plugin)
[![CI](https://github.com/dshplugin/dsh-plugin-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/dshplugin/dsh-plugin-hub/actions)
[![Listed on DSH Plugin Hub](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/dshplugin/dsh-plugin-hub)
[![GitHub stars](https://img.shields.io/github/stars/dshplugin/dsh-plugin-hub.svg?style=flat-square)](https://github.com/dshplugin/dsh-plugin-hub)
[![Website](https://img.shields.io/badge/website-dsh--plugin.org-blue.svg?style=flat-square)](https://dsh-plugin.org)
[![Topic](https://img.shields.io/badge/topic-dsh--plugin-0e7490.svg?style=flat-square)](https://github.com/topics/dsh-plugin)

[官网](https://dsh-plugin.org) · [提交 Issue](https://github.com/dshplugin/dsh-plugin-hub/issues) · [提交插件](https://dsh-plugin.org/zh/submit)

**简体中文** · [English](README.en.md)

</div>

---

## 什么是 DSH Plugin Hub

DSH Plugin Hub 是 **DeepSeek Harness 社区插件市场**：一个遵循官方插件开发规范构建的开源插件，安装进「设置 → 插件中心」后，无需离开应用即可浏览、搜索并一键安装社区插件。本项目为独立社区项目，与 DeepSeek Harness 官方无隶属关系。

<p align="center">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-market-zh.png" alt="DSH Plugin Hub 插件中心界面" width="840">
</p>

## 插件中心特性

**一键操作 · 全部可视化**

- **一键安装** — 点击即装：后台队列串行执行，弹窗实时显示安装进度，可随时取消；装完刷新页面即生效，无需重启
- **一键升级** — 目录检测到新版本自动提示，卡片按钮变为「更新」，覆盖安装一键完成
- **一键卸载** — 卸载全程可视化，实时进度一目了然，卸载成功即生效
- **任务留痕** — 每次安装 / 升级 / 卸载的成功与失败都会写入通知中心，随时回查

**通知中心**

- 进行中任务的实时进度与取消、待重启项、成功 / 失败历史记录集中管理
- 失败可一键提交 GitHub Issue，为开源做贡献；待重启项支持「稍后重启 / 立即重启」

**资源丰富 · 人工精选**

- 收录 **8,197** 个社区插件，其中 **4,585** 已人工精选验证，由 [dsh-plugin.org](https://dsh-plugin.org) 每日收录、人工审核并发布
- 涵盖界面与体验、会话与消息、记忆与上下文、工具能力等分类，按分类浏览、搜索直达
- 每个插件标注人工验证状态（verified）、Star / Fork 评分、版本号与最近更新时间，来源可溯

**中英双语 · 直观筛选**

- 界面默认跟随系统语言，右上角一键手动切换，界面文案与插件数据同步切换
- 支持「最热 / 最新 / 最早收录」排序，双语描述、能力标签一目了然
- 按已安装 / 未安装快速过滤，配合全文搜索精确定位目标插件

**实时同步 · 轻量安全**

- 数据与官网同源，安装后自动获取最新目录，无需手动升级
- 仅浏览器端注入，无宿主服务依赖，无遥测、无隐私采集

## 加入用户群 · 反馈问题

遇到使用问题、功能建议或想交流插件？扫码加入 DSH Plugin Hub 用户群，反馈问题、提交建议，与社区一起改进。群二维码定期更新，此码有效期至 2026-09-02。

<p align="center">
  <img src="https://api.dsh-plugin.org/images/dsh-plugin-user-group-qr-2026-09-02.png?v=2" alt="DSH Plugin Hub 用户群二维码" width="250" height="250">
</p>

## 功能一览

**已安装插件列表 · 自定义安装**

<p align="center">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-installed-zh.png" alt="已安装插件列表" width="400">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-custom-install-zh.png" alt="自定义安装" width="400">
</p>

集中管理当前环境已装的全部插件，支持搜索、来源筛选与排序，行尾提供更新、卸载与「在 Finder 中显示」 · 手动安装目录外的任意插件，支持 NPM 包、GitHub 源码与 DSH 命令行三种通道

**设置 · 系统日志**

<p align="center">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-settings-zh.png" alt="设置" width="400">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-system-logs-zh.png" alt="系统日志" width="400">
</p>

集中配置更新检查、NPM 镜像源、代理通道、安全信任与日志存放位置 · 记录安装、卸载、设置变更与诊断轨迹，按分类与级别筛选，内置日志查看器

**确认安装 · 确认卸载**

<p align="center">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-install-confirm-zh.png" alt="确认安装" width="400">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-uninstall-confirm-zh.png" alt="确认卸载" width="400">
</p>

安装前展示插件名称、来源仓库与执行命令，确认后才开始安装 · 卸载前展示待移除的插件，确认后才从环境移除，避免误删

**确认更新 · 通知中心**

<p align="center">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-update-confirm-zh.png" alt="确认更新" width="400">
  <img src="https://api.dsh-plugin.org/images/releases/1-3-9/dsh-plugin-hub-notifications-zh.png" alt="通知中心" width="400">
</p>

检测到新版本时弹出，确认后原位覆盖安装到最新版 · 集中管理安装、卸载、更新的历史记录、实时进度与待重启提醒

## 官网一览

插件中心的数据由 [dsh-plugin.org](https://dsh-plugin.org) 整理发布，两侧实时同步；在官网还可以查看插件详情、评分与 GitHub 源码链接。

**官网首页 · 分类展示**

<p align="center">
  <img src="docs/screenshots/dsh-plugin-hub-site-home.png" alt="DSH Plugin 官网首页" width="400">
  <img src="docs/screenshots/dsh-plugin-hub-site-categories.png" alt="DSH Plugin 分类展示" width="400">
</p>

数据与插件中心同源，人工精选验证、每日更新 · 按分类浏览全部收录插件，支持搜索直达

## 为什么选择 DSH Plugin Hub

DSH Plugin 插件中心收录 **8,197** 个 DeepSeek Harness Plugin（DSH）插件，其中 **4,585** 已人工精选验证，每日更新，免费按分类浏览、搜索、下载与安装，来源可溯。

### 及时更新

新发布的 DSH plugin 会尽快收录进插件中心，已有插件的描述、分类与兼容状态也会定期刷新。专业团队持续跟进 DeepSeek Harness 生态动态，让你始终看到最新信息。

### 人工审核

每个 DSH plugin 都由专业的技术团队人工核查，逐项核对安装命令、兼容状态（verified / unconfirmed）与 DSH 目标版本（dshTarget），并标注能力分类，质量有保障。

### 来源可查

每个 DSH plugin 都链回其 GitHub 源码仓库，并展示 Star、Fork 与最近更新时间；本站数据整理自 DeepSeek Harness 官网、官方架构文档与官方仓库，看到的信息都有据可查。

## 安装 DSH Plugin Hub

从 npm 安装（推荐）：

```bash
dsh plugin --profile web add dsh-plugin
```

插件已发布到 npm registry（包名 `dsh-plugin`），一条命令即可安装使用，无需任何构建。

从 GitHub 安装：

```bash
dsh plugin --profile web add git+https://github.com/dshplugin/dsh-plugin-hub.git
```

> **提示**：插件已内置浏览器端 bundle，从 GitHub 安装无需任何构建与授权；装完重启 `dsh web`，在「设置 → 插件中心」即可使用。

## 更新 DSH Plugin Hub

插件中心检测到新版本时会提示一键更新；如果旧版本存在更新缺陷导致拉取不到最新版，请直接用命令行升级：

**方式一：直接更新到最新（推荐）**

```bash
dsh plugin --profile web update dsh-plugin
```

**方式二：强制升级（旧版更新不上时）**

`update` 若受旧版缺陷影响无法拉取最新版，用显式版本号强制重装最新版：

```bash
dsh plugin --profile web add dsh-plugin@latest
```

**方式三：卸载重装到最新（最稳）**

`add` 对已安装的实例不覆盖版本，先卸载再安装必然拿到最新版：

```bash
dsh plugin --profile web remove dsh-plugin
dsh plugin --profile web add dsh-plugin
```

> 更新后重启 `dsh web` 即可生效。

## 快速开始：在 DeepSeek Harness 中使用

安装完成后重启 `dsh web`，打开 **设置 → 插件中心**，即可浏览并安装插件。插件市场与 [dsh-plugin.org](https://dsh-plugin.org) 官网数据同源、实时同步。

## 提交你的 DSH plugin

将你的插件发布到 GitHub 并添加 `dsh-plugin` topic，即可被 DSH Plugin 插件目录自动发现与收录。收录要求与提交流程见官网[提交插件](https://dsh-plugin.org/zh/submit)页面。

## 贡献

- **收录你的插件**：添加 `dsh-plugin` topic 即可被自动发现，入口见官网[提交插件](https://dsh-plugin.org/zh/submit)
- **数据勘误 / 功能建议**：欢迎[提交 Issue](https://github.com/dshplugin/dsh-plugin-hub/issues)
- **参与开发**：Fork 本仓库并提交 Pull Request

## 相关项目

- [dsh-plugin.org](https://dsh-plugin.org) — 插件中心官网，数据同源
- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) — DeepSeek Harness 本体

## 许可

[MIT](LICENSE) © DSH Plugin Hub contributors
