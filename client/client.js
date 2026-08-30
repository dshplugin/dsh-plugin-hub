window.__ModuleLoader__.load({ id: "dsh-plugin", factory: (require) => {


		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		//#region src/client/locales.ts
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* zh/en dictionaries for the DSH Plugin Hub settings section.
		*/
		const zh = {
			nav: "插件市场",
			title: "DSH Plugin Hub",
			tagline: "DSH Plugin 插件市场：面向 DeepSeek Harness 插件收录平台，人工审验、来源可溯，免费安装",
			adBadge: "推荐",
			ad: "DSH Plugin 插件市场：收录 {total} 款插件，{verified} 款人工精选验证，每日更新",
			search: "搜索插件名称、描述、标签…",
			all: "全部",
			sortStars: "Star",
			sortForks: "Fork",
			sortUpdated: "最近更新",
			sortNewest: "最新收录",
			sortAria: "插件排序方式",
			openHint: "打开 dsh-plugin.org",
			toggleLangHint: "切换界面语言",
			fork: "Fork",
			loading: "正在加载插件数据…",
			failed: "插件数据加载失败",
			failedDescNoProxy: "你的网络似乎不通，无法获取插件目录数据。请检查网络连接后重试；或点击右上角按钮在浏览器中打开插件市场。",
			failedDescProxy: "你的网络似乎不通，或设置里的 HTTP 代理地址不可达，无法获取插件目录数据。请检查代理设置与网络连接后重试；或点击右上角按钮在浏览器中打开插件市场。",
			retry: "重试",
			install: "安装",
			cliOnlyHint: "此插件可能需命令行辅助，失败时复制上方命令到 dsh 终端",
			failedCopyHint: "安装失败。请复制上方安装命令到 dsh 终端手动执行（原生依赖构建脚本可能需要人工放行，如 pnpm approve-builds）",
			toastCopied: "安装命令已复制，去 dsh 终端粘贴即可安装",
			installed: "已安装",
			viewMarket: "插件市场",
			viewInstalled: "已安装",
			viewCustom: "自定义安装",
			viewSettings: "设置",
			viewMarketHint: "浏览与发现插件",
			viewInstalledHint: "管理已安装插件",
			viewCustomHint: "手动安装 NPM 包或 GitHub 源码",
			viewSettingsHint: "网络通道与偏好设置",
			installedEmpty: "还没有安装插件",
			installedEmptyDesc: "可以去「自定义安装」，手动安装 NPM 包或 GitHub 源码",
			npmInstallLabel: "NPM 包 / 命令",
			npmInstallPlaceholder: "npm install <包名> 或直接输包名",
			npmInstallExample: "支持原生命令：npm install lodash、npm i lodash、pnpm add @scope/pkg",
			npmInstallExample2: "全局安装 CLI：npm install -g @scope/cli；或直接输入包名 lodash",
			npmInstallInvalid: "请输入 npm 包名（如 lodash、@scope/pkg），或原生安装命令（如 npm install lodash、npm i lodash、pnpm add @scope/pkg、npm install -g @scope/cli）",
			gitInstallLabel: "GitHub 源码",
			gitInstallPlaceholder: "输入仓库地址",
			gitInstallExample: "例如：owner/repo 或 https://github.com/owner/repo",
			gitInstallInvalid: "请输入 GitHub 仓库地址，例如：owner/repo 或 https://github.com/owner/repo",
			dshCmdLabel: "DeepSeek Harness 命令",
			dshCmdPlaceholder: "粘贴官方 dsh plugin 命令",
			dshCmdInsertHubUpdate: "插入更新命令",
			dshCmdExample: "例如：dsh plugin --profile web add github:owner/repo，或 dsh plugin --profile web update dsh-plugin",
			dshCmdInvalid: "请输入官方 dsh plugin 命令（--profile 必填，支持 add / update）。例如：dsh plugin --profile web update dsh-plugin",
			installHelp: "帮助",
			helpModalTitle: "支持的命令格式",
			npmInstallHelp: "lodash、@scope/pkg	直接输入包名\nnpm install lodash\nnpm i lodash\npnpm add @scope/pkg\npnpm i @scope/pkg\nnpm install -g @scope/cli	全局安装 CLI 工具，不进「已安装」列表",
			gitInstallHelp: "owner/repo\nhttps://github.com/owner/repo\ngithub:owner/repo\ngit+https://github.com/owner/repo.git\ngit@github.com:owner/repo.git",
			dshCmdHelp: "dsh plugin --profile web add <目标>	安装\ndsh plugin --profile web update <目标>	更新已安装目标到最新版本\ndsh plugin --profile=web add <目标>\ndsh plugin --profile=web update <目标>\n	--profile 必填，官方 CLI 无 -p 简写；<目标> 可为 npm 包名或 github:owner/repo；卸载请用「已安装」列表",
			globalNpmHint: "将全局安装 CLI 工具（npm install -g），不会出现在「已安装」列表，无需重启宿主",
			installCliBtn: "安装",
			channelDisabledHint: "该安装通道已关闭，请在「设置 → 安全信任」中打开开关",
			goToSettings: "前往设置",
			customViewDesc: "手动安装目录外的 NPM 包、GitHub 源码，或粘贴官方 dsh plugin 命令。装完的条目会出现在「已安装」列表，并标记为自定义安装。",
			customLabel: "自定义安装",
			installedSearch: "搜索已安装的插件…",
			installedFilterCatalog: "目录插件",
			hubInstall: "插件市场",
			hubInstallHint: "来自插件市场收录的目录插件",
			manualInstall: "手动安装",
			manualInstallHint: "非目录收录，通过命令行手动安装",
			filterByLabel: "来源",
			sortByLabel: "排序",
			sortName: "名称",
			sortInstalledAt: "最近",
			detailTitle: "插件详情",
			detailCategory: "分类",
			detailStats: "仓库统计",
			statusLabel: "安装状态",
			statusRunning: "运行中",
			statusPending: "待重启",
			exampleLabel: "DeepSeek Harness 内置示例项目",
			exampleHint: "DeepSeek Harness 内置示例项目：不是插件市场的 dsh 插件，宿主不会加载它，无需重启",
			restart: "重启",
			installedVersionLabel: "已安装版本",
			catalogLatest: "目录最新",
			installPath: "安装路径",
			copyPath: "复制路径",
			openFolder: "在文件夹中显示",
			openFolderFail: "无法打开文件夹，请复制路径手动打开",
			revealFolder: "在 Finder 中显示",
			installedAtLabel: "安装时间",
			lastUpdatedLabel: "最后更新",
			detailCatalog: "查看详情",
			packageName: "包名",
			versionUpHint: "发现新版本 v{from} → v{to}，点击「更新」原位覆盖重装",
			settingsUpdate: "更新设置",
			settingsUpdateDesc: "更新检查方式与安装走到的网络通道",
			settingsCheckOnStart: "启动时检查更新",
			settingsCheckOnStartDesc: "打开插件市场时检查已安装插件是否有新版，发现更新会提示",
			settingsProxy: "HTTP 代理",
			settingsProxyDesc: "npm / git / 目录数据请求统一走该代理；留空直连",
			proxyCheckChecking: "正在测试该代理地址…",
			proxyCheckOk: "测试可达，安装与目录请求将统一走该代理",
			proxyCheckFail: "此地址测试不通，仍可保存；请确认代理已开启、地址与端口无误",
			settingsMirror: "npm 镜像源",
			settingsMirrorDesc: "默认跟随本机 npm 配置；官方源慢可换国内镜像",
			mirrorNone: "未配置（跟随本机 npm 配置）",
			mirrorOfficial: "官方源 registry.npmjs.org",
			mirrorNpmmirror: "阿里云 npmmirror",
			mirrorTencent: "腾讯云镜像",
			mirrorTsinghua: "清华大学 TUNA 镜像",
			settingsSecurity: "安全信任",
			settingsSecurityDesc: "命令行安装的三个通道开关：NPM 包、GitHub 源码与 DSH 命令",
			settingsEnableNpm: "启用 NPM 安装",
			settingsEnableNpmDesc: "允许通过命令行安装 npm 包；关闭后输入包名安装会被拦截",
			settingsEnableGit: "启用 GitHub 源码安装",
			settingsEnableGitDesc: "允许通过命令行安装 GitHub 源码；关闭后输入仓库地址安装会被拦截",
			settingsEnableDsh: "启用 DSH 命令安装",
			settingsEnableDshDesc: "允许通过命令行粘贴 dsh plugin 命令安装；关闭后命令输入会被禁用",
			settingsDiagnostics: "系统诊断",
			settingsDiagnosticsDesc: "检测 npm 源 / GitHub / 目录站点等安装通道的连通状态",
			settingsLogs: "系统日志",
			settingsLogsDesc: "本地记录的安装 / 卸载 / 设置变更与诊断结果，可导出全文排查问题",
			logsHeadHint: "记录安装、卸载、设置变更与诊断结果，保留最近 2000 条",
			logsRefresh: "刷新日志",
			logsExport: "导出日志",
			logsLoading: "正在读取日志…",
			logsEmpty: "暂无日志记录",
			logsLoadFail: "读取日志失败，请稍后重试",
			logModalTitle: "日志查看器",
			logViewerOpen: "打开日志查看器",
			logViewerDesc: "内置窗口直接查看本地日志，按类型与级别筛选，可定位安装 / 卸载 / 更新时的不兼容点",
			logPathLabel: "日志文件",
			logOpenFile: "打开文件",
			logOpenFileTip: "在系统文件管理器中定位日志文件",
			logOpenFileFail: "打开失败，请在文件管理器中手动定位",
			logClearAll: "清空所有日志",
			logClearConfirmTitle: "清空所有日志？",
			logClearConfirmDesc: "将删除全部日志记录，且不可恢复。",
			logClearing: "正在清空…",
			logClearAllTip: "清空全部日志记录",
			logClearFailed: "清空失败，请重试",
			logPathSettingTitle: "日志存放位置",
			logPathSettingDesc: "默认存于宿主配置目录，可填目录或 .log 文件路径改存别处",
			logPathPlaceholder: "留空恢复默认",
			logPathReset: "恢复默认",
			logPathResetHint: "文本框显示当前生效位置",
			logPathSave: "保存",
			logPathSaving: "保存中…",
			logPathSaved: "已保存，新日志将写入该位置",
			logPathSaveFail: "保存失败：该位置不可写或不可用",
			logPathChange: "修改",
			logPathBrowse: "选择目录…",
			logPathBrowseFail: "选择目录不可用，请手动输入路径",
			logCatAll: "全部类型",
			logCatInstall: "安装",
			logCatUninstall: "卸载",
			logCatUpdate: "更新",
			logCatDiagnostics: "诊断",
			logCatSettings: "设置",
			logCatSystem: "系统",
			logLvAll: "全部级别",
			logLvError: "错误",
			logLvWarn: "警告",
			logLvSuccess: "成功",
			logLvInfo: "信息",
			logLvDebug: "调试",
			logSearchPlaceholder: "搜索事件或描述…",
			logLoadMore: "加载更多",
			logNoMore: "已加载全部，共 {n} 条",
			logCount: "共 {n} 条",
			logEmptyFilter: "没有符合条件的日志",
			settingsDiagFail: "不可达",
			diagNpm: "npm 源",
			diagNpmUnset: "未配置（跟随本机 npm 配置）",
			diagGithub: "GitHub",
			diagCatalog: "目录站点",
			diagCatalogTarget: "插件市场",
			diagProxy: "HTTP 代理",
			diagOk: "OK",
			diagChecking: "检测中…",
			diagIdle: "未检测",
			diagRecheck: "点击重测该通道",
			diagRunAll: "立即诊断",
			diagHeadHint: "共 {n} 个通道，点击任意一行可单独重测",
			diagSummaryRunning: "正在检测通道…",
			diagSummaryOk: "全部通道正常",
			diagSummaryFail: "存在不可达通道，点击对应行可重测",
			settingsEnvSnapshot: "系统版本",
			settingsEnvSnapshotDesc: "复制宿主版本与系统信息，提交 Issue 时粘贴到正文便于复现",
			settingsEnvCopy: "复制",
			settingsReset: "恢复默认",
			settingsResetDesc: "更新策略、镜像源、代理与安全限制一次性恢复为出厂默认值",
			settingsResetDetail: "恢复更新策略、镜像源、代理与安全限制为出厂默认值",
			settingsResetRun: "恢复默认",
			settingsResetConfirm: "确认恢复",
			settingsResetConfirmDetail: "确定要恢复默认设置吗？更新策略、镜像源、代理与安全限制将全部回到出厂默认值。",
			updateNoticeTitle: "发现新版本",
			updateNoticeGo: "去更新",
			ignoreUpdateRun: "忽略本次更新",
			ignoreUpdateConfirmTitle: "忽略本次更新？",
			ignoreUpdateConfirmDetail: "忽略后本次版本不再提醒；待插件发布下一个新版本时，会再次通知你。",
			ignoreUpdateConfirm: "确认忽略",
			uninstall: "卸载",
			uninstalling: "卸载中…",
			uninstallTitle: "确认卸载？",
			uninstallDesc: "将从当前环境卸载该插件。",
			uninstallDone: "卸载成功",
			uninstallFail: "卸载失败，请稍后重试",
			uninstallResultTitle: "卸载完成",
			uninstallResultDesc: "插件已从当前环境移除。",
			confirmTitle: "确认安装",
			confirmDesc: "安装前请前往插件仓库仔细阅读源码，确认可信后再安装",
			confirmPlugin: "插件",
			confirmSource: "来源",
			confirmCommand: "安装命令",
			copyInstallCommand: "复制安装命令",
			copyCmdLabel: "复制",
			copyUninstallCommand: "复制卸载命令",
			cancelUninstall: "取消卸载",
			uninstallConfirm: "确认卸载",
			installNow: "直接安装",
			installing: "安装中…",
			installDone: "安装成功",
			updateDone: "更新成功",
			installResultTitle: "插件安装成功",
			installResultDesc: "",
			confirmUpdateTitle: "确认更新",
			updateNow: "直接更新",
			updating: "更新中…",
			queuedUpdateTitle: "已加入更新排队",
			updateResultTitle: "更新完成",
			updateResultDesc: "插件已更新到最新版本。",
			installFail: "安装失败",
			requestTimeout: "请求超时：无法访问 GitHub 或网络不稳定，请稍后重试",
			confirmCancel: "取消",
			doneBtn: "完成",
			restartNow: "立即重启",
			restartLater: "稍后重启",
			restarting: "正在重启…",
			restartHint: "重启会中断正在进行的安装/卸载任务，其进度将丢失。部分插件（如插件市场、顶层 bundle）需重启后才会生效。",
			done: "完成",
			restartPendingHint: "安装成功，重启后生效",
			restartPendingHintUninstall: "卸载成功，重启后移除",
			sectionPendingRestart: "待重启",
			sectionInProgress: "进行中",
			notifications: "通知",
			notificationsHint: "查看安装/卸载/更新通知",
			notificationsDesc: "安装、卸载任务与更新提醒都会记录在这里，即使错过提示也能随时回来查看。",
			notificationsEmpty: "暂无通知记录",
			notificationsClear: "清空通知",
			notificationsClearConfirmTitle: "清空所有通知？",
			notificationsClearConfirmDesc: "将删除全部通知记录，且不可恢复。",
			removeNotification: "删除这条通知",
			removeNotificationConfirmTitle: "删除这条通知？",
			removeNotificationConfirmDesc: "该通知将被移除，且不可恢复。",
			queuedTitle: "已加入安装排队",
			queuedUninstallTitle: "已加入卸载排队",
			queuedHint: "已加入排队，前序任务完成后将自动开始，可关闭本窗口继续浏览。",
			cancelTask: "取消任务",
			cancelling: "正在取消…",
			errorTitle: "操作失败",
			errorTitleInstall: "安装失败",
			errorTitleUninstall: "卸载失败",
			errorTitleUpdate: "更新失败",
			errorPlugin: "插件",
			errorClose: "知道了",
			errorCopy: "复制错误信息",
			errCopied: "错误信息已复制",
			failCopy: "复制完整错误信息",
			failIssueHint: "带着错误日志去作者仓库一键提交 Issue（正文含官网收录链接）",
			failIssueBig: "一键提交 BUG 到 GitHub Issue 为开源作贡献",
			failPrepareHint: "该插件安装时的构建脚本执行失败（git 分发常缺失子模块或构建产物），属插件打包分发问题。请向作者仓库提交 Issue 反馈。",
			failPackagingHint: "该插件不支持官方默认安装方式：其 git 分发缺少构建产物（package.json 声明的入口文件在仓库中不存在），说明作者未适配官方安装流程。请到作者仓库提交 Issue 反馈，请其提交构建产物或发布 npm 版。",
			failIgnoredBuild: "该插件或其依赖需要执行构建脚本，被 pnpm 的安全白名单（allowBuilds）默认拦截导致安装失败（如原生模块 node-pty、或 git 安装时插件的 prepare 脚本）—— 其他插件不受影响，属该插件的依赖/打包问题。建议向作者仓库一键反馈，请作者改用预编译版本（如 node-pty-prebuilt-multiarch）或移除安装期构建。",
			failNpmTooLow: "怀疑本机 npm 版本过低：npm 解析插件依赖时内部崩溃（这是 npm 自身的已知缺陷，不是插件问题）。请升级 npm 后重试：npm install -g npm@latest",
			failNpmTooLowV: "本机 npm 版本过低（当前 v{v}）：npm 解析插件依赖时内部崩溃（这是 npm 自身的已知缺陷，不是插件问题）。请升级 npm 后重试：npm install -g npm@latest",
			failNetworkHint: "安装前检测到网络不通：无法连接到安装源（可能是断网、DNS 解析失败、被防火墙拦截，或代理配置有问题）。这不是插件本身的问题 —— 请检查网络连接，或到「设置」里确认 HTTP 代理配置，再到「系统诊断」运行一次连通性检测，然后重试。",
			failNetworkTarget: "无法访问 {url} —— 你的网络连接不通",
			failNetworkRunDiag: "去系统诊断检测网络",
			failDshMissingHint: "系统找不到 dsh 命令（dsh 未加入系统 PATH），无法调用安装器执行安装。请确认 DeepSeek Harness 已正确安装、dsh 已加入 PATH（或重新安装），然后重试。这不是插件本身的问题。",
			failGitMissingHint: "系统找不到 git 命令（Git 未安装或未加入系统 PATH），无法从 GitHub 源安装插件。请先安装 Git（如 git-scm.com/downloads）或把 git 加入 PATH，重启 DSH 后重试。这不是插件本身的问题。",
			failPnpmMissingHint: "安装器找到了 dsh，但系统里没有 pnpm 命令（dsh 用它来管理 profile 插件）。请先安装 pnpm（如 npm install -g pnpm），确认 pnpm 已加入 PATH 后重试。这不是插件本身的问题。",
			failNpmMissingHint: "系统找不到 npm 命令（npm 未安装或未加入系统 PATH），无法执行全局安装。请先安装 Node.js（自带 npm），确认 npm 已加入 PATH 后重试。这不是插件本身的问题。",
			failPnpmStoreHint: "安装器调用 pnpm 时报「store 位置不匹配」（ERR_PNPM_UNEXPECTED_STORE）：你的 profile 目录里旧插件依赖是用另一个大版本的 pnpm 生成的，当前 pnpm 出于安全不认旧目录，导致任何插件装进该 profile 都会失败。请删除该 profile 目录下的 node_modules 与 pnpm-lock.yaml（可先到「系统日志」或 ~/.dsh/profiles/<profile>/hub.log 查看完整报错），再重新安装。这不是插件本身的问题。",
			failPnpmPolicyHint: "安装器调用 pnpm 时被其供应链安全策略拦截——装任何插件都会撞墙，不是插件本身的问题。分两种情况处理：① 提示「Minimum release age」（ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION）：包发布还不满 24 小时，pnpm 11 出于安全会拒收这种刚发布的新包。可在 pnpm 配置（pnpm-workspace.yaml）里加 minimumReleaseAge: 0 豁免，或等满 24 小时后重试。② 提示「untrusted origin」（ERR_PNPM_UNTRUSTED_ORIGIN）：依赖来源不被本机 pnpm 信任，通常是该 profile 里之前用 github: 或非官方 npm 源装过插件，锁文件记录了不受信任的来源。请删除该 profile 目录下的 node_modules 与 pnpm-lock.yaml 后重新安装（可先到「系统日志」或 ~/.dsh/profiles/<profile>/hub.log 查看完整报错）。",
			installChannelNpm: "NPM 包",
			installChannelGit: "GitHub 源码",
			installChannelDsh: "DSH 命令",
			installEntryLine: "安装入口：{c}。",
			reportIssue: "去插件仓库提交 Issue",
			detail: "打开详情",
			noResult: "没有找到匹配的插件",
			noResultDesc: "换个关键词试试，或前往网站浏览全部插件。",
			today: "今天更新",
			daysAgo: "更新于 {days} 天前",
			monthsAgo: "更新于 {months} 个月前",
			yearsAgo: "更新于 {years} 年前",
			pluginsTotal: "结果 {n} 条插件",
			filterResults: "结果 {n} 条插件",
			more: "还有 {n} 个插件，去网站查看全部",
			browseAll: "浏览全部 {n} 个插件",
			verified: "已验证",
			version: "版本",
			update: "可更新",
			updateAvailable: "有更新",
			updateAvailableHint: "检测到更新：有版本号的仓库比对版本号，无版本号的仓库比对仓库最近更新时间",
			hubUpdateHint: "检测到 DSH Plugin Hub 新版本，点击查看更新内容并更新",
			hubUpdateTitle: "DSH Plugin Hub 有新版本",
			hubUpdateDesc: "v{version} 已发布，点击下方按钮即可更新，完成后需重启宿主生效。",
			hubUpdatePublished: "发布于",
			hubUpdateNotes: "更新记录",
			hubUpdateLater: "稍后再说",
			versionHint: "查看版本信息与更新记录",
			hubCurrentTitle: "当前版本",
			hubCurrentDesc: "你正在使用 v{version}，已是最新版本。",
			hubUpToDate: "已是最新版本",
			followUs: "关注我们",
			aboutTitle: "关注我们",
			aboutDesc: "了解 DSH Plugin Hub 是做什么的，加入用户反馈群随时交流。",
			aboutEmpty: "内容暂未发布，敬请期待。",
			aboutUpdated: "更新于",
			empty: "该分类暂无插件",
			dataFrom: "数据源 api.dsh-plugin.org · 每日人工更新"
		};
		const en = {
			nav: "Plugin Hub",
			title: "DSH Plugin Hub",
			tagline: "DSH Plugin Hub: a human-verified, free marketplace for DeepSeek Harness plugins",
			adBadge: "Featured",
			ad: "DSH Plugin Hub: {total} plugins indexed, {verified} human-verified, updated daily",
			search: "Search plugins by name, description, tags…",
			all: "All",
			sortStars: "Stars",
			sortForks: "Forks",
			sortUpdated: "Recently updated",
			sortNewest: "Newest added",
			sortAria: "Plugin sort order",
			openHint: "Open dsh-plugin.org",
			toggleLangHint: "Switch language",
			githubHint: "View source on GitHub",
			fork: "Fork",
			loading: "Loading plugin data…",
			failed: "Failed to load plugin data",
			failedDescNoProxy: "Your network seems unreachable, so the plugin catalog could not be loaded. Please check your connection and retry; or open the hub in your browser with the button above.",
			failedDescProxy: "Your network seems unreachable, or the HTTP proxy in Settings is unreachable, so the plugin catalog could not be loaded. Please check the proxy address and your connection, then retry; or open the hub in your browser with the button above.",
			retry: "Retry",
			install: "Install",
			cliOnlyHint: "This plugin may need command-line help; if it fails, copy the command above and run it in your dsh terminal",
			failedCopyHint: "Install failed. Copy the command above and run it manually in your dsh terminal (native build scripts may need manual approval, e.g. pnpm approve-builds)",
			toastCopied: "Install command copied — paste it in your dsh terminal",
			installed: "Installed",
			viewMarket: "Market",
			viewInstalled: "Installed",
			viewCustom: "Custom",
			viewSettings: "Settings",
			viewMarketHint: "Browse and discover plugins",
			viewInstalledHint: "Manage installed plugins",
			viewCustomHint: "Install npm packages or GitHub sources manually",
			viewSettingsHint: "Network sources and preferences",
			installedEmpty: "No plugins installed yet",
			installedEmptyDesc: "Go to Custom to add an npm package or GitHub source manually",
			npmInstallLabel: "npm package / command",
			npmInstallPlaceholder: "npm install <pkg> or a bare package name",
			npmInstallExample: "Native commands: npm install lodash, npm i lodash, pnpm add @scope/pkg",
			npmInstallExample2: "Global CLI: npm install -g @scope/cli; or just type a package name like lodash",
			npmInstallInvalid: "Enter an npm package name (e.g. lodash, @scope/pkg), or a native install command (e.g. npm install lodash, npm i lodash, pnpm add @scope/pkg, npm install -g @scope/cli)",
			gitInstallLabel: "GitHub source",
			gitInstallPlaceholder: "Repository address",
			gitInstallExample: "e.g. owner/repo or https://github.com/owner/repo",
			gitInstallInvalid: "Enter a GitHub repository address, e.g. owner/repo or https://github.com/owner/repo",
			dshCmdLabel: "DeepSeek Harness command",
			dshCmdPlaceholder: "Paste an official dsh plugin command",
			dshCmdInsertHubUpdate: "Insert update command",
			dshCmdExample: "e.g. dsh plugin --profile web add github:owner/repo, or dsh plugin --profile web update dsh-plugin",
			dshCmdInvalid: "Paste an official dsh plugin command (--profile required, add / update), e.g. dsh plugin --profile web update dsh-plugin",
			installHelp: "Help",
			helpModalTitle: "Supported command formats",
			npmInstallHelp: "lodash or @scope/pkg	just type the package name\nnpm install lodash\nnpm i lodash\npnpm add @scope/pkg\npnpm i @scope/pkg\nnpm install -g @scope/cli	installs the CLI globally, not shown in Installed",
			gitInstallHelp: "owner/repo\nhttps://github.com/owner/repo\ngithub:owner/repo\ngit+https://github.com/owner/repo.git\ngit@github.com:owner/repo.git",
			dshCmdHelp: "dsh plugin --profile web add <target>	install\ndsh plugin --profile web update <target>	update an installed target to the latest version\ndsh plugin --profile=web add <target>\ndsh plugin --profile=web update <target>\n	--profile is required and there is no -p shorthand; <target> can be an npm package or github:owner/repo; uninstall from the Installed list",
			globalNpmHint: "This installs CLI tools globally (npm install -g). They won't appear in Installed and no host restart is needed.",
			installCliBtn: "Install",
			channelDisabledHint: "This install channel is disabled — enable it in Settings → Security & Trust",
			goToSettings: "Go to Settings",
			customViewDesc: "Manually install an npm package, a GitHub source, or paste an official dsh plugin command. Finished installs appear in Installed, marked as custom.",
			customLabel: "Custom install",
			installedSearch: "Search installed plugins…",
			installedFilterCatalog: "Catalog",
			hubInstall: "Hub",
			hubInstallHint: "From the plugin hub catalog",
			manualInstall: "Manual",
			manualInstallHint: "Not from the catalog — installed via the command line",
			filterByLabel: "Source",
			sortByLabel: "Sort",
			sortName: "Name",
			sortInstalledAt: "Recent",
			detailTitle: "Plugin details",
			detailCategory: "Category",
			detailStats: "Repo stats",
			statusLabel: "Status",
			statusRunning: "Running",
			statusPending: "Restart pending",
			exampleLabel: "DeepSeek Harness built-in example",
			exampleHint: "DeepSeek Harness built-in example — not a marketplace dsh plugin, the host does not load it, no restart needed",
			restart: "Restart",
			installedVersionLabel: "Installed version",
			catalogLatest: "latest in catalog",
			installPath: "Install path",
			copyPath: "Copy path",
			openFolder: "Show in folder",
			openFolderFail: "Could not open the folder — copy the path instead",
			revealFolder: "Show in Finder",
			installedAtLabel: "Installed at",
			lastUpdatedLabel: "Last updated",
			detailCatalog: "View details",
			packageName: "Package",
			versionUpHint: "v{from} → v{to} available — Update reinstalls in place",
			settingsUpdate: "Update Settings",
			settingsUpdateDesc: "Update checks and the network channels used for installs",
			settingsCheckOnStart: "Check for updates on startup",
			settingsCheckOnStartDesc: "Check installed plugins for new versions when the hub opens; you will be notified when updates are found",
			settingsAutoInstall: "Auto-install updates",
			settingsAutoInstallDesc: "Install detected updates in the background without asking (a host restart applies them)",
			settingsProxy: "HTTP proxy",
			settingsProxyDesc: "Route npm, git and catalog requests through this proxy; leave empty to connect directly",
			proxyCheckChecking: "Testing this proxy address…",
			proxyCheckOk: "Reachable — installs and catalog requests will route through it",
			proxyCheckFail: "Unreachable, but you can still save it; make sure the proxy is running and the address and port are correct",
			settingsMirror: "npm mirror",
			settingsMirrorDesc: "Unset by default — follows local npm config; pick a domestic mirror if slow",
			mirrorNone: "Unset (follow local npm config)",
			mirrorOfficial: "Official registry.npmjs.org",
			mirrorNpmmirror: "Alibaba npmmirror",
			mirrorTencent: "Tencent Cloud mirror",
			mirrorTsinghua: "Tsinghua TUNA mirror",
			settingsSecurity: "Security & Trust",
			settingsSecurityDesc: "Toggles for the three command-line install channels: npm packages, GitHub sources and DSH commands",
			settingsEnableNpm: "Enable npm installs",
			settingsEnableNpmDesc: "Allow installing npm packages from the command line; turning this off rejects package-name installs",
			settingsEnableGit: "Enable GitHub source installs",
			settingsEnableGitDesc: "Allow installing from GitHub sources on the command line; turning this off rejects repository-address installs",
			settingsEnableDsh: "Enable DSH command installs",
			settingsEnableDshDesc: "Allow pasting a dsh plugin command to install; turning this off disables the command input",
			settingsDiagnostics: "System Diagnostics",
			settingsDiagnosticsDesc: "Check the connectivity of install channels: npm registry, GitHub and the catalog site",
			settingsLogs: "System Logs",
			settingsLogsDesc: "Local record of installs / uninstalls, settings changes and diagnostics — export the full log to troubleshoot",
			logsHeadHint: "Records installs, uninstalls, settings changes and diagnostics; keeps the latest 2,000 entries",
			logsRefresh: "Refresh log",
			logsExport: "Export log",
			logsLoading: "Reading log…",
			logsEmpty: "No log entries yet",
			logsLoadFail: "Failed to read the log; try again later",
			logModalTitle: "Log viewer",
			logViewerOpen: "Open log viewer",
			logViewerDesc: "View the local log in a built-in window; filter by type and level to pinpoint install / uninstall / update incompatibilities",
			logPathLabel: "Log file",
			logOpenFile: "Reveal",
			logOpenFileTip: "Reveal the log file in your system file manager",
			logOpenFileFail: "Could not open; locate the file manually",
			logClearAll: "Clear all logs",
			logClearConfirmTitle: "Clear all logs?",
			logClearConfirmDesc: "All log entries will be deleted. This cannot be undone.",
			logClearing: "Clearing…",
			logClearAllTip: "Delete all log entries",
			logClearFailed: "Failed to clear; try again",
			logPathSettingTitle: "Log Location",
			logPathSettingDesc: "Stored in the host config directory by default — set a directory or a .log file path to store elsewhere",
			logPathPlaceholder: "Leave empty for default",
			logPathReset: "Reset to default",
			logPathResetHint: "The field shows the location currently in use",
			logPathSave: "Save",
			logPathSaving: "Saving…",
			logPathSaved: "Saved — new logs will be written there",
			logPathSaveFail: "Could not save: the location is not writable",
			logPathChange: "Change",
			logPathBrowse: "Browse…",
			logPathBrowseFail: "Folder picker unavailable — type the path manually",
			logCatAll: "All types",
			logCatInstall: "Install",
			logCatUninstall: "Uninstall",
			logCatUpdate: "Update",
			logCatDiagnostics: "Diagnostics",
			logCatSettings: "Settings",
			logCatSystem: "System",
			logLvAll: "All levels",
			logLvError: "Error",
			logLvWarn: "Warn",
			logLvSuccess: "Success",
			logLvInfo: "Info",
			logLvDebug: "Debug",
			logSearchPlaceholder: "Search event or message…",
			logLoadMore: "Load more",
			logNoMore: "All loaded · {n} total",
			logCount: "{n} entries",
			logEmptyFilter: "No matching log entries",
			settingsDiagFail: "Unreachable",
			diagNpm: "npm registry",
			diagNpmUnset: "Unset (follow local npm config)",
			diagGithub: "GitHub",
			diagCatalog: "Catalog site",
			diagCatalogTarget: "Plugin marketplace",
			diagProxy: "HTTP proxy",
			diagOk: "OK",
			diagChecking: "Checking…",
			diagIdle: "Not checked",
			diagRecheck: "Click to re-check this channel",
			diagRunAll: "Run diagnostics",
			diagHeadHint: "{n} channels — click any row to re-check it alone",
			diagSummaryRunning: "Checking channels…",
			diagSummaryOk: "All channels reachable",
			diagSummaryFail: "Unreachable channel(s) — click a row to re-check",
			settingsEnvSnapshot: "System version",
			settingsEnvSnapshotDesc: "Copy host version and system info for pasting into issue reports",
			settingsEnvCopy: "Copy",
			settingsReset: "Restore Defaults",
			settingsResetDesc: "Restore update policy, npm mirror, proxy and security restrictions to factory defaults in one go",
			settingsResetDetail: "Reset update policy, npm mirror, proxy and security restrictions to factory defaults",
			settingsResetRun: "Restore Defaults",
			settingsResetConfirm: "Restore Defaults",
			settingsResetConfirmDetail: "Reset all settings to factory defaults? Update policy, npm mirror, proxy and security restrictions will be cleared.",
			updateNoticeTitle: "Update available",
			updateNoticeGo: "Update",
			ignoreUpdateRun: "Ignore this update",
			ignoreUpdateConfirmTitle: "Ignore this update?",
			ignoreUpdateConfirmDetail: "This version will no longer notify you. You will be alerted again when the next version is released.",
			ignoreUpdateConfirm: "Ignore",
			uninstall: "Uninstall",
			uninstalling: "Removing…",
			uninstallTitle: "Confirm uninstall?",
			uninstallDesc: "The plugin will be removed from this environment.",
			uninstallDone: "Uninstalled",
			uninstallFail: "Removal failed — try again",
			uninstallResultTitle: "Removed",
			uninstallResultDesc: "The plugin has been removed from this environment.",
			confirmTitle: "Confirm install",
			confirmDesc: "Review the plugin repository source code carefully before installing.",
			confirmPlugin: "Plugin",
			confirmSource: "Source",
			confirmCommand: "Command",
			copyInstallCommand: "Copy install command",
			copyCmdLabel: "Copy",
			copyUninstallCommand: "Copy uninstall command",
			cancelUninstall: "Cancel uninstall",
			uninstallConfirm: "Confirm uninstall",
			installNow: "Install",
			installing: "Installing…",
			installDone: "Installed",
			updateDone: "Updated",
			installResultTitle: "Plugin installed successfully",
			installResultDesc: "",
			confirmUpdateTitle: "Confirm update",
			updateNow: "Update",
			updating: "Updating…",
			queuedUpdateTitle: "Queued for update…",
			updateResultTitle: "Updated",
			updateResultDesc: "The plugin has been updated to the latest version.",
			installFail: "Install failed — copy the command instead",
			requestTimeout: "Request timed out: GitHub may be unreachable or the network is unstable — try again later",
			confirmCancel: "Cancel",
			doneBtn: "Done",
			restartNow: "Restart now",
			restartLater: "Later",
			restarting: "Restarting…",
			restartHint: "Restarting interrupts any in-progress install / uninstall task — its progress will be lost. Some plugins (such as plugin markets / top-level bundles) only take effect after a restart.",
			done: "Done",
			restartPendingHint: "Installed — takes effect after restart",
			restartPendingHintUninstall: "Removed — cleaned up after restart",
			sectionPendingRestart: "Pending restart",
			sectionInProgress: "In progress",
			notifications: "Notifications",
			notificationsHint: "View install/remove/update notifications",
			notificationsDesc: "Every install, remove and update notice is logged here — even if you missed the prompt, you can always check back.",
			notificationsEmpty: "No notifications yet",
			notificationsClear: "Clear notifications",
			notificationsClearConfirmTitle: "Clear all notifications?",
			notificationsClearConfirmDesc: "All notification records will be deleted. This cannot be undone.",
			removeNotification: "Remove this notification",
			removeNotificationConfirmTitle: "Remove this notification?",
			removeNotificationConfirmDesc: "This notification will be removed. This cannot be undone.",
			queuedTitle: "Queued…",
			queuedUninstallTitle: "Queued for removal…",
			queuedHint: "Queued — starts automatically after earlier tasks finish. You may close this window.",
			cancelTask: "Cancel task",
			cancel: "Cancel",
			cancelling: "Cancelling…",
			errorTitle: "Operation failed",
			errorTitleInstall: "Install failed",
			errorTitleUninstall: "Removal failed",
			errorTitleUpdate: "Update failed",
			errorPlugin: "Plugin",
			errorClose: "Got it",
			errorCopy: "Copy error",
			errCopied: "Error copied",
			failCopy: "Copy full log",
			failIssueHint: "Open a pre-filled issue on the author repo with this error log (includes catalog links)",
			failIssueBig: "Report this bug to GitHub — contribute to open source",
			failPrepareHint: "This plugin failed while running its build scripts during install (git tarballs often miss submodules or build output). This is a packaging issue of the plugin itself — please report it to the author repository.",
			failPackagingHint: "This plugin does not support the official default install method: its git distribution lacks the build output (the entry file declared in package.json is not in the repository), so it has not been adapted to the official install flow. Please file an Issue on the author's repo asking for committed build output or an npm release.",
			failIgnoredBuild: "This plugin (or its dependencies) needs to run build scripts, which pnpm blocks by default via its allowBuilds allowlist, so the install fails (e.g. native modules like node-pty, or the plugin's own prepare script on git installs) — other plugins are unaffected. This is a dependency/packaging issue of the plugin itself. Please report it to the author repository and ask the author to ship a prebuilt variant (e.g. node-pty-prebuilt-multiarch) or drop install-time builds.",
			failNpmTooLow: "Your local npm may be too old: npm crashed internally while resolving the plugin's dependencies (a known npm bug — not a plugin issue). Please upgrade npm and retry: npm install -g npm@latest",
			failNpmTooLowV: "Your local npm is too old (v{v}): npm crashed internally while resolving the plugin's dependencies (a known npm bug — not a plugin issue). Please upgrade npm and retry: npm install -g npm@latest",
			failNetworkHint: "The network could not be reached before install: the install source is unreachable (offline, DNS failure, firewall block, or a misconfigured proxy). This is not a problem with the plugin itself — please check your connection, confirm the HTTP proxy in Settings, run a connectivity check under System Diagnostics, then retry.",
			failNetworkTarget: "Cannot reach {url} — your network connection is down",
			failNetworkRunDiag: "Run a network diagnostic",
			failDshMissingHint: "The dsh command could not be found (it is not on the system PATH), so the installer could not run. Please make sure DeepSeek Harness is installed correctly and dsh is on your PATH (or reinstall it), then retry. This is not a problem with the plugin itself.",
			failGitMissingHint: "The git command could not be found (Git is not installed or not on the system PATH), so GitHub-source plugins cannot be installed. Please install Git (e.g. from git-scm.com/downloads) or add git to your PATH, restart DSH, then retry. This is not a problem with the plugin itself.",
			failPnpmMissingHint: "The installer found dsh, but pnpm is missing on this machine (dsh uses it to manage profile plugins). Please install pnpm first (e.g. npm install -g pnpm), make sure it is on your PATH, then retry. This is not a problem with the plugin itself.",
			failNpmMissingHint: "The npm command could not be found (npm is not installed or not on the system PATH), so a global install cannot run. Please install Node.js (which bundles npm), make sure npm is on your PATH, then retry. This is not a problem with the plugin itself.",
			failPnpmStoreHint: "pnpm reported an unexpected store location (ERR_PNPM_UNEXPECTED_STORE): the profile directory was previously set up with a different major version of pnpm, and the current pnpm refuses to reuse it — no plugin can be installed into that profile. Delete node_modules and pnpm-lock.yaml under the profile directory (see System Logs or ~/.dsh/profiles/<profile>/hub.log for the full output), then reinstall. This is not a problem with the plugin itself.",
			failPnpmPolicyHint: "The installer was blocked by pnpm supply-chain security policy — every plugin install would hit the same wall, so this is not a problem with the plugin itself. Two cases: ① \"Minimum release age\" (ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION): the package was published less than 24 hours ago, and pnpm 11 refuses freshly-published packages for safety. Add minimumReleaseAge: 0 to your pnpm config (pnpm-workspace.yaml) to opt out, or wait until the 24 hours have passed and retry. ② \"untrusted origin\" (ERR_PNPM_UNTRUSTED_ORIGIN): a dependency source is not trusted by this machine, usually because plugins were previously installed via github: or a non-official npm registry, so the lockfile records an untrusted source. Delete node_modules and pnpm-lock.yaml under the profile directory (see System Logs or ~/.dsh/profiles/<profile>/hub.log for the full output), then reinstall.",
			installChannelNpm: "NPM package",
			installChannelGit: "GitHub source",
			installChannelDsh: "DSH command",
			installEntryLine: "Install entry: {c}.",
			reportIssue: "Report an Issue to the plugin repo",
			detail: "Open details",
			noResult: "No plugins match your search",
			noResultDesc: "Try another keyword, or browse all plugins on the website.",
			today: "updated today",
			daysAgo: "updated {days}d ago",
			monthsAgo: "updated {months}mo ago",
			yearsAgo: "updated {years}y ago",
			pluginsTotal: "Results: {n} plugins",
			filterResults: "Results: {n} plugins",
			more: "{n} more on the website",
			browseAll: "Browse all {n} plugins",
			verified: "Verified",
			version: "Version",
			update: "Update",
			updateAvailable: "Update available",
			updateAvailableHint: "An update was detected: repos with a release are compared by tag, repos without one by last push time",
			hubUpdateHint: "A new DSH Plugin Hub version is available — click to view the changelog and update",
			hubUpdateTitle: "A new DSH Plugin Hub version is available",
			hubUpdateDesc: "v{version} has been released — click below to update, then restart the host to apply it.",
			hubUpdatePublished: "Published",
			hubUpdateNotes: "What's new",
			hubUpdateLater: "Later",
			versionHint: "View version info and changelog",
			hubCurrentTitle: "Current version",
			hubCurrentDesc: "You are on v{version} — this is the latest version.",
			hubUpToDate: "Up to date",
			followUs: "Follow us",
			aboutTitle: "Follow us",
			aboutDesc: "Learn what DSH Plugin Hub does and join our user feedback group.",
			aboutEmpty: "Content not published yet — stay tuned.",
			aboutUpdated: "Updated",
			empty: "No plugins in this category yet",
			dataFrom: "Data from api.dsh-plugin.org · curated daily"
		};
		//#endregion
		//#region \0dsh-css:src/client/styles/Header.module.css.mjs
		const css$11 = ".qikqja_root{min-width:0;height:100%;color:var(--hub-text-primary);flex-direction:column;gap:8px;display:flex}.qikqja_header{flex-direction:column;gap:2px;padding:2px 2px 0;display:flex}.qikqja_headerRight{flex-shrink:0;align-items:center;gap:2px;margin-left:auto;display:inline-flex}.qikqja_langBtn{height:24px;color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;padding:0 8px;font-size:12px;font-weight:600;transition:color .15s,background-color .15s;display:inline-flex}.qikqja_langBtn:hover{color:var(--hub-purple-1);background-color:var(--hub-purple-tint)}.qikqja_githubLink{color:var(--hub-text-tertiary);cursor:pointer;border-radius:6px;flex-shrink:0;align-items:center;padding:3px;text-decoration:none;transition:color .15s,background-color .15s;display:inline-flex}.qikqja_githubLink:hover{color:var(--hub-purple-1);background-color:var(--hub-purple-tint)}.qikqja_githubIcon{flex-shrink:0;display:block}.qikqja_aboutBtn{height:24px;color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;padding:0 8px;font-size:12px;font-weight:600;line-height:1;transition:color .15s,background-color .15s;display:inline-flex}.qikqja_aboutBtn:hover{color:var(--hub-purple-1);background-color:var(--hub-purple-tint)}.qikqja_headerTitleRow{align-items:center;gap:8px;min-width:0;display:flex}.qikqja_brandTitle{min-width:0;color:inherit;cursor:pointer;align-items:center;gap:10px;text-decoration:none;display:flex}.qikqja_taglineLink{min-width:0;max-width:100%;color:inherit;cursor:pointer;align-self:flex-start;text-decoration:none}.qikqja_title{margin:0;font-size:14px;font-weight:600;line-height:20px}.qikqja_version{color:var(--hub-text-secondary)}.qikqja_versionBtn{height:20px;color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:5px;flex-shrink:0;align-items:center;gap:5px;padding:0 6px;font-size:12px;font-weight:600;line-height:1;transition:color .12s;display:inline-flex}.qikqja_versionBtn:hover{color:var(--hub-text-secondary)}.qikqja_hubUpdateBadge{letter-spacing:.02em;color:#fff;background:var(--hub-danger);-webkit-user-select:none;user-select:none;border-radius:999px;flex-shrink:0;align-items:center;height:18px;padding:0 7px;font-size:11px;font-weight:700;line-height:1;transition:background .12s,box-shadow .12s,transform .12s;display:inline-flex;box-shadow:0 1px 4px #d1242f66}.qikqja_hubUpdateBadge:hover{background:var(--hub-danger-hover);transform:translateY(-1px);box-shadow:0 2px 8px #d1242f80}.qikqja_logoIcon{flex-shrink:0;display:block}.qikqja_copyIcon{flex-shrink:0}.qikqja_tagline{color:var(--hub-text-tertiary);white-space:nowrap;text-overflow:ellipsis;margin:0;font-size:12px;line-height:18px;overflow:hidden}.qikqja_controls{border-bottom:1px solid var(--hub-border-1);flex-shrink:0;align-items:center;gap:8px;padding:0 2px 8px;display:flex}.qikqja_resultCount{font-variant-numeric:tabular-nums;text-align:center;min-width:5ch}.qikqja_resultSeg{color:var(--hub-text-tertiary);white-space:nowrap;-webkit-user-select:none;user-select:none;flex-shrink:0;align-items:baseline;font-size:12px;line-height:18px;display:inline-flex}.qikqja_sortGroup{flex-shrink:0;align-items:center;gap:8px;margin-left:auto;display:inline-flex}.qikqja_segLabel{color:var(--hub-text-tertiary);flex-shrink:0;font-size:11px;line-height:16px}.qikqja_segGroup{border:1px solid var(--hub-border-2);border-radius:6px;flex-shrink:0;align-items:center;display:inline-flex;overflow:hidden}.qikqja_segBtn{height:24px;color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;white-space:nowrap;background:0 0;border:none;justify-content:center;align-items:center;gap:4px;padding:0 10px;font-family:inherit;font-size:12px;line-height:24px;transition:color .12s,background .12s;display:inline-flex}.qikqja_segBtn svg{flex-shrink:0;display:block}.qikqja_segBtn+.qikqja_segBtn{border-left:1px solid var(--hub-border-2)}.qikqja_segBtn:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.qikqja_segBtnActive,.qikqja_segBtnActive:hover{color:#fff;background:var(--hub-brand)}.qikqja_adBanner{border:1px solid var(--hub-purple-border);background:linear-gradient(90deg, var(--hub-purple-1) 0%, var(--hub-purple-2) 100%);color:#fff;cursor:pointer;-webkit-user-select:none;user-select:none;box-shadow:0 2px 10px var(--hub-purple-shadow);border-radius:8px;align-items:center;gap:8px;padding:7px 12px;text-decoration:none;transition:filter .15s,box-shadow .15s;display:flex}.qikqja_adBanner:hover{filter:brightness(1.1);box-shadow:0 4px 16px var(--hub-purple-shadow-strong)}.qikqja_adBadge{letter-spacing:.04em;color:#fff;white-space:nowrap;background:#ffffff29;border:1px solid #ffffff8c;border-radius:4px;flex-shrink:0;padding:3px 6px;font-size:10px;font-weight:700;line-height:1}.qikqja_adText{text-overflow:ellipsis;white-space:nowrap;color:#fff;min-width:0;font-size:12px;line-height:18px;overflow:hidden}.qikqja_adArrow{color:#fff;flex-shrink:0;margin-left:auto;font-size:13px}.qikqja_searchRow{align-items:center;gap:6px;padding:0 2px;display:flex}.qikqja_search{min-width:0;height:28px;color:inherit;border:1px solid var(--hub-border-2);background:0 0;border-radius:6px;outline:none;flex:auto;padding:0 9px;font-size:12px;line-height:26px;transition:border-color .12s}.qikqja_search::placeholder{color:var(--hub-text-tertiary)}.qikqja_search:focus{border-color:var(--hub-brand)}.qikqja_tabs{border-bottom:1px solid var(--hub-border-1);flex-wrap:wrap;align-items:center;gap:6px;padding:2px 2px 8px;display:flex}.qikqja_tab,.qikqja_tabActive{cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:999px;flex-shrink:0;align-items:center;gap:6px;padding:3px 10px;font-size:12px;line-height:18px;transition:color .12s,background .12s;display:inline-flex}.qikqja_tab{color:var(--hub-text-secondary);background:0 0}.qikqja_tab:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.qikqja_tabActive{color:var(--hub-text-on-fill);background:var(--hub-btn-fill)}.qikqja_tabCount{text-align:center;min-width:16px;color:var(--hub-text-tertiary);background:var(--hub-bg-btn);border-radius:999px;padding:0 5px;font-size:10px;line-height:14px}.qikqja_tabActive .qikqja_tabCount{color:var(--hub-text-on-fill);background:var(--hub-bg-on-fill)}.qikqja_tabsRow{flex-shrink:0;align-items:center;gap:10px;display:flex}.qikqja_tabsRow>:first-child{flex:auto;min-width:0}";
		const tagId$11 = "dsh-plugin/Header.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$11) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$11;
			tag.textContent = css$11;
			document.head.appendChild(tag);
		}
		const cssRegistry$11 = globalThis.__DSH_PLUGIN_CSS__ ??= [];
		if (!cssRegistry$11.some((e) => e.tagId === tagId$11)) cssRegistry$11.push({
			tagId: tagId$11,
			css: css$11
		});
		var Header_module_css_default = {
			"taglineLink": "qikqja_taglineLink",
			"root": "qikqja_root",
			"version": "qikqja_version",
			"brandTitle": "qikqja_brandTitle",
			"adBanner": "qikqja_adBanner",
			"logoIcon": "qikqja_logoIcon",
			"resultSeg": "qikqja_resultSeg",
			"header": "qikqja_header",
			"hubUpdateBadge": "qikqja_hubUpdateBadge",
			"aboutBtn": "qikqja_aboutBtn",
			"resultCount": "qikqja_resultCount",
			"tabsRow": "qikqja_tabsRow",
			"segBtnActive": "qikqja_segBtnActive",
			"segGroup": "qikqja_segGroup",
			"title": "qikqja_title",
			"segBtn": "qikqja_segBtn",
			"tagline": "qikqja_tagline",
			"adArrow": "qikqja_adArrow",
			"sortGroup": "qikqja_sortGroup",
			"segLabel": "qikqja_segLabel",
			"adBadge": "qikqja_adBadge",
			"tab": "qikqja_tab",
			"tabs": "qikqja_tabs",
			"search": "qikqja_search",
			"tabCount": "qikqja_tabCount",
			"tabActive": "qikqja_tabActive",
			"versionBtn": "qikqja_versionBtn",
			"headerRight": "qikqja_headerRight",
			"langBtn": "qikqja_langBtn",
			"githubLink": "qikqja_githubLink",
			"controls": "qikqja_controls",
			"copyIcon": "qikqja_copyIcon",
			"headerTitleRow": "qikqja_headerTitleRow",
			"searchRow": "qikqja_searchRow",
			"githubIcon": "qikqja_githubIcon",
			"adText": "qikqja_adText"
		};
		//#endregion
		//#region \0dsh-css:src/client/styles/Modal.module.css.mjs
		const css$10 = ".BiQ1zG_overlay{z-index:998;-webkit-user-select:none;user-select:none;background:#00000061;justify-content:center;align-items:center;animation:.16s ease-out BiQ1zG_overlayIn;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.BiQ1zG_modal,.BiQ1zG_errorModal{background:var(--hub-bg-1);border:1px solid var(--hub-border-2);border-radius:10px;flex-direction:column;gap:10px;width:540px;max-width:calc(100vw - 32px);max-height:calc(100vh - 64px);padding:14px 16px;animation:.18s ease-out BiQ1zG_modalIn;display:flex;box-shadow:0 12px 40px #0000003d}.BiQ1zG_errorModal{width:720px;max-width:calc(100vw - 48px)}.BiQ1zG_modalWide{width:640px;max-width:calc(100vw - 48px)}.BiQ1zG_helpModal{width:760px;max-width:calc(100vw - 48px)}.BiQ1zG_logModal{width:820px;max-width:calc(100vw - 48px);height:min(540px,100vh - 64px)}.BiQ1zG_modalHead{flex-shrink:0;justify-content:space-between;align-items:center;gap:8px;display:flex}.BiQ1zG_modalTitle{color:var(--hub-text-primary);font-size:14px;font-weight:600;line-height:20px}.BiQ1zG_modalTitleBusy{color:var(--hub-brand)}.BiQ1zG_modalTitleQueued{color:var(--hub-warning)}.BiQ1zG_modalClose{width:24px;height:24px;color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;font-size:16px;line-height:1;display:inline-flex}.BiQ1zG_modalClose:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.BiQ1zG_modalCloseIcon{flex-shrink:0;width:14px;height:14px}.BiQ1zG_confirmIconWrap{justify-content:center;padding:2px 0 6px;display:flex}.BiQ1zG_confirmIcon{background:var(--hub-brand);border-radius:50%;flex:none;justify-content:center;align-items:center;width:48px;height:48px;display:inline-flex;box-shadow:0 4px 12px #4f6ef747}.BiQ1zG_confirmIconDanger{background:var(--hub-danger);box-shadow:0 4px 12px #d1242f4d}.BiQ1zG_dangerConfirm{color:#fff;background:var(--hub-danger);border:1px solid var(--hub-danger);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;flex:none;height:28px;padding:0 14px;font-size:12px;font-weight:600;transition:background-color .12s,border-color .12s}.BiQ1zG_dangerConfirm:hover:not(:disabled){background:var(--hub-danger-hover);border-color:var(--hub-danger-hover)}.BiQ1zG_dangerConfirm:disabled{opacity:.55;cursor:default}.BiQ1zG_confirmPrimary{color:#fff;background:var(--hub-brand);border:1px solid var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;flex:none;height:28px;padding:0 14px;font-size:12px;font-weight:600;transition:filter .12s}.BiQ1zG_confirmPrimary:hover:not(:disabled){filter:brightness(1.08)}.BiQ1zG_confirmPrimary:disabled{opacity:.55;cursor:default}.BiQ1zG_modalDesc{color:var(--hub-text-secondary);font-size:12px;line-height:18px}.BiQ1zG_trustHint{color:var(--hub-danger-text);background:var(--hub-danger-tint);border:1px solid var(--hub-danger-border-soft);border-radius:6px;padding:6px 10px;font-size:12px;font-weight:500;line-height:18px}.BiQ1zG_cliOnlyHint{color:var(--hub-text-secondary);background:var(--hub-bg-hover);border-radius:6px;padding:6px 10px;font-size:12px;line-height:18px}.BiQ1zG_failedCopyHint{color:var(--hub-danger-text);background:var(--hub-danger-tint);border:1px solid var(--hub-danger-border-soft);border-radius:6px;padding:6px 10px;font-size:12px;font-weight:500;line-height:18px}.BiQ1zG_modalRow{align-items:baseline;gap:8px;min-width:0;font-size:12px;line-height:18px;display:flex}.BiQ1zG_modalLabel{min-width:64px;color:var(--hub-text-tertiary);flex-shrink:0}.BiQ1zG_modalValue{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--hub-text-primary);font-weight:500;overflow:hidden}.BiQ1zG_modalLink{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;gap:4px;font-weight:500;text-decoration:none;transition:color .12s;display:inline-flex;overflow:hidden}.BiQ1zG_modalLink:hover{color:var(--hub-brand-hover);text-decoration:underline}.BiQ1zG_linkIcon{flex-shrink:0}.BiQ1zG_modalCmd{color:var(--hub-text-primary);background:var(--hub-bg-2);border:1px solid var(--hub-border-2);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;justify-content:space-between;align-items:center;gap:8px;padding:6px 6px 6px 10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:18px;transition:border-color .12s,background .12s;display:flex}.BiQ1zG_modalCmd:hover{border-color:var(--hub-border-ghost);background:var(--hub-bg-3)}.BiQ1zG_modalCmdText{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.BiQ1zG_modalCmdCopy{color:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:4px;flex-shrink:0;align-items:center;gap:3px;padding:1px 7px;font-family:inherit;font-size:11px;line-height:16px;transition:color .12s,background .12s;display:inline-flex}.BiQ1zG_modalCmdCopy:hover{color:var(--hub-brand-hover);background:var(--hub-bg-2)}.BiQ1zG_modalActions{justify-content:flex-end;align-items:center;gap:8px;margin-top:2px;display:flex}.BiQ1zG_modalBody{flex-direction:column;flex:auto;gap:10px;min-height:0;display:flex;overflow-y:auto}.BiQ1zG_toast{z-index:1000;background:var(--hub-btn-fill);color:var(--hub-text-on-fill);pointer-events:none;white-space:nowrap;border:none;border-radius:8px;padding:10px 16px;font-size:12px;font-weight:500;line-height:18px;animation:.22s ease-out BiQ1zG_toastIn;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 6px 24px #00000047}@keyframes BiQ1zG_toastIn{0%{opacity:0;transform:translate(-50%,-44%)}to{opacity:1;transform:translate(-50%,-50%)}}.BiQ1zG_toastFail{background:var(--hub-danger);color:#fff;border-color:#ffffff3d}.BiQ1zG_queueSection{flex-direction:column;gap:6px;display:flex}.BiQ1zG_queueSectionTitle{color:var(--hub-text-secondary);padding:4px 2px 0;font-size:12px;font-weight:600;line-height:18px}.BiQ1zG_pendingRowStatus{color:var(--hub-warn);flex-shrink:0;font-weight:500}.BiQ1zG_pendingRowActions{flex-shrink:0;gap:8px;margin-left:auto;display:flex}.BiQ1zG_queueRow{border:1px solid var(--hub-border-2);background:var(--hub-bg-2);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:8px;flex-direction:column;gap:5px;padding:8px 10px;font-size:12px;line-height:18px;transition:background .12s;display:flex}.BiQ1zG_queueRow:hover{background:var(--hub-brand-tint)}.BiQ1zG_queueRowHead{align-items:center;gap:10px;display:flex}.BiQ1zG_queueRowTarget{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--hub-text-primary);flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow:hidden}.BiQ1zG_queueRowDesc{color:var(--hub-text-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.BiQ1zG_queueRowBody{align-items:center;gap:8px;display:flex}.BiQ1zG_queueRowStatus{color:var(--hub-brand);flex-shrink:0;font-weight:500}.BiQ1zG_queueRowTrack{flex:1;min-width:0}.BiQ1zG_queueRowPct{color:var(--hub-text-tertiary);font-variant-numeric:tabular-nums;flex-shrink:0}.BiQ1zG_stripCancel{color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;flex-shrink:0;padding:2px 10px;font-size:12px;line-height:18px;transition:background .12s,color .12s}.BiQ1zG_stripCancel:hover{background:var(--hub-danger-tint);color:var(--hub-danger-text)}.BiQ1zG_stripCancel:disabled{opacity:.45;cursor:default}.BiQ1zG_queuedHint{color:var(--hub-brand);background:var(--hub-brand-tint);border:1px solid var(--hub-brand-border-soft);border-radius:6px;padding:5px 10px;font-size:12px;line-height:18px}.BiQ1zG_errorTitle{color:var(--hub-danger-text);font-size:14px;font-weight:600;line-height:20px}.BiQ1zG_errorBox{border:1px solid var(--hub-danger-border);background:var(--hub-danger-tint-weak);max-height:240px;color:var(--hub-text-primary);white-space:pre-wrap;word-break:break-word;-webkit-user-select:none;user-select:none;border-radius:6px;margin:0;padding:10px 12px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:17px;overflow:auto}.BiQ1zG_errorCopySoft{color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:4px;flex-shrink:0;align-items:center;padding:2px 8px;font-size:11px;line-height:16px;transition:color .12s,background .12s;display:inline-flex}.BiQ1zG_errorCopySoft:hover{color:var(--hub-text-secondary);background:var(--hub-bg-2)}.BiQ1zG_errorHint{color:var(--hub-text-tertiary);font-size:12px;line-height:18px}.BiQ1zG_modalCancel,.BiQ1zG_modalCopy{color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:color .12s,background .12s}.BiQ1zG_modalCancel:hover,.BiQ1zG_modalCopy:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.BiQ1zG_modalInstall{color:var(--hub-text-on-fill);background:var(--hub-btn-fill);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.BiQ1zG_modalInstall:hover{background:var(--hub-btn-hover)}.BiQ1zG_modalCopy:disabled,.BiQ1zG_modalInstall:disabled,.BiQ1zG_modalCancel:disabled,.BiQ1zG_modalClose:disabled,.BiQ1zG_uninstallConfirm:disabled{opacity:.55;cursor:not-allowed;pointer-events:none}.BiQ1zG_uninstallConfirm{color:#fff;background:var(--hub-danger);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.BiQ1zG_uninstallConfirm:hover{background:var(--hub-danger-hover)}.BiQ1zG_result{text-align:center;flex-direction:column;align-items:center;gap:5px;padding:10px 0 2px;display:flex}.BiQ1zG_resultCheck{background:var(--hub-success-tint);width:40px;height:40px;color:var(--hub-success);border-radius:50%;justify-content:center;align-items:center;margin-bottom:3px;display:inline-flex}.BiQ1zG_resultCheckIcon{flex-shrink:0;width:20px;height:20px}.BiQ1zG_resultTitle{color:var(--hub-text-primary);font-size:13px;font-weight:600;line-height:20px}.BiQ1zG_resultDesc{color:var(--hub-text-secondary);font-size:12px;line-height:18px}.BiQ1zG_resultRestarting{color:var(--hub-text-tertiary);padding:12px 0 6px;font-size:12px;line-height:18px}.BiQ1zG_restartLater{color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:color .12s,background .12s}.BiQ1zG_restartLater:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.BiQ1zG_restartNow{color:var(--hub-text-on-fill);background:var(--hub-btn-fill);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.BiQ1zG_restartNow:hover{background:var(--hub-btn-hover)}.BiQ1zG_restartNow:disabled{opacity:.55;cursor:not-allowed;pointer-events:none}.BiQ1zG_restartNowWarning{color:#fff;background:var(--hub-warning);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.BiQ1zG_restartNowWarning:hover{background:var(--hub-warning-hover)}.BiQ1zG_restartNowWarning:disabled{opacity:.55;cursor:not-allowed;pointer-events:none}.BiQ1zG_result .BiQ1zG_modalActions{justify-content:center;gap:10px;margin-top:0;padding:6px 0 2px}.BiQ1zG_result .BiQ1zG_modalActions .BiQ1zG_restartLater,.BiQ1zG_result .BiQ1zG_modalActions .BiQ1zG_restartNow,.BiQ1zG_result .BiQ1zG_modalActions .BiQ1zG_restartNowWarning{min-width:100px}.BiQ1zG_progress{margin:10px 0 2px}.BiQ1zG_progressHead{justify-content:flex-end;align-items:center;margin-bottom:3px;display:flex}.BiQ1zG_progressText{color:var(--hub-text-secondary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:14px}.BiQ1zG_progressTrack{background:var(--hub-border-2);border-radius:2px;height:4px;overflow:hidden}.BiQ1zG_progressFill{background:var(--hub-brand);border-radius:2px;height:100%;transition:width .32s}.BiQ1zG_progressFillFail{background:var(--hub-danger)}@keyframes BiQ1zG_overlayIn{0%{opacity:0}to{opacity:1}}@keyframes BiQ1zG_modalIn{0%{opacity:0;transform:translateY(6px)scale(.98)}to{opacity:1;transform:translateY(0)scale(1)}}.BiQ1zG_failList{flex-direction:column;gap:12px;padding-right:2px;display:flex}.BiQ1zG_failRow{border:1px solid var(--hub-border-2);background:var(--hub-bg-2);border-radius:8px;flex-direction:column;gap:8px;padding:10px 12px;display:flex}.BiQ1zG_failHead{align-items:center;gap:8px;min-width:0;display:flex}.BiQ1zG_noticeList{flex-direction:column;gap:10px;padding-right:2px;display:flex}.BiQ1zG_noticeRow{border:1px solid var(--hub-border-2);background:var(--hub-bg-2);border-radius:8px;flex-direction:column;align-items:stretch;gap:6px;padding:10px 12px;display:flex}.BiQ1zG_noticeRowMain{align-items:center;gap:10px;width:100%;min-width:0;display:flex}.BiQ1zG_noticeBadgeOk,.BiQ1zG_noticeBadgeFail{border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;width:28px;height:28px;display:inline-flex;box-shadow:0 2px 6px #0000002e}.BiQ1zG_noticeBadgeOk{background:var(--hub-success)}.BiQ1zG_noticeBadgeFail{background:var(--hub-danger)}.BiQ1zG_noticeBadgeIcon{flex-shrink:0;width:12px;height:12px}.BiQ1zG_noticeMain{flex-direction:column;flex:1;gap:8px;min-width:0;display:flex}.BiQ1zG_noticeHead{align-items:center;gap:8px;min-width:0;display:flex}.BiQ1zG_noticeTextOk{color:var(--hub-success);flex-shrink:0;font-size:12px;font-weight:600;line-height:18px}.BiQ1zG_noticeTextFail{color:var(--hub-danger-text);flex-shrink:0;font-size:12px;font-weight:600;line-height:18px}.BiQ1zG_noticeFoot{justify-content:flex-end;align-items:center;display:flex}.BiQ1zG_noticeTime{color:var(--hub-text-tertiary);font-variant-numeric:tabular-nums;flex-shrink:0;font-size:11px;line-height:16px}.BiQ1zG_noticeRemove{width:22px;height:22px;color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:5px;flex-shrink:0;justify-content:center;align-items:center;margin-left:auto;transition:color .12s,background .12s;display:inline-flex}.BiQ1zG_noticeRemove:hover{color:var(--hub-danger-text);background:var(--hub-danger-tint)}.BiQ1zG_noticeRowOk .BiQ1zG_noticeRemove{margin-left:0}.BiQ1zG_noticeRowOk .BiQ1zG_noticeTime{margin-left:auto}.BiQ1zG_noticeRowUpdate{cursor:pointer;transition:border-color .12s,background .12s}.BiQ1zG_noticeRowUpdate:hover{border-color:var(--hub-brand);background:var(--hub-brand-tint)}.BiQ1zG_noticeVersion{color:var(--hub-brand);background:var(--hub-brand-tint);border:1px solid var(--hub-brand-border);font-variant-numeric:tabular-nums;border-radius:5px;flex-shrink:0;padding:0 6px;font-size:11px;font-weight:600;line-height:18px}.BiQ1zG_noticeUpdateGo{color:#fff;background:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:5px;flex-shrink:0;margin-left:2px;padding:2px 8px;font-size:11px;font-weight:600;line-height:16px;transition:background .12s}.BiQ1zG_noticeUpdateGo:hover{background:var(--hub-brand-hover)}.BiQ1zG_noticeIgnore{color:var(--hub-text-secondary);border:1px solid var(--hub-border-2);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:5px;flex-shrink:0;margin-left:2px;padding:1px 8px;font-size:11px;font-weight:500;line-height:16px;transition:color .12s,border-color .12s,background .12s}.BiQ1zG_noticeIgnore:hover{color:var(--hub-danger-text);border-color:var(--hub-danger-border);background:var(--hub-danger-tint)}.BiQ1zG_failKind{border:1px solid #0000;border-radius:4px;flex-shrink:0;padding:0 6px;font-size:10px;font-weight:500;line-height:16px}.BiQ1zG_failKindInstall{color:var(--hub-danger-text);border-color:var(--hub-danger-border);background:var(--hub-danger-tint)}.BiQ1zG_failKindUninstall{color:var(--hub-warn);border-color:var(--hub-warn-border);background:var(--hub-warn-tint)}.BiQ1zG_failRepo{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:18px;text-decoration:none;overflow:hidden}.BiQ1zG_failRepo:hover{text-decoration:underline}.BiQ1zG_failCopy{color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:4px;flex-shrink:0;align-items:center;padding:2px 8px;font-size:11px;line-height:16px;transition:color .12s,background .12s;display:inline-flex}.BiQ1zG_failCopy:hover{color:var(--hub-text-secondary);background:var(--hub-bg-2)}.BiQ1zG_failEmpty{text-align:center;color:var(--hub-text-tertiary);padding:24px 0;font-size:12px;line-height:18px}.BiQ1zG_failClear{color:var(--hub-danger);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:color .12s,background .12s}.BiQ1zG_failClear:hover{color:#fff;background:var(--hub-danger)}.BiQ1zG_failBigIssue{box-sizing:border-box;text-align:center;color:#fff;background:var(--hub-danger);border:1px solid var(--hub-danger);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:8px;width:100%;margin-top:4px;padding:3px 16px;font-size:13px;font-weight:600;line-height:18px;text-decoration:none;transition:background .12s,border-color .12s,box-shadow .12s;display:block}.BiQ1zG_failBigIssue:hover{background:var(--hub-danger-hover);border-color:var(--hub-danger-hover);box-shadow:0 3px 10px #d1242f59}.BiQ1zG_failPrepareHint{color:var(--hub-warning);background:var(--hub-warning-tint);border:1px solid var(--hub-warning-border);border-radius:6px;margin-top:6px;padding:8px 12px;font-size:12px;line-height:18px}.BiQ1zG_failDiagBtn{box-sizing:border-box;text-align:center;width:100%;color:var(--hub-text-on-fill);background:var(--hub-btn-fill);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:8px;margin-top:8px;padding:5px 16px;font-size:13px;font-weight:600;line-height:18px;transition:background .12s,box-shadow .12s;display:block}.BiQ1zG_failDiagBtn:hover{background:var(--hub-btn-hover);box-shadow:0 3px 10px #0000001f}.BiQ1zG_failNetworkTarget{word-break:break-all;color:var(--hub-danger);background:var(--hub-danger-tint);border:1px solid var(--hub-danger-border);border-radius:6px;margin-top:6px;padding:8px 12px;font-size:13px;font-weight:700;line-height:20px}.BiQ1zG_aboutModal{width:560px;max-width:calc(100vw - 48px)}.BiQ1zG_aboutContent{min-height:0;max-height:340px;color:var(--hub-text-secondary);background:var(--hub-bg-2);border:1px solid var(--hub-border-2);border-radius:8px;flex:auto;padding:10px 12px;font-size:12px;line-height:18px;overflow-y:auto}.BiQ1zG_aboutContent>:first-child{margin-top:0}.BiQ1zG_aboutContent>:last-child{margin-bottom:0}.BiQ1zG_aboutContent h2,.BiQ1zG_aboutContent h3,.BiQ1zG_aboutContent h4,.BiQ1zG_aboutContent h5{color:var(--hub-text-primary);margin:10px 0 4px;font-size:13px;font-weight:600;line-height:20px}.BiQ1zG_aboutContent h2{font-size:14px}.BiQ1zG_aboutContent p{margin:4px 0}.BiQ1zG_aboutContent ul,.BiQ1zG_aboutContent ol{margin:4px 0;padding-left:18px}.BiQ1zG_aboutContent li{margin:2px 0}.BiQ1zG_aboutContent code{background:var(--hub-bg-hover);color:var(--hub-text-primary);border-radius:4px;padding:1px 4px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}.BiQ1zG_aboutContent pre{background:var(--hub-bg-1);border:1px solid var(--hub-border-2);border-radius:6px;margin:6px 0;padding:8px 10px;overflow-x:auto}.BiQ1zG_aboutContent pre code{background:0 0;border-radius:0;padding:0}.BiQ1zG_aboutContent blockquote{border-left:3px solid var(--hub-brand);background:var(--hub-bg-hover);color:var(--hub-text-tertiary);border-radius:0 6px 6px 0;margin:6px 0;padding:2px 10px}.BiQ1zG_aboutContent a{color:var(--hub-brand);text-decoration:none}.BiQ1zG_aboutContent a:hover{color:var(--hub-brand-hover);text-decoration:underline}.BiQ1zG_aboutContent img{border-radius:8px;max-width:100%;max-height:220px;margin:8px auto;display:block;box-shadow:0 2px 8px #0000001f}.BiQ1zG_aboutContent img[width=\"100\"]{object-fit:contain;width:100px;height:100px;max-height:100px}.BiQ1zG_aboutMeta{color:var(--hub-text-tertiary);font-size:11px;line-height:16px}.BiQ1zG_hubUpdateModal{width:620px;max-width:calc(100vw - 48px)}.BiQ1zG_hubUpdateMeta{flex-wrap:wrap;align-items:center;gap:4px 14px;font-size:12px;line-height:18px;display:flex}.BiQ1zG_hubUpdateMetaItem{color:var(--hub-text-tertiary)}.BiQ1zG_hubUpdateNotes{min-height:0;max-height:300px;color:var(--hub-text-secondary);background:var(--hub-bg-2);border:1px solid var(--hub-border-2);border-radius:8px;flex:auto;padding:10px 12px;font-size:12px;line-height:18px;overflow-y:auto}.BiQ1zG_hubUpdateNotes>:first-child{margin-top:0}.BiQ1zG_hubUpdateNotes>:last-child{margin-bottom:0}.BiQ1zG_hubUpdateNotes h2,.BiQ1zG_hubUpdateNotes h3,.BiQ1zG_hubUpdateNotes h4,.BiQ1zG_hubUpdateNotes h5{color:var(--hub-text-primary);margin:10px 0 4px;font-size:13px;font-weight:600;line-height:20px}.BiQ1zG_hubUpdateNotes h2{font-size:14px}.BiQ1zG_hubUpdateNotes p{margin:4px 0}.BiQ1zG_hubUpdateNotes ul,.BiQ1zG_hubUpdateNotes ol{margin:4px 0;padding-left:18px}.BiQ1zG_hubUpdateNotes li{margin:2px 0}.BiQ1zG_hubUpdateNotes code{background:var(--hub-bg-hover);color:var(--hub-text-primary);border-radius:4px;padding:1px 4px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}.BiQ1zG_hubUpdateNotes pre{background:var(--hub-bg-1);border:1px solid var(--hub-border-2);border-radius:6px;margin:6px 0;padding:8px 10px;overflow-x:auto}.BiQ1zG_hubUpdateNotes pre code{background:0 0;border-radius:0;padding:0}.BiQ1zG_hubUpdateNotes blockquote{border-left:3px solid var(--hub-brand);background:var(--hub-bg-hover);color:var(--hub-text-tertiary);border-radius:0 6px 6px 0;margin:6px 0;padding:2px 10px}.BiQ1zG_hubUpdateNotes a{color:var(--hub-brand);text-decoration:none}.BiQ1zG_hubUpdateNotes a:hover{color:var(--hub-brand-hover);text-decoration:underline}.BiQ1zG_detailModal{width:580px;max-width:calc(100vw - 48px)}.BiQ1zG_detailUpdateHint{color:var(--hub-brand);background:var(--hub-brand-tint);border:1px solid var(--hub-brand-border-soft);border-radius:6px;padding:6px 10px;font-size:12px;line-height:18px}.BiQ1zG_detailGrid{flex-direction:column;gap:6px;display:flex}.BiQ1zG_detailRow{align-items:baseline;gap:10px;min-width:0;font-size:12px;line-height:20px;display:flex}.BiQ1zG_detailLabel{text-align:right;width:76px;color:var(--hub-text-tertiary);flex-shrink:0}.BiQ1zG_detailValue{min-width:0;color:var(--hub-text-primary);flex-wrap:wrap;flex:auto;align-items:baseline;gap:4px 6px;font-weight:500;display:flex}.BiQ1zG_detailMono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;font-weight:500}.BiQ1zG_detailArrow{color:var(--hub-text-tertiary);align-items:baseline;gap:4px;display:inline-flex}.BiQ1zG_detailDim{color:var(--hub-text-tertiary);font-size:11px;font-weight:400}.BiQ1zG_detailLink{min-width:0;color:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;gap:4px;font-weight:500;text-decoration:none;transition:color .12s;display:inline-flex}.BiQ1zG_detailLink:hover{color:var(--hub-brand-hover);text-decoration:underline}.BiQ1zG_detailStars{color:#b45309;font-weight:600}.BiQ1zG_detailPath{min-width:0;color:var(--hub-text-primary);background:var(--hub-bg-2);border:1px solid var(--hub-border-2);border-radius:6px;flex:auto;justify-content:space-between;align-items:center;gap:6px;padding:3px 3px 3px 8px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:18px;transition:border-color .12s,background .12s;display:flex}.BiQ1zG_detailPath:hover{border-color:var(--hub-border-ghost);background:var(--hub-bg-3)}.BiQ1zG_detailPathText{text-overflow:ellipsis;white-space:nowrap;cursor:pointer;-webkit-user-select:none;user-select:none;min-width:0;overflow:hidden}.BiQ1zG_detailPathActions{flex-shrink:0;align-items:center;gap:4px;display:inline-flex}.BiQ1zG_detailPathBtn{width:28px;height:28px;color:var(--hub-brand);background:var(--hub-brand-tint);border:1px solid var(--hub-brand-border-soft);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;justify-content:center;align-items:center;transition:color .12s,background .12s,border-color .12s;display:inline-flex}.BiQ1zG_detailPathBtn svg{width:15px;height:15px}.BiQ1zG_detailPathBtn:hover{color:#fff;background:var(--hub-brand);border-color:var(--hub-brand)}.BiQ1zG_detailStatusRunning,.BiQ1zG_detailStatusPending{border-radius:50%;flex-shrink:0;align-self:center;width:8px;height:8px}.BiQ1zG_detailStatusRunning{background:var(--hub-success)}.BiQ1zG_detailStatusPending{background:var(--hub-warning)}.BiQ1zG_detailStatusText{font-weight:500}";
		const tagId$10 = "dsh-plugin/Modal.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$10) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$10;
			tag.textContent = css$10;
			document.head.appendChild(tag);
		}
		const cssRegistry$10 = globalThis.__DSH_PLUGIN_CSS__ ??= [];
		if (!cssRegistry$10.some((e) => e.tagId === tagId$10)) cssRegistry$10.push({
			tagId: tagId$10,
			css: css$10
		});
		var Modal_module_css_default = {
			"pendingRowStatus": "BiQ1zG_pendingRowStatus",
			"toast": "BiQ1zG_toast",
			"helpModal": "BiQ1zG_helpModal",
			"errorHint": "BiQ1zG_errorHint",
			"detailPathText": "BiQ1zG_detailPathText",
			"detailStatusRunning": "BiQ1zG_detailStatusRunning",
			"errorCopySoft": "BiQ1zG_errorCopySoft",
			"queueRowTrack": "BiQ1zG_queueRowTrack",
			"modalDesc": "BiQ1zG_modalDesc",
			"failNetworkTarget": "BiQ1zG_failNetworkTarget",
			"detailStatusText": "BiQ1zG_detailStatusText",
			"modalTitleBusy": "BiQ1zG_modalTitleBusy",
			"failHead": "BiQ1zG_failHead",
			"noticeMain": "BiQ1zG_noticeMain",
			"queueRowTarget": "BiQ1zG_queueRowTarget",
			"queueRow": "BiQ1zG_queueRow",
			"modalTitleQueued": "BiQ1zG_modalTitleQueued",
			"noticeRowUpdate": "BiQ1zG_noticeRowUpdate",
			"progressText": "BiQ1zG_progressText",
			"queueSection": "BiQ1zG_queueSection",
			"failClear": "BiQ1zG_failClear",
			"hubUpdateNotes": "BiQ1zG_hubUpdateNotes",
			"resultTitle": "BiQ1zG_resultTitle",
			"aboutModal": "BiQ1zG_aboutModal",
			"noticeVersion": "BiQ1zG_noticeVersion",
			"queueRowBody": "BiQ1zG_queueRowBody",
			"modalCloseIcon": "BiQ1zG_modalCloseIcon",
			"progressFill": "BiQ1zG_progressFill",
			"failedCopyHint": "BiQ1zG_failedCopyHint",
			"modal": "BiQ1zG_modal",
			"failKindUninstall": "BiQ1zG_failKindUninstall",
			"resultRestarting": "BiQ1zG_resultRestarting",
			"modalRow": "BiQ1zG_modalRow",
			"confirmPrimary": "BiQ1zG_confirmPrimary",
			"noticeFoot": "BiQ1zG_noticeFoot",
			"linkIcon": "BiQ1zG_linkIcon",
			"stripCancel": "BiQ1zG_stripCancel",
			"noticeRow": "BiQ1zG_noticeRow",
			"noticeTextFail": "BiQ1zG_noticeTextFail",
			"failRepo": "BiQ1zG_failRepo",
			"noticeHead": "BiQ1zG_noticeHead",
			"errorModal": "BiQ1zG_errorModal",
			"modalValue": "BiQ1zG_modalValue",
			"resultDesc": "BiQ1zG_resultDesc",
			"detailStatusPending": "BiQ1zG_detailStatusPending",
			"progressFillFail": "BiQ1zG_progressFillFail",
			"noticeRowMain": "BiQ1zG_noticeRowMain",
			"overlayIn": "BiQ1zG_overlayIn",
			"resultCheck": "BiQ1zG_resultCheck",
			"noticeTextOk": "BiQ1zG_noticeTextOk",
			"failPrepareHint": "BiQ1zG_failPrepareHint",
			"progressHead": "BiQ1zG_progressHead",
			"failKind": "BiQ1zG_failKind",
			"noticeList": "BiQ1zG_noticeList",
			"noticeRowOk": "BiQ1zG_noticeRowOk",
			"confirmIconWrap": "BiQ1zG_confirmIconWrap",
			"queuedHint": "BiQ1zG_queuedHint",
			"noticeUpdateGo": "BiQ1zG_noticeUpdateGo",
			"detailUpdateHint": "BiQ1zG_detailUpdateHint",
			"progress": "BiQ1zG_progress",
			"failList": "BiQ1zG_failList",
			"result": "BiQ1zG_result",
			"detailPath": "BiQ1zG_detailPath",
			"modalTitle": "BiQ1zG_modalTitle",
			"overlay": "BiQ1zG_overlay",
			"modalLabel": "BiQ1zG_modalLabel",
			"modalInstall": "BiQ1zG_modalInstall",
			"aboutMeta": "BiQ1zG_aboutMeta",
			"modalCopy": "BiQ1zG_modalCopy",
			"progressTrack": "BiQ1zG_progressTrack",
			"modalLink": "BiQ1zG_modalLink",
			"noticeRemove": "BiQ1zG_noticeRemove",
			"queueSectionTitle": "BiQ1zG_queueSectionTitle",
			"restartNow": "BiQ1zG_restartNow",
			"hubUpdateMetaItem": "BiQ1zG_hubUpdateMetaItem",
			"confirmIcon": "BiQ1zG_confirmIcon",
			"detailDim": "BiQ1zG_detailDim",
			"noticeBadgeIcon": "BiQ1zG_noticeBadgeIcon",
			"queueRowDesc": "BiQ1zG_queueRowDesc",
			"uninstallConfirm": "BiQ1zG_uninstallConfirm",
			"restartLater": "BiQ1zG_restartLater",
			"trustHint": "BiQ1zG_trustHint",
			"modalIn": "BiQ1zG_modalIn",
			"toastIn": "BiQ1zG_toastIn",
			"modalCancel": "BiQ1zG_modalCancel",
			"logModal": "BiQ1zG_logModal",
			"resultCheckIcon": "BiQ1zG_resultCheckIcon",
			"noticeIgnore": "BiQ1zG_noticeIgnore",
			"failCopy": "BiQ1zG_failCopy",
			"modalBody": "BiQ1zG_modalBody",
			"failEmpty": "BiQ1zG_failEmpty",
			"modalClose": "BiQ1zG_modalClose",
			"detailPathBtn": "BiQ1zG_detailPathBtn",
			"aboutContent": "BiQ1zG_aboutContent",
			"failDiagBtn": "BiQ1zG_failDiagBtn",
			"detailLabel": "BiQ1zG_detailLabel",
			"confirmIconDanger": "BiQ1zG_confirmIconDanger",
			"hubUpdateMeta": "BiQ1zG_hubUpdateMeta",
			"cliOnlyHint": "BiQ1zG_cliOnlyHint",
			"detailLink": "BiQ1zG_detailLink",
			"modalCmdText": "BiQ1zG_modalCmdText",
			"detailPathActions": "BiQ1zG_detailPathActions",
			"errorTitle": "BiQ1zG_errorTitle",
			"restartNowWarning": "BiQ1zG_restartNowWarning",
			"dangerConfirm": "BiQ1zG_dangerConfirm",
			"detailModal": "BiQ1zG_detailModal",
			"detailRow": "BiQ1zG_detailRow",
			"failKindInstall": "BiQ1zG_failKindInstall",
			"queueRowHead": "BiQ1zG_queueRowHead",
			"modalHead": "BiQ1zG_modalHead",
			"failBigIssue": "BiQ1zG_failBigIssue",
			"toastFail": "BiQ1zG_toastFail",
			"noticeBadgeFail": "BiQ1zG_noticeBadgeFail",
			"detailArrow": "BiQ1zG_detailArrow",
			"modalCmdCopy": "BiQ1zG_modalCmdCopy",
			"queueRowStatus": "BiQ1zG_queueRowStatus",
			"hubUpdateModal": "BiQ1zG_hubUpdateModal",
			"detailMono": "BiQ1zG_detailMono",
			"detailValue": "BiQ1zG_detailValue",
			"noticeBadgeOk": "BiQ1zG_noticeBadgeOk",
			"queueRowPct": "BiQ1zG_queueRowPct",
			"modalCmd": "BiQ1zG_modalCmd",
			"modalWide": "BiQ1zG_modalWide",
			"detailGrid": "BiQ1zG_detailGrid",
			"noticeTime": "BiQ1zG_noticeTime",
			"errorBox": "BiQ1zG_errorBox",
			"failRow": "BiQ1zG_failRow",
			"pendingRowActions": "BiQ1zG_pendingRowActions",
			"detailStars": "BiQ1zG_detailStars",
			"modalActions": "BiQ1zG_modalActions"
		};
		//#endregion
		//#region src/client/logic/install-command.ts
		/**
		* 安装通道决策（用户无感知）：目录探测到 npm 包名 → 用 npm 包名安装
		* （走 npm registry tarball，更快、与 GitHub 网络无关）；无 npm 包名 → git 直装。
		* 返回值 target 即传给后端 /install 的安装目标（npm 包名 或 owner/repo）。
		*/
		function installTargetOf(p) {
			const pkg = (p.source?.npmPackage ?? "").trim();
			const repo = (p.source?.repo ?? "").trim();
			if (pkg && repo) return {
				target: pkg,
				via: "npm"
			};
			return {
				target: repo,
				via: "github"
			};
		}
		/** 展示用安装命令（复制/弹窗）：目录下发的权威命令优先（CLI-only 插件如 dsh-tui
		*  需专属 profile（--profile dsh-tui），无法从 repo/npm 包名推断，必须用官方命令）；
		*  常规插件无目录命令时按通道回退生成：npm 显示包名，git 显示显式 HTTPS URL。 */
		function installCommandOf(p, withProfile = false) {
			const { target, via } = installTargetOf(p);
			if (via === "npm") {
				const cmd = p.install?.command;
				if (cmd) return cmd;
			} else {
				const cmd = p.install?.githubCommand;
				if (cmd) return cmd;
			}
			return via === "npm" ? `dsh plugin${withProfile ? " --profile web" : ""} add ${target}` : `dsh plugin${withProfile ? " --profile web" : ""} add git+https://github.com/${target}.git`;
		}
		/** Normalize a task/install target to its owner/repo display identity. */
		function repoFromInstallTarget(value) {
			const input = value.trim();
			if (/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(input)) return input;
			for (const pattern of [
				/^github:([^/]+)\/([^/]+)$/i,
				/^(?:git\+)?https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:[?#].*)?$/i,
				/^(?:git\+)?ssh:\/\/(?:git@)?github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:[?#].*)?$/i,
				/^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?(?:[?#].*)?$/i
			]) {
				const match = pattern.exec(input);
				if (match !== null) return `${match[1]}/${match[2]}`;
			}
			return value;
		}
		//#endregion
		//#region src/client/logic/constants.ts
		/** 插件市场官网地址。 */
		const SITE_URL = "https://dsh-plugin.org/";
		/** 插件市场源码仓库：头部右上角 GitHub 图标的跳转地址 */
		const GITHUB_URL = "https://github.com/dshplugin/dsh-plugin-hub";
		/**
		* Hub 自我更新版本控制（接口中心 Pages：api.dsh-plugin.org，静态 JSON 发布）。
		* 发新版 = 在 api-center 的 releases/ 写发版记录 + 重新部署，hub.json 随之更新，
		* 所有已装用户的「可更新」徽标即可见，不再依赖主站目录数据管道。
		* 响应：{ version: string | null, publishedAt: string | null, notes: string | {zh,en} | null }
		*/
		const HUB_UPDATE_URL = "https://api.dsh-plugin.org/hub.json";
		/** 接口中心「关注我们」内容（静态 JSON，由 api-center 的 about.md 构建生成，Markdown）。 */
		const HUB_ABOUT_URL = "https://api.dsh-plugin.org/about.json";
		/**
		* 插件当前版本号，供头部标题展示「DSH Plugin Hub v0.1.1」。
		* tsdown 构建时用 define 把 __PLUGIN_VERSION__ 替换成 package.json 的版本号；
		* node --test 直接 import 本模块时该标识符不存在，typeof 守卫兜底为空串。
		*/
		const PLUGIN_VERSION = "1.4.0";
		const CATEGORY_ORDER = [
			"interface",
			"session",
			"memory",
			"tools",
			"agent",
			"workflow",
			"integration",
			"model",
			"dev",
			"knowledge",
			"fun"
		];
		/** 分类标签按界面语言取词；未知 key 原样返回。 */
		function categoryLabel(map, key, lang) {
			return map[key]?.[lang] ?? key;
		}
		const CATEGORY_LABELS = {
			interface: {
				zh: "界面与体验",
				en: "UI & Experience"
			},
			session: {
				zh: "会话与消息",
				en: "Sessions & Messages"
			},
			memory: {
				zh: "记忆与上下文",
				en: "Memory & Context"
			},
			tools: {
				zh: "工具与能力",
				en: "Tools & Capabilities"
			},
			agent: {
				zh: "技能与智能体",
				en: "Skills & Agents"
			},
			workflow: {
				zh: "工作流与自动化",
				en: "Workflow & Automation"
			},
			integration: {
				zh: "集成与连接",
				en: "Integrations & Connections"
			},
			model: {
				zh: "模型与推理",
				en: "Models & Reasoning"
			},
			dev: {
				zh: "开发与运维",
				en: "Development & Operations"
			},
			knowledge: {
				zh: "数据与知识",
				en: "Data & Knowledge"
			},
			fun: {
				zh: "娱乐",
				en: "Entertainment"
			}
		};
		/** 分类 Tab 的紧凑标签（英文模式空间受限时使用）。 */
		const CATEGORY_SHORT_LABELS = {
			interface: {
				zh: "界面体验",
				en: "UI Exp"
			},
			session: {
				zh: "会话消息",
				en: "Sessions"
			},
			memory: {
				zh: "记忆上下文",
				en: "Memory"
			},
			tools: {
				zh: "工具能力",
				en: "Tools"
			},
			agent: {
				zh: "技能智能体",
				en: "Agents"
			},
			workflow: {
				zh: "工作流",
				en: "Workflow"
			},
			integration: {
				zh: "集成连接",
				en: "Integrations"
			},
			model: {
				zh: "模型推理",
				en: "Models"
			},
			dev: {
				zh: "开发运维",
				en: "Dev"
			},
			knowledge: {
				zh: "数据知识",
				en: "Knowledge"
			},
			fun: {
				zh: "娱乐",
				en: "Fun"
			}
		};
		const SORTS = [
			"sortStars",
			"sortForks",
			"sortUpdated",
			"sortNewest"
		];
		//#endregion
		//#region src/client/logic/ensure-plugin-css.ts
		/** Re-inject any registered stylesheet that is missing from the DOM. Idempotent. */
		function ensurePluginCss() {
			if (typeof document === "undefined") return;
			const registry = window.__DSH_PLUGIN_CSS__;
			if (!registry || registry.length === 0) return;
			for (const { tagId, css } of registry) {
				const selector = "style[data-plugin-css=" + JSON.stringify(tagId) + "]";
				if (document.querySelector(selector) !== null) continue;
				const tag = document.createElement("style");
				tag.dataset.plugin = "dsh-plugin";
				tag.dataset.pluginCss = tagId;
				tag.textContent = css;
				document.head.appendChild(tag);
			}
		}
		//#endregion
		//#region src/client/data/host.ts
		/** 当前 profile 已安装插件表（npm 包名 -> manifest spec）+ 安装时记录的目录信号 + 安装路径 + 运行状态。 */
		async function fetchInstalled() {
			try {
				const res = await fetch("/dsh-plugin-hub/installed", { cache: "no-store" });
				if (!res.ok) return null;
				const data = await res.json();
				return {
					installed: data.installed ?? {},
					versions: data.versions ?? {},
					paths: data.paths ?? null,
					loaded: data.loaded ?? null,
					dshCapable: data.dshCapable ?? null
				};
			} catch {
				return null;
			}
		}
		let envPromise = null;
		/** 在系统文件管理器里定位并打开已安装插件的目录（服务端 spawn open，跨平台）；失败返回 false。 */
		async function revealInstallFolder(name) {
			try {
				return (await fetch("/dsh-plugin-hub/open-path", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ name }),
					cache: "no-store"
				})).ok;
			} catch {
				return false;
			}
		}
		/** 在系统文件管理器里定位日志文件（服务端 spawn open，跨平台）；失败返回 false。 */
		async function openLogFile() {
			try {
				return (await fetch("/dsh-plugin-hub/open-log", {
					method: "POST",
					cache: "no-store"
				})).ok;
			} catch {
				return false;
			}
		}
		/**
		* 系统目录选择器：弹原生文件夹对话框让用户挑日志存放目录（服务端 spawn
		* osascript / FolderBrowserDialog / zenity）；选中返回绝对路径，取消或
		* 平台不支持（无 osascript / zenity）时返回 null。
		*/
		async function chooseLogDir() {
			try {
				const res = await fetch("/dsh-plugin-hub/choose-log-dir", {
					method: "POST",
					cache: "no-store"
				});
				if (!res.ok) return null;
				const data = await res.json();
				return typeof data.path === "string" && data.path !== "" ? data.path : null;
			} catch {
				return null;
			}
		}
		/**
		* 宿主机器环境快照（/dsh-plugin-hub/env）：提交 bug 时拼进 issue 正文。
		* 懒加载 + 模块级缓存：环境在会话期间不会变化；拉取失败降级为 null
		* （issue 链接照常生成，只是少环境段）。
		*/
		function getEnv() {
			envPromise ??= fetch("/dsh-plugin-hub/env", { cache: "no-store" }).then((res) => res.ok ? res.json() : null).catch(() => null);
			return envPromise;
		}
		//#endregion
		//#region src/client/logic/normalize.ts
		function normalize(raw) {
			if (typeof raw.s === "string") return {
				slug: raw.s,
				ownerSlug: typeof raw.o === "string" ? raw.o : void 0,
				displayName: typeof raw.n === "string" ? raw.n : void 0,
				version: typeof raw.vr === "string" ? raw.vr : void 0,
				category: typeof raw.c === "string" ? raw.c : void 0,
				topics: Array.isArray(raw.t) ? raw.t : void 0,
				features: Array.isArray(raw.f) ? raw.f : void 0,
				description: typeof raw.d === "string" ? raw.d : void 0,
				source: typeof raw.r === "string" ? { repo: raw.r } : raw.r !== null && typeof raw.r === "object" ? {
					repo: typeof raw.r.repo === "string" ? raw.r.repo : void 0,
					npmPackage: typeof raw.r.npmPackage === "string" ? raw.r.npmPackage : void 0
				} : void 0,
				install: raw.wi === false || typeof raw.ic === "string" || typeof raw.igc === "string" ? {
					webInstallable: raw.wi === false ? false : void 0,
					command: typeof raw.ic === "string" ? raw.ic : void 0,
					githubCommand: typeof raw.igc === "string" ? raw.igc : void 0
				} : void 0,
				compatibility: typeof raw.v === "string" ? { status: raw.v } : void 0,
				dates: {
					repoUpdatedAt: typeof raw.u === "string" ? raw.u : void 0,
					addedAt: typeof raw.a === "string" ? raw.a : void 0
				},
				stats: {
					stargazers_count: typeof raw.sg === "number" ? raw.sg : void 0,
					forks_count: typeof raw.fk === "number" ? raw.fk : void 0
				}
			};
			return raw;
		}
		//#endregion
		//#region src/client/data/catalog.ts
		const PROXY_BASE = "/dsh-plugin-hub/catalog";
		const PLUGINS_URL = (lang) => `${PROXY_BASE}?lang=${lang}`;
		const STATS_URL = `${PROXY_BASE}?stats=1`;
		async function fetchJson(url, signal) {
			const res = await fetch(url, {
				cache: "no-store",
				signal
			});
			if (!res.ok) throw new Error(String(res.status));
			return res.json();
		}
		/** 目录插件列表（在线 API 已只返回 verified；过滤与排序由上层负责）。
		*  signal 可选：宿主重启/代理抖动导致请求挂起时，上层可中止旧请求释放连接。 */
		async function fetchCatalog(lang, signal) {
			const data = await fetchJson(PLUGINS_URL(lang), signal);
			return (Array.isArray(data) ? data : []).map((item) => normalize(item));
		}
		/** 收录/精选统计（/api/stats.json）；字段不完整返回 null。 */
		async function fetchStats(signal) {
			const s = await fetchJson(STATS_URL, signal);
			if (s && typeof s.total === "number" && typeof s.verified === "number") return {
				total: s.total,
				verified: s.verified
			};
			return null;
		}
		//#endregion
		//#region src/client/data/hub.ts
		/** 版本接口是 Pages 静态文件，默认带 CDN 缓存（Cache-Control: public, max-age=43200，
		*  即 12 小时），客户端 no-store 管不到 CDN 边缘，会拿到旧公告。
		*  静态资产请求免费且无限，因此所有版本检查一律带时间戳 query：URL 每次不同 →
		*  CDN 缓存 key 不同 → 强制回源拉到最新公告，无任何配额顾虑。 */
		function busted(url) {
			return `${url}${url.includes("?") ? "&" : "?"}_t=${Date.now()}`;
		}
		/** Worker 版本控制中心：最新版本 + Markdown 变更记录；不可用返回 null。 */
		async function fetchHubUpdate() {
			try {
				const res = await fetch(busted(HUB_UPDATE_URL), { cache: "no-store" });
				if (!res.ok) return null;
				const data = await res.json();
				if (!data) return null;
				const version = typeof data.version === "string" && data.version.length > 0 ? data.version : null;
				if (version === null) return null;
				return {
					version,
					publishedAt: data.publishedAt ?? null,
					notes: data.notes ?? null
				};
			} catch {
				return null;
			}
		}
		/** Worker「关注我们」内容（平台介绍 + 反馈群二维码，Markdown）；未推送返回 null。 */
		async function fetchHubAbout() {
			try {
				const res = await fetch(busted(HUB_ABOUT_URL), { cache: "no-store" });
				if (!res.ok) return null;
				const data = await res.json();
				if (!data || data.content === null || data.content === void 0) return null;
				const content = typeof data.content === "string" || typeof data.content === "object" ? data.content : null;
				if (content === null) return null;
				return {
					content,
					updatedAt: data.updatedAt ?? null
				};
			} catch {
				return null;
			}
		}
		//#endregion
		//#region src/client/logic/installed.ts
		/** 安装时记录的目录信号（按仓库小写 key 查表）。 */
		function signalOf(repo, versions) {
			if (!repo) return null;
			return versions[repo.toLowerCase()] ?? null;
		}
		/** 插件是否已安装：匹配 Git spec 中的 owner/repo，或 npm 通道安装的依赖包名；命中返回 npm 包名。 */
		function installedNameOf(plugin, installed, versions) {
			const repo = plugin.source?.repo;
			if (!repo) return null;
			const needle = repo.toLowerCase();
			for (const [name, spec] of Object.entries(installed)) if (repoFromInstallTarget(spec).toLowerCase() === needle) return name;
			const pkg = ((plugin.source?.npmPackage || versions[repo.toLowerCase()]?.npmPackage) ?? "").toLowerCase();
			if (pkg) for (const [name, spec] of Object.entries(installed)) {
				if (isRepoLike(repoFromInstallTarget(spec))) continue;
				if (name.toLowerCase() === pkg) return name;
			}
			return null;
		}
		/** 该插件安装时记录的目录版本（无记录/未安装 → null）。 */
		function installedVersionOf(plugin, versions) {
			const repo = plugin.source?.repo;
			if (!repo) return null;
			return versions[repo.toLowerCase()]?.version ?? null;
		}
		/**
		* 是否有更新：仅对已安装插件有意义。
		* 双信号判定——有 release 版本的比版本；无版本（repo 不打 tag）的比仓库最近更新时间
		* （repoUpdatedAt，ISO 字符串字典序 = 时间序），更新时间变新说明有新提交。
		*/
		function hasUpdateOf(plugin, installed, versions) {
			if (installedNameOf(plugin, installed, versions) === null) return false;
			const repo = plugin.source?.repo;
			if (!repo) return false;
			const rec = versions[repo.toLowerCase()];
			if (!rec) return false;
			if (plugin.version) return plugin.version !== rec.version;
			const current = plugin.dates?.repoUpdatedAt;
			return Boolean(current && rec.updatedAt && current > rec.updatedAt);
		}
		/** 依赖 spec 能否解析出仓库身份（owner/repo 形态才算）。 */
		function isRepoLike(value) {
			return /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(value);
		}
		/**
		* 提 Issue 的仓库身份解析：失败目标可能是 owner/repo 也可能是 npm 包名（含 @scope/pkg、
		* 可带 @version，如 dsh-plugin、@scope/pkg@1.2.3）。
		*  - 目标本身就能解析出 owner/repo → 直接用；
		*  - npm 包名 → 反查仓库身份：先查已安装表（该包名的条目若带仓库身份即命中），再查目录插件
		*    （source.npmPackage 与包名一致，取目录收录的仓库身份）。
		* 反查到才返回，查不到返回 null —— 调用方据此不显示「一键提 Issue」按钮，避免把 Issue
		* 提到错误的地址（别人发的 npm 包名不是 GitHub 仓库，直接拼 github.com/<包名> 是打不开的）。
		*/
		function issueRepoOf(target, installedItems, plugins) {
			const input = target.trim();
			if (!input) return null;
			const parsed = repoFromInstallTarget(input);
			if (isRepoLike(parsed)) return parsed;
			const pkg = parsed.replace(/@[^@]*$/, "").toLowerCase();
			for (const item of installedItems) {
				if (item.name.toLowerCase() !== pkg) continue;
				if (item.repo) return item.repo;
				const repo = repoFromInstallTarget(item.spec);
				if (isRepoLike(repo)) return repo;
			}
			for (const p of plugins ?? []) {
				const pkgName = (p.source?.npmPackage ?? "").trim();
				if (pkgName !== "" && pkgName.toLowerCase() === pkg && p.source?.repo) return p.source.repo;
			}
			return null;
		}
		/** 已安装项 → 弹窗可用的伪插件对象：卸载确认弹窗只读名称/来源行，
		*  自定义安装（目录外）没有完整目录数据，用它把 InstalledItem 适配成 HubPlugin。 */
		function pluginOfItem(item) {
			return {
				slug: item.name,
				displayName: item.plugin?.displayName ?? item.name,
				source: item.repo ? { repo: item.repo } : void 0,
				description: item.plugin?.description
			};
		}
		/**
		* Hub 自身（本插件 dsh-plugin）的识别：三维互证，杜绝误伤同名第三方包。
		*  1) 依赖 key 固定为 `dsh-plugin`（本插件 npm 包名）；
		*  2) spec 为 `file:`/`link:` 本地链接（hub 以 file: 安装进宿主）；
		*  3) 或 spec 解析出的仓库身份就是自营仓库 `dshplugin/dsh-plugin-hub`。
		* 命中即视为宿主内置本体：永不出现在「自定义安装」里，卸载接口也早已对
		* 它 400 拒绝（服务端多维防线之一）——显示出来只会让用户误点卸载。
		*/
		function isHubSelf(name, spec) {
			if (name !== "dsh-plugin") return false;
			if (spec.startsWith("file:") || spec.startsWith("link:")) return true;
			const repo = repoFromInstallTarget(spec);
			if (isRepoLike(repo) && repo.toLowerCase() === "dshplugin/dsh-plugin-hub".toLowerCase()) return true;
			return !isRepoLike(repo);
		}
		/**
		* 构建已安装项列表：目录插件按命中关系合并（拥有完整元数据），
		* 剩余未认领的依赖 key 归为自定义安装（目录外，仅运行时信息）。
		*/
		function installedItemsOf(plugins, installed, versions, paths, loadedNames, dshCapableNames) {
			const items = [];
			const claimed = /* @__PURE__ */ new Set();
			for (const p of plugins ?? []) {
				const name = installedNameOf(p, installed, versions);
				if (name === null || claimed.has(name)) continue;
				claimed.add(name);
				const repo = p.source?.repo ?? null;
				const rec = signalOf(repo, versions);
				items.push({
					name,
					spec: installed[name],
					plugin: p,
					repo,
					installPath: paths?.[name] ?? null,
					installedVersion: rec?.version ?? null,
					installedAt: rec?.installedAt ?? null,
					catalogVersion: p.version ?? null,
					hasUpdate: hasUpdateOf(p, installed, versions),
					loaded: loadedNames?.includes(name) ?? false,
					dshCapable: dshCapableNames?.includes(name) ?? false
				});
			}
			for (const [name, spec] of Object.entries(installed)) {
				if (claimed.has(name)) continue;
				if (isHubSelf(name, spec)) continue;
				const parsed = repoFromInstallTarget(spec);
				const repo = isRepoLike(parsed) ? parsed : null;
				const rec = signalOf(repo, versions);
				items.push({
					name,
					spec,
					plugin: null,
					repo,
					installPath: paths?.[name] ?? null,
					installedVersion: rec?.version ?? null,
					installedAt: rec?.installedAt ?? null,
					catalogVersion: null,
					hasUpdate: false,
					loaded: loadedNames?.includes(name) ?? false,
					dshCapable: dshCapableNames?.includes(name) ?? false
				});
			}
			return items;
		}
		//#endregion
		//#region src/client/hooks/useCatalog.ts
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Catalog data + view state for the Plugin Hub section.
		*
		* Owns the online-data pipeline (live fetch from api.dsh-plugin.org), the local
		* installed-plugin table, and the filter/search/sort/install-status view
		* state, exposing the derived visible list and per-category counts.
		*/
		/** 插件市场自身仓库：DSH Plugin Hub 不显示在目录里（自己不进自己的插件列表） */
		const SELF_REPO = "dshplugin/dsh-plugin-hub";
		/** 市场各排序的默认方向：全部按倒序（Star/Fork 多、更新/收录近的在前） */
		const SORT_DEFAULT_DIR$1 = {
			sortStars: "desc",
			sortForks: "desc",
			sortUpdated: "desc",
			sortNewest: "desc"
		};
		function useCatalog(lang) {
			/** 目录插件（仅保留人工验证通过的条目） */
			const [plugins, setPlugins] = (0, react.useState)(null);
			/** Hub 自身目录条目（dshplugin/dsh-plugin-hub）：目录过滤会排除自身（不进插件列表），
			*  此处单独保留，供头部「可更新」徽标 → 「直接更新」覆盖重装使用。 */
			const [hubPlugin, setHubPlugin] = (0, react.useState)(null);
			/** 收录/精选统计（官网 /api/stats.json 实时拉取） */
			const [stats, setStats] = (0, react.useState)(null);
			const [failed, setFailed] = (0, react.useState)(false);
			const [reloadKey, setReloadKey] = (0, react.useState)(0);
			const [category, setCategory] = (0, react.useState)("all");
			const [query, setQuery] = (0, react.useState)("");
			const [sort, setSort] = (0, react.useState)("sortStars");
			/** 当前排序方向：点同一个排序按钮切换 正序/倒序；点新排序用该排序的默认方向（与已安装视图一致） */
			const [sortDir, setSortDir] = (0, react.useState)("desc");
			/** 目录加载「超时自动强制刷新」重试计数：宿主重启/代理未就绪时请求可能长时间挂起，
			*  界面停在「正在加载插件数据…」假死 —— 超时自动重拉，最多自动重试 2 次后转失败态；
			*  用户手动刷新（reload）时清零重新计数。 */
			const loadRetriesRef = (0, react.useRef)(0);
			/** 目录加载超时阈值：超过即判定挂起，强制刷新一次（服务端代理 curl 上限 20s，客户端 12s 先兜底） */
			const LOAD_TIMEOUT_MS = 12e3;
			/** 挂起后最多自动重试次数：避免代理持续不通时无限循环刷新（每次重试仍 12s，2 次后转失败界面可手动重试） */
			const MAX_LOAD_RETRIES = 2;
			/** 点击排序按钮：同一按钮切换正/倒序，新按钮用默认方向 */
			function toggleSort(key) {
				if (key === sort) setSortDir((d) => d === "asc" ? "desc" : "asc");
				else {
					setSort(key);
					setSortDir(SORT_DEFAULT_DIR$1[key]);
				}
			}
			/**
			* 强制刷新 Hub 版本与「关注我们」信息：点击头部版本号/徽标时触发。
			* 挂载期的 useEffect 只在进入/reload 时拉一次，发版后已打开的界面点版本号
			* 仍显示旧数据；此处重新拉接口中心，最新版本与变更记录点击即见。
			* 失败静默为 null（弹窗兜底展示当前版本号），与挂载期拉取口径一致。
			*/
			const refreshHub = async () => {
				const [info, about] = await Promise.all([fetchHubUpdate(), fetchHubAbout()]);
				setHubUpdateInfo(info);
				setHubAboutInfo(about);
			};
			/** 当前 profile 已安装插件：npm 包名 -> manifest spec（来自宿主本地路由） */
			const [installed, setInstalled] = (0, react.useState)({});
			/** 安装时记录的目录信号：repo(小写) -> { version, updatedAt }（来自宿主本地路由）；
			*  npmPackage 为 npm 优先通道反查命中的包名映射（目录数据未下发时客户端靠它把依赖 key 匹配回仓库） */
			const [versions, setVersions] = (0, react.useState)({});
			/** 每个依赖在系统上的安装目录（profile/node_modules/<包名>），详情视图展示用 */
			const [installPaths, setInstallPaths] = (0, react.useState)(null);
			/** 已加载进运行中 loader 的包名（官方 ctx.loader 对账）：装完未重启的新插件不在其中 */
			const [loadedNames, setLoadedNames] = (0, react.useState)(null);
			/** 真正的 dsh 插件包名（包内声明 dsh 配置 / 在 profile bundles 清单）：非 dsh 插件不提示「待重启」 */
			const [dshCapableNames, setDshCapableNames] = (0, react.useState)(null);
			/** Hub 自我更新信息：来自接口中心 Pages（api.dsh-plugin.org），与目录数据解耦 */
			const [hubUpdateInfo, setHubUpdateInfo] = (0, react.useState)(null);
			/** 头部「关注我们」弹窗内容（平台介绍 + 反馈群二维码）：来自接口中心 /about，Markdown 推送非写死 */
			const [hubAboutInfo, setHubAboutInfo] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				let cancelled = false;
				let settled = false;
				const controller = new AbortController();
				setPlugins(null);
				setHubPlugin(null);
				setStats(null);
				setFailed(false);
				const load = () => Promise.all([fetchCatalog(lang, controller.signal), fetchStats(controller.signal)]);
				load().then(([list, stats]) => {
					if (cancelled) return;
					settled = true;
					const hadSelf = list.some((p) => p.source?.repo === SELF_REPO);
					setHubPlugin(list.find((p) => p.source?.repo === SELF_REPO) ?? null);
					setPlugins(list.filter((p) => p.compatibility?.status === "verified" && p.source?.repo !== SELF_REPO));
					if (stats) setStats(hadSelf ? {
						total: stats.total - 1,
						verified: stats.verified - 1
					} : {
						total: stats.total,
						verified: stats.verified
					});
				}).catch(() => {
					if (cancelled) return;
					settled = true;
					setFailed(true);
				});
				const timer = window.setTimeout(() => {
					if (cancelled || settled) return;
					if (loadRetriesRef.current < MAX_LOAD_RETRIES) {
						loadRetriesRef.current += 1;
						setReloadKey((k) => k + 1);
					} else setFailed(true);
				}, LOAD_TIMEOUT_MS);
				return () => {
					cancelled = true;
					window.clearTimeout(timer);
					controller.abort();
				};
			}, [reloadKey, lang]);
			/** 刷新当前 profile 已安装插件表；宿主未挂本地路由时静默降级为空表。 */
			const refreshInstalled = async () => {
				const data = await fetchInstalled();
				if (data === null) return;
				setInstalled(data.installed);
				setVersions(data.versions);
				setInstallPaths(data.paths);
				setLoadedNames(data.loaded);
				setDshCapableNames(data.dshCapable);
			};
			(0, react.useEffect)(() => {
				refreshInstalled();
			}, []);
			(0, react.useEffect)(() => {
				let cancelled = false;
				fetchHubUpdate().then((info) => {
					if (!cancelled) setHubUpdateInfo(info);
				});
				return () => {
					cancelled = true;
				};
			}, [reloadKey]);
			(0, react.useEffect)(() => {
				let cancelled = false;
				fetchHubAbout().then((info) => {
					if (!cancelled) setHubAboutInfo(info);
				});
				return () => {
					cancelled = true;
				};
			}, [reloadKey]);
			/** 插件是否已安装：匹配 Git spec 中的 owner/repo，或 npm 通道安装的依赖包名；命中返回 npm 包名。 */
			const installedName = (p) => installedNameOf(p, installed, versions);
			/** 该插件安装时记录的目录版本（无记录/未安装 → null）。 */
			const installedVersion = (p) => installedVersionOf(p, versions);
			/**
			* 是否有更新：仅对已安装插件有意义。
			* 双信号判定——有 release 版本的比版本；无版本（repo 不打 tag）的比仓库最近更新时间
			* （repoUpdatedAt，ISO 字符串字典序 = 时间序），更新时间变新说明有新提交。
			*/
			const hasUpdate = (p) => hasUpdateOf(p, installed, versions);
			/** 已安装项统一列表（目录元数据 + 运行时信息合并）：驱动「已安装」tab。 */
			const installedItems = (0, react.useMemo)(() => installedItemsOf(plugins, installed, versions, installPaths, loadedNames, dshCapableNames), [
				plugins,
				installed,
				versions,
				installPaths,
				loadedNames,
				dshCapableNames
			]);
			/**
			* Hub 自身是否有可用更新：Hub 就是当前运行的应用（始终已安装，无需 installedName 命中）。
			* 以 Worker 版本控制中心返回的「最新版本」为准，与当前运行的版本号比对——
			* 构建时注入的 PLUGIN_VERSION 是运行 bundle 的真实版本；测试/异常场景缺失时
			* 回退到安装时记录的版本。版本号不等即新版（版本号只在发版时变更，绝无降级场景）。
			*
			* 另加 pnpm 供应链安全门槛：新版本发布还不满 24 小时（+30 分钟缓冲）时，pnpm 会静默
			* 回退到旧版本，此时若提示「可更新」用户点了也更新不到。publishedAt 由接口中心按 npm
			* registry 真实发布时间下发（同源），据此判断最准。
			*/
			const hubHasUpdate = (() => {
				if (!hubUpdateInfo) return false;
				if (hubUpdateInfo.version === "1.4.0") return false;
				const publishedAt = hubUpdateInfo.publishedAt;
				if (publishedAt) {
					const publishedMs = Date.parse(publishedAt);
					if (!Number.isNaN(publishedMs)) {
						if (Date.now() - publishedMs < 882e5) return false;
					}
				}
				return true;
			})();
			(0, react.useMemo)(() => {
				if (!plugins) return [];
				if (category === "all") return plugins;
				return plugins.filter((p) => p.category === category);
			}, [plugins, category]);
			const visible = (0, react.useMemo)(() => {
				if (!plugins) return [];
				const q = query.trim().toLowerCase();
				const list = plugins.filter((p) => {
					if (category !== "all" && p.category !== category) return false;
					if (!q) return true;
					return (p.displayName ?? "").toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q) || (p.topics ?? []).some((topic) => topic.toLowerCase().includes(q));
				});
				const dir = sortDir === "asc" ? 1 : -1;
				return [...list].sort((a, b) => {
					if (sort === "sortStars") return ((a.stats?.stargazers_count ?? 0) - (b.stats?.stargazers_count ?? 0)) * dir;
					if (sort === "sortForks") return ((a.stats?.forks_count ?? 0) - (b.stats?.forks_count ?? 0)) * dir;
					if (sort === "sortNewest") return (a.dates?.addedAt ?? "").localeCompare(b.dates?.addedAt ?? "") * dir;
					return (a.dates?.repoUpdatedAt ?? "").localeCompare(b.dates?.repoUpdatedAt ?? "") * dir;
				});
			}, [
				plugins,
				category,
				query,
				sort,
				sortDir,
				installed
			]);
			/** Per-category plugin counts shown on the category chips. */
			const categoryCounts = (0, react.useMemo)(() => {
				const counts = {};
				for (const p of plugins ?? []) if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1;
				return counts;
			}, [plugins]);
			return {
				plugins,
				hubPlugin,
				stats,
				failed,
				reload: () => {
					loadRetriesRef.current = 0;
					setReloadKey((k) => k + 1);
				},
				installed,
				installedItems,
				installedName,
				installedVersion,
				hasUpdate,
				hubHasUpdate,
				hubUpdateInfo,
				hubAboutInfo,
				refreshHub,
				refreshInstalled,
				category,
				setCategory,
				query,
				setQuery,
				sort,
				sortDir,
				toggleSort,
				visible,
				total: plugins?.length ?? 0,
				categoryCounts
			};
		}
		//#endregion
		//#region src/client/logic/failures.ts
		const KEY = "gro.ngilp-hsd.failure-records";
		const MAX = 50;
		/** 运行时 localStorage 访问：类型上不依赖 DOM lib（Node 测试环境也能编译），浏览器里取 window。 */
		const storage = () => globalThis.localStorage;
		/** 读取本地通知记录（损坏/不可用时返回空列表，不抛错）。列表最新在前，全部保留，只由「清空」按钮手动移除。 */
		function loadNotifications() {
			try {
				const raw = storage()?.getItem(KEY);
				if (!raw) return [];
				const list = JSON.parse(raw);
				if (!Array.isArray(list)) return [];
				return list.filter((r) => !!r && typeof r === "object" && typeof r.message === "string").map((r) => ({
					...r,
					ok: r.ok === true
				}));
			} catch {
				return [];
			}
		}
		function save(list) {
			try {
				storage()?.setItem(KEY, JSON.stringify(list));
			} catch {}
		}
		/** 追加一条通知记录并持久化，返回更新后的完整列表（最新在前，超上限裁剪）。
		*  每次成功/失败都各自留痕：同一插件的安装/卸载记录都完整保留、只由「清空」按钮手动移除，
		*  不会因后续操作被自动覆盖清除。 */
		function addNotification(record) {
			const prev = loadNotifications();
			let id = Date.now();
			while (prev.some((r) => r.id === id)) id += 1;
			const next = [{
				...record,
				id,
				at: id
			}, ...prev].slice(0, MAX);
			save(next);
			return next;
		}
		/** 记录一次失败：携带完整错误日志，供通知中心查看/复制/提 Issue。 */
		function addFailure(record) {
			return addNotification({
				...record,
				ok: false
			});
		}
		/** 记录一次成功：轻量记录，不带日志。 */
		function addSuccess(record) {
			return addNotification({
				...record,
				ok: true,
				message: ""
			});
		}
		/** 记录一条「发现新版本」更新提醒：成功类轻量记录，携带目录新版本号供通知中心展示。
		*  同一插件同一新版本已在通知中心时跳过：宿主重载会重新触发启动检查，不更新时
		*  通知里已有的提醒保持单条，不重复追加。 */
		function addUpdateNotice(record) {
			const prev = loadNotifications();
			if (prev.some((r) => r.kind === "update" && r.repo === record.repo && (r.version ?? void 0) === (record.version ?? void 0))) return prev;
			return addNotification({
				...record,
				ok: true,
				message: ""
			});
		}
		/** 已忽略的更新提醒持久化 key：`owner/repo@version` 字符串数组。 */
		const IGNORE_KEY = "gro.ngilp-hsd.ignored-updates";
		/** 读取已忽略的更新提醒（`owner/repo@version` 字符串集合）；损坏/不可用时返回空集合。 */
		function loadIgnoredUpdates() {
			try {
				const raw = storage()?.getItem(IGNORE_KEY);
				if (!raw) return /* @__PURE__ */ new Set();
				const list = JSON.parse(raw);
				if (!Array.isArray(list)) return /* @__PURE__ */ new Set();
				return new Set(list.filter((x) => typeof x === "string"));
			} catch {
				return /* @__PURE__ */ new Set();
			}
		}
		function saveIgnoredUpdates(ignored) {
			try {
				storage()?.setItem(IGNORE_KEY, JSON.stringify([...ignored]));
			} catch {}
		}
		/** 忽略某插件本次更新（repo+version 持久化入忽略集）：本次版本不再提醒，直到下一个新版本发布。 */
		function ignoreUpdate(repo, version) {
			const next = loadIgnoredUpdates();
			next.add(`${repo}@${version ?? ""}`);
			saveIgnoredUpdates(next);
			return next;
		}
		/** 移除某插件某版本的更新提醒记录（忽略本次更新时一并清理通知），返回更新后的列表。 */
		function removeUpdateNotice(repo, version) {
			const next = loadNotifications().filter((r) => !(r.kind === "update" && r.repo === repo && (r.version ?? void 0) === (version ?? void 0)));
			save(next);
			return next;
		}
		/** 清空全部通知记录，返回空列表。 */
		function clearNotifications() {
			save([]);
			return [];
		}
		/** 按 id 删除单条通知记录，返回更新后的列表（仅移除该条，不影响其余记录）。 */
		function removeNotification(id) {
			const next = loadNotifications().filter((r) => r.id !== id);
			save(next);
			return next;
		}
		/**
		* 失败归类，七态。无论底层机制如何（pnpm 白名单拦截 / 构建脚本被忽略 / prepare 失败），
		* 对用户而言结果都一样 —— 当前安装通道（npm 或 git）装不上，就是插件分发/依赖的问题，
		* 一律引导提 Issue；唯一的例外是本机环境问题（npm 版本过低 / 找不到 dsh / 找不到 pnpm / 网络不通）：
		* - npmTooOld：失败输出含 npm arborist 的 `edgesOut` 崩溃特征（build-ideal-tree.js 解 peer 依赖时
		*   内部抛错，npm 11.6.0 前必现的已知缺陷，npm/cli#8261、#9787），或服务端已核实本机版本低于
		*   阈值并打了 `[npm-too-low]` 标记 —— 是本机 npm 版本过低/自身缺陷，不是插件问题 → 引导升级 npm
		* - dshMissing：安装器 spawn 的 `dsh` 命令找不到（Windows cmd「不是内部或外部命令」/ POSIX
		*   「command not found」/ spawn ENOENT）—— 是本机 DSH 未正确安装或不在 PATH，不是插件问题
		*   → 提示检查 PATH/重装 DSH，不引导提 Issue
		* - gitMissing：安装器调用 `git` 时找不到可执行文件（Windows cmd「'git' is not recognized」/
		*   POSIX「git: command not found」/ spawn ENOENT）—— 是本机 Git 未安装或不在 PATH，不是插件
		*   问题。pnpm 会把缺失 git 报成 `ERR_PNPM_GIT_RESOLVE_FAILED`（git ls-remote failed），若只看
		*   错误码会误归插件侧失败；且 dshMissing 的通用「not recognized」模式会先把它吞成 dsh 缺失，
		*   所以必须在 dshMissing 之前判断（dsh-plugin-hub#21：Win 下装 git 源插件，
		*   `'git' is not recognized` 被误归仓库问题引导去提 Issue）→ 提示安装 Git / 加入 PATH，不引导提 Issue
		* - pnpmMissing：dsh 存在但调用的 `pnpm` 找不到（dsh 报 `pnpm not found on PATH`/POSIX
		*   「pnpm: command not found」/ spawn ENOENT）—— 本机缺 pnpm（dsh 用 pnpm 管理 profile 插件），
		*   不是插件问题（dsh-plugin-hub#13：Linux 下 `dsh: pnpm not found on PATH` 被误归插件侧失败）
		*   → 提示安装/开启 pnpm，不引导提 Issue
		* - npmMissing：全局 npm 安装通道（`npm install -g ...`）spawn 的 `npm` 命令找不到
		*   （Windows cmd「'npm' is not recognized」/ POSIX「npm: command not found」/ spawn ENOENT）——
		*   本机 npm 未安装或不在 PATH，不是插件问题。dshMissing 的通用「not recognized」模式会把
		*   `'npm' is not recognized` 吞成 dsh 缺失，所以必须在 dshMissing 之前判断
		*   → 提示安装 npm（Node.js 自带）/加入 PATH，不引导提 Issue
		* - pnpmStore：pnpm 存在但报 store 位置不匹配（`ERR_PNPM_UNEXPECTED_STORE` / `Unexpected store
		*   location`）—— profile 目录的 node_modules 是用不同大版本的 pnpm 生成的，当前 pnpm 不认，
		*   任何插件装进该 profile 都会失败；不是插件问题（dsh-plugin-hub#14：macOS 下
		*   `ERR_PNPM_UNEXPECTED_STORE` 被误归插件侧失败）→ 提示清理 profile 依赖目录重建，不引导提 Issue
		* - pnpmPolicy：pnpm 11 的供应链安全策略拒绝安装（`ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` /
		*   `Minimum release age` —— 锁文件里包的发布时间还不满 24 小时被拒；`untrusted origin` —— 依赖来源未被
		*   本机 pnpm 信任）。拦的是「刚发布的新包」与「未被信任的来源」，装任何新插件都会撞墙，不是
		*   插件问题（dsh-plugin-hub#15/#16：用户装官方 dsh-plugin 也被这两类策略拦下并误归插件侧失败）
		*   → 提示按子场景给解法（发布未满 24 小时 → `minimumReleaseAge: 0` 豁免或等满 24 小时；untrusted
		*   origin → 删除 profile 的 node_modules + pnpm-lock.yaml 清掉不受信任来源后重装），不引导提 Issue
		* - network：安装前连通性预检拦截（服务端 `[network]` 标记）或底层连接失败
		*   （ERR_PNPM_GIT_FETCH_FAILED / ETIMEDOUT / DNS 解析 / TLS 握手 / 代理拒绝）——
		*   是本机网络不通/被墙/代理有问题，不是插件问题 → 提示检查网络，不引导提 Issue
		* - pnpmIgnoredBuild：插件自身或依赖的构建脚本被 pnpm 安全白名单（allowBuilds）默认拦截
		*   （`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` / `ERR_PNPM_IGNORED_BUILDS`）。只影响带安装期
		*   构建的插件，其他插件不受影响 —— 差异在插件的依赖/打包方式，属插件依赖/打包问题
		*   → 引导去仓库提 Issue（建议改用预编译版本或关闭安装期构建）
		* - pluginPrepare：插件的 prepare/构建脚本实际执行失败（git tarball 常因缺失子模块或
		*   构建产物导致）—— 属插件打包/分发问题，应引导去仓库提 Issue
		* - repo：其余失败（含 git prepare 被 pnpm 白名单拦截等），默认按插件仓库问题引导提 Issue
		*/
		function classifyFailure(message) {
			if (/\[npm-too-low\]|edgesOut/i.test(message)) return "npmTooOld";
			if (/\[pnpm-missing\]|pnpm not found|pnpm: command not found|spawn pnpm ENOENT|'pnpm' 不是内部或外部命令|"pnpm" 不是内部或外部命令|pnpm['"]?\s*is not recognized/i.test(message)) return "pnpmMissing";
			if (/\[git-missing\]|spawn git ENOENT|'git' 不是内部或外部命令|"git" 不是内部或外部命令|git['"]?\s*is not recognized|git: command not found/i.test(message)) return "gitMissing";
			if (/\[npm-missing\]|spawn npm ENOENT|'npm' 不是内部或外部命令|"npm" 不是内部或外部命令|npm['"]?\s*is not recognized|npm: command not found/i.test(message)) return "npmMissing";
			if (/\[dsh-missing\]|不是内部或外部命令|is not recognized as an internal or external command|command not found|spawn dsh ENOENT/i.test(message)) return "dshMissing";
			if (/ERR_PNPM_UNEXPECTED_STORE|Unexpected store location/i.test(message)) return "pnpmStore";
			if (/ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION|Minimum release age|untrusted origin/i.test(message)) return "pnpmPolicy";
			if (/ERR_PNPM_IGNORED_BUILDS|Ignored build scripts:|ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED/i.test(message)) return "pnpmIgnoredBuild";
			if (/\[network\]|ERR_PNPM_GIT_FETCH_FAILED|ETIMEDOUT|ECONNREFUSED|ECONNRESET|ENOTFOUND|EAI_AGAIN|EPIPE|EHOSTUNREACH|ENETUNREACH|getaddrinfo|Could not connect|Could not resolve host|Network unreachable|Failed to connect|socket hang up|CERT_HAS_EXPIRED|SSL certificate problem|\bTLS\b|\bSSL\b/i.test(message)) return "network";
			if (/\[packaging\]|entry file missing/i.test(message)) return "pluginPrepare";
			if (/ERR_PNPM_PREPARE_PACKAGE|ELIFECYCLE|Command failed|prepare-guard/i.test(message)) return "pluginPrepare";
			return "repo";
		}
		/** 从服务端 `[npm-too-low]` 标记行提取本机 npm 版本（如 `[npm-too-low] npm@11.3.0` → "11.3.0"）；
		*  历史记录无标记时返回 null，前端据此决定提示文案是否带具体版本。 */
		function npmTooLowVersion(message) {
			const m = message.match(/\[npm-too-low\]\s*npm@(\d+\.\d+\.\d+)/i);
			return m ? m[1] : null;
		}
		/** 核心行特征：错误代码 / 生命周期脚本失败 / prepare 失败 / 描述性报错（子模块缺失、找不到等）/ 退出与宿主提示信息。 */
		const CORE_LINE_RE = /ERR_[A-Z_]+|ELIFECYCLE|Command failed|prepare-guard|Failed to prepare|exit code|\bprepare\b|pnpm failed in profile|git-hosted plugins build|submodule|not found|cannot find|no such|unable to|fatal|missing|error/i;
		/** 提交 issue 时正文里错误摘要的上限字符数。GitHub 请求行上限 8192 字节，
		* 固定模板与 URL 编码开销约 1~2K，核心错误（以 ASCII 日志为主）可安全带到 ~5K；
		* 仍超长时 pluginIssueUrl 会逐档缩小核心预算，最终 URL 不会超限。 */
		const MAX_CORE_CHARS = 5e3;
		/** 摘要里单行上限：允许构建 key 等长行也被截短。 */
		const MAX_LINE_CHARS = 400;
		/**
		* 核心错误收集器：从完整安装输出里挑出真正说明问题的行（错误代码、构建脚本失败、
		* 退出与宿主提示），去重后拼接，单行与总量都截断 —— 只把「重点 + 原因」带进 issue 正文，
		* 避免完整日志塞进 URL 导致请求过长。无关键行时退化为「头部 + 尾部」快照。
		* maxChars 可由调用方按最终 URL 长度收紧（pluginIssueUrl 超限时逐档缩小）。
		*/
		function summarizeError(message, maxChars = MAX_CORE_CHARS) {
			const seen = /* @__PURE__ */ new Set();
			const core = [];
			for (const raw of message.split(/\r?\n/)) {
				const line = raw.trim();
				if (!line || !CORE_LINE_RE.test(line)) continue;
				const short = line.length > MAX_LINE_CHARS ? `${line.slice(0, MAX_LINE_CHARS)}…` : line;
				if (!seen.has(short)) {
					seen.add(short);
					core.push(short);
				}
			}
			let out;
			if (core.length === 0) {
				const tail = message.trimEnd().slice(-1e3);
				const sep = "\n…\n";
				const headBudget = Math.max(maxChars - tail.length - 3, 0);
				const head = message.slice(0, 500).trim();
				out = `${head.length > headBudget ? head.slice(0, headBudget) : head}${sep}${tail}`;
			} else out = core.join("\n");
			return out.length > maxChars ? `${out.slice(0, maxChars)}\n… (truncated)` : out;
		}
		/** 提取首个错误代码（如 ERR_PNPM_PREPARE_PACKAGE），无则 null。 */
		function coreErrorCode(message) {
			const m = message.match(/\[?ERR_[A-Z_]+\]?/);
			return m ? m[0].replace(/^\[|\]$/g, "") : null;
		}
		/**
		* 从网络类失败消息里提取「具体连不上的地址」，供弹窗精准提示（你的网络无法访问什么）。
		* 优先取服务端 [network] 预检消息括号里的探测地址（中文「（…）」/ 英文「(…)」），
		* 否则取消息里出现的第一个 URL（git fetch 的仓库地址、registry 域名等）。
		* 提取不到返回 null —— 调用方据此跳过地址行。
		*/
		function unreachableTargetOf(message) {
			const paren = message.match(/[（(](https?:\/\/[^\s'"`<>（)+]+)[)）]/);
			if (paren) return paren[1];
			const url = message.match(/https?:\/\/[^\s'"`<>（）()]+/);
			return url ? url[0].replace(/[.,;:）)\]]+$/, "") : null;
		}
		//#endregion
		//#region src/client/logic/urls.ts
		/** dsh-plugin.org 中文页挂在 /zh/ 前缀下，英文在根路径。 */
		function langPathOf(lang) {
			return lang === "zh" ? "zh/" : "";
		}
		/** 官网链接统一携带 `?ref=hub` 来源参数：统计有多少访问是从插件商城跳转而来。
		*  所有「从商城跳官网」的链接（详情页/首页）都应经由此函数拼接，避免来源参数散落各处。 */
		function siteUrl(path) {
			return `${SITE_URL}${path}?ref=hub`;
		}
		/**
		* 官网详情页两级路径：/plugins/{ownerSlug}/{slug}；
		* 缺 ownerSlug 时从 repo 推导（卡片详情按钮与弹窗来源行共用）。
		*/
		function pluginDetailUrl(plugin, langPath) {
			const repo = plugin.source?.repo ?? "";
			return siteUrl(`${langPath}plugins/${plugin.ownerSlug ?? repo.split("/")[0]?.toLowerCase() ?? ""}/${plugin.slug}`);
		}
		/**
		* 失败弹窗里仓库地址的跳转目标：官网详情页（含插件收录信息），
		* 与 issue 正文的 Catalog 链接同一形式（单级 /plugins/{repo}）。
		*/
		function pluginSiteUrl(repo) {
			return siteUrl(`plugins/${repo}`);
		}
		/** 按失败类型给出简洁的错误原因标题（对外用英文）：
		*  标题直接点明问题出在哪一侧（构建白名单/分发物/本机 npm/网络/插件侧），
		*  作者与用户扫一眼列表就能分流 —— 不再用含糊的 Install/Remove 动作词。 */
		function reasonTitleOf(kind) {
			switch (kind) {
				case "npmTooOld": return "npm too old to install";
				case "dshMissing": return "dsh command not found on the user machine";
				case "pnpmMissing": return "pnpm command not found on the user machine";
				case "pnpmStore": return "pnpm store version mismatch on the user machine";
				case "pnpmPolicy": return "pnpm supply-chain policy blocked the install on the user machine";
				case "pnpmIgnoredBuild": return "build scripts blocked by pnpm allowlist";
				case "pluginPrepare": return "plugin distribution incomplete";
				case "network": return "network failure on the user side";
				default: return "plugin install failed";
			}
		}
		/**
		* 一键反馈 GitHub Issue 的预填链接：标题带「来自 dsh-plugin.org」标识 + 错误原因，
		* 正文只带核心信息 —— 原因判定 + 关键错误代码 + 尝试过的安装方式 + 宿主机器环境快照 +
		* 错误核心摘要（完整日志太长，塞进 URL 会被 GitHub 以「request URL too long」拒绝，
		* 故只收集重点）。错误弹窗、失败记录共用此逻辑。
		* env 取不到时为 null，链接照常生成、只是少环境段。
		* attempts（尝试过的安装方式，npm 反查 + 实际执行命令）：作者看到我们查过/试过的命令，
		* 组织 scope 与 GitHub 用户名不一致时也能直接指认正确的 npm 包名。
		*/
		function pluginIssueUrl(repo, message, env, command, attempts) {
			const kind = classifyFailure(message);
			const title = `[dsh-plugin.org | dsh-plugin-hub] ${reasonTitleOf(kind)}: ${repo}`;
			const reason = /\[packaging\]/i.test(message) ? "plugin distribution is incomplete — the entry file declared in package.json is missing from the published package (github tarball or npm package); please commit build output or publish a complete package" : kind === "network" ? "network connectivity issue on the user side (DNS, proxy, firewall, or a blocked connection)" : kind === "pluginPrepare" ? "plugin prepare/build script failed during install (packaging/distribution issue)" : kind === "pnpmIgnoredBuild" ? "plugin depends on a native module whose build script pnpm blocks by default (use a prebuilt variant)" : kind === "pnpmPolicy" ? "the pnpm supply-chain policy on the user machine blocked the install (minimum release age for freshly published packages / untrusted origin)" : "plugin-side install failure";
			const code = coreErrorCode(message);
			const build = (coreChars) => {
				const body = [
					"## Summary",
					`- Cause: ${reason}`,
					...code ? [`- Key error: \`${code}\``] : [],
					"",
					`## [DSH Plugin 插件市场](${SITE_URL}) · 安装 Plugin 失败错误信息`,
					`本错误信息由 [dsh-plugin-hub](${GITHUB_URL}) 插件市场的安装程序自动生成，随本次安装失败一并提交。`,
					`- 实际执行的安装命令：\`${command ?? `dsh plugin${env?.profile ? ` --profile ${env.profile}` : ""} add git+https://github.com/${repo}.git`}\``,
					`- 执行结果：安装失败，未能安装该插件。`,
					...attempts && attempts.length > 0 ? [
						"",
						"## Attempted install channels（已尝试的安装方式）",
						...attempts.map((a) => `- ${a}`)
					] : [],
					.../\[packaging\]/i.test(message) ? [
						"",
						"## 安装方式说明",
						"DSH 插件支持两种官方安装通道：`dsh plugin add <npm-package>`（npm 分发，需发布完整构建产物）与 `dsh plugin add git+https://github.com/owner/repo.git`（Git 直装，仓库需提交构建产物或在 package.json 提供 `prepare` 脚本）。当前插件的分发物缺少 package.json 声明的入口文件，请按所用通道补齐后重新发布。"
					] : [],
					"",
					"## Environment",
					`- Plugin: \`${repo}\``,
					...env ? [
						`- DSH: ${env.dshVersion ? `v${env.dshVersion}` : "unknown"}`,
						`- Plugin Hub: v${PLUGIN_VERSION}`,
						`- Node: ${env.nodeVersion}`,
						`- pnpm: ${env.pnpmVersion ? `v${env.pnpmVersion}` : "unknown"}`,
						`- npm: ${env.npmVersion ? `v${env.npmVersion}` : "unknown"}`,
						`- git: ${env.gitVersion ? `v${env.gitVersion}` : "unknown"}`,
						`- OS: ${env.platform} ${env.arch} (${env.release})`,
						`- Profile: \`${env.profile}\``,
						`- DSH Home: \`${env.dshHome}\``,
						`- Full log: \`~/.dsh/profiles/${env.profile}/hub.log\` (paste or attach for the full output)`
					] : [],
					`- Catalog: [${pluginSiteUrl(repo)}](${pluginSiteUrl(repo)})`,
					"",
					"## Error (core)",
					"",
					"```",
					summarizeError(message, coreChars),
					"```",
					"",
					"---",
					`This error was produced by the [dsh-plugin-hub](${GITHUB_URL}) installer bundled with DeepSeek Harness.`
				].join("\n");
				return `https://github.com/${repo}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
			};
			const MAX_URL_CHARS = 7600;
			let url = build(MAX_CORE_CHARS);
			if (url.length > MAX_URL_CHARS) for (const budget of [
				4e3,
				2500,
				1400,
				800,
				400
			]) {
				url = build(budget);
				if (url.length <= MAX_URL_CHARS) break;
			}
			return url;
		}
		//#endregion
		//#region src/client/hooks/useLanguage.ts
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Language state for the section: the Hub shares the host (system) locale —
		* the header language toggle writes the host locale preference via setLocale,
		* so the host chrome (left sidebar, settings dialog) and the Hub panel switch
		* together instead of drifting apart. Exposes the localized dictionary lookup
		* `t()` plus the zh/en language flag and the /zh/ URL path prefix.
		*/
		function useLanguage(locale) {
			const [, setRev] = (0, react.useState)(0);
			(0, react.useEffect)(() => locale.subscribe(() => setRev((r) => r + 1)), [locale]);
			const lang = locale.getSnapshot().active;
			const langKey = lang === "en" ? "en" : "zh";
			const langPath = langPathOf(lang);
			const dict = langKey === "en" ? en : zh;
			const t = (key, params) => {
				const raw = dict[key] ?? key;
				return params ? raw.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? "")) : raw;
			};
			return {
				lang,
				langKey,
				langPath,
				t,
				toggleLang: () => locale.setLocale(lang === "en" ? "zh" : "en")
			};
		}
		//#endregion
		//#region src/client/hooks/useSettings.ts
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Hub settings state: loaded once from the host's local /settings route
		* (persisted at ~/.dsh/profiles/<profile>/hub-settings.json), updated
		* optimistically. Every change POSTs the patch immediately so a toggled
		* switch survives a reload; a host without the server routes falls back to
		* the defaults and keeps working (settings simply do not persist).
		*/
		const DEFAULT_SETTINGS = {
			checkUpdatesOnStart: true,
			proxy: "",
			npmRegistry: "",
			enableNpmInstall: true,
			enableGitInstall: true,
			enableDshInstall: true,
			logPath: ""
		};
		async function loadRemote() {
			try {
				const res = await fetch("/dsh-plugin-hub/settings", { cache: "no-store" });
				if (!res.ok) throw new Error(`settings ${res.status}`);
				const data = await res.json();
				return {
					...DEFAULT_SETTINGS,
					...data
				};
			} catch {
				return DEFAULT_SETTINGS;
			}
		}
		function useSettings() {
			const [settings, setSettings] = (0, react.useState)(DEFAULT_SETTINGS);
			/** 服务端配置是否已加载：更新策略等启动期逻辑须等真实值，避免用默认值误触发 */
			const [ready, setReady] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				let alive = true;
				loadRemote().then((s) => {
					if (!alive) return;
					setSettings(s);
					setReady(true);
				});
				return () => {
					alive = false;
				};
			}, []);
			return {
				settings,
				ready,
				update: (0, react.useCallback)((patch) => {
					setSettings((prev) => ({
						...prev,
						...patch
					}));
					fetch("/dsh-plugin-hub/settings", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify(patch),
						cache: "no-store"
					}).catch(() => {});
				}, []),
				reset: (0, react.useCallback)(() => {
					setSettings({ ...DEFAULT_SETTINGS });
					fetch("/dsh-plugin-hub/settings/reset", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: "{}",
						cache: "no-store"
					}).catch(() => {});
				}, [])
			};
		}
		//#endregion
		//#region src/client/hooks/useTaskQueue.ts
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Background install/remove task queue for the Plugin Hub.
		*
		* Mirrors the server-side FIFO active queue by polling /active, settles
		* vanished tasks against /status, and exposes the queue actions (install,
		* uninstall, cancel) plus the modal task lookups used by the dialogs.
		*/
		/** 安装/卸载请求超时（ms）：服务端 preflight + npm 反查可能耗时（各自都有超时，合计约 20~30s），
		*  给足余量；超时主动中止，避免服务端 preflight 网络挂起时前端永久卡「安装中 0%」。 */
		const REQUEST_TIMEOUT_MS = 6e4;
		/** 入口渠道的 i18n key：NPM 包 / GitHub 源码 / DSH 命令。 */
		const channelKeyOf = (channel) => channel === "git" ? "installChannelGit" : channel === "dsh" ? "installChannelDsh" : "installChannelNpm";
		/** 失败消息的入口溯源前缀：自定义安装（带渠道）在错误正文顶部精准指出从哪张卡片发起；
		*  目录插件安装（无渠道）返回 null，错误正文保持原样。 */
		const entryLineOf = (t, channel) => channel ? t("installEntryLine", { c: t(channelKeyOf(channel)) }) : null;
		function useTaskQueue(opts) {
			const { t, langKey, refreshInstalled, onInstallDone, onUninstallDone, onError, installPlugin, installCustomTarget, installGlobalTarget, uninstallPlugin, uninstallName, installedName, resolvePending } = opts;
			const [queue, setQueue] = (0, react.useState)([]);
			const queueRef = (0, react.useRef)([]);
			/** 待重启列表（服务端内存态 + 本地展示信息补齐）；与 queue 一样以 ref 为唯一事实来源。 */
			const [pendingRestarts, setPendingRestarts] = (0, react.useState)([]);
			const pendingRef = (0, react.useRef)([]);
			/** 本次会话内安装成功插件的展示信息（目标 → 简介/版本）：轮询合并待重启列表时补齐，刷新后由 resolvePending 兜底。 */
			const pendingInfoRef = (0, react.useRef)(/* @__PURE__ */ new Map());
			/** 保持最新的 resolvePending：轮询闭包捕获的是调用那一刻的目录状态，目录晚加载时也能补齐。 */
			const resolvePendingRef = (0, react.useRef)(resolvePending);
			resolvePendingRef.current = resolvePending;
			/** 当前打开弹窗所对应的任务 id：该任务完成时弹窗切换为结果视图 */
			const modalTaskRef = (0, react.useRef)(null);
			/** 已开始收尾但尚未结束的任务 id（服务端 /active 已消失 → 查 /status 中）：并发轮询时跳过，避免重复收尾 */
			const settlingRef = (0, react.useRef)(/* @__PURE__ */ new Set());
			/** 轮询定时器句柄（队列清空/组件卸载时清理） */
			const pollRef = (0, react.useRef)(null);
			/** 请求在途的目标集合（同步防重）：双击安装/卸载时第二击直接忽略。
			*  本地队列任务要等 fetch 返回后才入队，仅靠 queueRef 检查拦不住请求窗口内的重复点击。 */
			const submittingRef = (0, react.useRef)(/* @__PURE__ */ new Set());
			/** 乐观入队临时 id 计数器：递减产生唯一负数，与服务端自增正数 id 永不冲突。 */
			const tempIdRef = (0, react.useRef)(0);
			/** 请求在途标记：弹窗据此禁用确认按钮，避免等待响应期间被再次点击。 */
			const [submitting, setSubmitting] = (0, react.useState)(false);
			/** 停止后台任务轮询（任务结束或组件卸载时清理）。 */
			const stopPoll = () => {
				if (pollRef.current !== null) {
					window.clearInterval(pollRef.current);
					pollRef.current = null;
				}
			};
			/** 队列与待重启都清空才停轮询：待重启期间持续轮询，宿主一重启（内存列表清空）立刻感知并消失。 */
			const maybeStopPoll = () => {
				if (queueRef.current.length === 0 && pendingRef.current.length === 0) stopPoll();
			};
			(0, react.useEffect)(() => stopPoll, []);
			/** 更新队列（同步镜像到 ref：queueRef 是唯一事实来源，state 只负责触发渲染，
			*  避免依赖 React updater 的异步调度时序导致 gone/stopPoll/防重复入队读到旧值）。 */
			const applyQueue = (updater) => {
				const next = updater(queueRef.current);
				queueRef.current = next;
				setQueue(next);
			};
			/** 解析服务端待重启列表（安装目标归一化为 owner/repo，与安装任务对齐）。 */
			const parsePendingRestarts = (value) => {
				if (!Array.isArray(value)) return [];
				const out = [];
				for (const x of value) {
					if (typeof x !== "object" || x === null) continue;
					const target = x.target;
					if (typeof target !== "string" || target === "") continue;
					const at = x.at;
					out.push({
						target: repoFromInstallTarget(target),
						kind: x.kind === "uninstall" ? "uninstall" : "install",
						at: typeof at === "number" ? at : 0
					});
				}
				return out;
			};
			/** 合并服务端待重启列表：保留已有展示信息，缺失时用会话内记录 / 目录解析补齐。 */
			const applyPending = (raw) => {
				const prev = pendingRef.current;
				const next = raw.map((p) => {
					const old = prev.find((q) => q.target === p.target);
					if (old?.desc !== void 0) return {
						...p,
						desc: old.desc,
						version: old.version
					};
					const info = pendingInfoRef.current.get(p.target) ?? resolvePendingRef.current?.(p.target) ?? null;
					return info ? {
						...p,
						desc: info.desc,
						version: info.version
					} : p;
				});
				pendingRef.current = next;
				setPendingRestarts(next);
			};
			/** 向宿主记录某插件的安装时目录信号（version + updatedAt）；version 为空时清除记录（卸载）。 */
			const syncInstalledVersion = async (repo, version, updatedAt) => {
				if (!repo) return;
				try {
					await fetch("/dsh-plugin-hub/installed-version", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({
							repo,
							version: version ?? null,
							updatedAt
						})
					});
				} catch {}
			};
			/** 后台任务结束（active 中消失后查终态确认）：完成 → 刷新安装表 + 结果视图/toast；失败 → 完整错误弹窗 */
			const finishQueueTask = (ok, q, lines) => {
				applyQueue((prev) => prev.filter((x) => x.id !== q.id));
				if (ok) {
					refreshInstalled();
					if (q.kind === "uninstall") {
						syncInstalledVersion(q.repo, void 0, void 0);
						onUninstallDone(modalTaskRef.current === q.id, q.repo, q.needsRestart);
					} else {
						syncInstalledVersion(q.repo, q.version, q.updatedAt);
						pendingInfoRef.current.set(q.target, {
							desc: q.desc,
							version: q.version
						});
						onInstallDone(modalTaskRef.current === q.id, q.repo, q.needsRestart, q.action === "update");
					}
				} else {
					const rawDetail = lines.length > 0 ? [...lines].reverse().join("\n") : q.kind === "uninstall" ? t("uninstallFail") : t("installFail");
					const entry = entryLineOf(t, q.channel);
					onError(entry ? `${entry}\n${rawDetail}` : rawDetail, q.repo, q.kind, q.command, q.attempts, q.action === "update");
				}
				maybeStopPoll();
			};
			/** 卸载成功收尾前的进度过渡：任务已在服务端结束，但保留本地展示，
			*  让进度条在 ~2.4s 内缓缓跑到 100% 再切结果/Toast，给用户一个交互过程，
			*  而不是命令一执行进度条就一闪消失。 */
			const settleDone = (q, lines) => {
				stopPoll();
				const from = Math.min(q.progress, 90);
				const steps = 20;
				const stepMs = 120;
				let step = 0;
				applyQueue((prev) => prev.map((x) => x.id === q.id ? {
					...x,
					status: "running"
				} : x));
				const timer = window.setInterval(() => {
					step += 1;
					const progress = Math.round(from + (100 - from) * (step / steps));
					applyQueue((prev) => prev.map((x) => x.id === q.id ? {
						...x,
						progress
					} : x));
					if (step >= steps) {
						window.clearInterval(timer);
						finishQueueTask(true, q, lines);
						if (queueRef.current.length > 0) pollQueue();
					}
				}, stepMs);
			};
			/** 任务在 /active 中消失 = 已结束：查 /status 拿终态并收尾（cancelled 静默移除）。 */
			const settleTask = async (q) => {
				let status = "failed";
				let lines = [];
				let attempts;
				try {
					const res = await fetch(`/dsh-plugin-hub/status?task=${q.id}`, { cache: "no-store" });
					if (res.ok) {
						const task = (await res.json()).task;
						if (task !== void 0) {
							status = task.status ?? "failed";
							lines = task.lines ?? [];
							attempts = Array.isArray(task.attempts) ? task.attempts : void 0;
							const needsRestart = typeof task.needsRestart === "boolean" ? task.needsRestart : q.needsRestart;
							if (status === "done") {
								const settled = {
									...q,
									needsRestart
								};
								if (q.kind === "uninstall") settleDone(settled, lines);
								else finishQueueTask(true, settled, lines);
								return;
							}
							if (status === "failed") {
								finishQueueTask(false, {
									...q,
									attempts
								}, lines);
								return;
							}
						}
					}
				} catch {}
				applyQueue((prev) => prev.filter((x) => x.id !== q.id));
				maybeStopPoll();
			};
			/** 轮询整个队列：合并服务端 /active（running 在前、pending 在后），
			*  消失的任务查终态收尾；队列清空即停止轮询。 */
			const pollQueue = () => {
				stopPoll();
				pollRef.current = window.setInterval(async () => {
					try {
						const res = await fetch("/dsh-plugin-hub/active", { cache: "no-store" });
						if (!res.ok) throw new Error(`active ${res.status}`);
						const data = await res.json();
						const active = (data.tasks ?? []).filter((a) => typeof a.id === "number");
						const byId = new Map(active.map((a) => [a.id, a]));
						const prevQueue = queueRef.current;
						applyPending(parsePendingRestarts(data.pendingRestarts));
						applyQueue((prev) => {
							const next = [];
							for (const a of active) {
								const id = a.id;
								const prevTask = prev.find((q) => q.id === id);
								const isRemove = a.action === "remove";
								next.push({
									id,
									kind: isRemove ? "uninstall" : "install",
									target: typeof a.target === "string" ? repoFromInstallTarget(a.target) : prevTask?.target ?? "",
									desc: prevTask?.desc,
									repo: prevTask?.repo ?? (isRemove ? null : typeof a.target === "string" ? repoFromInstallTarget(a.target) : null),
									version: prevTask?.version,
									updatedAt: prevTask?.updatedAt,
									status: a.status === "running" ? "running" : "pending",
									progress: typeof a.progress === "number" ? a.progress : prevTask?.progress ?? 0,
									lines: Array.isArray(a.lines) ? a.lines : prevTask?.lines ?? [],
									attempts: Array.isArray(a.attempts) ? a.attempts : prevTask?.attempts ?? [],
									needsRestart: typeof a.needsRestart === "boolean" ? a.needsRestart : prevTask?.needsRestart ?? true,
									channel: a.installChannel === "npm" || a.installChannel === "git" || a.installChannel === "dsh" ? a.installChannel : prevTask?.channel
								});
							}
							const keepOpt = prev.filter((q) => q.optimistic && !next.some((x) => x.id === q.id));
							if (keepOpt.length > 0) next.push(...keepOpt);
							const keepGone = prev.filter((q) => !byId.has(q.id) && !next.some((x) => x.id === q.id) && q.status !== "cancelling" && !q.optimistic);
							if (keepGone.length > 0) next.push(...keepGone);
							return next;
						});
						const gone = prevQueue.filter((q) => !byId.has(q.id) && q.status !== "cancelling" && !q.optimistic && !settlingRef.current.has(q.id));
						for (const q of gone) {
							if (!queueRef.current.some((x) => x.id === q.id)) continue;
							settlingRef.current.add(q.id);
							try {
								await settleTask(q);
							} finally {
								settlingRef.current.delete(q.id);
							}
						}
					} catch {}
				}, 600);
			};
			(0, react.useEffect)(() => {
				let cancelled = false;
				const restore = async () => {
					try {
						const res = await fetch("/dsh-plugin-hub/active", { cache: "no-store" });
						if (!res.ok) return;
						const data = await res.json();
						if (cancelled) return;
						applyPending(parsePendingRestarts(data.pendingRestarts));
						const items = (data.tasks ?? []).filter((a) => typeof a.id === "number").map((a) => {
							const isRemove = a.action === "remove";
							const display = typeof a.displayTarget === "string" ? repoFromInstallTarget(a.displayTarget) : "";
							const fallback = typeof a.target === "string" ? repoFromInstallTarget(a.target) : "";
							return {
								id: a.id,
								kind: isRemove ? "uninstall" : "install",
								target: isRemove ? fallback : display || fallback,
								repo: isRemove ? null : display || fallback,
								action: a.action === "add" || a.action === "update" || a.action === "remove" ? a.action : "add",
								status: a.status === "running" ? "running" : "pending",
								progress: typeof a.progress === "number" ? a.progress : 0,
								lines: Array.isArray(a.lines) ? a.lines : [],
								attempts: Array.isArray(a.attempts) ? a.attempts : [],
								needsRestart: typeof a.needsRestart === "boolean" ? a.needsRestart : true,
								channel: a.installChannel === "npm" || a.installChannel === "git" || a.installChannel === "dsh" ? a.installChannel : void 0
							};
						});
						if (items.length > 0 || pendingRef.current.length > 0) {
							applyQueue((prev) => [...prev, ...items.filter((n) => !prev.some((p) => p.id === n.id))]);
							pollQueue();
						}
					} catch {}
				};
				restore();
				return () => {
					cancelled = true;
				};
			}, []);
			/** 弹窗动作：直接安装。请求宿主本地路由，任务进入服务端队列（FIFO），弹窗内实时显示进度。 */
			/** 安装入队核心：目录插件（catalog，后端走目录白名单）与命令行安装（custom，
			*  受安全开关控制）共用。队列条目一律用仓库名（repo）展示/防重，只有发给后端的
			*  实际安装目标（target）随通道变化（npm 包名 / github: 源）。 */
			const submitInstall = async (input) => {
				if (queueRef.current.some((q) => q.kind === "install" && q.target === input.repo)) return;
				if (submittingRef.current.has(input.repo)) return;
				submittingRef.current.add(input.repo);
				tempIdRef.current -= 1;
				const tempId = tempIdRef.current;
				modalTaskRef.current = tempId;
				applyQueue((prev) => [...prev, {
					id: tempId,
					kind: "install",
					target: input.repo,
					repo: input.repo,
					desc: input.desc,
					version: input.version,
					updatedAt: input.updatedAt,
					status: "running",
					progress: 0,
					lines: [],
					optimistic: true,
					command: input.command,
					channel: input.channel,
					action: input.update ? "update" : "add",
					attempts: [],
					needsRestart: true
				}]);
				setSubmitting(true);
				const controller = new AbortController();
				const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
				try {
					const res = await fetch("/dsh-plugin-hub/install", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({
							repo: input.target,
							display: input.repo,
							source: input.source,
							mode: input.update ? "update" : void 0,
							...langKey ? { lang: langKey } : {},
							...input.channel ? { installChannel: input.channel } : {},
							...input.globalNpm && input.globalNpm.length > 0 ? { globalNpm: input.globalNpm } : {}
						}),
						signal: controller.signal
					});
					const data = await res.json();
					if (!data.ok || typeof data.task !== "number") {
						applyQueue((prev) => prev.filter((x) => x.id !== tempId));
						const entry = entryLineOf(t, input.channel);
						const msg = data.error || `HTTP ${res.status}`;
						onError(entry ? `${entry}\n${msg}` : msg, input.repo, "install", input.command, data.attempts);
						return;
					}
					const taskId = data.task;
					modalTaskRef.current = taskId;
					applyQueue((prev) => prev.map((x) => x.id === tempId ? {
						...x,
						id: taskId,
						optimistic: void 0
					} : x));
					pendingInfoRef.current.set(input.repo, {
						desc: input.desc,
						version: input.version
					});
					pollQueue();
				} catch (err) {
					applyQueue((prev) => prev.filter((x) => x.id !== tempId));
					const reason = err?.name === "AbortError" ? t("requestTimeout") : err instanceof Error && err.message ? err.message : String(err ?? "");
					const entry = entryLineOf(t, input.channel);
					const msg = reason ? `${t("installFail")} — ${reason}` : t("installFail");
					onError(entry ? `${entry}\n${msg}` : msg, input.repo, "install", input.command);
				} finally {
					window.clearTimeout(timeout);
					submittingRef.current.delete(input.repo);
					setSubmitting(false);
				}
			};
			/** 目录插件安装：通道由目录数据（npmPackage）决定，走 catalog 白名单。 */
			const installNow = async (p, opts) => {
				const repo = p.source?.repo ?? "";
				if (!repo) return;
				const { target } = installTargetOf(p);
				if (!target) return;
				await submitInstall({
					target,
					repo,
					desc: p.description,
					version: p.version,
					updatedAt: p.dates?.repoUpdatedAt,
					command: installCommandOf(p, true),
					source: "catalog",
					update: opts?.update
				});
			};
			/** 命令行安装：用户手输 npm 包名或 GitHub 地址，走 custom 源（受安全开关控制）。
			*  update=true 时对已安装目标放行覆盖重装（与目录插件「更新」同一语义）。
			*  channel=入口渠道（NPM 包 / GitHub 源码 / DSH 命令卡片）：上报服务端落日志，
			*  失败弹窗/通知据此精准溯源。
			*  队列展示/防重一律用归一化身份（owner/repo 或 npm 包名）：与服务端 /active 合并、
			*  弹窗目标匹配同口径，npm 包名透传不受影响。 */
			const installCustom = async (raw, opts) => {
				const target = raw.trim();
				if (!target) return;
				const repo = repoFromInstallTarget(target);
				await submitInstall({
					target,
					repo,
					command: `pnpm add ${target}`,
					source: "custom",
					update: opts?.update,
					channel: opts?.channel
				});
			};
			/** 全局 npm 安装（官方 README 的 `npm install -g <pkgs>`）：不进任何 profile、无需宿主重启。
			*  队列展示/防重用包列表空格拼接的身份（与服务端 target 同口径）；入口渠道固定为 npm（NPM 包卡片）。 */
			const installGlobalNpm = async (pkgs, opts) => {
				const list = (pkgs ?? []).map((p) => p.trim()).filter((p) => p !== "");
				if (list.length === 0) return;
				const identity = list.join(" ");
				await submitInstall({
					target: identity,
					repo: identity,
					command: `npm install -g ${identity}`,
					source: "custom",
					globalNpm: list,
					update: opts?.update,
					channel: opts?.channel ?? "npm"
				});
			};
			/** 卸载入队核心：按 npm 包名直卸（目录插件与自定义安装共用，弹窗进度匹配同源）。 */
			const enqueueUninstall = async (name, repo, desc) => {
				if (!name) return;
				if (queueRef.current.some((q) => q.kind === "uninstall" && q.target === name)) return;
				if (submittingRef.current.has(name)) return;
				submittingRef.current.add(name);
				setSubmitting(true);
				const controller = new AbortController();
				const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
				try {
					const res = await fetch("/dsh-plugin-hub/uninstall", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({
							name,
							repo: repo ?? void 0
						}),
						signal: controller.signal
					});
					const data = await res.json();
					if (!data.ok || typeof data.task !== "number") {
						onError(data.error || `HTTP ${res.status}`, repo, "uninstall");
						return;
					}
					const taskId = data.task;
					modalTaskRef.current = taskId;
					applyQueue((prev) => [...prev, {
						id: taskId,
						kind: "uninstall",
						target: name,
						desc,
						repo,
						status: "pending",
						progress: 0,
						lines: [],
						needsRestart: true
					}]);
					pollQueue();
				} catch (err) {
					const reason = err?.name === "AbortError" ? t("requestTimeout") : err instanceof Error && err.message ? err.message : String(err ?? "");
					onError(reason ? `${t("uninstallFail")} — ${reason}` : t("uninstallFail"), repo, "uninstall");
				} finally {
					window.clearTimeout(timeout);
					submittingRef.current.delete(name);
					setSubmitting(false);
				}
			};
			/** 弹窗动作：直接卸载（目录插件入口）。与安装同一队列机制，弹窗内实时显示进度。 */
			const uninstallNow = async (p) => {
				const name = installedName(p);
				if (!name) return;
				await enqueueUninstall(name, p.source?.repo ?? null, p.description);
			};
			/** 已安装视图动作：按已安装项卸载（覆盖目录外自定义安装，无目录数据也能卸）。 */
			const uninstallItem = async (item) => {
				await enqueueUninstall(item.name, item.repo, item.plugin?.description);
			};
			/** 取消任务：排队中立即出队，执行中终止子进程；先标记「正在取消」短暂过渡后再移除。 */
			const cancelTask = async (id) => {
				if (modalTaskRef.current === id) modalTaskRef.current = null;
				applyQueue((prev) => prev.map((q) => q.id === id ? {
					...q,
					status: "cancelling"
				} : q));
				try {
					await fetch("/dsh-plugin-hub/cancel", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ id })
					});
				} catch {}
				window.setTimeout(() => {
					applyQueue((prev) => prev.filter((x) => x.id !== id));
					maybeStopPoll();
				}, 700);
			};
			/** 打开新弹窗前清空任务匹配：避免旧任务 id 误匹配到新弹窗。 */
			const clearModalTask = () => {
				modalTaskRef.current = null;
			};
			const installModalTarget = installPlugin?.source?.repo ?? (installCustomTarget ? repoFromInstallTarget(installCustomTarget) : null) ?? installGlobalTarget ?? null;
			return {
				queue,
				pendingRestarts,
				installModalTask: installPlugin || installCustomTarget || installGlobalTarget ? queue.find((q) => q.id === modalTaskRef.current && q.kind === "install" && q.status !== "cancelling") ?? queue.find((q) => q.kind === "install" && q.target === installModalTarget && q.status !== "cancelling") ?? null : null,
				uninstallModalTask: uninstallPlugin || uninstallName ? queue.find((q) => q.id === modalTaskRef.current && q.status !== "cancelling") ?? queue.find((q) => q.kind === "uninstall" && q.target === (uninstallName ?? installedName(uninstallPlugin) ?? "") && q.status !== "cancelling") ?? null : null,
				submitting,
				installNow,
				installCustom,
				installGlobalNpm,
				uninstallNow,
				uninstallItem,
				cancelTask,
				clearModalTask
			};
		}
		//#endregion
		//#region src/client/components/ui/icons.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Inline SVG icons used across the client. Icons inherit currentColor so
		* they adapt to themes and disabled states automatically.
		*/
		/** 弹窗右上角关闭按钮图标：内联 SVG 十字（stroke 继承 currentColor），随按钮禁用态一起变淡。 */
		function CloseIcon() {
			return (0, react.createElement)("svg", {
				className: Modal_module_css_default.modalCloseIcon,
				viewBox: "0 0 16 16",
				width: 14,
				height: 14,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", {
				d: "M3 3l10 10M13 3L3 13",
				stroke: "currentColor",
				strokeWidth: 1.6,
				strokeLinecap: "round"
			}));
		}
		/** 来源链接图标：链节（stroke 继承 currentColor），弹窗里官网收录地址旁提示「可点击跳转」。 */
		function LinkIcon() {
			return (0, react.createElement)("svg", {
				className: Modal_module_css_default.linkIcon,
				viewBox: "0 0 24 24",
				width: 13,
				height: 13,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", {
				d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
				stroke: "currentColor",
				strokeWidth: 1.8,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}), (0, react.createElement)("path", {
				d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
				stroke: "currentColor",
				strokeWidth: 1.8,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}));
		}
		/** 帮助图标：圆圈 + 问号（stroke 继承 currentColor），自定义安装卡片标题旁的「帮助」按钮用。 */
		function HelpIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 16 16",
				width: 13,
				height: 13,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("circle", {
				cx: 8,
				cy: 8,
				r: 6.3,
				stroke: "currentColor",
				strokeWidth: 1.4
			}), (0, react.createElement)("path", {
				d: "M6.3 6.5a1.9 1.9 0 1 1 2.7 1.7c-.7.3-1 .8-1 1.4",
				stroke: "currentColor",
				strokeWidth: 1.4,
				strokeLinecap: "round"
			}), (0, react.createElement)("circle", {
				cx: 8,
				cy: 11.6,
				r: .95,
				fill: "currentColor"
			}));
		}
		/** 品牌 logo 图标：蓝紫渐变圆角方块 + 白色拼图块（2x2 错落），标题左侧的品牌标识。 */
		function LogoIcon() {
			return (0, react.createElement)("svg", {
				className: Header_module_css_default.logoIcon,
				viewBox: "0 0 24 24",
				width: 20,
				height: 20,
				"aria-hidden": "true"
			}, (0, react.createElement)("defs", null, (0, react.createElement)("linearGradient", {
				id: "dshLogoGrad",
				x1: "0",
				y1: "0",
				x2: "1",
				y2: "1"
			}, (0, react.createElement)("stop", {
				offset: "0%",
				stopColor: "#4f46e5"
			}), (0, react.createElement)("stop", {
				offset: "100%",
				stopColor: "#7c3aed"
			}))), (0, react.createElement)("rect", {
				x: 1,
				y: 1,
				width: 22,
				height: 22,
				rx: 6,
				fill: "url(#dshLogoGrad)"
			}), (0, react.createElement)("rect", {
				x: 5.5,
				y: 5.5,
				width: 5.5,
				height: 5.5,
				rx: 1.5,
				fill: "#ffffff"
			}), (0, react.createElement)("rect", {
				x: 13,
				y: 5.5,
				width: 5.5,
				height: 5.5,
				rx: 1.5,
				fill: "#ffffff",
				opacity: .55
			}), (0, react.createElement)("rect", {
				x: 5.5,
				y: 13,
				width: 5.5,
				height: 5.5,
				rx: 1.5,
				fill: "#ffffff",
				opacity: .55
			}), (0, react.createElement)("rect", {
				x: 13,
				y: 13,
				width: 5.5,
				height: 5.5,
				rx: 1.5,
				fill: "#ffffff"
			}));
		}
		/** GitHub 图标：官方 GitHub Mark（octocat），fill 继承 currentColor，头部右上角源码链接用。 */
		function GitHubIcon() {
			return (0, react.createElement)("svg", {
				className: Header_module_css_default.githubIcon,
				viewBox: "0 0 24 24",
				width: 18,
				height: 18,
				fill: "currentColor",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", { d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" }));
		}
		/** 复制图标：双层矩形（stroke 继承 currentColor），手动命令旁的复制按钮用。 */
		function CopyIcon() {
			return (0, react.createElement)("svg", {
				className: Header_module_css_default.copyIcon,
				viewBox: "0 0 16 16",
				width: 12,
				height: 12,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("rect", {
				x: 5.5,
				y: 5.5,
				width: 7,
				height: 7,
				rx: 1.5,
				stroke: "currentColor",
				strokeWidth: 1.4
			}), (0, react.createElement)("path", {
				d: "M10.5 5.5v-2a1.5 1.5 0 0 0-1.5-1.5H4.5A1.5 1.5 0 0 0 3 3.5v4A1.5 1.5 0 0 0 4.5 9h1",
				stroke: "currentColor",
				strokeWidth: 1.4,
				strokeLinecap: "round"
			}));
		}
		/** 文件夹图标（Material folder）：「在文件夹中显示」按钮用，fill 继承 currentColor。 */
		function FolderIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 24 24",
				width: 13,
				height: 13,
				fill: "currentColor",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", { d: "M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" }));
		}
		/** 下拉箭头图标：向下 V 形（stroke 继承 currentColor），下拉按钮触发器右侧提示可展开。 */
		function ChevronDownIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 16 16",
				width: 12,
				height: 12,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", {
				d: "M3.5 5.5L8 10l4.5-4.5",
				stroke: "currentColor",
				strokeWidth: 1.6,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}));
		}
		/** 排序方向小箭头：正序(up) 朝上 / 倒序(down) 朝下，随 currentColor 着色，仅当前排序按钮显示 */
		function SortArrowIcon({ up }) {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 16 16",
				width: 10,
				height: 10,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", {
				d: up ? "M4 9.5L8 5.5l4 4" : "M4 6.5L8 10.5l4-4",
				stroke: "currentColor",
				strokeWidth: 1.8,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}));
		}
		/** 插件市场图标：店面货架（stroke 继承 currentColor），一级导航「插件市场」tab 用。 */
		function MarketIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 24 24",
				width: 16,
				height: 16,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", {
				d: "M4 10L5.6 4.5h12.8L20 10",
				stroke: "currentColor",
				strokeWidth: 1.8,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}), (0, react.createElement)("path", {
				d: "M4 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0 4.4 0",
				stroke: "currentColor",
				strokeWidth: 1.8,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}), (0, react.createElement)("path", {
				d: "M5 13v6.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V13",
				stroke: "currentColor",
				strokeWidth: 1.8,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}));
		}
		/** 自定义安装图标：终端窗口 + 提示符（stroke 继承 currentColor），一级导航「自定义安装」tab 用。 */
		function TerminalIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 24 24",
				width: 16,
				height: 16,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("rect", {
				x: 3,
				y: 4.5,
				width: 18,
				height: 15,
				rx: 2.5,
				stroke: "currentColor",
				strokeWidth: 1.8
			}), (0, react.createElement)("path", {
				d: "M6.8 9.2l3.4 2.8-3.4 2.8",
				stroke: "currentColor",
				strokeWidth: 1.8,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}), (0, react.createElement)("path", {
				d: "M12.5 14.8h4.5",
				stroke: "currentColor",
				strokeWidth: 1.8,
				strokeLinecap: "round"
			}));
		}
		/** 已安装图标：插件包（圆角方盒 + 盒盖线）+ 对勾（stroke 继承 currentColor），一级导航「已安装」tab 用。 */
		function InstalledIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 24 24",
				width: 16,
				height: 16,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("rect", {
				x: 4.5,
				y: 6.5,
				width: 15,
				height: 13,
				rx: 2.5,
				stroke: "currentColor",
				strokeWidth: 1.8
			}), (0, react.createElement)("path", {
				d: "M4.5 11h15",
				stroke: "currentColor",
				strokeWidth: 1.8,
				strokeLinecap: "round"
			}), (0, react.createElement)("path", {
				d: "M9.2 15.2l2.1 2.1 3.6-4",
				stroke: "currentColor",
				strokeWidth: 1.8,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}));
		}
		/** 通知铃铛图标：实心铃铛（fill 继承 currentColor），采用 Material 官方 notifications 路径，一级导航通知中心入口用。 */
		function BellIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 24 24",
				width: 15,
				height: 15,
				fill: "currentColor",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", { d: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" }));
		}
		/** 设置图标：实心齿轮（fill 继承 currentColor），采用 Material 官方 settings 路径，齿形清晰、辨识度高。 */
		function SettingsIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 24 24",
				width: 16,
				height: 16,
				fill: "currentColor",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.22-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61L19.14 12.94zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }));
		}
		/** 更新与通道图标：循环同步箭头（fill 继承 currentColor），采用 Material 官方 sync 路径，设置左侧导航「更新与通道」用。 */
		function UpdatesIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 24 24",
				width: 15,
				height: 15,
				fill: "currentColor",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", { d: "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" }));
		}
		/** 安全与信任图标：盾牌 + 对勾（stroke 继承 currentColor），设置左侧导航「安全与信任」用。 */
		function SecurityIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 16 16",
				width: 15,
				height: 15,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", {
				d: "M8 1.8L13.8 3.8v4.3c0 3.5-2.2 6.3-5.8 7.6-3.6-1.3-5.8-4.1-5.8-7.6V3.8L8 1.8z",
				stroke: "currentColor",
				strokeWidth: 1.5,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}), (0, react.createElement)("path", {
				d: "M5.6 8.1l1.7 1.7 3.2-3.4",
				stroke: "currentColor",
				strokeWidth: 1.5,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}));
		}
		/** 诊断图标：心跳脉冲线（stroke 继承 currentColor），设置左侧导航「诊断」用。 */
		function DiagnosticsIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 16 16",
				width: 15,
				height: 15,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", {
				d: "M1.6 8h3l1.9-4.2 2.9 8.4 1.9-4.2h3.1",
				stroke: "currentColor",
				strokeWidth: 1.5,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}));
		}
		/** 恢复默认图标：逆时针还原箭头（stroke 继承 currentColor），设置左侧导航「恢复默认」用。 */
		function ResetIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 16 16",
				width: 15,
				height: 15,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", {
				d: "M3 5.2A5.6 5.6 0 1 1 2.4 9.6",
				stroke: "currentColor",
				strokeWidth: 1.5,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}), (0, react.createElement)("path", {
				d: "M2.6 2.6v2.6h2.6",
				stroke: "currentColor",
				strokeWidth: 1.5,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}));
		}
		/** 确认弹窗图标：圆形徽标 + 白色图形 —— 普通确认（安装/更新/重启/忽略）蓝底白问号；
		*  危险操作（清空/删除/卸载/重置）红底白动作图形。居中放在弹窗标题下方，一眼区分确认类型。 */
		function ConfirmIcon({ type }) {
			const danger = type !== "question";
			const glyphs = type === "trash" ? [
				(0, react.createElement)("path", {
					d: "M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7",
					stroke: "#ffffff",
					strokeWidth: 1.9,
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}),
				(0, react.createElement)("path", {
					d: "M6.2 6.5l.7 12.2a1.5 1.5 0 0 0 1.5 1.3h7.2a1.5 1.5 0 0 0 1.5-1.3l.7-12.2",
					stroke: "#ffffff",
					strokeWidth: 1.9,
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}),
				(0, react.createElement)("path", {
					d: "M10 10.2v6M14 10.2v6",
					stroke: "#ffffff",
					strokeWidth: 1.9,
					strokeLinecap: "round"
				})
			] : type === "warning" ? [
				(0, react.createElement)("path", {
					d: "M12 4.2l8.5 14.3a1 1 0 0 1-.87 1.5H4.37a1 1 0 0 1-.87-1.5L12 4.2z",
					stroke: "#ffffff",
					strokeWidth: 1.9,
					strokeLinejoin: "round"
				}),
				(0, react.createElement)("path", {
					d: "M12 9.6v4.5",
					stroke: "#ffffff",
					strokeWidth: 1.9,
					strokeLinecap: "round"
				}),
				(0, react.createElement)("circle", {
					cx: 12,
					cy: 16.7,
					r: 1.05,
					fill: "#ffffff"
				})
			] : type === "reset" ? [(0, react.createElement)("path", {
				d: "M4.5 7.8A8.4 8.4 0 1 1 3.6 14.4",
				stroke: "#ffffff",
				strokeWidth: 1.9,
				strokeLinecap: "round"
			}), (0, react.createElement)("path", {
				d: "M3.9 3.9v3.9h3.9",
				stroke: "#ffffff",
				strokeWidth: 1.9,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})] : [(0, react.createElement)("path", {
				d: "M9.5 9.2a2.6 2.6 0 1 1 3.7 2.38c-.84.38-1.2.95-1.2 1.72",
				stroke: "#ffffff",
				strokeWidth: 1.9,
				strokeLinecap: "round"
			}), (0, react.createElement)("circle", {
				cx: 12,
				cy: 16.4,
				r: 1.1,
				fill: "#ffffff"
			})];
			return (0, react.createElement)("div", {
				className: danger ? `${Modal_module_css_default.confirmIcon} ${Modal_module_css_default.confirmIconDanger}` : Modal_module_css_default.confirmIcon,
				"aria-hidden": "true"
			}, (0, react.createElement)("svg", {
				viewBox: "0 0 24 24",
				width: 22,
				height: 22,
				fill: "none"
			}, ...glyphs));
		}
		/** 系统日志图标：文档纸 + 三行文字（stroke 继承 currentColor），设置左侧导航「系统日志」用。 */
		function LogsIcon() {
			return (0, react.createElement)("svg", {
				viewBox: "0 0 16 16",
				width: 15,
				height: 15,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", {
				d: "M4.2 1.8h4.8l2.8 2.8v9.6H4.2z",
				stroke: "currentColor",
				strokeWidth: 1.5,
				strokeLinejoin: "round"
			}), (0, react.createElement)("path", {
				d: "M9 1.8v2.8h2.8",
				stroke: "currentColor",
				strokeWidth: 1.5,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}), (0, react.createElement)("path", {
				d: "M5.6 9.2h4.8M5.6 11.2h4.8",
				stroke: "currentColor",
				strokeWidth: 1.5,
				strokeLinecap: "round"
			}));
		}
		//#endregion
		//#region src/client/components/modals/ProgressView.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Inline progress block shared by the install and uninstall dialogs:
		* a real percentage bar (server-estimated, client-polled). No live terminal
		* window — pnpm emits nothing during git clone/build, so a log pane would be
		* empty for most of the run; failures surface their full output in ErrorModal.
		*/
		function ProgressView({ task }) {
			return (0, react.createElement)("div", { className: Modal_module_css_default.progress }, (0, react.createElement)("div", { className: Modal_module_css_default.progressHead }, (0, react.createElement)("span", { className: Modal_module_css_default.progressText }, `${Math.round(task.progress)}%`)), (0, react.createElement)("div", { className: Modal_module_css_default.progressTrack }, (0, react.createElement)("div", {
				className: task.status === "failed" ? `${Modal_module_css_default.progressFill} ${Modal_module_css_default.progressFillFail}` : Modal_module_css_default.progressFill,
				style: { width: `${task.progress}%` }
			})));
		}
		//#endregion
		//#region src/client/components/modals/modals.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Dialog layer for the Plugin Hub: the install-confirm dialog, the uninstall
		* dialog and the global toast. Both dialogs lock themselves while a mutation
		* or restart is running, then switch to a result view offering an immediate
		* restart or a "later" deferral.
		*/
		/** 完成结果视图：绿色对勾 + 标题/描述；
		*  needsRestart=true（插件需重启才生效）→ 「稍后重启 / 立即重启」按钮对，点稍后重启后
		*  通知中心待重启条目常驻（服务端登记，内存态），直到用户点「立即重启」真正重启后才消失；
		*  needsRestart=false（卸载已即时生效）→ 仅「完成」关闭。 */
		function ResultView({ title, desc, t, restarting, needsRestart, onRestart, onClose }) {
			return (0, react.createElement)("div", { className: Modal_module_css_default.result }, (0, react.createElement)("div", { className: Modal_module_css_default.resultCheck }, (0, react.createElement)("svg", {
				className: Modal_module_css_default.resultCheckIcon,
				viewBox: "0 0 16 16",
				width: 20,
				height: 20,
				fill: "none",
				"aria-hidden": "true"
			}, (0, react.createElement)("path", {
				d: "M2.5 8.5l3.5 3.5 7.5-7.5",
				stroke: "currentColor",
				strokeWidth: 2,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}))), (0, react.createElement)("div", { className: Modal_module_css_default.resultTitle }, title), desc ? (0, react.createElement)("div", { className: Modal_module_css_default.resultDesc }, desc) : null, needsRestart ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.resultRestarting }, restarting ? t("restarting") : t("restartHint")), (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartLater,
				onClick: onClose,
				disabled: restarting
			}, t("restartLater")), (0, react.createElement)("button", {
				className: Modal_module_css_default.restartNowWarning,
				onClick: onRestart,
				disabled: restarting
			}, restarting ? t("restarting") : t("restartNow")))]) : (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartNow,
				onClick: onClose
			}, t("done"))));
		}
		/**
		* 信任确认弹窗：安装进入后台队列后弹窗仍可关闭（任务继续），
		* 只在本任务执行中展示实时进度；完成后切换为结果视图，与卸载一致。
		* 目录插件与命令行安装（customTarget 模式）共用同一套确认/进度/结果流程。
		*/
		function InstallModal(props) {
			const { plugin, customTarget, globalNpm, done, task, t, langPath, restarting, submitting, update, cliOnly, needsRestart, onClose, onCopy, onInstall, onRestart } = props;
			const busy = submitting || task !== null && (task.status === "pending" || task.status === "running");
			const name = customTarget ?? (globalNpm !== void 0 && globalNpm.length > 0 ? globalNpm.join(" ") : void 0) ?? plugin?.displayName ?? plugin?.slug ?? "";
			const busyTitle = (label) => langPath === "zh/" ? `${name} 插件${label}` : `${label} ${name}`;
			const title = busy ? task && task.status === "pending" ? busyTitle(update ? t("queuedUpdateTitle") : t("queuedTitle")) : busyTitle(update ? t("updating") : t("installing")) : done ? update ? t("updateResultTitle") : t("installResultTitle") : update ? t("confirmUpdateTitle") : t("confirmTitle");
			return (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: Modal_module_css_default.modal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: busy ? `${Modal_module_css_default.modalTitle} ${task && task.status === "pending" ? Modal_module_css_default.modalTitleQueued : Modal_module_css_default.modalTitleBusy}` : Modal_module_css_default.modalTitle }, title), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("confirmCancel"),
				onClick: () => onClose()
			}, (0, react.createElement)(CloseIcon))), done ? (0, react.createElement)(ResultView, {
				title: update ? t("updateResultTitle") : t("installResultTitle"),
				desc: update ? t("updateResultDesc") : t("installResultDesc"),
				t,
				restarting,
				needsRestart,
				onRestart,
				onClose
			}) : (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, !busy ? (0, react.createElement)("div", { className: Modal_module_css_default.confirmIconWrap }, (0, react.createElement)(ConfirmIcon, { type: "question" })) : null, (0, react.createElement)("div", { className: Modal_module_css_default.trustHint }, t("confirmDesc")), (0, react.createElement)("div", { className: Modal_module_css_default.modalRow }, (0, react.createElement)("span", { className: Modal_module_css_default.modalLabel }, t("confirmPlugin")), (0, react.createElement)("span", {
				className: Modal_module_css_default.modalValue,
				title: name
			}, name)), plugin?.source?.repo ? (0, react.createElement)("div", { className: Modal_module_css_default.modalRow }, (0, react.createElement)("span", { className: Modal_module_css_default.modalLabel }, t("confirmSource")), (0, react.createElement)("a", {
				className: Modal_module_css_default.modalLink,
				href: pluginDetailUrl(plugin, langPath),
				target: "_blank",
				rel: "noopener noreferrer",
				title: plugin.source.repo
			}, (0, react.createElement)(LinkIcon), plugin.source.repo)) : null, (0, react.createElement)("div", {
				className: Modal_module_css_default.modalCmd,
				onClick: onCopy,
				title: t("copyInstallCommand"),
				role: "button",
				tabIndex: 0
			}, (0, react.createElement)("span", { className: Modal_module_css_default.modalCmdText }, globalNpm !== void 0 && globalNpm.length > 0 ? `npm install -g ${globalNpm.join(" ")}` : customTarget ? `pnpm add ${customTarget}` : installCommandOf(plugin)), (0, react.createElement)("span", { className: Modal_module_css_default.modalCmdCopy }, (0, react.createElement)(CopyIcon), t("copyCmdLabel"))), globalNpm !== void 0 && globalNpm.length > 0 ? (0, react.createElement)("div", { className: Modal_module_css_default.cliOnlyHint }, t("globalNpmHint")) : null, cliOnly ? (0, react.createElement)("div", { className: Modal_module_css_default.cliOnlyHint }, t("cliOnlyHint")) : null, task && task.status === "pending" ? (0, react.createElement)("div", { className: Modal_module_css_default.queuedHint }, t("queuedHint")) : null, task ? (0, react.createElement)(ProgressView, { task }) : null, task && task.status === "failed" ? (0, react.createElement)("div", { className: Modal_module_css_default.failedCopyHint }, t("failedCopyHint")) : null, (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.modalCopy,
				disabled: busy,
				onClick: onCopy
			}, t("copyInstallCommand")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalInstall,
				disabled: busy,
				onClick: onInstall
			}, busy ? task && task.status === "pending" ? update ? t("queuedUpdateTitle") : t("queuedTitle") : update ? t("updating") : t("installing") : update ? t("updateNow") : t("installNow"))))));
		}
		/** 卸载确认弹窗：确认/进行中（后台队列，可关闭）；完成后切换为结果视图（成功即生效，仅「完成」关闭）。 */
		function UninstallModal(props) {
			const { plugin, done, task, t, langPath, restarting, submitting, needsRestart, onClose, onCancel, onCopyCommand, onConfirm, onRestart } = props;
			const busy = submitting || task !== null && (task.status === "pending" || task.status === "running");
			const name = plugin.displayName ?? plugin.slug;
			const busyTitle = (label) => langPath === "zh/" ? `${name} 插件${label}` : `${label} ${name}`;
			const title = busy ? task && task.status === "pending" ? busyTitle(t("queuedUninstallTitle")) : busyTitle(t("uninstalling")) : done ? t("uninstallResultTitle") : t("uninstallTitle");
			return (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: Modal_module_css_default.modal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: busy ? `${Modal_module_css_default.modalTitle} ${task !== null && task.status === "pending" ? Modal_module_css_default.modalTitleQueued : Modal_module_css_default.modalTitleBusy}` : Modal_module_css_default.modalTitle }, title), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("confirmCancel"),
				onClick: () => onClose()
			}, (0, react.createElement)(CloseIcon))), done ? (0, react.createElement)(ResultView, {
				title: t("uninstallResultTitle"),
				desc: t("uninstallResultDesc"),
				t,
				restarting,
				needsRestart,
				onRestart,
				onClose
			}) : (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, !busy ? (0, react.createElement)("div", { className: Modal_module_css_default.confirmIconWrap }, (0, react.createElement)(ConfirmIcon, { type: "trash" })) : null, (0, react.createElement)("div", { className: Modal_module_css_default.modalDesc }, t("uninstallDesc")), (0, react.createElement)("div", { className: Modal_module_css_default.modalRow }, (0, react.createElement)("span", { className: Modal_module_css_default.modalLabel }, t("confirmPlugin")), (0, react.createElement)("span", {
				className: Modal_module_css_default.modalValue,
				title: plugin.displayName ?? plugin.slug
			}, plugin.displayName ?? plugin.slug)), plugin.source?.repo ? (0, react.createElement)("div", { className: Modal_module_css_default.modalRow }, (0, react.createElement)("span", { className: Modal_module_css_default.modalLabel }, t("confirmSource")), (0, react.createElement)("a", {
				className: Modal_module_css_default.modalLink,
				href: pluginDetailUrl(plugin, langPath),
				target: "_blank",
				rel: "noopener noreferrer",
				title: plugin.source.repo
			}, (0, react.createElement)(LinkIcon), plugin.source.repo)) : null, task && task.status === "pending" ? (0, react.createElement)("div", { className: Modal_module_css_default.queuedHint }, t("queuedHint")) : null, task ? (0, react.createElement)(ProgressView, { task }) : null, (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.modalCopy,
				disabled: busy,
				onClick: onCopyCommand
			}, t("copyUninstallCommand")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalCancel,
				onClick: onCancel
			}, t("cancelUninstall")), (0, react.createElement)("button", {
				className: Modal_module_css_default.uninstallConfirm,
				disabled: busy,
				onClick: onConfirm
			}, busy ? task && task.status === "pending" ? t("queuedUninstallTitle") : t("uninstalling") : t("uninstallConfirm"))))));
		}
		/** 预填插件仓库的 GitHub Issue 链接：标题带插件名，正文附完整错误信息，方便用户一键反馈。 */
		/** 安装/卸载失败弹窗：布局与失败记录一致（类型徽标 + 仓库超链接 + 隐蔽复制按钮），报错完整展示，底部一键提交 Issue。 */
		function ErrorModal({ message, repo, kind, command, attempts, t, env, onCopy, onClose, onRunDiagnostics }) {
			const failureKind = classifyFailure(message);
			const npmVersion = npmTooLowVersion(message);
			const copyText = [
				...command ? [command] : [],
				...attempts ?? [],
				message
			].join("\n");
			return (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: Modal_module_css_default.errorModal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.errorTitle }, kind === "install" ? t("errorTitleInstall") : t("errorTitleUninstall")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("errorClose"),
				onClick: onClose
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, (0, react.createElement)("div", { className: Modal_module_css_default.failRow }, (0, react.createElement)("div", { className: Modal_module_css_default.failHead }, (0, react.createElement)("span", { className: kind === "install" ? Modal_module_css_default.failKindInstall : Modal_module_css_default.failKindUninstall }, kind === "install" ? t("install") : t("uninstall")), repo ? (0, react.createElement)("a", {
				className: Modal_module_css_default.failRepo,
				href: pluginSiteUrl(repo),
				target: "_blank",
				rel: "noopener noreferrer",
				title: repo
			}, repo) : null, (0, react.createElement)("button", {
				className: Modal_module_css_default.errorCopySoft,
				onClick: () => onCopy(copyText)
			}, t("errorCopy"))), (0, react.createElement)("pre", { className: Modal_module_css_default.errorBox }, message), failureKind === "npmTooOld" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t(npmVersion ? "failNpmTooLowV" : "failNpmTooLow", npmVersion ? { v: npmVersion } : void 0)) : failureKind === "dshMissing" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failDshMissingHint")) : failureKind === "gitMissing" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failGitMissingHint")) : failureKind === "pnpmMissing" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmMissingHint")) : failureKind === "npmMissing" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failNpmMissingHint")) : failureKind === "pnpmStore" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmStoreHint")) : failureKind === "pnpmPolicy" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmPolicyHint")) : failureKind === "network" ? (0, react.createElement)("div", null, [
				(() => {
					const target = unreachableTargetOf(message);
					return target ? (0, react.createElement)("div", { className: Modal_module_css_default.failNetworkTarget }, t("failNetworkTarget", { url: target })) : null;
				})(),
				(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failNetworkHint")),
				onRunDiagnostics ? (0, react.createElement)("button", {
					className: Modal_module_css_default.failDiagBtn,
					onClick: onRunDiagnostics
				}, t("failNetworkRunDiag")) : null
			]) : failureKind === "pluginPrepare" || failureKind === "pnpmIgnoredBuild" ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, failureKind === "pnpmIgnoredBuild" ? t("failIgnoredBuild") : /\[packaging\]/i.test(message) ? t("failPackagingHint") : t("failPrepareHint")), repo ? (0, react.createElement)("a", {
				className: Modal_module_css_default.failBigIssue,
				href: pluginIssueUrl(repo, message, env, command, attempts),
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("failIssueHint")
			}, t("failIssueBig")) : null]) : repo ? (0, react.createElement)("a", {
				className: Modal_module_css_default.failBigIssue,
				href: pluginIssueUrl(repo, message, env, command, attempts),
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("failIssueHint")
			}, t("failIssueBig")) : null), (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartLater,
				onClick: onClose
			}, t("errorClose"))))));
		}
		/** 全局反馈 Toast：复制成功（反色）/ 安装完成（反色）/ 安装失败（红色）/ 卸载结果 */
		function Toast({ toast, t }) {
			const text = toast.kind === "copied" ? t("toastCopied") : toast.kind === "errCopied" ? t("errCopied") : toast.kind === "done" ? t("installDone") : toast.kind === "fail" ? t("installFail") : toast.kind === "removed" ? t("uninstallDone") : toast.kind === "revealFail" ? t("openFolderFail") : t("uninstallFail");
			const fail = toast.kind === "fail" || toast.kind === "removeFail" || toast.kind === "revealFail";
			return (0, react.createElement)("div", {
				key: toast.id,
				className: fail ? `${Modal_module_css_default.toast} ${Modal_module_css_default.toastFail}` : Modal_module_css_default.toast
			}, text);
		}
		/** 待重启确认弹窗：已安装列表行内「重启」按钮点击后弹出，
		*  与通知中心待重启条目同一交互（说明 + 稍后重启 / 立即重启），
		*  避免行内按钮误触直接触发宿主重启。 */
		function RestartConfirmModal({ t, restarting, onClose, onRestartNow }) {
			return (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: Modal_module_css_default.modal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.modalTitle }, t("sectionPendingRestart")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				type: "button",
				"aria-label": t("errorClose"),
				onClick: onClose
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, (0, react.createElement)("div", { className: Modal_module_css_default.confirmIconWrap }, (0, react.createElement)(ConfirmIcon, { type: "warning" })), (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("restartHint")), (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartLater,
				type: "button",
				disabled: restarting,
				onClick: onClose
			}, t("restartLater")), (0, react.createElement)("button", {
				className: Modal_module_css_default.restartNowWarning,
				type: "button",
				disabled: restarting,
				onClick: onRestartNow
			}, restarting ? t("restarting") : t("restartNow"))))));
		}
		//#endregion
		//#region src/client/logic/renderMarkdown.ts
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* 轻量 Markdown 渲染器：仅用于 Hub 自我更新的变更记录（Worker 下发的 notes）。
		*
		* 内容由插件作者自己编写、属可信内容，但渲染端仍先整体 HTML 转义，再按
		* Markdown 语法输出结构，杜绝任何未转义的原始 HTML 注入；链接仅放行 http(s)。
		*
		* 支持：标题(#~####)、有序/无序列表、代码块(```)、行内代码、加粗、斜体、
		* 链接、图片(![alt](url)，如反馈群二维码)、引用(>)、段落；其余语法一律按
		* 纯文本处理，不引入外部依赖。图片仅放行 http(s)，限定最大宽度不撑破弹窗。
		*/
		/** HTML 转义：所有文本先进这里，再进入结构变换，保证输出里没有未转义的用户输入。 */
		function escapeHtml(s) {
			return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
		}
		/** 行内变换：链接 / 加粗 / 斜体 / 行内代码（代码先占位保护，最后还原）。 */
		function inline(s) {
			let out = escapeHtml(s);
			const codeSpans = [];
			out = out.replace(/`([^`]+)`/g, (_m, code) => {
				codeSpans.push(String(code));
				return `\u0000${codeSpans.length - 1}\u0000`;
			});
			out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) => {
				const src = String(url);
				if (!/^https?:\/\//i.test(src) || /[\u0000]/.test(src)) return m;
				if (/\/dsh-plugin-user-group-qr-[^/]*$/i.test(src)) return `<img src="${src}" alt="${String(alt)}" width="100" height="100" loading="lazy">`;
				return `<img src="${src}" alt="${String(alt)}" loading="lazy">`;
			});
			out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, url) => /^https?:\/\//i.test(String(url)) && !/[\u0000]/.test(String(url)) ? `<a href="${String(url)}" target="_blank" rel="noopener noreferrer">${String(text)}</a>` : m);
			out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
			out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
			return out.replace(/\u0000(\d+)\u0000/g, (_m, idx) => `<code>${codeSpans[Number(idx)]}</code>`);
		}
		/** 把变更记录 Markdown 渲染为安全的 HTML 字符串（由弹窗用 dangerouslySetInnerHTML 注入）。 */
		function renderMarkdown(md) {
			const lines = md.replace(/\r\n?/g, "\n").split("\n");
			const blocks = [];
			let i = 0;
			while (i < lines.length) {
				const line = lines[i];
				if (/^\s*```/.test(line)) {
					const buf = [];
					i++;
					while (i < lines.length && !/^\s*```/.test(lines[i])) {
						buf.push(lines[i]);
						i++;
					}
					i++;
					blocks.push(`<pre><code>${escapeHtml(buf.join("\n"))}</code></pre>`);
					continue;
				}
				if (line.trim() === "") {
					i++;
					continue;
				}
				const heading = line.match(/^(#{1,4})\s+(.*)/);
				if (heading) {
					const level = heading[1].length + 1;
					blocks.push(`<h${level}>${inline(heading[2])}</h${level}>`);
					i++;
					continue;
				}
				if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
					const ordered = /^\s*\d+[.)]\s+/.test(line);
					const items = [];
					while (i < lines.length && (/^\s*[-*+]\s+/.test(lines[i]) || /^\s*\d+[.)]\s+/.test(lines[i]))) {
						items.push(`<li>${inline(lines[i].replace(/^\s*[-*+]|\s*\d+[.)]\s*/, "").trim())}</li>`);
						i++;
					}
					blocks.push(`<${ordered ? "ol" : "ul"}>${items.join("")}</${ordered ? "ol" : "ul"}>`);
					continue;
				}
				if (/^\s*>\s?/.test(line)) {
					const buf = [];
					while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
						buf.push(inline(lines[i].replace(/^\s*>\s?/, "")));
						i++;
					}
					blocks.push(`<blockquote>${buf.join("<br>")}</blockquote>`);
					continue;
				}
				const buf = [];
				while (i < lines.length && lines[i].trim() !== "" && !/^\s*```/.test(lines[i]) && !/^#{1,4}\s+/.test(lines[i]) && !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) {
					buf.push(inline(lines[i]));
					i++;
				}
				blocks.push(`<p>${buf.join("<br>")}</p>`);
			}
			return blocks.join("");
		}
		//#endregion
		//#region src/client/components/modals/AboutModal.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* 头部「关注我们」弹窗：介绍 DSH Plugin Hub 的功能定位 + 用户反馈群二维码。
		* 内容以 Markdown 形式由 dsh-update Worker 的 /about 接口下发（key = hub:about），
		* 客户端按接口返回渲染，不内置固定文案。
		* 图片（反馈群二维码）经 renderMarkdown 的 ![](url) 语法嵌入，居中、最大高度受控。
		*/
		function AboutModal({ info, lang, t, onClose }) {
			const contentRaw = info ? typeof info.content === "string" ? info.content : info.content && typeof info.content === "object" ? lang === "en" ? info.content.en ?? info.content.zh ?? "" : info.content.zh ?? info.content.en ?? "" : "" : "";
			const contentHtml = contentRaw.trim() ? renderMarkdown(contentRaw) : null;
			let updated = null;
			if (info?.updatedAt) {
				const d = new Date(info.updatedAt);
				if (!Number.isNaN(d.getTime())) updated = d.toLocaleString(lang === "en" ? "en-US" : "zh-CN");
			}
			return (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: `${Modal_module_css_default.modal} ${Modal_module_css_default.aboutModal}`,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.modalTitle }, t("aboutTitle")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("confirmCancel"),
				onClick: () => onClose()
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalDesc }, t("aboutDesc")), contentHtml ? (0, react.createElement)("div", {
				className: Modal_module_css_default.aboutContent,
				dangerouslySetInnerHTML: { __html: contentHtml }
			}) : (0, react.createElement)("div", { className: Modal_module_css_default.aboutContent }, t("aboutEmpty")), updated ? (0, react.createElement)("div", { className: Modal_module_css_default.aboutMeta }, `${t("aboutUpdated")} ${updated}`) : null, (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.modalInstall,
				onClick: onClose
			}, t("doneBtn")))));
		}
		//#endregion
		//#region src/client/components/modals/HubUpdateModal.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Hub 版本信息 / 自我更新说明弹窗：
		*  - 有更新（hasUpdate=true）：标题「有新版本」，展示新版本号、发布时间与 Worker 下发的
		*    Markdown 变更记录（renderMarkdown 渲染，双语言按界面语言取 {zh,en} 对象），
		*    按钮「稍后再说 / 直接更新」，确认后进入安装弹窗执行覆盖重装。
		*  - 无更新（hasUpdate=false）：标题「当前版本」，展示当前版本信息与更新记录，已是最新。
		* 点击头部版本号（或「可更新」徽标）打开 —— 无论有无更新都能看到更新内容。
		*/
		function HubUpdateModal({ info, lang, t, hasUpdate, onProceed, onClose }) {
			const notesRaw = typeof info.notes === "string" ? info.notes : info.notes && typeof info.notes === "object" ? lang === "en" ? info.notes.en ?? info.notes.zh ?? "" : info.notes.zh ?? info.notes.en ?? "" : "";
			const notesHtml = notesRaw.trim() ? renderMarkdown(notesRaw) : null;
			let published = null;
			if (info.publishedAt) {
				const d = new Date(info.publishedAt);
				if (!Number.isNaN(d.getTime())) published = d.toLocaleString(lang === "en" ? "en-US" : "zh-CN");
			}
			return (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: `${Modal_module_css_default.modal} ${Modal_module_css_default.hubUpdateModal}`,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.modalTitle }, t(hasUpdate ? "hubUpdateTitle" : "hubCurrentTitle")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("confirmCancel"),
				onClick: () => onClose()
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalDesc }, t(hasUpdate ? "hubUpdateDesc" : "hubCurrentDesc", { version: info.version })), (0, react.createElement)("div", { className: Modal_module_css_default.hubUpdateMeta }, (0, react.createElement)("span", { className: Modal_module_css_default.hubUpdateMetaItem }, `${t("version")} ${info.version}`), published ? (0, react.createElement)("span", { className: Modal_module_css_default.hubUpdateMetaItem }, `${t("hubUpdatePublished")} ${published}`) : null), notesHtml ? (0, react.createElement)("div", {
				className: Modal_module_css_default.hubUpdateNotes,
				dangerouslySetInnerHTML: { __html: notesHtml }
			}) : null, (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, hasUpdate ? [(0, react.createElement)("button", {
				className: Modal_module_css_default.restartLater,
				onClick: onClose
			}, t("hubUpdateLater")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalInstall,
				onClick: onProceed
			}, t("updateNow"))] : (0, react.createElement)("button", {
				className: Modal_module_css_default.modalInstall,
				onClick: onClose
			}, t("hubUpToDate")))));
		}
		//#endregion
		//#region src/client/logic/format.ts
		/** 星数/分支数的紧凑展示：<1k 原样；千级 1.2k；十万级取整。 */
		function fmtStars(count) {
			if (!count || count <= 0) return "0";
			if (count < 1e3) return String(count);
			const k = count / 1e3;
			return `${k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
		}
		/** 相对时间：今天 / N 天前 / N 个月前 / N 年前。 */
		function relTime(iso, t) {
			if (!iso) return "";
			const days = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
			if (days <= 0) return t("today");
			if (days < 30) return t("daysAgo", { days });
			if (days < 365) return t("monthsAgo", { months: Math.floor(days / 30) });
			return t("yearsAgo", { years: Math.floor(days / 365) });
		}
		//#endregion
		//#region src/client/components/modals/InstalledDetailModal.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Installed-plugin detail dialog: opens from the Installed view (row click
		* or the detail button) and shows everything we know about an installed
		* entry — the catalog metadata (category, catalog entry, stars/forks,
		* latest version) merged with the host runtime facts (install path, installed
		* version, install time, last update). Update / uninstall actions are
		* offered from here too, mirroring the row actions.
		*/
		/** ISO 安装时间 → 本地可读；非法值返回 null（行内不显示）。 */
		function fmtDate(iso, lang) {
			if (!iso) return null;
			const d = new Date(iso);
			return Number.isNaN(d.getTime()) ? null : d.toLocaleString(lang === "en" ? "en-US" : "zh-CN");
		}
		function InstalledDetailModal({ item, t, lang, langPath, onClose, onUpdate, onUninstall, onCopyPath, onReveal }) {
			const p = item.plugin;
			const name = p?.displayName ?? item.name;
			const installedAt = fmtDate(item.installedAt, lang);
			const lastUpdated = fmtDate(p?.dates?.repoUpdatedAt ?? null, lang);
			const hasUpdate = item.hasUpdate && item.plugin !== null;
			return (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: `${Modal_module_css_default.modal} ${Modal_module_css_default.detailModal}`,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.modalTitle }, name), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("confirmCancel"),
				onClick: onClose
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, p?.description ? (0, react.createElement)("div", { className: Modal_module_css_default.modalDesc }, p.description) : null, hasUpdate ? (0, react.createElement)("div", { className: Modal_module_css_default.detailUpdateHint }, item.installedVersion && item.catalogVersion ? t("versionUpHint", {
				from: item.installedVersion,
				to: item.catalogVersion
			}) : t("updateAvailableHint")) : null, (0, react.createElement)("div", { className: Modal_module_css_default.detailGrid }, p?.category ? (0, react.createElement)("div", { className: Modal_module_css_default.detailRow }, (0, react.createElement)("span", { className: Modal_module_css_default.detailLabel }, t("detailCategory")), (0, react.createElement)("span", { className: Modal_module_css_default.detailValue }, categoryLabel(CATEGORY_LABELS, p.category, lang))) : null, (0, react.createElement)("div", { className: Modal_module_css_default.detailRow }, (0, react.createElement)("span", { className: Modal_module_css_default.detailLabel }, t("statusLabel")), (0, react.createElement)("span", { className: Modal_module_css_default.detailValue }, (0, react.createElement)("span", {
				className: item.loaded ? Modal_module_css_default.detailStatusRunning : Modal_module_css_default.detailStatusPending,
				"aria-hidden": "true"
			}), (0, react.createElement)("span", { className: Modal_module_css_default.detailStatusText }, item.loaded ? t("statusRunning") : t("statusPending")))), item.installedVersion ? (0, react.createElement)("div", { className: Modal_module_css_default.detailRow }, (0, react.createElement)("span", { className: Modal_module_css_default.detailLabel }, t("installedVersionLabel")), (0, react.createElement)("span", { className: Modal_module_css_default.detailValue }, (0, react.createElement)("span", { className: Modal_module_css_default.detailMono }, item.installedVersion), item.catalogVersion && item.catalogVersion !== item.installedVersion ? (0, react.createElement)("span", { className: Modal_module_css_default.detailArrow }, "→", (0, react.createElement)("span", { className: Modal_module_css_default.detailMono }, item.catalogVersion), (0, react.createElement)("span", { className: Modal_module_css_default.detailDim }, t("catalogLatest"))) : null)) : null, item.repo ? (0, react.createElement)("div", { className: Modal_module_css_default.detailRow }, (0, react.createElement)("span", { className: Modal_module_css_default.detailLabel }, t("detailCatalog")), (0, react.createElement)("a", {
				className: Modal_module_css_default.detailLink,
				href: p ? pluginDetailUrl(p, langPath) : `https://github.com/${item.repo}`,
				target: "_blank",
				rel: "noopener noreferrer",
				title: item.repo
			}, (0, react.createElement)(LinkIcon), item.repo)) : null, item.plugin?.source?.npmPackage ? (0, react.createElement)("div", { className: Modal_module_css_default.detailRow }, (0, react.createElement)("span", { className: Modal_module_css_default.detailLabel }, t("packageName")), (0, react.createElement)("span", { className: Modal_module_css_default.detailValue }, (0, react.createElement)("span", { className: Modal_module_css_default.detailMono }, item.plugin.source.npmPackage))) : null, p?.stats && (p.stats.stargazers_count ?? 0) > 0 ? (0, react.createElement)("div", { className: Modal_module_css_default.detailRow }, (0, react.createElement)("span", { className: Modal_module_css_default.detailLabel }, t("detailStats")), (0, react.createElement)("span", { className: Modal_module_css_default.detailValue }, (0, react.createElement)("span", { className: Modal_module_css_default.detailStars }, "★ ", fmtStars(p.stats.stargazers_count)), (0, react.createElement)("span", { className: Modal_module_css_default.detailDim }, t("fork"), " ", fmtStars(p.stats.forks_count)))) : null, item.installPath ? (0, react.createElement)("div", { className: Modal_module_css_default.detailRow }, (0, react.createElement)("span", { className: Modal_module_css_default.detailLabel }, t("installPath")), (0, react.createElement)("div", { className: Modal_module_css_default.detailPath }, (0, react.createElement)("span", {
				className: Modal_module_css_default.detailPathText,
				title: t("copyPath"),
				onClick: () => onCopyPath(item.installPath)
			}, item.installPath), (0, react.createElement)("span", { className: Modal_module_css_default.detailPathActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.detailPathBtn,
				type: "button",
				title: t("copyPath"),
				onClick: (e) => {
					e.stopPropagation();
					onCopyPath(item.installPath);
				}
			}, (0, react.createElement)(CopyIcon)), (0, react.createElement)("button", {
				className: Modal_module_css_default.detailPathBtn,
				type: "button",
				title: t("openFolder"),
				onClick: (e) => {
					e.stopPropagation();
					onReveal(item);
				}
			}, (0, react.createElement)(FolderIcon))))) : null, installedAt ? (0, react.createElement)("div", { className: Modal_module_css_default.detailRow }, (0, react.createElement)("span", { className: Modal_module_css_default.detailLabel }, t("installedAtLabel")), (0, react.createElement)("span", { className: Modal_module_css_default.detailValue }, installedAt)) : null, lastUpdated ? (0, react.createElement)("div", { className: Modal_module_css_default.detailRow }, (0, react.createElement)("span", { className: Modal_module_css_default.detailLabel }, t("lastUpdatedLabel")), (0, react.createElement)("span", { className: Modal_module_css_default.detailValue }, lastUpdated)) : null)), (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartLater,
				onClick: onClose
			}, t("done")), hasUpdate ? (0, react.createElement)("button", {
				className: Modal_module_css_default.modalInstall,
				onClick: () => onUpdate(item)
			}, t("update")) : null, (0, react.createElement)("button", {
				className: Modal_module_css_default.uninstallConfirm,
				onClick: () => onUninstall(item)
			}, t("uninstall")))));
		}
		//#endregion
		//#region src/client/components/modals/ConfirmDialog.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Generic confirm dialog — the single entry point for every "are you sure?"
		* question in the app. Rule: any question must be a modal dialog, never an
		* in-button double-click.
		*
		* The icon in the middle tells the type at a glance: a blue question mark
		* for routine confirmations (install / update / restart / ignore), a red
		* action glyph for destructive ones (clear / delete / uninstall / reset).
		*/
		/** 通用确认弹窗：标题 + 类型图标 + 描述 + 取消/确认按钮。
		*  type='question' → 蓝问号 + 品牌蓝确认按钮；危险类型 → 红图形 + 红色确认按钮。 */
		function ConfirmDialog({ type, title, desc, confirmLabel, cancelLabel, busy, busyLabel, t, onConfirm, onCancel }) {
			const danger = type !== "question";
			return (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onCancel();
				}
			}, (0, react.createElement)("div", {
				className: Modal_module_css_default.modal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.modalTitle }, title), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				type: "button",
				"aria-label": t("errorClose"),
				onClick: onCancel
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, (0, react.createElement)("div", { className: Modal_module_css_default.confirmIconWrap }, (0, react.createElement)(ConfirmIcon, { type })), desc ? (0, react.createElement)("div", { className: Modal_module_css_default.modalDesc }, desc) : null, (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartLater,
				type: "button",
				disabled: busy,
				onClick: onCancel
			}, cancelLabel ?? t("confirmCancel")), (0, react.createElement)("button", {
				className: danger ? Modal_module_css_default.dangerConfirm : Modal_module_css_default.confirmPrimary,
				type: "button",
				disabled: busy,
				onClick: onConfirm
			}, busy && busyLabel ? busyLabel : confirmLabel)))));
		}
		//#endregion
		//#region src/client/components/modals/NotificationsModal.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Notification-center dialog: a persistent log of every settled install /
		* remove task — successes and failures alike.
		*
		* Records are written to localStorage at settle time (see logic/failures.ts),
		* so a result is never lost even when the dialog was dismissed or the user
		* was away. Each entry carries a circular status badge (green check for
		* success, red cross for failure) with white glyph and message text;
		* failures keep their copy / fix / file-an-issue actions. Opened from the
		* header entry button (after the Settings tab).
		*/
		/** 记录时间完整展示：YYYY-MM-DD HH:mm:ss（每条通知都带精确到秒的时间戳）。 */
		function fmtTime(at) {
			const d = new Date(at);
			const pad = (n) => String(n).padStart(2, "0");
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
		}
		/** 圆形状态徽标内的白色图形：成功为对勾、失败为叉。 */
		function BadgeGlyph({ ok }) {
			return (0, react.createElement)("svg", {
				className: Modal_module_css_default.noticeBadgeIcon,
				viewBox: "0 0 16 16",
				width: 12,
				height: 12,
				fill: "none",
				"aria-hidden": "true"
			}, ok ? (0, react.createElement)("path", {
				d: "M3 8.5l3.5 3.5 6.5-6.5",
				stroke: "#ffffff",
				strokeWidth: 2,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}) : (0, react.createElement)("path", {
				d: "M4 4l8 8M12 4L4 12",
				stroke: "#ffffff",
				strokeWidth: 2,
				strokeLinecap: "round"
			}));
		}
		function NotificationsModal({ records, tasks, pendingRestarts, t, env, onClose, onCopy, onClear, onRemove, onUpdate, onIgnoreUpdate, cancelTask, restarting, onRestart, onRunDiagnostics, resolveRepo }) {
			const [confirmClear, setConfirmClear] = (0, react.useState)(false);
			const [confirmRemoveId, setConfirmRemoveId] = (0, react.useState)(null);
			return (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: Modal_module_css_default.errorModal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.modalTitle }, t("notifications")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("errorClose"),
				onClick: onClose
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, (0, react.createElement)("div", { className: Modal_module_css_default.errorHint }, t("notificationsDesc")), tasks.length > 0 || pendingRestarts.length > 0 ? (0, react.createElement)("div", null, [pendingRestarts.length > 0 ? (0, react.createElement)("div", { className: Modal_module_css_default.queueSection }, (0, react.createElement)("div", { className: Modal_module_css_default.queueSectionTitle }, t("sectionPendingRestart")), pendingRestarts.map((p) => (0, react.createElement)("div", {
				key: `restart-${p.target}`,
				className: Modal_module_css_default.queueRow
			}, (0, react.createElement)("div", { className: Modal_module_css_default.queueRowHead }, (0, react.createElement)("span", { className: `${Modal_module_css_default.failKind} ${p.kind === "uninstall" ? Modal_module_css_default.failKindUninstall : Modal_module_css_default.failKindInstall}` }, p.kind === "uninstall" ? t("uninstall") : t("install")), (0, react.createElement)("span", {
				className: Modal_module_css_default.queueRowTarget,
				title: p.target
			}, p.target)), p.desc ? (0, react.createElement)("div", {
				className: Modal_module_css_default.queueRowDesc,
				title: p.desc
			}, p.desc) : null, (0, react.createElement)("div", { className: Modal_module_css_default.queueRowBody }, (0, react.createElement)("span", { className: Modal_module_css_default.pendingRowStatus }, p.kind === "uninstall" ? t("restartPendingHintUninstall") : t("restartPendingHint")), (0, react.createElement)("span", { className: Modal_module_css_default.pendingRowActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartLater,
				disabled: restarting,
				onClick: onClose
			}, t("restartLater")), (0, react.createElement)("button", {
				className: Modal_module_css_default.restartNow,
				disabled: restarting,
				onClick: onRestart
			}, restarting ? t("restarting") : t("restartNow"))))))) : null, tasks.length > 0 ? (0, react.createElement)("div", { className: Modal_module_css_default.queueSection }, (0, react.createElement)("div", { className: Modal_module_css_default.queueSectionTitle }, t("sectionInProgress")), tasks.map((q) => (0, react.createElement)("div", {
				key: q.id,
				className: Modal_module_css_default.queueRow
			}, (0, react.createElement)("div", { className: Modal_module_css_default.queueRowHead }, (0, react.createElement)("span", { className: `${Modal_module_css_default.failKind} ${q.kind === "install" ? Modal_module_css_default.failKindInstall : Modal_module_css_default.failKindUninstall}` }, q.kind === "install" ? t("install") : t("uninstall")), (0, react.createElement)("span", {
				className: Modal_module_css_default.queueRowTarget,
				title: q.target
			}, q.target), (0, react.createElement)("button", {
				className: Modal_module_css_default.stripCancel,
				disabled: q.status === "cancelling",
				onClick: (e) => {
					e.stopPropagation();
					cancelTask(q.id);
				}
			}, t("cancelTask"))), q.desc ? (0, react.createElement)("div", {
				className: Modal_module_css_default.queueRowDesc,
				title: q.desc
			}, q.desc) : null, (0, react.createElement)("div", { className: Modal_module_css_default.queueRowBody }, (0, react.createElement)("span", { className: Modal_module_css_default.queueRowStatus }, q.status === "running" ? q.kind === "install" ? t("installing") : t("uninstalling") : q.status === "cancelling" ? t("cancelling") : q.kind === "install" ? t("queuedTitle") : t("queuedUninstallTitle")), (0, react.createElement)("div", { className: `${Modal_module_css_default.progressTrack} ${Modal_module_css_default.queueRowTrack}` }, (0, react.createElement)("div", {
				className: Modal_module_css_default.progressFill,
				style: { width: `${q.progress}%` }
			})), (0, react.createElement)("span", { className: Modal_module_css_default.queueRowPct }, `${q.progress}%`))))) : null]) : null, records.length === 0 ? (0, react.createElement)("div", { className: Modal_module_css_default.failEmpty }, t("notificationsEmpty")) : (0, react.createElement)("div", { className: Modal_module_css_default.noticeList }, records.map((r) => {
				const isUpdate = r.kind === "update";
				const shownRepo = resolveRepo ? resolveRepo(r.repo) ?? "" : r.repo;
				return (0, react.createElement)("div", {
					key: r.id,
					className: r.ok ? `${Modal_module_css_default.noticeRow} ${Modal_module_css_default.noticeRowOk}${isUpdate ? ` ${Modal_module_css_default.noticeRowUpdate}` : ""}` : Modal_module_css_default.noticeRow,
					...isUpdate ? {
						onClick: () => onUpdate(r.repo),
						title: t("updateNoticeGo")
					} : {}
				}, (0, react.createElement)("div", { className: Modal_module_css_default.noticeRowMain }, (0, react.createElement)("div", { className: r.ok ? Modal_module_css_default.noticeBadgeOk : Modal_module_css_default.noticeBadgeFail }, (0, react.createElement)(BadgeGlyph, { ok: r.ok })), (0, react.createElement)("div", { className: Modal_module_css_default.noticeMain }, (0, react.createElement)("div", { className: Modal_module_css_default.noticeHead }, (0, react.createElement)("span", { className: r.ok ? Modal_module_css_default.noticeTextOk : Modal_module_css_default.noticeTextFail }, r.ok ? isUpdate ? t("updateNoticeTitle") : r.action === "update" ? t("updateDone") : r.kind === "install" ? t("installDone") : t("uninstallDone") : r.action === "update" ? t("errorTitleUpdate") : r.kind === "install" ? t("errorTitleInstall") : t("errorTitleUninstall")), isUpdate && r.version ? (0, react.createElement)("span", {
					className: Modal_module_css_default.noticeVersion,
					title: r.version
				}, `v${r.version}`) : null, r.repo ? isUpdate ? (0, react.createElement)("span", {
					className: Modal_module_css_default.failRepo,
					title: r.repo
				}, r.repo) : shownRepo ? (0, react.createElement)("a", {
					className: Modal_module_css_default.failRepo,
					href: pluginSiteUrl(shownRepo),
					target: "_blank",
					rel: "noopener noreferrer",
					title: shownRepo
				}, shownRepo) : (0, react.createElement)("span", {
					className: Modal_module_css_default.failRepo,
					title: r.repo
				}, r.repo) : null, !r.ok && (0, react.createElement)("button", {
					className: Modal_module_css_default.failCopy,
					onClick: () => onCopy(r.message)
				}, t("failCopy")), r.ok ? (0, react.createElement)("span", {
					className: Modal_module_css_default.noticeTime,
					title: new Date(r.at).toLocaleString()
				}, fmtTime(r.at)) : null, isUpdate ? (0, react.createElement)("button", {
					className: Modal_module_css_default.noticeUpdateGo,
					onClick: (e) => {
						e.stopPropagation();
						onUpdate(r.repo);
					}
				}, t("updateNoticeGo")) : null, isUpdate ? (0, react.createElement)("button", {
					className: Modal_module_css_default.noticeIgnore,
					onClick: (e) => {
						e.stopPropagation();
						onIgnoreUpdate(r.repo, r.version);
					}
				}, t("ignoreUpdateRun")) : null, (0, react.createElement)("button", {
					className: Modal_module_css_default.noticeRemove,
					"aria-label": t("removeNotification"),
					title: t("removeNotification"),
					onClick: (e) => {
						e.stopPropagation();
						setConfirmRemoveId(r.id);
					}
				}, (0, react.createElement)(CloseIcon))), !r.ok && (() => {
					const kind = classifyFailure(r.message);
					if (kind === "npmTooOld") {
						const v = npmTooLowVersion(r.message);
						return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t(v ? "failNpmTooLowV" : "failNpmTooLow", v ? { v } : void 0));
					}
					if (kind === "dshMissing") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failDshMissingHint"));
					if (kind === "gitMissing") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failGitMissingHint"));
					if (kind === "pnpmMissing") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmMissingHint"));
					if (kind === "npmMissing") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failNpmMissingHint"));
					if (kind === "pnpmStore") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmStoreHint"));
					if (kind === "pnpmPolicy") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmPolicyHint"));
					if (kind === "network") return (0, react.createElement)("div", null, [
						(() => {
							const target = unreachableTargetOf(r.message);
							return target ? (0, react.createElement)("div", { className: Modal_module_css_default.failNetworkTarget }, t("failNetworkTarget", { url: target })) : null;
						})(),
						(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failNetworkHint")),
						onRunDiagnostics ? (0, react.createElement)("button", {
							className: Modal_module_css_default.failDiagBtn,
							onClick: onRunDiagnostics
						}, t("failNetworkRunDiag")) : null
					]);
					if (kind === "pluginPrepare" || kind === "pnpmIgnoredBuild") return (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, kind === "pnpmIgnoredBuild" ? t("failIgnoredBuild") : /\[packaging\]/i.test(r.message) ? t("failPackagingHint") : t("failPrepareHint")), r.repo && shownRepo ? (0, react.createElement)("a", {
						className: Modal_module_css_default.failBigIssue,
						href: pluginIssueUrl(shownRepo, r.message, env, r.command, r.attempts),
						target: "_blank",
						rel: "noopener noreferrer",
						title: t("failIssueHint")
					}, t("failIssueBig")) : null]);
					return r.repo && shownRepo ? (0, react.createElement)("a", {
						className: Modal_module_css_default.failBigIssue,
						href: pluginIssueUrl(shownRepo, r.message, env, r.command, r.attempts),
						target: "_blank",
						rel: "noopener noreferrer",
						title: t("failIssueHint")
					}, t("failIssueBig")) : null;
				})())), !r.ok ? (0, react.createElement)("div", { className: Modal_module_css_default.noticeFoot }, (0, react.createElement)("span", {
					className: Modal_module_css_default.noticeTime,
					title: new Date(r.at).toLocaleString()
				}, fmtTime(r.at))) : null);
			})), (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, records.length > 0 ? (0, react.createElement)("button", {
				className: Modal_module_css_default.failClear,
				onClick: () => setConfirmClear(true)
			}, t("notificationsClear")) : null, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartNow,
				onClick: onClose
			}, t("errorClose"))))), confirmClear && (0, react.createElement)(ConfirmDialog, {
				type: "trash",
				title: t("notificationsClearConfirmTitle"),
				desc: t("notificationsClearConfirmDesc"),
				confirmLabel: t("notificationsClear"),
				t,
				onConfirm: () => {
					setConfirmClear(false);
					onClear();
				},
				onCancel: () => setConfirmClear(false)
			}), confirmRemoveId !== null && (0, react.createElement)(ConfirmDialog, {
				type: "trash",
				title: t("removeNotificationConfirmTitle"),
				desc: t("removeNotificationConfirmDesc"),
				confirmLabel: t("removeNotification"),
				t,
				onConfirm: () => {
					onRemove(confirmRemoveId);
					setConfirmRemoveId(null);
				},
				onCancel: () => setConfirmRemoveId(null)
			}));
		}
		//#endregion
		//#region src/client/components/layout/CatalogHeader.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Section header: brand title row (H1 + open-site button) + tagline, followed
		* by the purple ad banner that promotes the catalog stats.
		*/
		function CatalogHeader({ t, langPath, statsTotal, statsVerified, onToggleLang, hubUpdate, onVersionClick, onAboutClick }) {
			return (0, react.createElement)(react.Fragment, null, (0, react.createElement)("div", { className: Header_module_css_default.header }, (0, react.createElement)("div", { className: Header_module_css_default.headerTitleRow }, (0, react.createElement)("a", {
				className: Header_module_css_default.brandTitle,
				href: siteUrl(langPath),
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("openHint"),
				"aria-label": t("openHint")
			}, (0, react.createElement)(LogoIcon), (0, react.createElement)("h1", { className: Header_module_css_default.title }, t("title"))), (0, react.createElement)("button", {
				className: Header_module_css_default.versionBtn,
				type: "button",
				onClick: onVersionClick,
				title: t(hubUpdate ? "hubUpdateHint" : "versionHint"),
				"aria-label": t(hubUpdate ? "hubUpdateHint" : "versionHint")
			}, `v${PLUGIN_VERSION}`, hubUpdate && (0, react.createElement)("span", { className: Header_module_css_default.hubUpdateBadge }, t("update"))), (0, react.createElement)("div", { className: Header_module_css_default.headerRight }, (0, react.createElement)("button", {
				className: Header_module_css_default.langBtn,
				type: "button",
				onClick: onToggleLang,
				title: t("toggleLangHint"),
				"aria-label": t("toggleLangHint")
			}, langPath === "zh/" ? "EN" : "中文"), (0, react.createElement)("button", {
				className: Header_module_css_default.aboutBtn,
				type: "button",
				onClick: onAboutClick,
				title: t("aboutDesc"),
				"aria-label": t("aboutTitle")
			}, t("followUs")), (0, react.createElement)("a", {
				className: Header_module_css_default.githubLink,
				href: GITHUB_URL,
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("githubHint"),
				"aria-label": t("githubHint")
			}, (0, react.createElement)(GitHubIcon)))), (0, react.createElement)("a", {
				className: Header_module_css_default.taglineLink,
				href: siteUrl(langPath),
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("openHint")
			}, (0, react.createElement)("div", { className: Header_module_css_default.tagline }, t("tagline", {
				total: statsTotal,
				verified: statsVerified
			})))), (0, react.createElement)("a", {
				className: Header_module_css_default.adBanner,
				href: siteUrl(langPath),
				target: "_blank",
				rel: "noopener noreferrer"
			}, (0, react.createElement)("span", { className: Header_module_css_default.adBadge }, t("adBadge")), (0, react.createElement)("span", { className: Header_module_css_default.adText }, t("ad", {
				total: statsTotal,
				verified: statsVerified
			})), (0, react.createElement)("span", { className: Header_module_css_default.adArrow }, "↗")));
		}
		//#endregion
		//#region src/client/components/layout/CategoryTabs.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Category tabs: an "all" chip followed by one chip per catalog category.
		* The "all" chip carries the total plugin count; the per-category chips
		* carry no counts so their widths stay uniform.
		*/
		function CategoryTabs({ category, setCategory, allLabel, totalCount, langKey }) {
			return (0, react.createElement)("div", { className: Header_module_css_default.tabs }, (0, react.createElement)("button", {
				key: "all",
				className: category === "all" ? Header_module_css_default.tabActive : Header_module_css_default.tab,
				onClick: () => setCategory("all")
			}, allLabel, (0, react.createElement)("span", { className: Header_module_css_default.tabCount }, totalCount)), CATEGORY_ORDER.map((id) => (0, react.createElement)("button", {
				key: id,
				className: category === id ? Header_module_css_default.tabActive : Header_module_css_default.tab,
				onClick: () => setCategory(id)
			}, categoryLabel(CATEGORY_SHORT_LABELS, id, langKey))));
		}
		//#endregion
		//#region src/client/components/layout/CatalogControls.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Toolbar above the market list:
		* row 1 — full-width search input;
		* row 2 — result count on the left, sort segmented control on the right
		* (mirrors the Installed view: clicking the same sort toggles
		* ascending/descending, a new sort uses its default order; the active
		* button shows an up/down arrow for the current direction).
		*/
		/** 单选按钮组中的一个按钮（segmented control，与已安装视图排序按钮同款） */
		function SegBtn$1({ active, onClick, label, icon }) {
			return (0, react.createElement)("button", {
				type: "button",
				className: active ? `${Header_module_css_default.segBtn} ${Header_module_css_default.segBtnActive}` : Header_module_css_default.segBtn,
				"aria-pressed": active,
				onClick
			}, label, icon);
		}
		function CatalogControls({ query, setQuery, sort, sortDir, toggleSort, t, resultText }) {
			return (0, react.createElement)(react.Fragment, null, (0, react.createElement)("div", { className: Header_module_css_default.searchRow }, (0, react.createElement)("input", {
				className: Header_module_css_default.search,
				type: "search",
				placeholder: t("search"),
				value: query,
				spellCheck: false,
				onInput: (e) => setQuery(e.target.value)
			})), (0, react.createElement)("div", { className: Header_module_css_default.controls }, resultText ? (0, react.createElement)("span", { className: Header_module_css_default.resultSeg }, ...resultText.split(/(\d+)/).map((part, i) => /^\d+$/.test(part) ? (0, react.createElement)("span", {
				key: i,
				className: Header_module_css_default.resultCount
			}, part) : part)) : null, (0, react.createElement)("div", { className: Header_module_css_default.sortGroup }, (0, react.createElement)("span", { className: Header_module_css_default.segLabel }, t("sortByLabel")), (0, react.createElement)("div", {
				className: Header_module_css_default.segGroup,
				role: "radiogroup",
				"aria-label": t("sortAria")
			}, SORTS.map((key) => SegBtn$1({
				active: sort === key,
				onClick: () => toggleSort(key),
				label: t(key),
				icon: sort === key ? (0, react.createElement)(SortArrowIcon, { up: sortDir === "asc" }) : null
			}))))));
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/List.module.css.mjs
		const css$9 = "._3XaZHa_body{flex-direction:column;flex:1;min-height:0;display:flex}._3XaZHa_list{flex-direction:column;flex:1;gap:6px;min-height:0;padding:2px 4px 4px 2px;display:flex;overflow-y:auto}._3XaZHa_moreSentinel{flex-shrink:0;height:1px}._3XaZHa_card{border:1px solid var(--hub-border-2);background:var(--hub-bg-1);border-radius:8px;justify-content:space-between;align-items:stretch;gap:12px;padding:9px 12px;transition:border-color .12s,background .12s;display:flex}._3XaZHa_card:hover{border-color:var(--hub-brand);background:var(--hub-bg-2)}._3XaZHa_cardMain{flex-direction:column;gap:4px;min-width:0;display:flex}._3XaZHa_cardHead{align-items:center;gap:6px;min-width:0;display:flex}._3XaZHa_cardTitle{white-space:nowrap;text-overflow:ellipsis;font-size:13px;font-weight:600;line-height:18px;overflow:hidden}._3XaZHa_categoryBadge,._3XaZHa_verified,._3XaZHa_versionBadge,._3XaZHa_updateBadge{border:1px solid #0000;border-radius:4px;flex-shrink:0;padding:0 6px;font-size:10px;line-height:16px}._3XaZHa_categoryBadge{color:var(--hub-brand);border-color:var(--hub-border-ghost)}._3XaZHa_verified{color:var(--hub-success);border-color:var(--hub-success-border)}._3XaZHa_versionBadge{color:var(--hub-text-secondary);border-color:var(--hub-border-input)}._3XaZHa_updateBadge{color:var(--hub-warn);border-color:var(--hub-warn-border);background:var(--hub-warn-tint)}._3XaZHa_desc{color:var(--hub-text-secondary);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0;font-size:12px;line-height:18px;display:-webkit-box;overflow:hidden}._3XaZHa_topics{flex-wrap:wrap;align-items:center;gap:4px;min-width:0;display:flex}._3XaZHa_topic{color:var(--hub-text-tertiary);background:var(--hub-bg-3);white-space:nowrap;border-radius:4px;flex-shrink:0;padding:0 6px;font-size:10px;line-height:16px}._3XaZHa_cardSide{flex-direction:column;flex-shrink:0;justify-content:space-between;align-items:flex-end;gap:6px;display:flex}._3XaZHa_stats{flex-direction:column;align-items:flex-end;gap:1px;display:flex}._3XaZHa_star{color:var(--hub-warn);white-space:nowrap;font-size:11px;line-height:16px}._3XaZHa_fork{color:var(--hub-text-tertiary);white-space:nowrap;font-size:11px;line-height:16px}._3XaZHa_date{color:var(--hub-text-tertiary);white-space:nowrap;font-size:10px;line-height:14px}._3XaZHa_installBtn,._3XaZHa_installBtnCopied,._3XaZHa_installBtnInstalled,._3XaZHa_installBtnUpdate,._3XaZHa_uninstallBtn,._3XaZHa_detailBtn{cursor:pointer;border-radius:6px;padding:2px 10px;font-size:11px;line-height:18px;transition:color .12s,border-color .12s,background .12s}._3XaZHa_installBtnInstalled{color:var(--hub-success);background:var(--hub-success-tint);cursor:default;-webkit-user-select:none;user-select:none;border:none}._3XaZHa_installBtnUpdate{color:#fff;background:var(--hub-warn);-webkit-user-select:none;user-select:none;border:none;font-weight:500}._3XaZHa_installBtnUpdate:hover{background:var(--hub-warn-strong)}._3XaZHa_uninstallBtn{color:var(--hub-danger);background:var(--hub-danger-tint);-webkit-user-select:none;user-select:none;border:none}._3XaZHa_uninstallBtn:hover{color:#fff;background:var(--hub-danger-hover)}body[data-ds-dark-theme] ._3XaZHa_uninstallBtn{color:#fff;background:var(--hub-danger)}body[data-ds-dark-theme] ._3XaZHa_uninstallBtn:hover{background:var(--hub-danger-hover)}._3XaZHa_installBtn{color:var(--hub-text-on-fill);background:var(--hub-btn-fill);-webkit-user-select:none;user-select:none;border:none;font-weight:500}._3XaZHa_installBtn:hover{background:var(--hub-btn-hover)}._3XaZHa_detailBtn{color:var(--hub-text-secondary);-webkit-user-select:none;user-select:none;background:0 0;border:none;align-items:center;text-decoration:none;display:inline-flex}._3XaZHa_detailBtn:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}._3XaZHa_actions{align-items:center;gap:6px;display:flex}._3XaZHa_installBtnCopied{color:var(--hub-success);background:var(--hub-success-tint);-webkit-user-select:none;user-select:none;border:none}._3XaZHa_state{text-align:center;min-height:160px;color:var(--hub-text-tertiary);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:8px;padding:24px;font-size:12px;line-height:18px;display:flex}._3XaZHa_stateTitle{color:var(--hub-text-primary);font-size:13px;font-weight:600}._3XaZHa_stateDesc{max-width:420px}._3XaZHa_retryBtn{color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;padding:4px 12px;font-size:12px;line-height:18px}._3XaZHa_retryBtn:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}._3XaZHa_stateActions{align-items:center;gap:8px;margin-top:4px;display:flex}._3XaZHa_diagBtn{color:#fff;background:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:4px 12px;font-size:12px;line-height:18px}._3XaZHa_diagBtn:hover{background:var(--hub-brand-hover)}._3XaZHa_footer{border-top:1px solid var(--hub-border-1);flex-shrink:0;justify-content:flex-end;align-items:center;gap:8px;padding:6px 4px 0;display:flex}._3XaZHa_footLink{color:var(--hub-brand);white-space:nowrap;-webkit-user-select:none;user-select:none;font-size:11px;line-height:16px;text-decoration:none}._3XaZHa_footLink:hover{text-decoration:underline}";
		const tagId$9 = "dsh-plugin/List.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$9) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$9;
			tag.textContent = css$9;
			document.head.appendChild(tag);
		}
		const cssRegistry$9 = globalThis.__DSH_PLUGIN_CSS__ ??= [];
		if (!cssRegistry$9.some((e) => e.tagId === tagId$9)) cssRegistry$9.push({
			tagId: tagId$9,
			css: css$9
		});
		var List_module_css_default = {
			"cardHead": "_3XaZHa_cardHead",
			"verified": "_3XaZHa_verified",
			"stats": "_3XaZHa_stats",
			"fork": "_3XaZHa_fork",
			"installBtnInstalled": "_3XaZHa_installBtnInstalled",
			"detailBtn": "_3XaZHa_detailBtn",
			"actions": "_3XaZHa_actions",
			"state": "_3XaZHa_state",
			"retryBtn": "_3XaZHa_retryBtn",
			"footLink": "_3XaZHa_footLink",
			"footer": "_3XaZHa_footer",
			"topic": "_3XaZHa_topic",
			"categoryBadge": "_3XaZHa_categoryBadge",
			"installBtnUpdate": "_3XaZHa_installBtnUpdate",
			"stateActions": "_3XaZHa_stateActions",
			"moreSentinel": "_3XaZHa_moreSentinel",
			"card": "_3XaZHa_card",
			"cardMain": "_3XaZHa_cardMain",
			"updateBadge": "_3XaZHa_updateBadge",
			"installBtnCopied": "_3XaZHa_installBtnCopied",
			"installBtn": "_3XaZHa_installBtn",
			"list": "_3XaZHa_list",
			"stateTitle": "_3XaZHa_stateTitle",
			"stateDesc": "_3XaZHa_stateDesc",
			"star": "_3XaZHa_star",
			"topics": "_3XaZHa_topics",
			"desc": "_3XaZHa_desc",
			"cardTitle": "_3XaZHa_cardTitle",
			"diagBtn": "_3XaZHa_diagBtn",
			"date": "_3XaZHa_date",
			"uninstallBtn": "_3XaZHa_uninstallBtn",
			"versionBadge": "_3XaZHa_versionBadge",
			"cardSide": "_3XaZHa_cardSide",
			"body": "_3XaZHa_body"
		};
		//#endregion
		//#region src/client/hooks/useIncrementalList.ts
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Incremental list: renders only the first batch of a (potentially huge)
		* result set and appends the next batch whenever the end sentinel scrolls
		* into view, so the plugin market never mounts thousands of cards at once.
		* The items reference is the list identity — category / search / sort
		* changes produce a new array, which resets the window to the first batch.
		*/
		/** 首批渲染条数 & 每次滚到底追加的增量（单卡约 80px 高，100 条已远超一屏） */
		const PAGE_SIZE = 100;
		/** 哨兵进入视口底部前 800px 就提前加载下一批，滚到底时无感知衔接 */
		const PRELOAD_MARGIN = "800px 0px";
		function useIncrementalList(items) {
			const [limit, setLimit] = (0, react.useState)(PAGE_SIZE);
			const sentinelRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				setLimit(PAGE_SIZE);
			}, [items]);
			(0, react.useEffect)(() => {
				const el = sentinelRef.current;
				if (!el || limit >= items.length) return;
				const io = new IntersectionObserver((entries) => {
					for (const entry of entries) if (entry.isIntersecting) setLimit((cur) => Math.min(cur + PAGE_SIZE, items.length));
				}, { rootMargin: PRELOAD_MARGIN });
				io.observe(el);
				return () => io.disconnect();
			}, [items.length, limit]);
			return {
				shown: items.slice(0, limit),
				hasMore: limit < items.length,
				sentinelRef
			};
		}
		//#endregion
		//#region src/client/components/catalog/PluginCard.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* One plugin card in the catalog list: name/category/verified badge,
		* description + topics, star/fork/date stats, and the detail/install/
		* uninstall actions.
		*/
		function PluginCard({ plugin: p, copied, installedName, installedVersion, hasUpdate, t, langKey, langPath, onInstall, onUninstall }) {
			const repo = p.source?.repo ?? "";
			const isCopied = copied === repo;
			const isInstalled = installedName(p) !== null;
			const update = hasUpdate(p);
			const versionShown = isInstalled ? installedVersion(p) : p.version;
			return (0, react.createElement)("div", { className: List_module_css_default.card }, (0, react.createElement)("div", { className: List_module_css_default.cardMain }, (0, react.createElement)("div", { className: List_module_css_default.cardHead }, (0, react.createElement)("div", {
				className: List_module_css_default.cardTitle,
				title: p.description ?? ""
			}, p.displayName ?? p.slug), versionShown ? (0, react.createElement)("span", {
				className: List_module_css_default.versionBadge,
				title: t("version")
			}, versionShown) : null, update ? (0, react.createElement)("span", {
				className: List_module_css_default.updateBadge,
				title: t("updateAvailableHint")
			}, t("updateAvailable")) : null, p.category ? (0, react.createElement)("span", { className: List_module_css_default.categoryBadge }, categoryLabel(CATEGORY_LABELS, p.category, langKey)) : null, p.compatibility?.status === "verified" ? (0, react.createElement)("span", { className: List_module_css_default.verified }, t("verified")) : null), p.description ? (0, react.createElement)("p", { className: List_module_css_default.desc }, p.description) : null, (p.topics?.length ?? 0) > 0 ? (0, react.createElement)("div", { className: List_module_css_default.topics }, p.topics.slice(0, 3).map((topic) => (0, react.createElement)("span", {
				key: topic,
				className: List_module_css_default.topic
			}, topic))) : null), (0, react.createElement)("div", { className: List_module_css_default.cardSide }, (0, react.createElement)("div", { className: List_module_css_default.stats }, (0, react.createElement)("span", { className: List_module_css_default.star }, "★ ", fmtStars(p.stats?.stargazers_count)), (0, react.createElement)("span", { className: List_module_css_default.fork }, t("fork"), " ", fmtStars(p.stats?.forks_count)), (0, react.createElement)("span", { className: List_module_css_default.date }, relTime(p.dates?.repoUpdatedAt, t))), repo ? (0, react.createElement)("div", { className: List_module_css_default.actions }, (0, react.createElement)("a", {
				className: List_module_css_default.detailBtn,
				href: pluginDetailUrl(p, langPath),
				target: "_blank",
				rel: "noopener noreferrer",
				title: p.slug
			}, t("detail")), isInstalled ? update ? (0, react.createElement)("button", {
				className: List_module_css_default.installBtnUpdate,
				title: t("updateAvailableHint"),
				onClick: () => onInstall(p, { update: true })
			}, t("update")) : (0, react.createElement)("button", {
				className: List_module_css_default.installBtnInstalled,
				disabled: true,
				title: t("installed")
			}, t("installed")) : (0, react.createElement)("button", {
				className: isCopied ? List_module_css_default.installBtnCopied : List_module_css_default.installBtn,
				onClick: () => onInstall(p)
			}, t("install")), isInstalled ? (0, react.createElement)("button", {
				className: List_module_css_default.uninstallBtn,
				onClick: () => onUninstall(p)
			}, t("uninstall")) : null) : null));
		}
		//#endregion
		//#region src/client/components/catalog/CatalogList.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Catalog list: the scrollable container with the loading / failed / empty
		* states, the plugin cards, and the count footer. Resets scroll position when
		* the category or install-status filter changes so the replaced content is
		* not mistaken for a no-op update.
		*/
		function CatalogList({ plugins, failed, visible, total, t, langPath, reload, category, copied, installedName, installedVersion, hasUpdate, langKey, onInstall, onUninstall, hasProxy, onOpenDiagnostics }) {
			/** 列表滚动容器：分类/搜索切换后列表内容替换但 scrollTop 保留，会让用户误以为列表没更新，需重置回顶部 */
			const listRef = (0, react.useRef)(null);
			/** 增量渲染：全量目录太大（4400+），只渲染首批，滚动接近底部时自动追加下一批 */
			const { shown, hasMore, sentinelRef } = useIncrementalList(visible);
			(0, react.useEffect)(() => {
				listRef.current?.scrollTo({ top: 0 });
			}, [category]);
			return (0, react.createElement)("div", { className: List_module_css_default.body }, (0, react.createElement)("div", {
				ref: listRef,
				className: List_module_css_default.list
			}, plugins === null && !failed && (0, react.createElement)("div", { className: List_module_css_default.state }, t("loading")), failed && (0, react.createElement)("div", { className: List_module_css_default.state }, (0, react.createElement)("div", { className: List_module_css_default.stateTitle }, t("failed")), (0, react.createElement)("div", { className: List_module_css_default.stateDesc }, t(hasProxy ? "failedDescProxy" : "failedDescNoProxy")), (0, react.createElement)("div", { className: List_module_css_default.stateActions }, (0, react.createElement)("button", {
				className: List_module_css_default.retryBtn,
				onClick: () => reload()
			}, t("retry")), (0, react.createElement)("button", {
				className: List_module_css_default.diagBtn,
				onClick: onOpenDiagnostics
			}, t("failNetworkRunDiag")))), plugins !== null && !failed && visible.length === 0 && (0, react.createElement)("div", { className: List_module_css_default.state }, (0, react.createElement)("div", { className: List_module_css_default.stateTitle }, t("noResult")), (0, react.createElement)("div", { className: List_module_css_default.stateDesc }, t("noResultDesc"))), plugins !== null && !failed && shown.map((p) => (0, react.createElement)(PluginCard, {
				key: p.ownerSlug ? `${p.ownerSlug}/${p.slug}` : p.slug,
				plugin: p,
				copied,
				installedName,
				installedVersion,
				hasUpdate,
				t,
				langKey,
				langPath,
				onInstall,
				onUninstall
			})), hasMore && (0, react.createElement)("div", {
				ref: sentinelRef,
				className: List_module_css_default.moreSentinel,
				"aria-hidden": "true"
			})), plugins !== null && !failed && (0, react.createElement)("div", { className: List_module_css_default.footer }, (0, react.createElement)("a", {
				className: List_module_css_default.footLink,
				href: siteUrl(langPath),
				target: "_blank",
				rel: "noopener noreferrer"
			}, t("browseAll", { n: total }))));
		}
		//#endregion
		//#region src/client/components/views/MarketView.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Market view: the browse experience for the catalog — category tabs,
		* search/sort/install-state controls and the plugin list. Owns nothing;
		* it wires catalog state (query/sort/filter/category) to the small
		* presentational components so PluginHubSection stays free of view internals.
		*/
		function MarketView({ catalog, t, langPath, langKey, copied, resultText, onInstall, onUninstall, hasProxy, onOpenDiagnostics }) {
			return (0, react.createElement)(react.Fragment, null, (0, react.createElement)(CategoryTabs, {
				category: catalog.category,
				setCategory: catalog.setCategory,
				allLabel: t("all"),
				totalCount: catalog.total,
				langKey
			}), (0, react.createElement)(CatalogControls, {
				query: catalog.query,
				setQuery: catalog.setQuery,
				sort: catalog.sort,
				sortDir: catalog.sortDir,
				toggleSort: catalog.toggleSort,
				t,
				resultText
			}), (0, react.createElement)(CatalogList, {
				plugins: catalog.plugins,
				failed: catalog.failed,
				visible: catalog.visible,
				total: catalog.total,
				t,
				langPath,
				reload: catalog.reload,
				category: catalog.category,
				copied,
				installedName: catalog.installedName,
				installedVersion: catalog.installedVersion,
				hasUpdate: catalog.hasUpdate,
				langKey,
				onInstall,
				onUninstall,
				hasProxy,
				onOpenDiagnostics
			}));
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/SectionTabs.module.css.mjs
		const css$8 = "._7tvizq_root{border-bottom:1px solid var(--hub-border-1);flex-shrink:0;align-items:stretch;gap:28px;padding:0 2px;display:flex}._7tvizq_tab,._7tvizq_tabActive{cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;align-items:center;gap:7px;height:38px;padding:0 4px;font-size:14px;line-height:38px;transition:color .12s;display:inline-flex;position:relative}._7tvizq_tab{color:var(--hub-text-secondary)}._7tvizq_tab:hover{color:var(--hub-text-primary)}._7tvizq_tabActive{color:var(--hub-text-primary);font-weight:600}._7tvizq_tabIcon{flex-shrink:0;align-items:center;line-height:1;display:inline-flex}._7tvizq_tabActive:after{content:\"\";background:var(--hub-brand);border-radius:1px;height:2px;position:absolute;bottom:-1px;left:0;right:0}._7tvizq_tabCount,._7tvizq_tabCountActive{text-align:center;border-radius:999px;min-width:18px;padding:0 6px;font-size:11px;line-height:16px}._7tvizq_tabCount{color:var(--hub-text-tertiary);background:var(--hub-bg-btn)}._7tvizq_tabActive ._7tvizq_tabCountActive{color:var(--hub-text-on-fill);background:var(--hub-btn-fill)}._7tvizq_noticeBtn{box-sizing:border-box;height:26px;color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:1px solid #0000;border-radius:6px;flex-shrink:0;align-self:center;align-items:center;gap:5px;margin-left:auto;padding:0 8px;font-size:12px;line-height:24px;transition:color .12s,background .12s;display:inline-flex;position:relative}._7tvizq_noticeBtn:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover);border-color:var(--hub-border-2)}._7tvizq_noticeIcon{align-items:center;line-height:1;display:inline-flex}._7tvizq_noticeCount{text-align:center;color:#fff;background:var(--hub-danger);border-radius:999px;min-width:17px;height:17px;padding:0 5px;font-size:11px;font-weight:600;line-height:17px;box-shadow:0 1px 3px #d1242f59}";
		const tagId$8 = "dsh-plugin/SectionTabs.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$8) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$8;
			tag.textContent = css$8;
			document.head.appendChild(tag);
		}
		const cssRegistry$8 = globalThis.__DSH_PLUGIN_CSS__ ??= [];
		if (!cssRegistry$8.some((e) => e.tagId === tagId$8)) cssRegistry$8.push({
			tagId: tagId$8,
			css: css$8
		});
		var SectionTabs_module_css_default = {
			"tabCountActive": "_7tvizq_tabCountActive",
			"root": "_7tvizq_root",
			"tabCount": "_7tvizq_tabCount",
			"noticeBtn": "_7tvizq_noticeBtn",
			"tab": "_7tvizq_tab",
			"noticeCount": "_7tvizq_noticeCount",
			"noticeIcon": "_7tvizq_noticeIcon",
			"tabActive": "_7tvizq_tabActive",
			"tabIcon": "_7tvizq_tabIcon"
		};
		//#endregion
		//#region src/client/components/layout/SectionTabs.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Primary navigation: a compact segmented control switching between the
		* four top-level sections — Market (browse), Installed (manage), Custom
		* (manual command installs) and Settings (network sources & preferences).
		* Kept visually distinct from the category chips so the hierarchy reads:
		* section → category → plugin.
		*/
		const ORDER = [
			{
				id: "market",
				labelKey: "viewMarket",
				hintKey: "viewMarketHint",
				Icon: MarketIcon
			},
			{
				id: "installed",
				labelKey: "viewInstalled",
				hintKey: "viewInstalledHint",
				Icon: InstalledIcon
			},
			{
				id: "custom",
				labelKey: "viewCustom",
				hintKey: "viewCustomHint",
				Icon: TerminalIcon
			},
			{
				id: "settings",
				labelKey: "viewSettings",
				hintKey: "viewSettingsHint",
				Icon: SettingsIcon
			}
		];
		function SectionTabs({ view, setView, installedCount, t, noticeCount, onOpenNotifications }) {
			return (0, react.createElement)("div", {
				className: SectionTabs_module_css_default.root,
				role: "tablist"
			}, ORDER.map(({ id, labelKey, hintKey, Icon }) => (0, react.createElement)("button", {
				key: id,
				role: "tab",
				"aria-selected": view === id,
				title: t(hintKey),
				className: view === id ? SectionTabs_module_css_default.tabActive : SectionTabs_module_css_default.tab,
				onClick: () => setView(id)
			}, (0, react.createElement)("span", { className: SectionTabs_module_css_default.tabIcon }, (0, react.createElement)(Icon)), t(labelKey), id === "installed" && installedCount > 0 ? (0, react.createElement)("span", { className: view === id ? SectionTabs_module_css_default.tabCountActive : SectionTabs_module_css_default.tabCount }, installedCount) : null)), (0, react.createElement)("button", {
				type: "button",
				className: SectionTabs_module_css_default.noticeBtn,
				onClick: onOpenNotifications,
				title: t("notificationsHint"),
				"aria-label": t("notificationsHint")
			}, (0, react.createElement)("span", { className: SectionTabs_module_css_default.noticeIcon }, (0, react.createElement)(BellIcon)), noticeCount > 0 ? (0, react.createElement)("span", { className: SectionTabs_module_css_default.noticeCount }, noticeCount > 99 ? "99+" : String(noticeCount)) : null));
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/InstalledView.module.css.mjs
		const css$7 = "._1nXeGW_root{flex-direction:column;gap:8px;min-width:0;display:flex}._1nXeGW_toolbar{border-bottom:1px solid var(--hub-border-1);flex-direction:column;flex-shrink:0;gap:8px;padding:0 2px 10px;display:flex}._1nXeGW_searchWrap{width:100%;min-width:0;height:28px}._1nXeGW_searchInput{width:100%;height:28px;color:var(--hub-text-primary);border:1px solid var(--hub-border-2);background:0 0;border-radius:6px;outline:none;padding:0 9px;font-size:12px;line-height:26px;transition:border-color .12s}._1nXeGW_searchInput::placeholder{color:var(--hub-text-tertiary)}._1nXeGW_searchInput:focus{border-color:var(--hub-brand)}._1nXeGW_segRow{align-items:center;gap:8px;min-width:0;display:flex}._1nXeGW_segLabel{color:var(--hub-text-tertiary);flex-shrink:0;font-size:11px;line-height:16px}._1nXeGW_segGroup{border:1px solid var(--hub-border-2);border-radius:6px;flex-shrink:0;align-items:center;display:inline-flex;overflow:hidden}._1nXeGW_segBtn{height:24px;color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;white-space:nowrap;background:0 0;border:none;justify-content:center;align-items:center;gap:4px;padding:0 10px;font-family:inherit;font-size:12px;line-height:24px;transition:color .12s,background .12s;display:inline-flex}._1nXeGW_segBtn svg{flex-shrink:0;display:block}._1nXeGW_segBtn+._1nXeGW_segBtn{border-left:1px solid var(--hub-border-2)}._1nXeGW_segBtn:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}._1nXeGW_segBtnActive,._1nXeGW_segBtnActive:hover{color:#fff;background:var(--hub-brand)}._1nXeGW_empty{color:var(--hub-text-tertiary);text-align:center;border:1px dashed var(--hub-border-2);border-radius:8px;flex-direction:column;align-items:center;gap:4px;padding:36px 12px;font-size:12px;line-height:18px;display:flex}._1nXeGW_emptyTitle{color:var(--hub-text-secondary);font-size:13px;font-weight:600}._1nXeGW_emptyDesc{color:var(--hub-text-tertiary)}._1nXeGW_list{border:1px solid var(--hub-border-1);border-radius:8px;flex-direction:column;margin:0;padding:0;list-style:none;display:flex;overflow:hidden}._1nXeGW_row{background:var(--hub-bg-1);cursor:pointer;-webkit-user-select:none;user-select:none;flex-direction:column;gap:4px;padding:8px 10px;transition:background .12s;display:flex}._1nXeGW_row+._1nXeGW_row{border-top:1px solid var(--hub-border-1)}._1nXeGW_row:hover{background:var(--hub-bg-2)}._1nXeGW_rowTitleLine{align-items:center;gap:8px;min-width:0;display:flex}._1nXeGW_rowDesc{color:var(--hub-text-tertiary);white-space:nowrap;text-overflow:ellipsis;min-width:0;padding-left:16px;font-size:11px;line-height:16px;overflow:hidden}._1nXeGW_statusDot{background:var(--hub-success);border-radius:50%;flex-shrink:0;width:8px;height:8px}._1nXeGW_statusDot._1nXeGW_statusPending{background:var(--hub-warning)}._1nXeGW_statusDot._1nXeGW_statusInactive{background:var(--hub-text-tertiary)}._1nXeGW_rowMain{flex:auto;align-items:baseline;gap:6px;min-width:0;display:flex}._1nXeGW_rowTitle{color:var(--hub-text-primary);white-space:nowrap;text-overflow:ellipsis;min-width:0;font-size:12px;font-weight:600;line-height:18px;overflow:hidden}._1nXeGW_versionBadge{color:var(--hub-text-tertiary);background:var(--hub-bg-hover);border-radius:4px;flex-shrink:0;padding:0 5px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:16px}._1nXeGW_updateBadge{color:var(--hub-warn);background:var(--hub-warn-tint);border:1px solid var(--hub-warn-border);border-radius:4px;flex-shrink:0;padding:0 5px;font-size:11px;font-weight:500;line-height:16px}._1nXeGW_rowSourceTag{box-sizing:border-box;text-align:center;white-space:nowrap;text-overflow:ellipsis;border-radius:4px;flex-shrink:0;width:60px;padding:0 4px;font-size:11px;font-weight:500;line-height:16px;overflow:hidden}._1nXeGW_rowSourceTagHub{color:var(--hub-brand);background:var(--hub-brand-tint);border:1px solid var(--hub-brand-border-soft)}._1nXeGW_rowSourceTagManual{color:var(--hub-warning);background:var(--hub-warning-tint);border:1px solid var(--hub-warning-border)}._1nXeGW_exampleBadge{color:var(--hub-brand);background:var(--hub-brand-tint);border:1px solid var(--hub-brand-border-soft);border-radius:4px;flex-shrink:0;padding:0 5px;font-size:11px;font-weight:500;line-height:16px}._1nXeGW_exampleRow{align-items:center;min-width:0;padding-left:16px;display:flex}._1nXeGW_rowMeta{align-items:center;gap:8px;min-width:0;padding-left:16px;display:flex;overflow:hidden}._1nXeGW_rowRepo{color:var(--hub-text-tertiary);white-space:nowrap;text-overflow:ellipsis;min-width:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:16px;overflow:hidden}._1nXeGW_rowCategory{color:var(--hub-text-tertiary);background:var(--hub-bg-hover);border-radius:4px;flex-shrink:0;padding:0 6px;font-size:11px;line-height:16px}._1nXeGW_rowActions{flex-shrink:0;align-items:center;gap:4px;display:flex}._1nXeGW_rowDetail{color:var(--hub-text-secondary);border:1px solid var(--hub-border-2);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;padding:2px 10px;font-family:inherit;font-size:12px;line-height:18px;transition:color .12s,background .12s,border-color .12s}._1nXeGW_rowDetail:hover{color:var(--hub-text-primary);border-color:var(--hub-border-ghost);background:var(--hub-bg-hover)}._1nXeGW_rowRestart{color:var(--hub-warning);background:var(--hub-warning-tint);border:1px solid var(--hub-warning-border);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;padding:2px 10px;font-family:inherit;font-size:12px;font-weight:500;line-height:18px;transition:color .12s,background .12s,border-color .12s}._1nXeGW_rowRestart:hover{color:#fff;background:var(--hub-warning);border-color:var(--hub-warning)}._1nXeGW_rowUpdate{color:#fff;background:var(--hub-warn);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:3px 10px;font-family:inherit;font-size:12px;font-weight:500;line-height:18px;transition:background .12s}._1nXeGW_rowUpdate:hover{background:var(--hub-warn-strong)}._1nXeGW_rowUninstall{color:var(--hub-danger);border:1px solid var(--hub-danger-border-soft);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;padding:2px 10px;font-family:inherit;font-size:12px;line-height:18px;transition:color .12s,background .12s,border-color .12s}._1nXeGW_rowUninstall:hover,body[data-ds-dark-theme] ._1nXeGW_rowUninstall{color:#fff;background:var(--hub-danger);border-color:var(--hub-danger)}body[data-ds-dark-theme] ._1nXeGW_rowUninstall:hover{background:var(--hub-danger-hover);border-color:var(--hub-danger-hover)}";
		const tagId$7 = "dsh-plugin/InstalledView.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$7) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$7;
			tag.textContent = css$7;
			document.head.appendChild(tag);
		}
		const cssRegistry$7 = globalThis.__DSH_PLUGIN_CSS__ ??= [];
		if (!cssRegistry$7.some((e) => e.tagId === tagId$7)) cssRegistry$7.push({
			tagId: tagId$7,
			css: css$7
		});
		var InstalledView_module_css_default = {
			"emptyDesc": "_1nXeGW_emptyDesc",
			"versionBadge": "_1nXeGW_versionBadge",
			"rowSourceTagHub": "_1nXeGW_rowSourceTagHub",
			"rowCategory": "_1nXeGW_rowCategory",
			"rowDetail": "_1nXeGW_rowDetail",
			"rowUpdate": "_1nXeGW_rowUpdate",
			"list": "_1nXeGW_list",
			"statusPending": "_1nXeGW_statusPending",
			"updateBadge": "_1nXeGW_updateBadge",
			"statusDot": "_1nXeGW_statusDot",
			"rowMain": "_1nXeGW_rowMain",
			"rowMeta": "_1nXeGW_rowMeta",
			"rowRestart": "_1nXeGW_rowRestart",
			"toolbar": "_1nXeGW_toolbar",
			"rowTitleLine": "_1nXeGW_rowTitleLine",
			"rowActions": "_1nXeGW_rowActions",
			"searchWrap": "_1nXeGW_searchWrap",
			"exampleRow": "_1nXeGW_exampleRow",
			"rowRepo": "_1nXeGW_rowRepo",
			"segLabel": "_1nXeGW_segLabel",
			"root": "_1nXeGW_root",
			"segBtn": "_1nXeGW_segBtn",
			"rowTitle": "_1nXeGW_rowTitle",
			"rowSourceTag": "_1nXeGW_rowSourceTag",
			"rowSourceTagManual": "_1nXeGW_rowSourceTagManual",
			"exampleBadge": "_1nXeGW_exampleBadge",
			"rowUninstall": "_1nXeGW_rowUninstall",
			"emptyTitle": "_1nXeGW_emptyTitle",
			"segRow": "_1nXeGW_segRow",
			"empty": "_1nXeGW_empty",
			"statusInactive": "_1nXeGW_statusInactive",
			"segGroup": "_1nXeGW_segGroup",
			"row": "_1nXeGW_row",
			"rowDesc": "_1nXeGW_rowDesc",
			"searchInput": "_1nXeGW_searchInput",
			"segBtnActive": "_1nXeGW_segBtnActive"
		};
		//#endregion
		//#region src/client/components/views/InstalledView.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Installed view: manages the plugins installed into the current profile.
		* Follows the mainstream extension-manager pattern (VSCode Installed tab) —
		* a searchable, sortable list of installed entries that mixes catalog
		* plugins (full metadata) and custom command installs (outside the catalog,
		* only runtime info, tagged with a custom badge). The toolbar carries a
		* search box plus two segmented radio-button groups: source filter
		* (all / catalog / custom) and sort (name / recently installed / stars / forks).
		* Each row carries restart (when pending), update and uninstall actions
		* and opens a detail modal with the full install metadata.
		*
		* Pure presentational: owns only local search/sort state; the InstalledItem
		* model arrives from the catalog hook and actions bubble up via callbacks.
		*/
		const INSTALLED_SORTS = [
			"sortName",
			"sortInstalledAt",
			"sortStars",
			"sortForks"
		];
		/** 各排序的默认方向：名称按字母正序，最近安装 / Star / Fork 按数值倒序 */
		const SORT_DEFAULT_DIR = {
			sortName: "asc",
			sortInstalledAt: "desc",
			sortStars: "desc",
			sortForks: "desc"
		};
		/** 单选按钮组中的一个按钮（segmented control，与排序/来源筛选共用）；
		可带尾随图标（排序按钮激活时显示当前方向箭头） */
		function SegBtn({ active, onClick, label, icon }) {
			return (0, react.createElement)("button", {
				type: "button",
				className: active ? `${InstalledView_module_css_default.segBtn} ${InstalledView_module_css_default.segBtnActive}` : InstalledView_module_css_default.segBtn,
				"aria-pressed": active,
				onClick
			}, label, icon);
		}
		function InstalledRow({ item, t, langKey, canReveal, revealLabel, onOpenDetail, onReveal, onUpdate, onUninstall, onRestart }) {
			const name = item.plugin?.displayName ?? item.name;
			const repo = item.repo;
			const category = item.plugin?.category;
			const desc = item.plugin?.description;
			const isCustom = item.plugin === null;
			return (0, react.createElement)("li", {
				className: InstalledView_module_css_default.row,
				onClick: () => onOpenDetail(item),
				role: "button",
				tabIndex: 0,
				title: t("detail"),
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onOpenDetail(item);
					}
				}
			}, (0, react.createElement)("div", { className: InstalledView_module_css_default.rowTitleLine }, (0, react.createElement)("span", {
				className: item.loaded ? InstalledView_module_css_default.statusDot : item.dshCapable ? `${InstalledView_module_css_default.statusDot} ${InstalledView_module_css_default.statusPending}` : `${InstalledView_module_css_default.statusDot} ${InstalledView_module_css_default.statusInactive}`,
				title: item.loaded ? t("statusRunning") : item.dshCapable ? t("statusPending") : t("exampleHint"),
				"aria-label": item.loaded ? t("statusRunning") : item.dshCapable ? t("statusPending") : t("exampleHint")
			}), (0, react.createElement)("div", { className: InstalledView_module_css_default.rowMain }, (0, react.createElement)("span", { className: InstalledView_module_css_default.rowTitle }, name), item.installedVersion ? (0, react.createElement)("span", {
				className: InstalledView_module_css_default.versionBadge,
				title: t("installedVersionLabel")
			}, item.installedVersion) : null, item.hasUpdate ? (0, react.createElement)("span", {
				className: InstalledView_module_css_default.updateBadge,
				title: t("updateAvailableHint")
			}, t("updateAvailable")) : null), (0, react.createElement)("span", {
				className: isCustom ? `${InstalledView_module_css_default.rowSourceTag} ${InstalledView_module_css_default.rowSourceTagManual}` : `${InstalledView_module_css_default.rowSourceTag} ${InstalledView_module_css_default.rowSourceTagHub}`,
				title: isCustom ? t("manualInstallHint") : t("hubInstallHint")
			}, isCustom ? t("manualInstall") : t("hubInstall")), (0, react.createElement)("div", { className: InstalledView_module_css_default.rowActions }, !item.loaded && item.dshCapable ? (0, react.createElement)("button", {
				className: InstalledView_module_css_default.rowRestart,
				type: "button",
				title: t("restartPendingHint"),
				onClick: (e) => {
					e.stopPropagation();
					onRestart();
				}
			}, t("restart")) : null, canReveal ? (0, react.createElement)("button", {
				className: InstalledView_module_css_default.rowDetail,
				type: "button",
				onClick: (e) => {
					e.stopPropagation();
					onReveal(item);
				}
			}, revealLabel) : null, item.hasUpdate && item.plugin ? (0, react.createElement)("button", {
				className: InstalledView_module_css_default.rowUpdate,
				type: "button",
				title: t("updateAvailableHint"),
				onClick: (e) => {
					e.stopPropagation();
					onUpdate(item);
				}
			}, t("update")) : null, (0, react.createElement)("button", {
				className: InstalledView_module_css_default.rowUninstall,
				type: "button",
				onClick: (e) => {
					e.stopPropagation();
					onUninstall(item);
				}
			}, t("uninstall")))), !item.dshCapable ? (0, react.createElement)("div", { className: InstalledView_module_css_default.exampleRow }, (0, react.createElement)("span", {
				className: InstalledView_module_css_default.exampleBadge,
				title: t("exampleHint")
			}, t("exampleLabel"))) : null, repo || category ? (0, react.createElement)("div", { className: InstalledView_module_css_default.rowMeta }, item.repo ? (0, react.createElement)("span", { className: InstalledView_module_css_default.rowRepo }, item.repo) : null, category ? (0, react.createElement)("span", { className: InstalledView_module_css_default.rowCategory }, categoryLabel(CATEGORY_LABELS, category, langKey)) : null) : null, desc ? (0, react.createElement)("div", {
				className: InstalledView_module_css_default.rowDesc,
				title: desc
			}, desc) : null);
		}
		/** 行列表：单个已安装列表（自定义安装与目录插件混排，靠徽标区分）。 */
		function RowList({ items, t, langKey, canReveal, revealLabel, onOpenDetail, onReveal, onUpdate, onUninstall, onRestart }) {
			return (0, react.createElement)("ul", { className: InstalledView_module_css_default.list }, items.map((item) => (0, react.createElement)(InstalledRow, {
				key: item.name,
				item,
				t,
				langKey,
				canReveal,
				revealLabel,
				onOpenDetail,
				onReveal,
				onUpdate,
				onUninstall,
				onRestart
			})));
		}
		function InstalledView({ items, t, langKey, platform, onOpenDetail, onReveal, onUpdate, onUninstall, onRestart }) {
			const [query, setQuery] = (0, react.useState)("");
			/** 默认按「最近安装」排序（最新在前）；点其他排序按钮用该排序的默认方向（Star/Fork 最多在前、名称正序） */
			const [sort, setSort] = (0, react.useState)("sortInstalledAt");
			/** 当前排序方向：点同一个排序按钮切换 正/倒序；点新排序用该排序的默认方向 */
			const [sortDir, setSortDir] = (0, react.useState)("desc");
			/** 已安装列表的来源筛选：全部 / 目录收录 / 自定义安装（单选按钮组） */
			const [sourceFilter, setSourceFilter] = (0, react.useState)("all");
			/** 点击排序按钮：同一按钮切换正/倒序，新按钮用默认方向 */
			function pickSort(key) {
				if (key === sort) setSortDir((d) => d === "asc" ? "desc" : "asc");
				else {
					setSort(key);
					setSortDir(SORT_DEFAULT_DIR[key]);
				}
			}
			const list = (0, react.useMemo)(() => {
				const q = query.trim().toLowerCase();
				const filtered = items.filter((item) => {
					if (!q) return true;
					return (item.plugin?.displayName ?? item.name).toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || (item.repo ?? "").toLowerCase().includes(q) || (item.plugin?.description ?? "").toLowerCase().includes(q);
				});
				const dir = sortDir === "asc" ? 1 : -1;
				return [...filtered].sort((a, b) => {
					if (sort === "sortName") return (a.plugin?.displayName ?? a.name).localeCompare(b.plugin?.displayName ?? b.name) * dir;
					if (sort === "sortStars" || sort === "sortForks") {
						const metric = sort === "sortStars" ? "stargazers_count" : "forks_count";
						const sa = a.plugin?.stats?.[metric];
						const sb = b.plugin?.stats?.[metric];
						if (sa == null && sb == null) return 0;
						if (sa == null) return 1;
						if (sb == null) return -1;
						return (sa - sb) * dir;
					}
					const av = a.installedAt ?? "";
					const bv = b.installedAt ?? "";
					if (av === bv) return 0;
					if (av === "") return 1;
					if (bv === "") return -1;
					return av.localeCompare(bv) * dir;
				});
			}, [
				items,
				query,
				sort,
				sortDir
			]);
			const catalogItems = list.filter((item) => item.plugin !== null);
			const customItems = list.filter((item) => item.plugin === null);
			const filtered = sourceFilter === "all" ? list : sourceFilter === "catalog" ? catalogItems : customItems;
			const rowListProps = {
				t,
				langKey,
				canReveal: platform === "darwin" || platform === "win32" || platform === "linux",
				revealLabel: platform === "darwin" ? t("revealFolder") : t("openFolder"),
				onOpenDetail,
				onReveal,
				onUpdate,
				onUninstall,
				onRestart
			};
			const listToolbar = (0, react.createElement)("div", { className: InstalledView_module_css_default.toolbar }, (0, react.createElement)("div", { className: InstalledView_module_css_default.searchWrap }, (0, react.createElement)("input", {
				className: InstalledView_module_css_default.searchInput,
				type: "search",
				placeholder: t("installedSearch"),
				value: query,
				spellCheck: false,
				onInput: (e) => setQuery(e.target.value)
			})), (0, react.createElement)("div", { className: InstalledView_module_css_default.segRow }, (0, react.createElement)("span", { className: InstalledView_module_css_default.segLabel }, t("filterByLabel")), (0, react.createElement)("div", {
				className: InstalledView_module_css_default.segGroup,
				role: "radiogroup",
				"aria-label": t("filterByLabel")
			}, SegBtn({
				active: sourceFilter === "all",
				onClick: () => setSourceFilter("all"),
				label: t("all")
			}), SegBtn({
				active: sourceFilter === "catalog",
				onClick: () => setSourceFilter("catalog"),
				label: t("installedFilterCatalog")
			}), SegBtn({
				active: sourceFilter === "custom",
				onClick: () => setSourceFilter("custom"),
				label: t("customLabel")
			})), (0, react.createElement)("span", { className: InstalledView_module_css_default.segLabel }, t("sortByLabel")), (0, react.createElement)("div", {
				className: InstalledView_module_css_default.segGroup,
				role: "radiogroup",
				"aria-label": t("sortAria")
			}, INSTALLED_SORTS.map((key) => SegBtn({
				active: sort === key,
				onClick: () => pickSort(key),
				label: t(key),
				icon: sort === key ? (0, react.createElement)(SortArrowIcon, { up: sortDir === "asc" }) : null
			})))));
			return (0, react.createElement)("div", { className: InstalledView_module_css_default.root }, listToolbar, filtered.length === 0 ? items.length === 0 ? (0, react.createElement)("div", { className: InstalledView_module_css_default.empty }, (0, react.createElement)("div", { className: InstalledView_module_css_default.emptyTitle }, t("installedEmpty")), (0, react.createElement)("div", { className: InstalledView_module_css_default.emptyDesc }, t("installedEmptyDesc"))) : (0, react.createElement)("div", { className: InstalledView_module_css_default.empty }, (0, react.createElement)("div", { className: InstalledView_module_css_default.emptyTitle }, t("noResult")), (0, react.createElement)("div", { className: InstalledView_module_css_default.emptyDesc }, t("noResultDesc"))) : (0, react.createElement)(RowList, {
				items: filtered,
				...rowListProps
			}));
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/CustomInstallView.module.css.mjs
		const css$6 = ".zISxCG_root{flex-direction:column;gap:10px;min-width:0;max-width:560px;display:flex}.zISxCG_desc{color:var(--hub-text-tertiary);margin:0;font-size:12px;line-height:18px}.zISxCG_installCards{flex-direction:column;flex-shrink:0;gap:10px;min-width:0;display:flex}.zISxCG_installCard{background:var(--hub-bg-1);border:1px solid var(--hub-border-1);border-radius:8px;flex-direction:column;gap:8px;min-width:0;padding:10px 12px;display:flex}.zISxCG_installCardHead{align-items:center;min-width:0;display:flex}.zISxCG_installLabel{color:var(--hub-text-primary);font-size:12px;font-weight:600;line-height:18px}.zISxCG_installHelpBtn{width:18px;height:18px;color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:1px solid #0000;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;margin-left:6px;padding:0;transition:color .12s,background .12s,border-color .12s;display:inline-flex}.zISxCG_installHelpBtn:hover{color:var(--hub-brand);background:var(--hub-brand-tint);border-color:var(--hub-brand-border-soft)}.zISxCG_installInsertBtn{color:var(--hub-text-secondary);border:1px solid var(--hub-border-2);cursor:pointer;white-space:nowrap;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;flex-shrink:0;margin-left:auto;padding:2px 9px;font-family:inherit;font-size:11px;font-weight:500;line-height:16px;transition:color .12s,border-color .12s,background .12s}.zISxCG_installInsertBtn:hover{color:var(--hub-brand);border-color:var(--hub-brand-border-soft);background:var(--hub-brand-tint)}.zISxCG_installExample{color:var(--hub-text-tertiary);white-space:nowrap;text-overflow:ellipsis;min-width:0;font-size:11px;line-height:16px;overflow:hidden}.zISxCG_installRow{align-items:center;gap:8px;min-width:0;display:flex}.zISxCG_installInput{min-width:0;height:28px;color:var(--hub-text-primary);border:1px solid var(--hub-border-2);background:0 0;border-radius:6px;outline:none;flex:auto;padding:0 9px;font-size:12px;line-height:26px;transition:border-color .12s}.zISxCG_installInput::placeholder{color:var(--hub-text-tertiary)}.zISxCG_installInput:focus{border-color:var(--hub-brand)}.zISxCG_installInputError,.zISxCG_installInputError:focus{border-color:var(--hub-danger-text)}.zISxCG_installBtn{color:#fff;background:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;flex-shrink:0;padding:5px 14px;font-family:inherit;font-size:12px;font-weight:500;line-height:18px;transition:background .12s,opacity .12s}.zISxCG_installBtn:hover{background:var(--hub-brand-hover)}.zISxCG_installBtn:disabled{opacity:.45;cursor:default}.zISxCG_installCardDisabled{opacity:.8}.zISxCG_channelOff{min-width:0;color:var(--hub-warn);background:var(--hub-warn-tint);border:1px solid var(--hub-warn-border);border-radius:6px;justify-content:space-between;align-items:center;gap:8px;padding:6px 9px;font-size:12px;line-height:16px;display:flex}.zISxCG_channelOffText{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.zISxCG_channelOffBtn{color:var(--hub-warn-strong);border:1px solid var(--hub-warn-border);cursor:pointer;white-space:nowrap;background:0 0;border-radius:6px;flex-shrink:0;padding:3px 10px;font-family:inherit;font-size:12px;font-weight:500;line-height:18px;transition:background .12s,color .12s}.zISxCG_channelOffBtn:hover{background:var(--hub-warn-tint);color:var(--hub-warn)}.zISxCG_installError{color:var(--hub-danger-text);background:var(--hub-danger-tint);border:1px solid var(--hub-danger-border);border-radius:6px;padding:5px 8px;font-size:12px;line-height:16px}.zISxCG_helpBody{flex-direction:column;gap:7px;padding:4px 2px;display:flex}.zISxCG_helpLine{align-items:baseline;gap:12px;min-width:0;font-size:12px;line-height:20px;display:flex}.zISxCG_helpCmd{color:var(--hub-text-primary);white-space:nowrap;flex-shrink:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}.zISxCG_helpNote{min-width:0;color:var(--hub-text-tertiary);font-size:11px}";
		const tagId$6 = "dsh-plugin/CustomInstallView.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$6) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$6;
			tag.textContent = css$6;
			document.head.appendChild(tag);
		}
		const cssRegistry$6 = globalThis.__DSH_PLUGIN_CSS__ ??= [];
		if (!cssRegistry$6.some((e) => e.tagId === tagId$6)) cssRegistry$6.push({
			tagId: tagId$6,
			css: css$6
		});
		var CustomInstallView_module_css_default = {
			"installInputError": "zISxCG_installInputError",
			"installHelpBtn": "zISxCG_installHelpBtn",
			"desc": "zISxCG_desc",
			"installInput": "zISxCG_installInput",
			"installCardDisabled": "zISxCG_installCardDisabled",
			"channelOffBtn": "zISxCG_channelOffBtn",
			"installCardHead": "zISxCG_installCardHead",
			"installCards": "zISxCG_installCards",
			"installExample": "zISxCG_installExample",
			"helpCmd": "zISxCG_helpCmd",
			"installError": "zISxCG_installError",
			"root": "zISxCG_root",
			"installBtn": "zISxCG_installBtn",
			"channelOff": "zISxCG_channelOff",
			"installRow": "zISxCG_installRow",
			"installCard": "zISxCG_installCard",
			"installLabel": "zISxCG_installLabel",
			"channelOffText": "zISxCG_channelOffText",
			"helpLine": "zISxCG_helpLine",
			"helpNote": "zISxCG_helpNote",
			"installInsertBtn": "zISxCG_installInsertBtn",
			"helpBody": "zISxCG_helpBody"
		};
		//#endregion
		//#region src/client/components/views/CustomInstallView.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Custom install view: a standalone top-level section for manually
		* installing npm packages or GitHub sources outside the catalog. Three
		* installer cards, one per channel — npm package (bare name or a full
		* npm/pnpm install command, including the official global `npm install -g`),
		* GitHub source and the official `dsh plugin ... add <target>` command —
		* each with a placeholder example above the input and its own format check.
		* The cards stay separate so a user never has to guess which format goes
		* where. Finished installs surface in the Installed view, marked as custom.
		*
		* Pure presentational: owns only the three local input/error states; the
		* actual install (custom source, gated by the security toggles) bubbles up
		* via onInstallCustom.
		*/
		/** GitHub 地址（带前缀形态）：github:、https://github.com/、git+https://github.com/、git@github.com: */
		const GITHUB_URL_RE = /^(?:github:|https?:\/\/github\.com\/|git\+https?:\/\/github\.com\/|git@github\.com:)([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?$/;
		/** 裸 owner/repo（npm 包名只有 @scope/pkg 才带斜杠，无 @ 前缀的 a/b 一定是 GitHub 仓库） */
		const GITHUB_BARE_RE = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/;
		/** npm 包名（含 @scope/pkg） */
		const NPM_PACKAGE_RE = /^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/;
		/** DSH 命令行前缀（官方唯一形式 `dsh plugin --profile <name> <add|update> <target>`）—— 提取其中的动作与目标。
		* 官方 CLI（apps/cli/src/args.ts，commander）：--profile 为必填长选项（无 -p 简写，省略即报错），
		* 支持 `--profile=<name>` 等号形式；命令大小写不敏感。update = 已安装目标覆盖更新到最新；
		* remove 不走这里（卸载由「已安装」列表的卸载按钮执行，命令框不认卸载动词）。
		* 与 server 端 installTargetOf 口径一致。 */
		const DSH_PLUGIN_CMD_RE = /^dsh\s+plugin\s+--profile(?:\s+|=)\S+\s+(add|update)\s+(.+)$/i;
		/** npm 全局安装命令（官方 README 格式，如 `npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui`）——
		* 提取 -g 之后的包列表；任一包名非法返回 null（交给格式错误提示）。与 server 端 globalNpmPackagesOf 口径一致。 */
		const NPM_GLOBAL_CMD_RE = /^npm\s+(?:install|i)\s+(?:-g|--global)\s+(.+)$/i;
		/** 常规 npm/pnpm 安装命令（装进当前 profile，如 `npm install lodash`、`pnpm add @scope/pkg`）——
		* 提取命令后的包列表；包列表在 splitPackages 里逐个校验。 */
		const NPM_INSTALL_CMD_RE = /^(?:npm\s+(?:install|i)|pnpm\s+(?:add|i|install))\s+(.+)$/i;
		/** 解析 DSH 命令：返回 { action, target }；非官方命令返回 null（交给格式错误提示）。 */
		function parseDshCommand(raw) {
			const input = raw.trim();
			const match = DSH_PLUGIN_CMD_RE.exec(input);
			if (match === null) return null;
			return {
				action: match[1].toLowerCase(),
				target: match[2].trim()
			};
		}
		/** 空格分隔的包列表：逐个按 npm 包名语法校验 + 拒绝以 - 开头的 token（npm 会把 --xxx 当参数而非包名），
		* 任一非法返回 null（交给格式错误提示）。与 server 端 globalNpmPackagesOf 同口径。 */
		function splitPackages(raw) {
			const packages = raw.trim().split(/\s+/).filter((p) => p !== "");
			if (packages.length === 0 || packages.some((p) => !NPM_PACKAGE_RE.test(p) || p.startsWith("-"))) return null;
			return packages;
		}
		function parseNpmInput(raw) {
			const input = raw.trim();
			if (NPM_PACKAGE_RE.test(input)) return {
				kind: "pkg",
				target: input
			};
			const global = NPM_GLOBAL_CMD_RE.exec(input);
			if (global !== null) {
				const pkgs = splitPackages(global[1]);
				if (pkgs !== null) return {
					kind: "global",
					pkgs
				};
				return null;
			}
			const install = NPM_INSTALL_CMD_RE.exec(input);
			if (install !== null) {
				const pkgs = splitPackages(install[1]);
				if (pkgs !== null && pkgs.length === 1) return {
					kind: "pkg",
					target: pkgs[0]
				};
				return null;
			}
			return null;
		}
		function isGitHubInput(raw) {
			const input = raw.trim();
			return GITHUB_URL_RE.test(input) || GITHUB_BARE_RE.test(input);
		}
		/** 卡片标题旁的「帮助」弹窗：三块卡片各自的标题与格式清单语言包 key。 */
		const HELP_CARDS = {
			npm: {
				titleKey: "npmInstallLabel",
				contentKey: "npmInstallHelp"
			},
			git: {
				titleKey: "gitInstallLabel",
				contentKey: "gitInstallHelp"
			},
			cmd: {
				titleKey: "dshCmdLabel",
				contentKey: "dshCmdHelp"
			}
		};
		function CustomInstallView({ t, onInstallCustom, enableNpm, enableGit, enableDsh, onOpenSettings, profile }) {
			/** 自定义安装：NPM 包输入与格式错误（'' = 无错误） */
			const [npmQuery, setNpmQuery] = (0, react.useState)("");
			const [npmError, setNpmError] = (0, react.useState)("");
			/** 自定义安装：GitHub 源码输入与格式错误（'' = 无错误） */
			const [gitQuery, setGitQuery] = (0, react.useState)("");
			const [gitError, setGitError] = (0, react.useState)("");
			/** 自定义安装：DSH 命令输入与格式错误（'' = 无错误） */
			const [cmdQuery, setCmdQuery] = (0, react.useState)("");
			const [cmdError, setCmdError] = (0, react.useState)("");
			/** 卡片标题旁「帮助」弹窗：null = 未打开；'npm' | 'git' | 'cmd' = 打开对应卡片的格式清单 */
			const [helpFor, setHelpFor] = (0, react.useState)(null);
			/** 通道关闭提示行：开关关掉后替代示例与输入行，引导去设置打开 */
			const channelOffRow = (0, react.createElement)("div", { className: CustomInstallView_module_css_default.channelOff }, (0, react.createElement)("span", { className: CustomInstallView_module_css_default.channelOffText }, t("channelDisabledHint")), (0, react.createElement)("button", {
				type: "button",
				className: CustomInstallView_module_css_default.channelOffBtn,
				onClick: onOpenSettings
			}, t("goToSettings")));
			const submitNpm = () => {
				const raw = npmQuery.trim();
				if (!raw) return;
				const parsed = parseNpmInput(raw);
				if (parsed === null) {
					setNpmError(t("npmInstallInvalid"));
					return;
				}
				if (parsed.kind === "global") onInstallCustom(raw, {
					installChannel: "npm",
					globalNpm: parsed.pkgs
				});
				else onInstallCustom(parsed.target, { installChannel: "npm" });
				setNpmQuery("");
				setNpmError("");
			};
			const submitGit = () => {
				const target = gitQuery.trim();
				if (!target) return;
				if (!isGitHubInput(target)) {
					setGitError(t("gitInstallInvalid"));
					return;
				}
				onInstallCustom(target, { installChannel: "git" });
				setGitQuery("");
				setGitError("");
			};
			const submitCmd = () => {
				const raw = cmdQuery.trim();
				if (!raw) return;
				const parsed = parseDshCommand(raw);
				if (parsed === null) {
					setCmdError(t("dshCmdInvalid"));
					return;
				}
				onInstallCustom(parsed.target, { installChannel: "dsh" });
				setCmdQuery("");
				setCmdError("");
			};
			/** 一键插入 DSH Plugin Hub 自身的更新命令：按当前 profile 拼官方命令填进输入框，用户确认后提交 */
			const insertHubUpdate = () => {
				setCmdQuery(`dsh plugin --profile ${profile} update dsh-plugin`);
				setCmdError("");
			};
			return (0, react.createElement)("div", { className: CustomInstallView_module_css_default.root }, (0, react.createElement)("p", { className: CustomInstallView_module_css_default.desc }, t("customViewDesc")), (0, react.createElement)("div", { className: CustomInstallView_module_css_default.installCards }, (0, react.createElement)("div", { className: enableNpm ? CustomInstallView_module_css_default.installCard : `${CustomInstallView_module_css_default.installCard} ${CustomInstallView_module_css_default.installCardDisabled}` }, (0, react.createElement)("div", { className: CustomInstallView_module_css_default.installCardHead }, (0, react.createElement)("span", { className: CustomInstallView_module_css_default.installLabel }, t("npmInstallLabel")), (0, react.createElement)("button", {
				type: "button",
				className: CustomInstallView_module_css_default.installHelpBtn,
				title: t("installHelp"),
				"aria-label": t("installHelp"),
				onClick: () => setHelpFor("npm")
			}, (0, react.createElement)(HelpIcon))), !enableNpm ? channelOffRow : [
				(0, react.createElement)("div", { className: CustomInstallView_module_css_default.installExample }, t("npmInstallExample"), (0, react.createElement)("br"), t("npmInstallExample2")),
				(0, react.createElement)("div", { className: CustomInstallView_module_css_default.installRow }, (0, react.createElement)("input", {
					className: npmError ? `${CustomInstallView_module_css_default.installInput} ${CustomInstallView_module_css_default.installInputError}` : CustomInstallView_module_css_default.installInput,
					type: "text",
					placeholder: t("npmInstallPlaceholder"),
					value: npmQuery,
					spellCheck: false,
					onInput: (e) => {
						setNpmQuery(e.target.value);
						setNpmError("");
					},
					onKeyDown: (e) => {
						if (e.key === "Enter") submitNpm();
					}
				}), (0, react.createElement)("button", {
					className: CustomInstallView_module_css_default.installBtn,
					type: "button",
					disabled: npmQuery.trim() === "",
					onClick: submitNpm
				}, t("installCliBtn"))),
				npmError ? (0, react.createElement)("div", { className: CustomInstallView_module_css_default.installError }, npmError) : null
			]), (0, react.createElement)("div", { className: enableGit ? CustomInstallView_module_css_default.installCard : `${CustomInstallView_module_css_default.installCard} ${CustomInstallView_module_css_default.installCardDisabled}` }, (0, react.createElement)("div", { className: CustomInstallView_module_css_default.installCardHead }, (0, react.createElement)("span", { className: CustomInstallView_module_css_default.installLabel }, t("gitInstallLabel")), (0, react.createElement)("button", {
				type: "button",
				className: CustomInstallView_module_css_default.installHelpBtn,
				title: t("installHelp"),
				"aria-label": t("installHelp"),
				onClick: () => setHelpFor("git")
			}, (0, react.createElement)(HelpIcon))), !enableGit ? channelOffRow : [
				(0, react.createElement)("div", { className: CustomInstallView_module_css_default.installExample }, t("gitInstallExample")),
				(0, react.createElement)("div", { className: CustomInstallView_module_css_default.installRow }, (0, react.createElement)("input", {
					className: gitError ? `${CustomInstallView_module_css_default.installInput} ${CustomInstallView_module_css_default.installInputError}` : CustomInstallView_module_css_default.installInput,
					type: "text",
					placeholder: t("gitInstallPlaceholder"),
					value: gitQuery,
					spellCheck: false,
					onInput: (e) => {
						setGitQuery(e.target.value);
						setGitError("");
					},
					onKeyDown: (e) => {
						if (e.key === "Enter") submitGit();
					}
				}), (0, react.createElement)("button", {
					className: CustomInstallView_module_css_default.installBtn,
					type: "button",
					disabled: gitQuery.trim() === "",
					onClick: submitGit
				}, t("installCliBtn"))),
				gitError ? (0, react.createElement)("div", { className: CustomInstallView_module_css_default.installError }, gitError) : null
			]), (0, react.createElement)("div", { className: enableDsh ? CustomInstallView_module_css_default.installCard : `${CustomInstallView_module_css_default.installCard} ${CustomInstallView_module_css_default.installCardDisabled}` }, (0, react.createElement)("div", { className: CustomInstallView_module_css_default.installCardHead }, (0, react.createElement)("span", { className: CustomInstallView_module_css_default.installLabel }, t("dshCmdLabel")), (0, react.createElement)("button", {
				type: "button",
				className: CustomInstallView_module_css_default.installHelpBtn,
				title: t("installHelp"),
				"aria-label": t("installHelp"),
				onClick: () => setHelpFor("cmd")
			}, (0, react.createElement)(HelpIcon)), enableDsh ? (0, react.createElement)("button", {
				type: "button",
				className: CustomInstallView_module_css_default.installInsertBtn,
				onClick: insertHubUpdate
			}, t("dshCmdInsertHubUpdate")) : null), !enableDsh ? channelOffRow : [
				(0, react.createElement)("div", { className: CustomInstallView_module_css_default.installExample }, t("dshCmdExample")),
				(0, react.createElement)("div", { className: CustomInstallView_module_css_default.installRow }, (0, react.createElement)("input", {
					className: cmdError ? `${CustomInstallView_module_css_default.installInput} ${CustomInstallView_module_css_default.installInputError}` : CustomInstallView_module_css_default.installInput,
					type: "text",
					placeholder: t("dshCmdPlaceholder"),
					value: cmdQuery,
					spellCheck: false,
					onInput: (e) => {
						setCmdQuery(e.target.value);
						setCmdError("");
					},
					onKeyDown: (e) => {
						if (e.key === "Enter") submitCmd();
					}
				}), (0, react.createElement)("button", {
					className: CustomInstallView_module_css_default.installBtn,
					type: "button",
					disabled: cmdQuery.trim() === "",
					onClick: submitCmd
				}, t("installCliBtn"))),
				cmdError ? (0, react.createElement)("div", { className: CustomInstallView_module_css_default.installError }, cmdError) : null
			])), helpFor !== null ? (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) setHelpFor(null);
				}
			}, (0, react.createElement)("div", {
				className: `${Modal_module_css_default.errorModal} ${Modal_module_css_default.helpModal}`,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.modalTitle }, `${t(HELP_CARDS[helpFor].titleKey)} · ${t("helpModalTitle")}`), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("errorClose"),
				onClick: () => setHelpFor(null)
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, (0, react.createElement)("div", { className: CustomInstallView_module_css_default.helpBody }, t(HELP_CARDS[helpFor].contentKey).split("\n").map((line, i) => {
				const [cmd, note] = line.split("	");
				return (0, react.createElement)("div", {
					key: i,
					className: CustomInstallView_module_css_default.helpLine
				}, cmd !== "" ? (0, react.createElement)("span", { className: CustomInstallView_module_css_default.helpCmd }, cmd) : null, note !== void 0 ? (0, react.createElement)("span", { className: CustomInstallView_module_css_default.helpNote }, note) : null);
			}))))) : null);
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/SettingsView.module.css.mjs
		const css$5 = "._506LLG_root{flex:1;align-items:stretch;min-width:0;min-height:0;display:flex}._506LLG_sidebar{border-right:1px solid var(--hub-border-1);flex-direction:column;flex:none;gap:2px;padding:8px 6px;display:flex;overflow-y:auto}._506LLG_navItem,._506LLG_navItemActive{box-sizing:border-box;text-align:left;cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:7px;align-items:center;gap:8px;width:100%;padding:7px 10px;font-size:12.5px;line-height:18px;transition:color .12s,background-color .12s;display:flex}._506LLG_navItem{color:var(--hub-text-secondary);background:0 0}._506LLG_navItem:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}._506LLG_navItemActive{color:var(--hub-brand);background:var(--hub-brand-tint);font-weight:600}._506LLG_navIcon{flex:none;display:inline-flex}._506LLG_content{flex-direction:column;flex:1;min-width:0;min-height:0;padding:14px 16px 18px;display:flex;overflow-y:auto}._506LLG_pageHeader{margin-bottom:12px}._506LLG_pageTitle{color:var(--hub-text-primary);font-size:14px;font-weight:600;line-height:20px}._506LLG_pageDesc{color:var(--hub-text-tertiary);margin-top:3px;font-size:11.5px;line-height:16px}._506LLG_card{border:1px solid var(--hub-border-1);background:var(--hub-bg-1);border-radius:8px;flex-direction:column;min-width:0;display:flex}._506LLG_settingRow{border-bottom:1px solid var(--hub-border-1);justify-content:space-between;align-items:center;gap:16px;min-width:0;padding:10px 12px;display:flex}._506LLG_settingRow:last-child{border-bottom:none}._506LLG_settingLabel{flex:1;min-width:0}._506LLG_settingTitle{color:var(--hub-text-primary);white-space:nowrap;text-overflow:ellipsis;font-size:12.5px;font-weight:500;line-height:18px;overflow:hidden}._506LLG_settingDesc{color:var(--hub-text-tertiary);margin-top:2px;font-size:11px;line-height:15px}._506LLG_settingControl{flex:none;align-items:center;display:flex}._506LLG_settingRowStack{border-bottom:1px solid var(--hub-border-1);flex-direction:column;align-items:stretch;gap:8px;min-width:0;padding:10px 12px;display:flex}._506LLG_settingRowStack:last-child{border-bottom:none}._506LLG_settingControlStack{align-items:center;display:flex}._506LLG_settingControlStack ._506LLG_textInput{width:100%}._506LLG_proxyControl{flex-direction:column;align-items:stretch;gap:5px;width:100%;display:flex}._506LLG_proxyHint{color:var(--hub-text-disabled);font-size:11px;line-height:1.4}._506LLG_proxyHintOk{color:var(--hub-success)}._506LLG_proxyHintFail{color:var(--hub-warning)}._506LLG_controlDropdown{min-width:180px}._506LLG_textInput{width:240px;height:28px;color:var(--hub-text-primary);background:var(--hub-bg-1);border:1px solid var(--hub-border-input);border-radius:6px;outline:none;padding:0 9px;font-family:inherit;font-size:12px;transition:border-color .15s}._506LLG_textInput:focus{border-color:var(--hub-brand-border)}._506LLG_textInput::placeholder{color:var(--hub-text-disabled)}._506LLG_resetBtn{cursor:pointer;height:28px;color:var(--hub-danger-text);border:1px solid var(--hub-danger-border);background:0 0;border-radius:6px;flex:none;padding:0 14px;font-size:12px;font-weight:500;transition:background-color .15s,border-color .15s,color .15s}._506LLG_resetBtn:hover{background:var(--hub-danger-tint);border-color:var(--hub-danger-text)}";
		const tagId$5 = "dsh-plugin/SettingsView.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$5) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$5;
			tag.textContent = css$5;
			document.head.appendChild(tag);
		}
		const cssRegistry$5 = globalThis.__DSH_PLUGIN_CSS__ ??= [];
		if (!cssRegistry$5.some((e) => e.tagId === tagId$5)) cssRegistry$5.push({
			tagId: tagId$5,
			css: css$5
		});
		var SettingsView_module_css_default = {
			"textInput": "_506LLG_textInput",
			"pageHeader": "_506LLG_pageHeader",
			"proxyHint": "_506LLG_proxyHint",
			"proxyHintOk": "_506LLG_proxyHintOk",
			"navItem": "_506LLG_navItem",
			"settingRow": "_506LLG_settingRow",
			"sidebar": "_506LLG_sidebar",
			"root": "_506LLG_root",
			"pageDesc": "_506LLG_pageDesc",
			"proxyHintFail": "_506LLG_proxyHintFail",
			"navItemActive": "_506LLG_navItemActive",
			"settingControlStack": "_506LLG_settingControlStack",
			"settingDesc": "_506LLG_settingDesc",
			"controlDropdown": "_506LLG_controlDropdown",
			"settingTitle": "_506LLG_settingTitle",
			"content": "_506LLG_content",
			"settingControl": "_506LLG_settingControl",
			"proxyControl": "_506LLG_proxyControl",
			"card": "_506LLG_card",
			"settingRowStack": "_506LLG_settingRowStack",
			"pageTitle": "_506LLG_pageTitle",
			"navIcon": "_506LLG_navIcon",
			"resetBtn": "_506LLG_resetBtn",
			"settingLabel": "_506LLG_settingLabel"
		};
		//#endregion
		//#region \0dsh-css:src/client/styles/Dropdown.module.css.mjs
		const css$4 = ".B_Gxsq_dropdown{flex-shrink:0;position:relative}.B_Gxsq_dropdownFill{width:100%}.B_Gxsq_dropdownFill>.B_Gxsq_dropdownBtn{justify-content:space-between;width:100%}.B_Gxsq_dropdownBtn{box-sizing:border-box;border:1px solid var(--hub-border-2);height:28px;color:var(--hub-text-primary);background:var(--hub-bg-hover);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;align-items:center;gap:6px;padding:0 10px;font-size:12px;line-height:26px;transition:color .12s,background .12s,border-color .12s;display:inline-flex}.B_Gxsq_dropdownBtn:hover{background:#80808047}.B_Gxsq_dropdownLabel{white-space:nowrap}.B_Gxsq_dropdownArrow,.B_Gxsq_dropdownArrowOpen{color:var(--hub-text-tertiary);transition:transform .12s,color .12s;display:inline-flex}.B_Gxsq_dropdownArrowOpen{color:var(--hub-text-secondary);transform:rotate(180deg)}.B_Gxsq_dropdownPanel{z-index:20;border:1px solid var(--hub-border-2);background:var(--hub-bg-1);border-radius:8px;flex-direction:column;gap:1px;min-width:100%;padding:4px;display:flex;position:absolute;top:calc(100% + 4px);left:0}.B_Gxsq_dropdownItem,.B_Gxsq_dropdownItemActive{text-align:left;cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;justify-content:space-between;align-items:center;gap:12px;width:100%;padding:5px 8px;font-size:12px;line-height:16px;transition:color .12s,background .12s;display:flex}.B_Gxsq_dropdownItem{color:var(--hub-text-secondary);background:0 0}.B_Gxsq_dropdownItem:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.B_Gxsq_dropdownItemActive{color:var(--hub-brand);background:var(--hub-brand-tint);font-weight:600}.B_Gxsq_dropdownItemLabel{white-space:nowrap}.B_Gxsq_dropdownCount,.B_Gxsq_dropdownCountActive{text-align:center;border-radius:999px;min-width:16px;padding:0 5px;font-size:10px;line-height:14px}.B_Gxsq_dropdownCount{color:var(--hub-text-tertiary);background:var(--hub-bg-btn)}.B_Gxsq_dropdownCountActive{color:var(--hub-text-on-fill);background:var(--hub-btn-fill)}";
		const tagId$4 = "dsh-plugin/Dropdown.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		const cssRegistry$4 = globalThis.__DSH_PLUGIN_CSS__ ??= [];
		if (!cssRegistry$4.some((e) => e.tagId === tagId$4)) cssRegistry$4.push({
			tagId: tagId$4,
			css: css$4
		});
		var Dropdown_module_css_default = {
			"dropdownItem": "B_Gxsq_dropdownItem",
			"dropdownItemLabel": "B_Gxsq_dropdownItemLabel",
			"dropdownPanel": "B_Gxsq_dropdownPanel",
			"dropdownFill": "B_Gxsq_dropdownFill",
			"dropdownItemActive": "B_Gxsq_dropdownItemActive",
			"dropdownCount": "B_Gxsq_dropdownCount",
			"dropdownCountActive": "B_Gxsq_dropdownCountActive",
			"dropdownArrowOpen": "B_Gxsq_dropdownArrowOpen",
			"dropdown": "B_Gxsq_dropdown",
			"dropdownArrow": "B_Gxsq_dropdownArrow",
			"dropdownLabel": "B_Gxsq_dropdownLabel",
			"dropdownBtn": "B_Gxsq_dropdownBtn"
		};
		//#endregion
		//#region \0dsh-css:src/client/styles/Toggle.module.css.mjs
		const css$3 = ".k-cD4G_toggle,.k-cD4G_toggleOn{cursor:pointer;border:none;border-radius:999px;flex:none;align-items:center;width:34px;height:18px;padding:0;transition:background-color .15s;display:inline-flex}.k-cD4G_toggle{background:var(--hub-bg-3);box-shadow:inset 0 0 0 1px var(--hub-border-2)}.k-cD4G_toggle:hover{background:var(--hub-bg-hover)}.k-cD4G_toggleOn{background:var(--hub-brand)}.k-cD4G_toggleOn:hover{background:var(--hub-brand-hover)}.k-cD4G_toggle:disabled,.k-cD4G_toggleOn:disabled{opacity:.5;cursor:not-allowed}.k-cD4G_knob{background:#fff;border-radius:999px;width:14px;height:14px;transition:transform .15s;display:block;transform:translate(2px);box-shadow:0 1px 2px #00000040}.k-cD4G_toggleOn .k-cD4G_knob{transform:translate(18px)}";
		const tagId$3 = "dsh-plugin/Toggle.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		const cssRegistry$3 = globalThis.__DSH_PLUGIN_CSS__ ??= [];
		if (!cssRegistry$3.some((e) => e.tagId === tagId$3)) cssRegistry$3.push({
			tagId: tagId$3,
			css: css$3
		});
		var Toggle_module_css_default = {
			"knob": "k-cD4G_knob",
			"toggleOn": "k-cD4G_toggleOn",
			"toggle": "k-cD4G_toggle"
		};
		//#endregion
		//#region src/client/components/ui/Toggle.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Compact switch used by the settings rows. Native-button based so it is
		* keyboard focusable and announces state via aria-checked; styling driven
		* by the --hub-* tokens (on = brand fill, off = neutral track).
		*/
		function Toggle({ checked, onChange, title, disabled }) {
			return (0, react.createElement)("button", {
				type: "button",
				role: "switch",
				"aria-checked": checked,
				disabled,
				title,
				className: checked ? Toggle_module_css_default.toggleOn : Toggle_module_css_default.toggle,
				onClick: () => onChange(!checked)
			}, (0, react.createElement)("span", { className: Toggle_module_css_default.knob }));
		}
		//#endregion
		//#region src/client/components/ui/Dropdown.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Button-style dropdown (native <select> replacement).
		*
		* The trigger is a compact toolbar button — hairline border + subtle grey
		* fill + current value + chevron — so it sits naturally next to the other
		* toolbar buttons and takes a single slot of horizontal space. Clicking
		* outside or pressing Esc closes the panel; options get a hover fill and
		* the active one a brand highlight, all driven by the --hub-* tokens.
		*/
		function Dropdown({ value, options, onChange, title, className }) {
			const [open, setOpen] = (0, react.useState)(false);
			const rootRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (!open) return;
				const onDoc = (e) => {
					if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
				};
				const onKey = (e) => {
					if (e.key === "Escape") setOpen(false);
				};
				document.addEventListener("mousedown", onDoc);
				document.addEventListener("keydown", onKey);
				return () => {
					document.removeEventListener("mousedown", onDoc);
					document.removeEventListener("keydown", onKey);
				};
			}, [open]);
			const current = options.find((o) => o.value === value);
			return (0, react.createElement)("div", {
				className: className ? `${Dropdown_module_css_default.dropdown} ${className}` : Dropdown_module_css_default.dropdown,
				ref: rootRef
			}, (0, react.createElement)("button", {
				className: Dropdown_module_css_default.dropdownBtn,
				type: "button",
				title,
				"aria-haspopup": "listbox",
				"aria-expanded": open,
				onClick: () => setOpen((v) => !v)
			}, (0, react.createElement)("span", { className: Dropdown_module_css_default.dropdownLabel }, current?.label ?? value), (0, react.createElement)("span", { className: open ? Dropdown_module_css_default.dropdownArrowOpen : Dropdown_module_css_default.dropdownArrow }, (0, react.createElement)(ChevronDownIcon))), open && (0, react.createElement)("div", {
				className: Dropdown_module_css_default.dropdownPanel,
				role: "listbox"
			}, options.map((o) => (0, react.createElement)("button", {
				key: o.value,
				type: "button",
				role: "option",
				"aria-selected": o.value === value,
				className: o.value === value ? Dropdown_module_css_default.dropdownItemActive : Dropdown_module_css_default.dropdownItem,
				onClick: () => {
					onChange(o.value);
					setOpen(false);
				}
			}, (0, react.createElement)("span", { className: Dropdown_module_css_default.dropdownItemLabel }, o.label), typeof o.count === "number" ? (0, react.createElement)("span", { className: o.value === value ? Dropdown_module_css_default.dropdownCountActive : Dropdown_module_css_default.dropdownCount }, o.count) : null))));
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/DiagnosticsView.module.css.mjs
		const css$2 = ".k9eRya_panel{flex-direction:column;min-width:0;display:flex}.k9eRya_envRow{border-bottom:1px solid var(--hub-border-1);align-items:center;gap:10px;padding:8px 12px;display:flex}.k9eRya_envLabel{flex:1;min-width:0}.k9eRya_envTitle{color:var(--hub-text-primary);font-size:12.5px;font-weight:500;line-height:18px}.k9eRya_envDesc{color:var(--hub-text-tertiary);font-size:11px;line-height:16px}.k9eRya_envCopyBtn{height:24px;color:var(--hub-text-secondary);background:var(--hub-bg-hover);border:1px solid var(--hub-border-2);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;flex:none;padding:0 12px;font-size:11.5px;font-weight:500;transition:color .12s,background-color .12s,border-color .12s}.k9eRya_envCopyBtn:hover:not(:disabled){color:var(--hub-text-primary);background:var(--hub-bg-2)}.k9eRya_envCopyBtn:disabled{opacity:.55;cursor:default}.k9eRya_head{border-bottom:1px solid var(--hub-border-1);align-items:center;gap:10px;padding:8px 12px;display:flex}.k9eRya_headHint{min-width:0;color:var(--hub-text-tertiary);flex:1;font-size:11px;line-height:16px}.k9eRya_runBtn{height:24px;color:var(--hub-brand);background:var(--hub-brand-tint);cursor:pointer;-webkit-user-select:none;user-select:none;border:1px solid #0000;border-radius:6px;flex:none;padding:0 12px;font-size:11.5px;font-weight:500;transition:color .12s,background-color .12s,border-color .12s}.k9eRya_runBtn:hover:not(:disabled){color:#fff;background:var(--hub-brand);border-color:var(--hub-brand)}.k9eRya_runBtn:disabled{opacity:.55;cursor:default}.k9eRya_row{box-sizing:border-box;border:none;border-bottom:1px solid var(--hub-border-1);width:100%;min-width:0;font:inherit;text-align:left;cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;align-items:center;gap:10px;padding:9px 12px;transition:background-color .12s;display:flex}.k9eRya_row:last-of-type{border-bottom:none}.k9eRya_row:hover:not(:disabled){background:var(--hub-bg-hover)}.k9eRya_row:disabled{cursor:default}.k9eRya_name{color:var(--hub-text-primary);white-space:nowrap;flex:none;font-size:12.5px;font-weight:500;line-height:18px}.k9eRya_display{min-width:0;color:var(--hub-text-tertiary);white-space:nowrap;text-overflow:ellipsis;flex:1;font-size:11px;line-height:16px;overflow:hidden}.k9eRya_meta{color:var(--hub-text-tertiary);font-variant-numeric:tabular-nums;flex:none;font-size:11px;line-height:16px}.k9eRya_badge{text-align:center;white-space:nowrap;font-variant-numeric:tabular-nums;border-radius:999px;flex:none;height:17px;padding:0 8px;font-size:10.5px;line-height:17px}.k9eRya_badgeOk{color:var(--hub-success);background:var(--hub-success-tint)}.k9eRya_badgeFail{color:var(--hub-danger-text);background:var(--hub-danger-tint)}.k9eRya_badgeRunning{color:var(--hub-text-secondary);background:var(--hub-bg-hover);animation:1s ease-in-out infinite k9eRya_diagPulse}.k9eRya_badgeIdle{color:var(--hub-text-disabled);background:var(--hub-bg-hover)}@keyframes k9eRya_diagPulse{0%,to{opacity:1}50%{opacity:.4}}.k9eRya_summary{padding:8px 12px 10px;font-size:11px;line-height:16px}.k9eRya_summaryOk{color:var(--hub-success)}.k9eRya_summaryFail{color:var(--hub-danger-text)}.k9eRya_summaryRunning{color:var(--hub-text-tertiary)}";
		const tagId$2 = "dsh-plugin/DiagnosticsView.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		const cssRegistry$2 = globalThis.__DSH_PLUGIN_CSS__ ??= [];
		if (!cssRegistry$2.some((e) => e.tagId === tagId$2)) cssRegistry$2.push({
			tagId: tagId$2,
			css: css$2
		});
		var DiagnosticsView_module_css_default = {
			"summaryOk": "k9eRya_summaryOk",
			"badge": "k9eRya_badge",
			"badgeOk": "k9eRya_badgeOk",
			"diagPulse": "k9eRya_diagPulse",
			"envCopyBtn": "k9eRya_envCopyBtn",
			"summary": "k9eRya_summary",
			"envDesc": "k9eRya_envDesc",
			"display": "k9eRya_display",
			"summaryRunning": "k9eRya_summaryRunning",
			"row": "k9eRya_row",
			"meta": "k9eRya_meta",
			"name": "k9eRya_name",
			"envLabel": "k9eRya_envLabel",
			"head": "k9eRya_head",
			"headHint": "k9eRya_headHint",
			"panel": "k9eRya_panel",
			"summaryFail": "k9eRya_summaryFail",
			"envRow": "k9eRya_envRow",
			"envTitle": "k9eRya_envTitle",
			"runBtn": "k9eRya_runBtn",
			"badgeIdle": "k9eRya_badgeIdle",
			"badgeRunning": "k9eRya_badgeRunning",
			"badgeFail": "k9eRya_badgeFail"
		};
		//#endregion
		//#region src/client/components/views/DiagnosticsView.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* System diagnostics list: one row per connectivity channel (npm registry /
		* GitHub API / catalog site), each with a live status badge — 200 OK in
		* green, Unreachable in red, Checking… while probing. The list runs
		* automatically when the page opens; every row is a button that re-probes
		* just that channel, so a click always yields visible feedback
		* (row pulses → badge flips → latency refreshes).
		*/
		/** 系统版本文本：提交 Issue 时粘贴到正文，方便作者复现。 */
		function formatEnv(env) {
			return [
				`DSH Plugin Hub ${PLUGIN_VERSION}`,
				`DSH ${env.dshVersion ?? "unknown"}`,
				`Node ${env.nodeVersion}`,
				`${env.platform} ${env.arch} (${env.release})`,
				`Profile ${env.profile}`,
				env.dshHome ? `Home ${env.dshHome}` : ""
			].filter(Boolean).join("\n");
		}
		const INITIAL_ROWS = [
			{
				key: "npm",
				display: "",
				nameKey: "diagNpm",
				status: "idle",
				ms: null,
				statusCode: null
			},
			{
				key: "github",
				display: "github.com",
				nameKey: "diagGithub",
				status: "idle",
				ms: null,
				statusCode: null
			},
			{
				key: "catalog",
				display: "",
				nameKey: "diagCatalog",
				status: "idle",
				ms: null,
				statusCode: null
			}
		];
		function DiagnosticsView({ t, env, proxy, onCopy }) {
			const [rows, setRows] = (0, react.useState)(() => {
				const base = INITIAL_ROWS.map((r) => ({ ...r }));
				if (proxy.trim() !== "") base.push({
					key: "proxy",
					display: proxy.trim(),
					nameKey: "diagProxy",
					status: "idle",
					ms: null,
					statusCode: null
				});
				return base;
			});
			/** 当前探测请求：重测/卸载时 abort 旧请求，避免乱序结果覆盖 */
			const runningRef = (0, react.useRef)(null);
			const patchRows = (key, patch) => {
				setRows((prev) => prev.map((r) => key === void 0 || r.key === key ? {
					...r,
					...patch
				} : r));
			};
			/** 探测：key 缺省 = 全量串行；传 key = 只重测该通道 */
			const run = (0, react.useCallback)((key) => {
				runningRef.current?.abort();
				const controller = new AbortController();
				runningRef.current = controller;
				patchRows(key, {
					status: "running",
					ms: null,
					statusCode: null
				});
				(async () => {
					try {
						const res = await fetch("/dsh-plugin-hub/diagnostics", {
							method: "POST",
							headers: { "content-type": "application/json" },
							body: key === void 0 ? "{}" : JSON.stringify({ key }),
							cache: "no-store",
							signal: controller.signal
						});
						if (!res.ok || res.body === null) throw new Error(`http ${res.status}`);
						const reader = res.body.getReader();
						const decoder = new TextDecoder();
						let buf = "";
						for (;;) {
							const { done, value } = await reader.read();
							if (done) break;
							buf += decoder.decode(value, { stream: true });
							let nl = buf.indexOf("\n");
							while (nl !== -1) {
								const raw = buf.slice(0, nl).trim();
								buf = buf.slice(nl + 1);
								if (raw !== "") {
									const ev = JSON.parse(raw);
									if (ev.type === "ok" || ev.type === "fail") patchRows(ev.key, {
										status: ev.type === "ok" ? "ok" : "fail",
										ms: typeof ev.ms === "number" ? ev.ms : null,
										statusCode: typeof ev.status === "number" ? ev.status : null,
										display: typeof ev.display === "string" ? ev.display : ""
									});
								}
								nl = buf.indexOf("\n");
							}
						}
					} catch {
						if (controller.signal.aborted) return;
						patchRows(key, {
							status: "fail",
							ms: null,
							statusCode: null
						});
					}
				})();
			}, []);
			(0, react.useEffect)(() => {
				run();
				return () => runningRef.current?.abort();
			}, [run]);
			const anyRunning = rows.some((r) => r.status === "running");
			const allOk = !anyRunning && rows.every((r) => r.status === "ok");
			!anyRunning && rows.some((r) => r.status === "fail");
			return (0, react.createElement)("div", { className: DiagnosticsView_module_css_default.panel }, (0, react.createElement)("div", { className: DiagnosticsView_module_css_default.envRow }, (0, react.createElement)("div", { className: DiagnosticsView_module_css_default.envLabel }, (0, react.createElement)("div", { className: DiagnosticsView_module_css_default.envTitle }, t("settingsEnvSnapshot")), (0, react.createElement)("div", { className: DiagnosticsView_module_css_default.envDesc }, t("settingsEnvSnapshotDesc"))), (0, react.createElement)("button", {
				type: "button",
				className: DiagnosticsView_module_css_default.envCopyBtn,
				disabled: env === null,
				onClick: () => {
					if (env) onCopy(formatEnv(env));
				}
			}, t("settingsEnvCopy"))), (0, react.createElement)("div", { className: DiagnosticsView_module_css_default.head }, (0, react.createElement)("span", { className: DiagnosticsView_module_css_default.headHint }, t("diagHeadHint", { n: rows.length })), (0, react.createElement)("button", {
				type: "button",
				className: DiagnosticsView_module_css_default.runBtn,
				disabled: anyRunning,
				onClick: () => run()
			}, t("diagRunAll"))), rows.map((r) => {
				const badge = r.status === "running" ? (0, react.createElement)("span", { className: `${DiagnosticsView_module_css_default.badge} ${DiagnosticsView_module_css_default.badgeRunning}` }, t("diagChecking")) : r.status === "ok" ? (0, react.createElement)("span", { className: `${DiagnosticsView_module_css_default.badge} ${DiagnosticsView_module_css_default.badgeOk}` }, r.statusCode !== null ? `HTTP ${r.statusCode} ${t("diagOk")}` : t("diagOk")) : r.status === "fail" ? (0, react.createElement)("span", { className: `${DiagnosticsView_module_css_default.badge} ${DiagnosticsView_module_css_default.badgeFail}` }, t("settingsDiagFail")) : (0, react.createElement)("span", { className: `${DiagnosticsView_module_css_default.badge} ${DiagnosticsView_module_css_default.badgeIdle}` }, t("diagIdle"));
				return (0, react.createElement)("button", {
					key: r.key,
					type: "button",
					className: DiagnosticsView_module_css_default.row,
					disabled: r.status === "running",
					onClick: () => run(r.key),
					title: t("diagRecheck")
				}, (0, react.createElement)("span", { className: DiagnosticsView_module_css_default.name }, t(r.nameKey)), (0, react.createElement)("span", { className: DiagnosticsView_module_css_default.display }, r.key === "catalog" ? t("diagCatalogTarget") : r.display !== "" ? r.display : t("diagNpmUnset")), (0, react.createElement)("span", { className: DiagnosticsView_module_css_default.meta }, r.status === "ok" && r.ms !== null ? `${r.ms} ms` : ""), badge);
			}), (0, react.createElement)("div", { className: `${DiagnosticsView_module_css_default.summary} ${anyRunning ? DiagnosticsView_module_css_default.summaryRunning : allOk ? DiagnosticsView_module_css_default.summaryOk : DiagnosticsView_module_css_default.summaryFail}` }, anyRunning ? t("diagSummaryRunning") : allOk ? t("diagSummaryOk") : t("diagSummaryFail")));
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/LogsView.module.css.mjs
		const css$1 = "._3j77BW_panel{flex-direction:column;min-width:0;display:flex}._3j77BW_head{border-bottom:1px solid var(--hub-border-1);flex-direction:column;align-items:stretch;gap:6px;padding:8px 12px;display:flex}._3j77BW_headHint{min-width:0;color:var(--hub-text-tertiary);font-size:11px;line-height:16px}._3j77BW_actions{flex:none;justify-content:flex-start;align-items:center;gap:6px;display:flex}._3j77BW_btn{height:24px;color:var(--hub-text-secondary);background:var(--hub-bg-hover);border:1px solid var(--hub-border-2);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;flex:none;padding:0 10px;font-size:11.5px;font-weight:500;transition:color .12s,background-color .12s,border-color .12s}._3j77BW_btn:hover:not(:disabled){color:var(--hub-text-primary);background:var(--hub-bg-2)}._3j77BW_btn:disabled{opacity:.55;cursor:default}._3j77BW_headActions{flex:1;justify-content:flex-end;margin-right:4px;display:flex}._3j77BW_clearBtn{height:22px;color:var(--hub-text-secondary);border:1px solid var(--hub-border-2);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;flex:none;padding:0 10px;font-size:11px;font-weight:500;transition:color .12s,background-color .12s,border-color .12s}._3j77BW_clearBtn:hover:not(:disabled){color:var(--hub-text-primary);background:var(--hub-bg-2)}._3j77BW_clearBtn:disabled{opacity:.55;cursor:default}._3j77BW_list{flex-direction:column;max-height:340px;display:flex;overflow-y:auto}._3j77BW_entry{align-items:baseline;gap:8px;min-width:0;padding:5px 12px;font-size:11px;line-height:16px;display:flex}._3j77BW_entry:hover{background:var(--hub-bg-hover)}._3j77BW_time{font-variant-numeric:tabular-nums;color:var(--hub-text-tertiary);white-space:nowrap;flex:none}._3j77BW_event{color:var(--hub-text-tertiary);white-space:nowrap;flex:none;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px}._3j77BW_message{min-width:0;color:var(--hub-text-primary);white-space:nowrap;text-overflow:ellipsis;flex:1;overflow:hidden}._3j77BW_pathRow{border-bottom:1px solid var(--hub-border-1);align-items:center;gap:8px;padding:6px 12px;display:flex}._3j77BW_pathLabel{color:var(--hub-text-tertiary);flex:none;font-size:11px;line-height:16px}._3j77BW_pathText{min-width:0;color:var(--hub-text-secondary);white-space:nowrap;text-overflow:ellipsis;flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;line-height:16px;overflow:hidden}._3j77BW_footFail{color:var(--hub-danger-text);flex:none;font-size:11px;line-height:16px}._3j77BW_pathDialog{flex-direction:column;gap:10px;display:flex}._3j77BW_pathDialogDesc{color:var(--hub-text-tertiary);font-size:11px;line-height:16px}._3j77BW_pathDialogRow{align-items:center;gap:6px;display:flex}._3j77BW_pathDialogReset{justify-content:space-between;align-items:center;gap:8px;display:flex}._3j77BW_pathDialogHint{color:var(--hub-text-tertiary);font-size:11px;line-height:16px}._3j77BW_linkBtn{color:var(--hub-brand);cursor:pointer;background:0 0;border:none;flex:none;padding:0;font-size:11.5px;font-weight:500;line-height:16px}._3j77BW_linkBtn:hover{text-decoration:underline}._3j77BW_pathDraft{min-width:0;height:26px;color:var(--hub-text-primary);background:var(--hub-bg-1);border:1px solid var(--hub-border-input);border-radius:6px;outline:none;flex:1;padding:0 9px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;transition:border-color .12s}._3j77BW_pathDraft:focus{border-color:var(--hub-brand-border)}._3j77BW_pathDraft::placeholder{color:var(--hub-text-disabled)}._3j77BW_pathDialogFoot{justify-content:flex-end;gap:6px;display:flex}._3j77BW_previewRow{text-align:left;cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;width:100%;padding:0;display:block}._3j77BW_filterBar{flex-wrap:wrap;align-items:center;gap:6px;padding:2px 0 0;display:flex}._3j77BW_filterChip{height:22px;color:var(--hub-text-secondary);border:1px solid var(--hub-border-2);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:11px;flex:none;padding:0 10px;font-size:11px;line-height:20px;transition:color .12s,background-color .12s,border-color .12s}._3j77BW_filterChip:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}._3j77BW_filterChipActive,._3j77BW_filterChipActive:hover{color:var(--hub-brand);background:var(--hub-brand-tint);border-color:var(--hub-brand-border-soft);font-weight:500}._3j77BW_filterChipActive:hover{background:var(--hub-brand-tint-strong);border-color:var(--hub-brand-border)}._3j77BW_search{flex:1;min-width:140px}._3j77BW_searchInput{width:100%;height:24px;color:var(--hub-text-primary);background:var(--hub-bg-2);border:1px solid var(--hub-border-2);border-radius:6px;outline:none;padding:0 8px;font-size:11px;line-height:16px;transition:border-color .12s,background-color .12s}._3j77BW_searchInput:focus{border-color:var(--hub-brand);background:var(--hub-bg-1)}._3j77BW_searchInput::placeholder{color:var(--hub-text-tertiary)}._3j77BW_logList{flex-direction:column;flex:auto;min-height:0;padding:4px 0 6px;display:flex;overflow-y:auto}._3j77BW_more{height:26px;color:var(--hub-brand);background:var(--hub-brand-tint);border:1px solid var(--hub-brand-border-soft);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;flex:none;align-self:center;margin:10px 0 4px;padding:0 18px;font-size:11.5px;font-weight:500;transition:color .12s,background-color .12s,border-color .12s}._3j77BW_more:hover:not(:disabled){color:#fff;background:var(--hub-brand);border-color:var(--hub-brand)}._3j77BW_more:disabled{opacity:.55;cursor:default}._3j77BW_moreEnd{text-align:center;color:var(--hub-text-tertiary);font-variant-numeric:tabular-nums;flex:none;padding:12px 0 4px;font-size:11px;line-height:16px}._3j77BW_foot{border-top:1px solid var(--hub-border-1);align-items:center;gap:8px;padding:8px 12px;display:flex}._3j77BW_footPath{min-width:0;color:var(--hub-text-tertiary);white-space:nowrap;text-overflow:ellipsis;flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;line-height:16px;overflow:hidden}._3j77BW_footCount{color:var(--hub-text-tertiary);font-variant-numeric:tabular-nums;flex:none;font-size:11px;line-height:16px}._3j77BW_footActions{flex:none;align-items:center;gap:6px;display:inline-flex}._3j77BW_badge{letter-spacing:.3px;flex:none;font-size:10px;font-weight:600}._3j77BW_badgeSuccess{color:var(--hub-success)}._3j77BW_badgeError{color:var(--hub-danger-text)}._3j77BW_badgeWarn{color:var(--hub-warning)}._3j77BW_badgeInfo{color:var(--hub-text-secondary)}._3j77BW_badgeDebug{color:var(--hub-text-tertiary)}._3j77BW_catBadge{border:1px solid #0000;border-radius:4px;flex:none;padding:0 6px;font-size:10px;font-weight:500;line-height:16px}._3j77BW_catInstall{color:var(--hub-brand);border-color:var(--hub-brand-border-soft);background:var(--hub-brand-tint)}._3j77BW_catUninstall{color:var(--hub-danger-text);border-color:var(--hub-danger-border);background:var(--hub-danger-tint)}._3j77BW_catUpdate{color:var(--hub-warning);border-color:var(--hub-warning-border);background:var(--hub-warning-tint)}._3j77BW_catDiagnostics{color:var(--hub-success);border-color:var(--hub-success-border);background:var(--hub-success-tint)}._3j77BW_catSettings{color:var(--hub-warn);border-color:var(--hub-warn-border);background:var(--hub-warn-tint)}._3j77BW_catSystem{color:var(--hub-text-secondary);border-color:var(--hub-border-2);background:var(--hub-bg-hover)}._3j77BW_empty{text-align:center;color:var(--hub-text-tertiary);padding:28px 12px;font-size:11.5px}";
		const tagId$1 = "dsh-plugin/LogsView.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		const cssRegistry$1 = globalThis.__DSH_PLUGIN_CSS__ ??= [];
		if (!cssRegistry$1.some((e) => e.tagId === tagId$1)) cssRegistry$1.push({
			tagId: tagId$1,
			css: css$1
		});
		var LogsView_module_css_default = {
			"catInstall": "_3j77BW_catInstall",
			"footFail": "_3j77BW_footFail",
			"pathDraft": "_3j77BW_pathDraft",
			"catUninstall": "_3j77BW_catUninstall",
			"previewRow": "_3j77BW_previewRow",
			"badgeDebug": "_3j77BW_badgeDebug",
			"pathDialogDesc": "_3j77BW_pathDialogDesc",
			"logList": "_3j77BW_logList",
			"panel": "_3j77BW_panel",
			"foot": "_3j77BW_foot",
			"actions": "_3j77BW_actions",
			"pathRow": "_3j77BW_pathRow",
			"pathDialog": "_3j77BW_pathDialog",
			"badge": "_3j77BW_badge",
			"filterBar": "_3j77BW_filterBar",
			"filterChip": "_3j77BW_filterChip",
			"pathDialogRow": "_3j77BW_pathDialogRow",
			"pathDialogReset": "_3j77BW_pathDialogReset",
			"pathDialogHint": "_3j77BW_pathDialogHint",
			"moreEnd": "_3j77BW_moreEnd",
			"footCount": "_3j77BW_footCount",
			"badgeError": "_3j77BW_badgeError",
			"headActions": "_3j77BW_headActions",
			"catDiagnostics": "_3j77BW_catDiagnostics",
			"more": "_3j77BW_more",
			"badgeWarn": "_3j77BW_badgeWarn",
			"empty": "_3j77BW_empty",
			"btn": "_3j77BW_btn",
			"entry": "_3j77BW_entry",
			"message": "_3j77BW_message",
			"footPath": "_3j77BW_footPath",
			"filterChipActive": "_3j77BW_filterChipActive",
			"pathText": "_3j77BW_pathText",
			"badgeSuccess": "_3j77BW_badgeSuccess",
			"catSettings": "_3j77BW_catSettings",
			"list": "_3j77BW_list",
			"linkBtn": "_3j77BW_linkBtn",
			"catSystem": "_3j77BW_catSystem",
			"catUpdate": "_3j77BW_catUpdate",
			"search": "_3j77BW_search",
			"clearBtn": "_3j77BW_clearBtn",
			"headHint": "_3j77BW_headHint",
			"time": "_3j77BW_time",
			"head": "_3j77BW_head",
			"event": "_3j77BW_event",
			"pathLabel": "_3j77BW_pathLabel",
			"pathDialogFoot": "_3j77BW_pathDialogFoot",
			"footActions": "_3j77BW_footActions",
			"badgeInfo": "_3j77BW_badgeInfo",
			"searchInput": "_3j77BW_searchInput",
			"catBadge": "_3j77BW_catBadge"
		};
		//#endregion
		//#region src/client/components/modals/LogsModal.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Built-in log viewer dialog: no external software needed — the app opens
		* its own window and loads the local system log (JSONL at
		* ~/.dsh/profiles/<profile>/hub.log) straight from the server, one page at
		* a time.
		*
		* Every line is categorized twice: a function area (install / uninstall /
		* update / diagnostics / settings / system) and a severity level (debug /
		* info / success / warn / error). Filtering on both axes lets you target,
		* say, only install errors — so the exact incompatible step of an install
		* (or uninstall) is easy to spot. Search narrows by event code or message.
		*
		* Server pagination: GET /dsh-plugin-hub/logs?offset=&limit=&category=
		* &level=&query= → { entries, total, hasMore, path }. The footer shows the
		* real file location and reveals it in the system file manager.
		*/
		const PAGE = 100;
		/** 类别筛选标签：值 → 语言包 key（弹窗内 chip 与行内类别徽章共用）。 */
		const CAT_LABEL = {
			install: "logCatInstall",
			uninstall: "logCatUninstall",
			update: "logCatUpdate",
			diagnostics: "logCatDiagnostics",
			settings: "logCatSettings",
			system: "logCatSystem"
		};
		const CAT_FILTERS = [
			{
				value: "all",
				key: "logCatAll"
			},
			{
				value: "install",
				key: "logCatInstall"
			},
			{
				value: "uninstall",
				key: "logCatUninstall"
			},
			{
				value: "update",
				key: "logCatUpdate"
			},
			{
				value: "diagnostics",
				key: "logCatDiagnostics"
			},
			{
				value: "settings",
				key: "logCatSettings"
			},
			{
				value: "system",
				key: "logCatSystem"
			}
		];
		const LEVEL_FILTERS = [
			{
				value: "all",
				key: "logLvAll"
			},
			{
				value: "error",
				key: "logLvError"
			},
			{
				value: "warn",
				key: "logLvWarn"
			},
			{
				value: "success",
				key: "logLvSuccess"
			},
			{
				value: "info",
				key: "logLvInfo"
			},
			{
				value: "debug",
				key: "logLvDebug"
			}
		];
		/** 级别徽章文案：弹窗 chip 与行内级别徽章共用同一语言包 key。 */
		const LEVEL_LABEL = {
			debug: "logLvDebug",
			info: "logLvInfo",
			success: "logLvSuccess",
			warn: "logLvWarn",
			error: "logLvError"
		};
		/** 时间：YYYY-MM-DD HH:mm:ss（每条都精确到秒）。 */
		function fmtLogTime(at) {
			const d = new Date(at);
			const pad = (n) => String(n).padStart(2, "0");
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
		}
		/** 导出文件名时间戳：2026-08-24_21-35-00。 */
		function fmtFileStamp(at) {
			const d = new Date(at);
			const pad = (n) => String(n).padStart(2, "0");
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
		}
		/** 单条日志行：时间 + 级别徽章 + 类别徽章 + 事件码 + 描述。查看器弹窗与设置页预览共用。 */
		function LogEntryRow({ e, t }) {
			return (0, react.createElement)("div", {
				className: LogsView_module_css_default.entry,
				title: e.message
			}, (0, react.createElement)("span", { className: LogsView_module_css_default.time }, fmtLogTime(e.at)), (0, react.createElement)("span", { className: `${LogsView_module_css_default.badge} ${LogsView_module_css_default[`badge${e.level}`]}` }, t(LEVEL_LABEL[e.level])), (0, react.createElement)("span", { className: `${LogsView_module_css_default.catBadge} ${LogsView_module_css_default[`cat${e.category}`]}` }, t(CAT_LABEL[e.category])), (0, react.createElement)("span", { className: LogsView_module_css_default.event }, e.event), (0, react.createElement)("span", { className: LogsView_module_css_default.message }, e.message));
		}
		function LogsModal({ t, onClose }) {
			const [category, setCategory] = (0, react.useState)("all");
			const [level, setLevel] = (0, react.useState)("all");
			const [query, setQuery] = (0, react.useState)("");
			const [entries, setEntries] = (0, react.useState)([]);
			const [total, setTotal] = (0, react.useState)(0);
			const [hasMore, setHasMore] = (0, react.useState)(false);
			const [path, setPath] = (0, react.useState)("");
			const [loading, setLoading] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(false);
			const [opening, setOpening] = (0, react.useState)(false);
			const [openFailed, setOpenFailed] = (0, react.useState)(false);
			const [showClearConfirm, setShowClearConfirm] = (0, react.useState)(false);
			const [clearing, setClearing] = (0, react.useState)(false);
			const [clearFailed, setClearFailed] = (0, react.useState)(false);
			const offsetRef = (0, react.useRef)(0);
			/** 拉一页：过滤参数取当前 state，偏移量由调用方给出。 */
			const fetchPage = (0, react.useCallback)(async (offset) => {
				try {
					const qs = new URLSearchParams({
						offset: String(offset),
						limit: String(PAGE)
					});
					if (category !== "all") qs.set("category", category);
					if (level !== "all") qs.set("level", level);
					const q = query.trim();
					if (q !== "") qs.set("query", q);
					const res = await fetch(`/dsh-plugin-hub/logs?${qs.toString()}`, { cache: "no-store" });
					if (!res.ok) return null;
					return await res.json();
				} catch {
					return null;
				}
			}, [
				category,
				level,
				query
			]);
			/** 从第一页重新加载（换筛选/搜索时）。 */
			const reload = (0, react.useCallback)(async () => {
				setLoading(true);
				const data = await fetchPage(0);
				if (data === null) {
					setError(true);
					setLoading(false);
					return;
				}
				offsetRef.current = data.entries.length;
				setEntries(data.entries);
				setTotal(data.total);
				setHasMore(data.hasMore);
				if (data.path !== "") setPath(data.path);
				setError(false);
				setLoading(false);
			}, [fetchPage]);
			/** 追加下一页（「加载更多」）。 */
			const loadMore = (0, react.useCallback)(async () => {
				if (loading) return;
				setLoading(true);
				const data = await fetchPage(offsetRef.current);
				if (data === null) {
					setError(true);
					setLoading(false);
					return;
				}
				offsetRef.current += data.entries.length;
				setEntries((prev) => [...prev, ...data.entries]);
				setTotal(data.total);
				setHasMore(data.hasMore);
				setLoading(false);
			}, [fetchPage, loading]);
			const first = (0, react.useRef)(true);
			(0, react.useEffect)(() => {
				if (first.current) {
					first.current = false;
					reload();
					return;
				}
				const id = window.setTimeout(() => {
					reload();
				}, 280);
				return () => window.clearTimeout(id);
			}, [reload]);
			/** 在系统文件管理器中定位日志文件（服务端 spawn open）。 */
			const openFile = async () => {
				if (opening) return;
				setOpening(true);
				setOpenFailed(false);
				const ok = await openLogFile();
				setOpening(false);
				if (!ok) setOpenFailed(true);
			};
			/** 清空所有日志：确认弹窗（独立弹出框，垃圾桶图标）确认后执行。 */
			const doClear = async () => {
				setClearing(true);
				try {
					if (!(await fetch("/dsh-plugin-hub/clear-log", {
						method: "POST",
						cache: "no-store"
					})).ok) {
						setClearFailed(true);
						return;
					}
					await reload();
				} catch {
					setClearFailed(true);
				} finally {
					setClearing(false);
					setShowClearConfirm(false);
				}
			};
			/** 导出：拼纯文本 → Blob → 触发浏览器下载 .log 文件 */
			const exportFile = () => {
				const text = entries.map((e) => `[${fmtLogTime(e.at)}] [${e.level}] [${e.category}] [${e.event}] ${e.message}`).join("\n");
				if (text === "") return;
				const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `dsh-plugin-hub-log-${fmtFileStamp(Date.now())}.log`;
				document.body.appendChild(a);
				a.click();
				a.remove();
				URL.revokeObjectURL(url);
			};
			return (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: `${Modal_module_css_default.errorModal} ${Modal_module_css_default.logModal}`,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.modalTitle }, t("logModalTitle")), (0, react.createElement)("div", { className: LogsView_module_css_default.headActions }, (0, react.createElement)("button", {
				type: "button",
				className: LogsView_module_css_default.clearBtn,
				disabled: clearing,
				title: t("logClearAllTip"),
				onClick: () => setShowClearConfirm(true)
			}, t("logClearAll"))), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("errorClose"),
				onClick: onClose
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, (0, react.createElement)("div", { className: LogsView_module_css_default.filterBar }, CAT_FILTERS.map((f) => (0, react.createElement)("button", {
				key: f.value,
				type: "button",
				className: category === f.value ? `${LogsView_module_css_default.filterChip} ${LogsView_module_css_default.filterChipActive}` : LogsView_module_css_default.filterChip,
				onClick: () => setCategory(f.value)
			}, t(f.key)))), (0, react.createElement)("div", { className: LogsView_module_css_default.filterBar }, LEVEL_FILTERS.map((f) => (0, react.createElement)("button", {
				key: f.value,
				type: "button",
				className: level === f.value ? `${LogsView_module_css_default.filterChip} ${LogsView_module_css_default.filterChipActive}` : LogsView_module_css_default.filterChip,
				onClick: () => setLevel(f.value)
			}, t(f.key))), (0, react.createElement)("div", { className: LogsView_module_css_default.search }, (0, react.createElement)("input", {
				className: LogsView_module_css_default.searchInput,
				type: "search",
				value: query,
				placeholder: t("logSearchPlaceholder"),
				"aria-label": t("logSearchPlaceholder"),
				onChange: (e) => setQuery(e.target.value)
			}))), (0, react.createElement)("div", { className: LogsView_module_css_default.logList }, error ? (0, react.createElement)("div", { className: LogsView_module_css_default.empty }, t("logsLoadFail")) : loading && entries.length === 0 ? (0, react.createElement)("div", { className: LogsView_module_css_default.empty }, t("logsLoading")) : entries.length === 0 ? (0, react.createElement)("div", { className: LogsView_module_css_default.empty }, t("logEmptyFilter")) : entries.map((e, i) => (0, react.createElement)(LogEntryRow, {
				key: `${e.at}-${i}`,
				e,
				t
			})), entries.length > 0 && (hasMore ? (0, react.createElement)("button", {
				type: "button",
				className: LogsView_module_css_default.more,
				disabled: loading,
				onClick: () => void loadMore()
			}, loading ? t("logsLoading") : t("logLoadMore")) : (0, react.createElement)("div", { className: LogsView_module_css_default.moreEnd }, t("logNoMore", { n: total }))))), (0, react.createElement)("div", { className: LogsView_module_css_default.foot }, (0, react.createElement)("span", {
				className: LogsView_module_css_default.footPath,
				title: path
			}, `${t("logPathLabel")}: ${path === "" ? "…" : path}`), clearFailed ? (0, react.createElement)("span", { className: LogsView_module_css_default.footFail }, t("logClearFailed")) : openFailed ? (0, react.createElement)("span", { className: LogsView_module_css_default.footFail }, t("logOpenFileFail")) : (0, react.createElement)("span", { className: LogsView_module_css_default.footCount }, t("logCount", { n: total })), (0, react.createElement)("div", { className: LogsView_module_css_default.footActions }, (0, react.createElement)("button", {
				type: "button",
				className: LogsView_module_css_default.btn,
				disabled: opening || path === "",
				title: t("logOpenFileTip"),
				onClick: () => void openFile()
			}, t("logOpenFile")), (0, react.createElement)("button", {
				type: "button",
				className: LogsView_module_css_default.btn,
				disabled: entries.length === 0,
				onClick: exportFile
			}, t("logsExport"))))), showClearConfirm && (0, react.createElement)(ConfirmDialog, {
				type: "trash",
				title: t("logClearConfirmTitle"),
				desc: t("logClearConfirmDesc"),
				confirmLabel: t("logClearAll"),
				busy: clearing,
				busyLabel: t("logClearing"),
				t,
				onConfirm: () => void doClear(),
				onCancel: () => setShowClearConfirm(false)
			}));
		}
		//#endregion
		//#region src/client/components/modals/LogsPathModal.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* 日志存放位置弹窗：设置页不内联长表单（挡视线），点「修改」弹窗编辑。
		* 两种输入方式并存 —— 手输目录 / .log 文件路径，或点「选择目录」调系统
		* 原生文件夹对话框（服务端 spawn osascript / FolderBrowserDialog / zenity）。
		* 文本框预填当前生效位置，目录选择器也从该位置打开 —— 默认地址是动态的
		* （随用户主目录/平台变化，如 ~/.dsh/profiles/<profile>/hub.log），必须实时展示。
		* 留空或点「恢复默认」= 回到默认；保存前服务端预验证可写。
		*/
		function LogsPathModal({ t, defaultPath, currentPath, onSaved, onClose }) {
			const [draft, setDraft] = (0, react.useState)(currentPath);
			const [saving, setSaving] = (0, react.useState)(false);
			const [fail, setFail] = (0, react.useState)(false);
			const [browsing, setBrowsing] = (0, react.useState)(false);
			const [browseFail, setBrowseFail] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				const onKey = (e) => {
					if (e.key === "Escape") onClose();
				};
				window.addEventListener("keydown", onKey);
				return () => window.removeEventListener("keydown", onKey);
			}, [onClose]);
			/** 保存：空串 = 回默认；填回默认位置同样按「未自定义」处理（设置里保持干净）。
			* 服务端预建目录验证可写，失败给出反馈。 */
			const save = async () => {
				if (saving) return;
				setSaving(true);
				setFail(false);
				try {
					const value = draft.trim();
					const normalized = value === "" || value === defaultPath ? "" : value;
					if (!(await fetch("/dsh-plugin-hub/settings", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ logPath: normalized }),
						cache: "no-store"
					})).ok) {
						setFail(true);
						return;
					}
					onSaved(normalized);
					onClose();
				} catch {
					setFail(true);
				} finally {
					setSaving(false);
				}
			};
			/** 选择目录：系统对话框从默认位置打开，选中路径回填输入框（仍可手改）。 */
			const browse = async () => {
				if (browsing) return;
				setBrowsing(true);
				setBrowseFail(false);
				const picked = await chooseLogDir();
				setBrowsing(false);
				if (picked !== null) {
					setDraft(picked);
					setFail(false);
				} else setBrowseFail(true);
			};
			return (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: `${Modal_module_css_default.modal} ${Modal_module_css_default.modalWide}`,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.modalTitle }, t("logPathSettingTitle")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("errorClose"),
				onClick: onClose
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, (0, react.createElement)("div", { className: LogsView_module_css_default.pathDialog }, (0, react.createElement)("div", { className: LogsView_module_css_default.pathDialogDesc }, t("logPathSettingDesc")), (0, react.createElement)("div", { className: LogsView_module_css_default.pathDialogRow }, (0, react.createElement)("input", {
				type: "text",
				className: LogsView_module_css_default.pathDraft,
				value: draft,
				placeholder: t("logPathPlaceholder"),
				spellCheck: false,
				onChange: (e) => {
					setDraft(e.currentTarget.value);
					setFail(false);
					setBrowseFail(false);
				}
			}), (0, react.createElement)("button", {
				type: "button",
				className: LogsView_module_css_default.btn,
				disabled: browsing,
				title: t("logPathBrowse"),
				onClick: () => void browse()
			}, browsing ? t("logPathSaving") : t("logPathBrowse"))), (0, react.createElement)("div", { className: LogsView_module_css_default.pathDialogReset }, (0, react.createElement)("span", { className: LogsView_module_css_default.pathDialogHint }, t("logPathResetHint")), (0, react.createElement)("button", {
				type: "button",
				className: LogsView_module_css_default.linkBtn,
				onClick: () => {
					setDraft(defaultPath);
					setFail(false);
					setBrowseFail(false);
				}
			}, t("logPathReset"))), browseFail && (0, react.createElement)("div", { className: LogsView_module_css_default.footFail }, t("logPathBrowseFail")), fail && (0, react.createElement)("div", { className: LogsView_module_css_default.footFail }, t("logPathSaveFail")), (0, react.createElement)("div", { className: LogsView_module_css_default.pathDialogFoot }, (0, react.createElement)("button", {
				type: "button",
				className: LogsView_module_css_default.btn,
				disabled: saving,
				onClick: onClose
			}, t("confirmCancel")), (0, react.createElement)("button", {
				type: "button",
				className: `${LogsView_module_css_default.btn} ${LogsView_module_css_default.btnPrimary}`,
				disabled: saving,
				onClick: () => void save()
			}, saving ? t("logPathSaving") : t("logPathSave")))))));
		}
		//#endregion
		//#region src/client/components/views/LogsView.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* 系统日志入口视图：不在这里堆全文，而是给出「打开日志查看器」窗口入口 +
		* 日志文件真实路径（可一键在系统文件管理器中定位）+ 最近若干条预览。
		* 完整阅读/筛选/分页在 LogsModal 内置查看器弹窗里完成 —— 无需借助任何
		* 外部软件，点击即弹出自己的窗口加载本地 JSONL 日志。
		*/
		/** 设置页预览条数：只放最近一小段，给用户快速感观，完整内容进查看器。 */
		const PREVIEW = 12;
		function LogsView({ t, logPath, onLogPathSaved }) {
			const [entries, setEntries] = (0, react.useState)([]);
			const [path, setPath] = (0, react.useState)("");
			const [defaultPath, setDefaultPath] = (0, react.useState)("");
			const [loading, setLoading] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(false);
			const [open, setOpen] = (0, react.useState)(false);
			const [opening, setOpening] = (0, react.useState)(false);
			const [openFailed, setOpenFailed] = (0, react.useState)(false);
			const [showPathModal, setShowPathModal] = (0, react.useState)(false);
			const mountedRef = (0, react.useRef)(true);
			const load = (0, react.useCallback)(async () => {
				setLoading(true);
				try {
					const res = await fetch("/dsh-plugin-hub/logs", { cache: "no-store" });
					if (!res.ok) throw new Error(`http ${res.status}`);
					const data = await res.json();
					if (mountedRef.current) {
						setEntries(data.entries);
						if (data.path !== "") setPath(data.path);
						if (data.defaultPath !== void 0) setDefaultPath(data.defaultPath);
						setError(false);
					}
				} catch {
					if (mountedRef.current) setError(true);
				} finally {
					if (mountedRef.current) setLoading(false);
				}
			}, []);
			(0, react.useEffect)(() => {
				mountedRef.current = true;
				load();
				return () => {
					mountedRef.current = false;
				};
			}, [load]);
			/** 导出：拼纯文本 → Blob → 触发浏览器下载 .log 文件 */
			const exportFile = () => {
				const text = entries.map((e) => `[${fmtLogTime(e.at)}] [${e.level}] [${e.category}] [${e.event}] ${e.message}`).join("\n");
				if (text === "") return;
				const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "dsh-plugin-hub-log.log";
				document.body.appendChild(a);
				a.click();
				a.remove();
				URL.revokeObjectURL(url);
			};
			/** 在系统文件管理器中定位日志文件。 */
			const openFile = async () => {
				if (opening) return;
				setOpening(true);
				setOpenFailed(false);
				const ok = await openLogFile();
				setOpening(false);
				if (!ok) setOpenFailed(true);
			};
			const preview = entries.slice(0, PREVIEW);
			return (0, react.createElement)("div", { className: LogsView_module_css_default.panel }, (0, react.createElement)("div", { className: LogsView_module_css_default.head }, (0, react.createElement)("span", { className: LogsView_module_css_default.headHint }, t("logsHeadHint")), (0, react.createElement)("div", { className: LogsView_module_css_default.actions }, (0, react.createElement)("button", {
				type: "button",
				className: LogsView_module_css_default.btn,
				onClick: () => setOpen(true)
			}, t("logViewerOpen")), (0, react.createElement)("button", {
				type: "button",
				className: LogsView_module_css_default.btn,
				disabled: entries.length === 0,
				onClick: exportFile
			}, t("logsExport")), (0, react.createElement)("button", {
				type: "button",
				className: LogsView_module_css_default.btn,
				disabled: loading,
				onClick: () => void load()
			}, t("logsRefresh")))), (0, react.createElement)("div", { className: LogsView_module_css_default.pathRow }, (0, react.createElement)("span", { className: LogsView_module_css_default.pathLabel }, t("logPathSettingTitle")), (0, react.createElement)("span", {
				className: LogsView_module_css_default.pathText,
				title: path
			}, path === "" ? "…" : path), openFailed && (0, react.createElement)("span", { className: LogsView_module_css_default.footFail }, t("logOpenFileFail")), (0, react.createElement)("button", {
				type: "button",
				className: LogsView_module_css_default.btn,
				onClick: () => setShowPathModal(true)
			}, t("logPathChange")), (0, react.createElement)("button", {
				type: "button",
				className: LogsView_module_css_default.btn,
				disabled: opening || path === "",
				title: t("logOpenFileTip"),
				onClick: () => void openFile()
			}, t("logOpenFile"))), error ? (0, react.createElement)("div", { className: LogsView_module_css_default.empty }, t("logsLoadFail")) : loading && entries.length === 0 ? (0, react.createElement)("div", { className: LogsView_module_css_default.empty }, t("logsLoading")) : entries.length === 0 ? (0, react.createElement)("div", { className: LogsView_module_css_default.empty }, t("logsEmpty")) : (0, react.createElement)("div", { className: LogsView_module_css_default.list }, preview.map((e, i) => (0, react.createElement)("button", {
				key: `${e.at}-${i}`,
				type: "button",
				className: LogsView_module_css_default.previewRow,
				onClick: () => setOpen(true),
				title: t("logViewerOpen")
			}, (0, react.createElement)(LogEntryRow, {
				e,
				t
			})))), open && (0, react.createElement)(LogsModal, {
				t,
				onClose: () => setOpen(false)
			}), showPathModal && (0, react.createElement)(LogsPathModal, {
				t,
				defaultPath,
				currentPath: path,
				onSaved: (v) => {
					onLogPathSaved(v);
					load();
				},
				onClose: () => setShowPathModal(false)
			}));
		}
		//#endregion
		//#region src/client/components/views/SettingsView.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Settings view: desktop-settings navigation — a fixed left sidebar lists
		* the sections (icon + label, click to switch), the right pane shows the
		* active section's rows. New settings only add rows, new areas only add a
		* sidebar entry.
		*
		* Sections mirror what the local server actually enforces:
		*   Updates & Sources — startup update check / npm mirror / HTTP proxy
		*                        (all wired into the install command path)
		*   Security & Trust  — restricted custom installs (server 403 gate)
		*   Diagnostics       — live connectivity probe + environment snapshot
		*   Logs              — system log viewer + storage location
		*/
		/** npm 镜像源预设：空串 = 未配置（跟随用户本机 npm 配置，本插件不注入任何 registry）。
		*  只提供常见国内顶级镜像下拉，不做自定义输入 —— 想用其它镜像直接在 ~/.npmrc 配置即可。 */
		const MIRROR_PRESETS = [
			{
				value: "",
				labelKey: "mirrorNone"
			},
			{
				value: "https://registry.npmjs.org",
				labelKey: "mirrorOfficial"
			},
			{
				value: "https://registry.npmmirror.com",
				labelKey: "mirrorNpmmirror"
			},
			{
				value: "https://mirrors.cloud.tencent.com/npm/",
				labelKey: "mirrorTencent"
			},
			{
				value: "https://mirrors.tuna.tsinghua.edu.cn/npm/",
				labelKey: "mirrorTsinghua"
			}
		];
		/** 左侧导航：顺序即展示顺序；labelKey 是分组标题，icon 是行内小图标。 */
		const NAV = [
			{
				key: "updates",
				labelKey: "settingsUpdate",
				icon: UpdatesIcon
			},
			{
				key: "security",
				labelKey: "settingsSecurity",
				icon: SecurityIcon
			},
			{
				key: "diagnostics",
				labelKey: "settingsDiagnostics",
				icon: DiagnosticsIcon
			},
			{
				key: "logs",
				labelKey: "settingsLogs",
				icon: LogsIcon
			},
			{
				key: "reset",
				labelKey: "settingsReset",
				icon: ResetIcon
			}
		];
		/** 设置行：默认标签左控件右；stack=true 时控件独占一行（文本框整行显示），hairline 分隔。 */
		function SettingRow({ title, desc, children, stack = false }) {
			return (0, react.createElement)("div", { className: stack ? SettingsView_module_css_default.settingRowStack : SettingsView_module_css_default.settingRow }, (0, react.createElement)("div", { className: SettingsView_module_css_default.settingLabel }, (0, react.createElement)("div", { className: SettingsView_module_css_default.settingTitle }, title), desc ? (0, react.createElement)("div", { className: SettingsView_module_css_default.settingDesc }, desc) : null), (0, react.createElement)("div", { className: stack ? SettingsView_module_css_default.settingControlStack : SettingsView_module_css_default.settingControl }, children));
		}
		function SettingsView({ t, settings, update, reset, env, onCopy, openSection, onConsumedOpenSection }) {
			/** 当前激活的分组：左侧导航点击切换，右侧只渲染这一组 */
			const [section, setSection] = (0, react.useState)("updates");
			/** 恢复默认确认弹窗：点按钮先弹窗询问，确认后才真正 reset（不做两段式按钮） */
			const [resetConfirm, setResetConfirm] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				if (!openSection) return;
				setSection(openSection);
				onConsumedOpenSection?.();
			}, [openSection, onConsumedOpenSection]);
			const [proxyProbe, setProxyProbe] = (0, react.useState)("idle");
			const proxyProbeTimer = (0, react.useRef)(null);
			const proxyProbeSeq = (0, react.useRef)(0);
			(0, react.useEffect)(() => () => {
				if (proxyProbeTimer.current !== null) window.clearTimeout(proxyProbeTimer.current);
				proxyProbeSeq.current += 1;
			}, []);
			(0, react.useEffect)(() => {
				if (settings.proxy === "") setProxyProbe("idle");
			}, [settings.proxy]);
			const probeProxyNow = (value) => {
				const v = value.trim();
				if (v === "") {
					setProxyProbe("idle");
					return;
				}
				const seq = ++proxyProbeSeq.current;
				setProxyProbe("checking");
				fetch("/dsh-plugin-hub/proxy-check", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ proxy: v }),
					cache: "no-store"
				}).then((res) => res.json()).then((data) => {
					if (seq !== proxyProbeSeq.current) return;
					setProxyProbe(data.ok ? "ok" : "fail");
				}).catch(() => {
					if (seq === proxyProbeSeq.current) setProxyProbe("fail");
				});
			};
			const onProxyChange = (e) => {
				const value = e.target.value;
				update({ proxy: value });
				if (proxyProbeTimer.current !== null) window.clearTimeout(proxyProbeTimer.current);
				proxyProbeTimer.current = window.setTimeout(() => probeProxyNow(value), 700);
			};
			const onMirrorChange = (value) => update({ npmRegistry: value });
			/** 每个分组的页面副标题（导航标题之上再补一句说明，保持桌面设置质感） */
			const pageDesc = {
				updates: t("settingsUpdateDesc"),
				security: t("settingsSecurityDesc"),
				diagnostics: t("settingsDiagnosticsDesc"),
				logs: t("settingsLogsDesc"),
				reset: t("settingsResetDesc")
			};
			const activeNav = NAV.find((n) => n.key === section) ?? NAV[0];
			const updatesCard = (0, react.createElement)("div", { className: SettingsView_module_css_default.card }, (0, react.createElement)(SettingRow, {
				title: t("settingsCheckOnStart"),
				desc: t("settingsCheckOnStartDesc"),
				children: (0, react.createElement)(Toggle, {
					checked: settings.checkUpdatesOnStart,
					onChange: (v) => update({ checkUpdatesOnStart: v }),
					title: t("settingsCheckOnStart")
				})
			}), (0, react.createElement)(SettingRow, {
				title: t("settingsMirror"),
				desc: t("settingsMirrorDesc"),
				stack: true,
				children: (0, react.createElement)(Dropdown, {
					value: settings.npmRegistry,
					options: MIRROR_PRESETS.map((m) => ({
						value: m.value,
						label: t(m.labelKey)
					})),
					onChange: onMirrorChange,
					title: t("settingsMirror"),
					className: `${SettingsView_module_css_default.controlDropdown} ${Dropdown_module_css_default.dropdownFill}`
				})
			}), (0, react.createElement)(SettingRow, {
				title: t("settingsProxy"),
				desc: t("settingsProxyDesc"),
				stack: true,
				children: (0, react.createElement)("div", { className: SettingsView_module_css_default.proxyControl }, (0, react.createElement)("input", {
					className: SettingsView_module_css_default.textInput,
					type: "text",
					value: settings.proxy,
					placeholder: "http://127.0.0.1:7890",
					spellCheck: false,
					onChange: onProxyChange
				}), proxyProbe === "checking" ? (0, react.createElement)("div", { className: SettingsView_module_css_default.proxyHint }, t("proxyCheckChecking")) : proxyProbe === "ok" ? (0, react.createElement)("div", { className: `${SettingsView_module_css_default.proxyHint} ${SettingsView_module_css_default.proxyHintOk}` }, t("proxyCheckOk")) : proxyProbe === "fail" ? (0, react.createElement)("div", { className: `${SettingsView_module_css_default.proxyHint} ${SettingsView_module_css_default.proxyHintFail}` }, t("proxyCheckFail")) : null)
			}));
			const securityCard = (0, react.createElement)("div", { className: SettingsView_module_css_default.card }, (0, react.createElement)(SettingRow, {
				title: t("settingsEnableNpm"),
				desc: t("settingsEnableNpmDesc"),
				children: (0, react.createElement)(Toggle, {
					checked: settings.enableNpmInstall,
					onChange: (v) => update({ enableNpmInstall: v }),
					title: t("settingsEnableNpm")
				})
			}), (0, react.createElement)(SettingRow, {
				title: t("settingsEnableGit"),
				desc: t("settingsEnableGitDesc"),
				children: (0, react.createElement)(Toggle, {
					checked: settings.enableGitInstall,
					onChange: (v) => update({ enableGitInstall: v }),
					title: t("settingsEnableGit")
				})
			}), (0, react.createElement)(SettingRow, {
				title: t("settingsEnableDsh"),
				desc: t("settingsEnableDshDesc"),
				children: (0, react.createElement)(Toggle, {
					checked: settings.enableDshInstall,
					onChange: (v) => update({ enableDshInstall: v }),
					title: t("settingsEnableDsh")
				})
			}));
			const diagnosticsCard = (0, react.createElement)("div", { className: SettingsView_module_css_default.card }, (0, react.createElement)(DiagnosticsView, {
				t,
				env,
				proxy: settings.proxy,
				onCopy
			}));
			const logsCard = (0, react.createElement)("div", { className: SettingsView_module_css_default.card }, (0, react.createElement)(LogsView, {
				t,
				logPath: settings.logPath,
				onLogPathSaved: (v) => update({ logPath: v })
			}));
			const resetCard = (0, react.createElement)("div", { className: SettingsView_module_css_default.card }, (0, react.createElement)(SettingRow, {
				title: t("settingsReset"),
				desc: t("settingsResetDetail"),
				children: (0, react.createElement)("button", {
					type: "button",
					className: SettingsView_module_css_default.resetBtn,
					onClick: () => setResetConfirm(true)
				}, t("settingsResetRun"))
			}));
			return (0, react.createElement)("div", { className: SettingsView_module_css_default.root }, (0, react.createElement)("nav", {
				className: SettingsView_module_css_default.sidebar,
				"aria-label": t("viewSettings")
			}, NAV.map((item) => (0, react.createElement)("button", {
				key: item.key,
				type: "button",
				className: section === item.key ? SettingsView_module_css_default.navItemActive : SettingsView_module_css_default.navItem,
				onClick: () => setSection(item.key),
				"aria-current": section === item.key ? "page" : void 0,
				title: t(item.labelKey)
			}, (0, react.createElement)("span", { className: SettingsView_module_css_default.navIcon }, (0, react.createElement)(item.icon)), (0, react.createElement)("span", { className: SettingsView_module_css_default.navLabel }, t(item.labelKey))))), (0, react.createElement)("div", { className: SettingsView_module_css_default.content }, (0, react.createElement)("div", { className: SettingsView_module_css_default.pageHeader }, (0, react.createElement)("div", { className: SettingsView_module_css_default.pageTitle }, t(activeNav.labelKey)), (0, react.createElement)("div", { className: SettingsView_module_css_default.pageDesc }, pageDesc[section])), section === "updates" ? updatesCard : section === "security" ? securityCard : section === "diagnostics" ? diagnosticsCard : section === "logs" ? logsCard : resetCard), resetConfirm && (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) setResetConfirm(false);
				}
			}, (0, react.createElement)("div", {
				className: Modal_module_css_default.modal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.modalTitle }, t("settingsReset")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				type: "button",
				"aria-label": t("errorClose"),
				onClick: () => setResetConfirm(false)
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, (0, react.createElement)("div", { className: Modal_module_css_default.confirmIconWrap }, (0, react.createElement)(ConfirmIcon, { type: "warning" })), (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("settingsResetConfirmDetail")), (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartLater,
				type: "button",
				onClick: () => setResetConfirm(false)
			}, t("cancel")), (0, react.createElement)("button", {
				className: Modal_module_css_default.restartNowWarning,
				type: "button",
				onClick: () => {
					setResetConfirm(false);
					reset();
				}
			}, t("settingsResetConfirm")))))));
		}
		//#endregion
		//#region src/client/components/PluginHubSection.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* Plugin Hub section: wires the catalog data pipeline, the background task
		* queue and the feedback state together. Data/queue logic lives in hooks/,
		* rendering is delegated to the small presentational components in this
		* folder; it hosts the dialogs/toast and the section-level copy actions.
		*/
		function PluginHubSection({ t: _hostT, locale }) {
			const { lang, langKey, langPath, t, toggleLang } = useLanguage(locale);
			const catalog = useCatalog(lang);
			/** 设置状态：服务端 hub-settings.json 持久化，本地乐观更新即时生效 */
			const { settings: hubSettings, ready: settingsReady, update: updateSettings, reset: resetSettings } = useSettings();
			/** 一级导航：插件市场 / 已安装 / 自定义安装 / 设置 */
			const [view, setView] = (0, react.useState)("market");
			/** 外部跳转设置分组的一次性信号（错误弹窗「去系统诊断」→ 设置 → 系统诊断）：
			*  传给 SettingsView 消费后即清空，避免下次进设置被强制带跳 */
			const [settingsSection, setSettingsSection] = (0, react.useState)(null);
			/** 网络不通提示的「去系统诊断」直达：关掉所有弹窗（错误/通知/安装确认进度等，
			*  否则 InstallModal 失败后仍停驻原地盖住设置页）→ 切到设置页 → 切到系统诊断分组（自动跑连通性检测） */
			const openDiagnostics = () => {
				setErrorMsg(null);
				setShowNotifications(false);
				setConfirmPlugin(null);
				setConfirmCustomTarget(null);
				setConfirmGlobalNpm(null);
				setUninstallPlugin(null);
				setUninstallItem(null);
				setDetailItem(null);
				setShowHubUpdate(false);
				setShowAbout(false);
				setIgnoreTarget(null);
				setShowRestartConfirm(false);
				setView("settings");
				setSettingsSection("diagnostics");
			};
			/** 全局反馈 Toast：{id} 用于重复触发时重新走入场动画，kind 决定文案与配色 */
			const [toast, setToast] = (0, react.useState)(null);
			/** 复制反馈：记录刚复制安装命令的仓库，按钮短暂切换为「已复制」样式 */
			const [copied, setCopied] = (0, react.useState)(null);
			/** 信任确认弹窗：记录待安装的插件，确认后才执行复制 */
			const [confirmPlugin, setConfirmPlugin] = (0, react.useState)(null);
			/** 弹窗动作是否为「更新」：已安装插件点「更新」→ 走同一条 add 命令原位覆盖重装，文案区分安装/更新 */
			const [confirmIsUpdate, setConfirmIsUpdate] = (0, react.useState)(false);
			/** 命令行安装确认弹窗：记录待安装的裸目标（npm 包名 / GitHub 地址，DSH 命令已剥成裸目标）——
			*  与应用商店同一套确认/进度/结果弹窗，提供时 plugin 传 null 走 customTarget 模式 */
			const [confirmCustomTarget, setConfirmCustomTarget] = (0, react.useState)(null);
			/** 自定义安装入口渠道（三张卡片之一）：随确认弹窗记录，提交时上报服务端，
			*  报错/日志据此精准溯源「从哪个入口发起」（npm 全局安装固定为 'npm'） */
			const [confirmCustomChannel, setConfirmCustomChannel] = (0, react.useState)(null);
			/** 全局 npm 安装确认弹窗（官方 `npm install -g <pkgs>`）：记录原始命令 + 解析出的包列表，
			*  走与应用商店同一套确认/进度/结果弹窗（plugin 传 null，InstallModal 走 globalNpm 模式） */
			const [confirmGlobalNpm, setConfirmGlobalNpm] = (0, react.useState)(null);
			/** Hub 自我更新说明弹窗：点「可更新」徽标先展示版本 + Markdown 变更记录，确认后再进安装弹窗 */
			const [showHubUpdate, setShowHubUpdate] = (0, react.useState)(false);
			/** 「关注我们」弹窗：GitHub 图标后按钮点击打开，展示平台介绍 + 用户反馈群二维码（Worker /about 推送） */
			const [showAbout, setShowAbout] = (0, react.useState)(false);
			/** 卸载确认弹窗：记录待卸载的插件（目录内） */
			const [uninstallPlugin, setUninstallPlugin] = (0, react.useState)(null);
			/** 卸载确认弹窗：记录待卸载的已安装项（自定义安装无目录数据，按包名直卸） */
			const [uninstallItem, setUninstallItem] = (0, react.useState)(null);
			/** 已安装详情弹窗：记录当前查看的已安装项（行点击 / 详情按钮打开） */
			const [detailItem, setDetailItem] = (0, react.useState)(null);
			/** 待重启确认弹窗：已安装列表行内「重启」先弹「立即重启 / 稍后重启」确认（与通知中心一致），
			*  确认后才真正触发宿主重启，避免误触 */
			const [showRestartConfirm, setShowRestartConfirm] = (0, react.useState)(false);
			/** 安装/卸载完成后的结果视图：停留弹窗内，点「完成」关闭 */
			const [installDone, setInstallDone] = (0, react.useState)(false);
			const [uninstallDone, setUninstallDone] = (0, react.useState)(false);
			/** 结果视图是否给「立即重启」：服务端任务终态带出（卸载时 loader 已即时移除 → false 只给「完成」；
			*  true 时通知中心待重启条目同步常驻，直到用户点「立即重启」真正重启后才消失） */
			const [installNeedsRestart, setInstallNeedsRestart] = (0, react.useState)(true);
			const [uninstallNeedsRestart, setUninstallNeedsRestart] = (0, react.useState)(true);
			/** 结果视图「立即重启」：请求宿主重启后进入等待，服务回来后整页刷新 */
			const [restarting, setRestarting] = (0, react.useState)(false);
			/** 操作失败完整信息 + 所属插件仓库 + 失败类型（决定弹窗标题「安装失败/卸载失败」）+ 实际执行的安装命令 + 尝试过的安装方式（issue 预填用） */
			const [errorMsg, setErrorMsg] = (0, react.useState)(null);
			/** 通知中心记录：localStorage 持久化，每次安装/卸载任务成败都留痕（启动时读回） */
			const [notifications, setNotifications] = (0, react.useState)(() => loadNotifications());
			/** 通知中心弹窗：一级导航「设置」tab 后边的铃铛入口按钮打开 */
			const [showNotifications, setShowNotifications] = (0, react.useState)(false);
			/** 「忽略本次更新」确认弹窗：{ repo, version }；null = 关闭 */
			const [ignoreTarget, setIgnoreTarget] = (0, react.useState)(null);
			/** 宿主机器环境快照：提交 bug 的 issue 正文附带；取不到为 null（链接少环境段，不阻塞） */
			const [env, setEnv] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				let alive = true;
				getEnv().then((info) => {
					if (alive) setEnv(info);
				});
				return () => {
					alive = false;
				};
			}, []);
			(0, react.useEffect)(() => {
				ensurePluginCss();
			}, [view]);
			const queue = useTaskQueue({
				t,
				langKey,
				refreshInstalled: catalog.refreshInstalled,
				onInstallDone: (viaModal, repo, needsRestart, update) => {
					setInstallNeedsRestart(needsRestart);
					if (viaModal) setInstallDone(true);
					else setToast({
						id: Date.now(),
						kind: "done"
					});
					setNotifications(addSuccess({
						kind: "install",
						action: update ? "update" : "install",
						repo: repo ?? ""
					}));
				},
				onUninstallDone: (viaModal, repo, needsRestart) => {
					setUninstallNeedsRestart(needsRestart);
					if (viaModal) setUninstallDone(true);
					else setToast({
						id: Date.now(),
						kind: "removed"
					});
					setNotifications(addSuccess({
						kind: "uninstall",
						repo: repo ?? ""
					}));
				},
				onError: (message, repo, kind, command, attempts, update) => {
					const issueRepo = issueRepoOf(repo ?? "", catalog.installedItems, catalog.plugins);
					setErrorMsg({
						message,
						repo: issueRepo,
						kind,
						command,
						attempts
					});
					setNotifications(addFailure({
						kind,
						action: update ? "update" : "install",
						repo: repo ?? "",
						message,
						command,
						attempts
					}));
				},
				installPlugin: confirmPlugin,
				installCustomTarget: confirmCustomTarget,
				installGlobalTarget: confirmGlobalNpm ? confirmGlobalNpm.pkgs.join(" ") : null,
				uninstallPlugin,
				uninstallName: uninstallItem ? uninstallItem.name : null,
				installedName: catalog.installedName,
				resolvePending: (repo) => {
					const p = catalog.plugins?.find((x) => x.source?.repo === repo);
					return p ? {
						desc: p.description,
						version: p.version
					} : null;
				}
			});
			/** 补齐更新提醒：把「当前有更新但通知中心还没有」的插件补写进通知（repo+version 去重）。
			*  返回本次实际新增的条数（0 = 无可更新或全部已提示过）。启动检查与打开通知中心共用，
			*  保证通知中心始终反映可更新状态：同一版本只一条、清空/删除后重开恢复、更新完成后消失。 */
			const syncUpdateNotices = () => {
				const updatable = catalog.installedItems.filter((i) => i.hasUpdate && i.plugin);
				if (updatable.length === 0) return 0;
				const known = new Set(loadIgnoredUpdates());
				for (const r of loadNotifications()) if (r.kind === "update") known.add(`${r.repo}@${r.version ?? ""}`);
				const fresh = updatable.filter((item) => item.repo !== null && !known.has(`${item.repo}@${item.catalogVersion ?? ""}`));
				if (fresh.length === 0) return 0;
				for (const item of fresh) if (item.repo) addUpdateNotice({
					kind: "update",
					repo: item.repo,
					version: item.catalogVersion ?? void 0
				});
				setNotifications(loadNotifications());
				return fresh.length;
			};
			const startupCheckedRef = (0, react.useRef)(false);
			(0, react.useEffect)(() => {
				if (startupCheckedRef.current) return;
				if (!settingsReady || catalog.plugins === null || catalog.failed) return;
				startupCheckedRef.current = true;
				if (!hubSettings.checkUpdatesOnStart) return;
				syncUpdateNotices();
			}, [
				settingsReady,
				hubSettings,
				catalog.plugins,
				catalog.failed,
				catalog.installedItems,
				queue
			]);
			(0, react.useEffect)(() => {
				if (!confirmPlugin && !confirmCustomTarget && !confirmGlobalNpm && !uninstallPlugin && !uninstallItem && !detailItem && !showHubUpdate && !showAbout && !showNotifications && !ignoreTarget) return;
				const onKey = (e) => {
					if (e.key === "Escape") {
						setConfirmPlugin(null);
						setConfirmCustomTarget(null);
						setConfirmCustomChannel(null);
						setConfirmGlobalNpm(null);
						setUninstallPlugin(null);
						setUninstallItem(null);
						setDetailItem(null);
						setUninstallDone(false);
						setShowHubUpdate(false);
						setShowAbout(false);
						setShowNotifications(false);
						setIgnoreTarget(null);
					}
				};
				window.addEventListener("keydown", onKey);
				return () => window.removeEventListener("keydown", onKey);
			}, [
				confirmPlugin,
				confirmCustomTarget,
				uninstallPlugin,
				uninstallItem,
				detailItem,
				showHubUpdate,
				showAbout,
				showNotifications,
				ignoreTarget
			]);
			(0, react.useEffect)(() => {
				if (!toast) return;
				const timer = window.setTimeout(() => setToast(null), 2400);
				return () => window.clearTimeout(timer);
			}, [toast]);
			/** 复制文本到剪贴板，返回是否成功（Clipboard API + 隐藏 textarea 兜底）。 */
			const doCopy = async (text) => {
				try {
					await navigator.clipboard.writeText(text);
					return true;
				} catch {
					const ta = document.createElement("textarea");
					ta.value = text;
					ta.style.position = "fixed";
					ta.style.opacity = "0";
					document.body.appendChild(ta);
					ta.select();
					let ok = false;
					try {
						ok = document.execCommand("copy");
					} catch {
						ok = false;
					}
					document.body.removeChild(ta);
					return ok;
				}
			};
			/** 命令行安装目标是否已安装（与服务端 already 判定同口径）：GitHub 地址按仓库身份匹配
			*  （归一化后比对已装项的 repo/spec），npm 包名按依赖 key 直查。命中 → 弹窗转「更新」语义
			*  （mode=update 放行覆盖重装），避免重复点击撞 409 报错。 */
			const customTargetInstalled = (raw) => {
				const target = raw.trim();
				if (!target) return false;
				const repo = repoFromInstallTarget(target);
				if (/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(repo)) {
					const needle = repo.toLowerCase();
					return catalog.installedItems.some((i) => i.repo !== null && i.repo.toLowerCase() === needle || repoFromInstallTarget(i.spec).toLowerCase() === needle);
				}
				const pkg = repo.replace(/@[^@]*$/, "").toLowerCase();
				return catalog.installedItems.some((i) => i.name.toLowerCase() === pkg) || Object.keys(catalog.installed).some((k) => k.toLowerCase() === pkg);
			};
			/** 弹窗动作一：复制安装命令到剪贴板，引导去终端粘贴执行（npm 通道显示包名命令）。 */
			const copyCommand = async (p) => {
				const repo = p.source?.repo ?? "";
				if (await doCopy(installCommandOf(p))) {
					setCopied(repo);
					setToast({
						id: Date.now(),
						kind: "copied"
					});
					window.setTimeout(() => setCopied((cur) => cur === repo ? null : cur), 1600);
				}
				setConfirmPlugin(null);
			};
			/** 卸载弹窗动作：复制卸载命令，万一直接卸载失败可去终端手动执行。
			*  自定义安装（无目录数据）按已安装项包名直卸，同样给复制通道。 */
			const copyUninstallCommand = async () => {
				const name = uninstallItem ? uninstallItem.name : uninstallPlugin ? catalog.installedName(uninstallPlugin) : null;
				if (!name) return;
				if (await doCopy(`dsh plugin remove ${name}`)) setToast({
					id: Date.now(),
					kind: "copied"
				});
			};
			/** 详情弹窗动作：在系统文件管理器里定位安装目录；服务端失败给 toast 提示。 */
			const revealFolder = async (item) => {
				if (!await revealInstallFolder(item.name)) setToast({
					id: Date.now(),
					kind: "revealFail"
				});
			};
			/** 「立即重启」：POST 同源 /restart，宿主进程自杀重启；随后轮询服务恢复后整页刷新。 */
			const requestRestart = async () => {
				if (restarting) return;
				setRestarting(true);
				try {
					await fetch("/dsh-plugin-hub/restart", { method: "POST" });
				} catch {}
				let attempts = 0;
				const poll = async () => {
					attempts += 1;
					try {
						if ((await fetch("/dsh-plugin-hub/active", {
							method: "GET",
							cache: "no-store"
						})).ok) {
							window.location.reload();
							return;
						}
					} catch {}
					if (attempts < 60) window.setTimeout(poll, 1e3);
					else {
						setRestarting(false);
						setToast({
							id: Date.now(),
							kind: "fail"
						});
					}
				};
				window.setTimeout(poll, 1200);
			};
			const { total, installedName, installedVersion, hasUpdate } = catalog;
			const statsTotal = catalog.stats?.total ?? total;
			const statsVerified = catalog.stats?.verified ?? 0;
			const count = catalog.visible.length;
			const hubEntry = catalog.hubPlugin;
			return (0, react.createElement)("div", { className: Header_module_css_default.root }, (0, react.createElement)(CatalogHeader, {
				t,
				langPath,
				statsTotal,
				statsVerified,
				onToggleLang: toggleLang,
				hubUpdate: catalog.hubHasUpdate,
				onVersionClick: () => {
					catalog.refreshHub().then(() => setShowHubUpdate(true));
				},
				onAboutClick: () => setShowAbout(true)
			}), (0, react.createElement)("div", { className: Header_module_css_default.tabsRow }, (0, react.createElement)(SectionTabs, {
				view,
				setView,
				installedCount: catalog.installedItems.length,
				t,
				noticeCount: notifications.length + queue.queue.length + queue.pendingRestarts.length,
				onOpenNotifications: () => {
					if (hubSettings.checkUpdatesOnStart) syncUpdateNotices();
					setShowNotifications(true);
				}
			})), view === "market" ? (0, react.createElement)(MarketView, {
				catalog,
				t,
				langPath,
				langKey,
				copied,
				resultText: catalog.plugins === null || catalog.failed ? null : catalog.category === "all" && count === total ? t("pluginsTotal", { n: count }) : t("filterResults", { n: count }),
				onInstall: (p, opts) => {
					setInstallDone(false);
					setConfirmIsUpdate(opts?.update ?? false);
					queue.clearModalTask();
					setConfirmPlugin(p);
				},
				onUninstall: (p) => {
					setUninstallDone(false);
					queue.clearModalTask();
					setUninstallPlugin(p);
				},
				hasProxy: (hubSettings.proxy ?? "").trim() !== "",
				onOpenDiagnostics: openDiagnostics
			}) : view === "installed" ? (0, react.createElement)(InstalledView, {
				items: catalog.installedItems,
				langKey,
				t,
				platform: env?.platform ?? "",
				onOpenDetail: (item) => setDetailItem(item),
				onReveal: (item) => {
					revealFolder(item);
				},
				onUpdate: (item) => {
					if (!item.plugin) return;
					setDetailItem(null);
					setInstallDone(false);
					setConfirmIsUpdate(true);
					queue.clearModalTask();
					setConfirmPlugin(item.plugin);
				},
				onUninstall: (item) => {
					setDetailItem(null);
					setUninstallDone(false);
					queue.clearModalTask();
					setUninstallItem(item);
				},
				onRestart: () => setShowRestartConfirm(true)
			}) : view === "custom" ? (0, react.createElement)(CustomInstallView, {
				t,
				enableNpm: hubSettings.enableNpmInstall,
				enableGit: hubSettings.enableGitInstall,
				enableDsh: hubSettings.enableDshInstall,
				onOpenSettings: () => setView("settings"),
				profile: env?.profile ?? "web",
				onInstallCustom: (raw, opts) => {
					const target = raw.trim();
					if (!target) return;
					setInstallDone(false);
					queue.clearModalTask();
					if (opts?.globalNpm && opts.globalNpm.length > 0) {
						setConfirmCustomTarget(null);
						setConfirmCustomChannel(null);
						setConfirmIsUpdate(false);
						setConfirmGlobalNpm({
							raw,
							pkgs: opts.globalNpm
						});
						return;
					}
					setConfirmGlobalNpm(null);
					setConfirmCustomChannel(opts.installChannel);
					setConfirmIsUpdate(customTargetInstalled(target));
					setConfirmCustomTarget(target);
				}
			}) : (0, react.createElement)(SettingsView, {
				t,
				settings: hubSettings,
				update: updateSettings,
				reset: resetSettings,
				env,
				onCopy: (text) => {
					doCopy(text);
					setToast({
						id: Date.now(),
						kind: "copied"
					});
				},
				openSection: settingsSection,
				onConsumedOpenSection: () => setSettingsSection(null)
			}), showHubUpdate && (0, react.createElement)(HubUpdateModal, {
				info: catalog.hubUpdateInfo ?? { version: "1.4.0" },
				lang,
				t,
				hasUpdate: catalog.hubHasUpdate,
				onClose: () => setShowHubUpdate(false),
				onProceed: () => {
					setShowHubUpdate(false);
					if (hubEntry) {
						setInstallDone(false);
						setConfirmIsUpdate(true);
						queue.clearModalTask();
						setConfirmPlugin(hubEntry);
					}
				}
			}), showAbout && (0, react.createElement)(AboutModal, {
				info: catalog.hubAboutInfo ?? null,
				lang,
				t,
				onClose: () => setShowAbout(false)
			}), showNotifications && (0, react.createElement)(NotificationsModal, {
				records: notifications,
				tasks: queue.queue,
				pendingRestarts: queue.pendingRestarts,
				t,
				env,
				onClose: () => setShowNotifications(false),
				onCopy: (text) => {
					doCopy(text);
					setToast({
						id: Date.now(),
						kind: "errCopied"
					});
				},
				onClear: () => setNotifications(clearNotifications()),
				onRemove: (id) => setNotifications(removeNotification(id)),
				onUpdate: (repo) => {
					const plugin = catalog.installedItems.find((i) => i.repo === repo)?.plugin;
					if (!plugin) return;
					setShowNotifications(false);
					setInstallDone(false);
					setConfirmIsUpdate(true);
					queue.clearModalTask();
					setConfirmPlugin(plugin);
				},
				onIgnoreUpdate: (repo, version) => setIgnoreTarget({
					repo,
					version
				}),
				cancelTask: queue.cancelTask,
				restarting,
				onRestart: () => setShowRestartConfirm(true),
				onRunDiagnostics: openDiagnostics,
				resolveRepo: (repo) => issueRepoOf(repo, catalog.installedItems, catalog.plugins)
			}), ignoreTarget && (0, react.createElement)("div", {
				className: Modal_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) setIgnoreTarget(null);
				}
			}, (0, react.createElement)("div", {
				className: Modal_module_css_default.modal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.modalTitle }, t("ignoreUpdateConfirmTitle")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				type: "button",
				"aria-label": t("errorClose"),
				onClick: () => setIgnoreTarget(null)
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, (0, react.createElement)("div", { className: Modal_module_css_default.confirmIconWrap }, (0, react.createElement)(ConfirmIcon, { type: "question" })), (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("ignoreUpdateConfirmDetail")), (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartLater,
				type: "button",
				onClick: () => setIgnoreTarget(null)
			}, t("confirmCancel")), (0, react.createElement)("button", {
				className: Modal_module_css_default.restartNow,
				type: "button",
				onClick: () => {
					ignoreUpdate(ignoreTarget.repo, ignoreTarget.version);
					setNotifications(removeUpdateNotice(ignoreTarget.repo, ignoreTarget.version));
					setIgnoreTarget(null);
				}
			}, t("ignoreUpdateConfirm")))))), confirmPlugin && (0, react.createElement)(InstallModal, {
				plugin: confirmPlugin,
				done: installDone,
				task: queue.installModalTask,
				t,
				langPath,
				restarting,
				update: confirmIsUpdate,
				cliOnly: confirmPlugin.install?.webInstallable === false,
				submitting: queue.submitting,
				needsRestart: installNeedsRestart,
				onClose: () => setConfirmPlugin(null),
				onCopy: () => copyCommand(confirmPlugin),
				onInstall: () => queue.installNow(confirmPlugin, confirmIsUpdate ? { update: true } : void 0),
				onRestart: () => setShowRestartConfirm(true)
			}), confirmCustomTarget && (0, react.createElement)(InstallModal, {
				plugin: null,
				customTarget: confirmCustomTarget,
				done: installDone,
				task: queue.installModalTask,
				t,
				langPath,
				restarting,
				update: confirmIsUpdate,
				cliOnly: false,
				submitting: queue.submitting,
				needsRestart: installNeedsRestart,
				onClose: () => {
					setInstallDone(false);
					setConfirmCustomTarget(null);
					setConfirmCustomChannel(null);
				},
				onCopy: () => {
					doCopy(`pnpm add ${confirmCustomTarget}`);
					setToast({
						id: Date.now(),
						kind: "copied"
					});
				},
				onInstall: () => void queue.installCustom(confirmCustomTarget, {
					update: confirmIsUpdate,
					channel: confirmCustomChannel ?? "npm"
				}),
				onRestart: () => setShowRestartConfirm(true)
			}), confirmGlobalNpm && (0, react.createElement)(InstallModal, {
				plugin: null,
				globalNpm: confirmGlobalNpm.pkgs,
				done: installDone,
				task: queue.installModalTask,
				t,
				langPath,
				restarting,
				update: false,
				cliOnly: false,
				submitting: queue.submitting,
				needsRestart: installNeedsRestart,
				onClose: () => {
					setInstallDone(false);
					setConfirmGlobalNpm(null);
					setConfirmCustomChannel(null);
				},
				onCopy: () => {
					doCopy(`npm install -g ${confirmGlobalNpm.pkgs.join(" ")}`);
					setToast({
						id: Date.now(),
						kind: "copied"
					});
				},
				onInstall: () => void queue.installGlobalNpm(confirmGlobalNpm.pkgs, { channel: "npm" }),
				onRestart: () => setShowRestartConfirm(true)
			}), (uninstallPlugin || uninstallItem) && (0, react.createElement)(UninstallModal, {
				plugin: uninstallPlugin ?? pluginOfItem(uninstallItem),
				done: uninstallDone,
				task: queue.uninstallModalTask,
				t,
				langPath,
				restarting,
				submitting: queue.submitting,
				needsRestart: uninstallNeedsRestart,
				onClose: () => {
					setUninstallDone(false);
					setUninstallPlugin(null);
					setUninstallItem(null);
				},
				onCancel: () => {
					setUninstallPlugin(null);
					setUninstallItem(null);
				},
				onCopyCommand: copyUninstallCommand,
				onConfirm: () => {
					if (uninstallItem) queue.uninstallItem(uninstallItem);
					else if (uninstallPlugin) queue.uninstallNow(uninstallPlugin);
				},
				onRestart: () => setShowRestartConfirm(true)
			}), detailItem && (0, react.createElement)(InstalledDetailModal, {
				item: detailItem,
				t,
				lang: langKey,
				langPath,
				onClose: () => setDetailItem(null),
				onUpdate: (item) => {
					if (!item.plugin) return;
					setDetailItem(null);
					setInstallDone(false);
					setConfirmIsUpdate(true);
					queue.clearModalTask();
					setConfirmPlugin(item.plugin);
				},
				onUninstall: (item) => {
					setDetailItem(null);
					setUninstallDone(false);
					queue.clearModalTask();
					setUninstallItem(item);
				},
				onCopyPath: (path) => {
					doCopy(path);
					setToast({
						id: Date.now(),
						kind: "copied"
					});
				},
				onReveal: (item) => {
					revealFolder(item);
				}
			}), toast && (0, react.createElement)(Toast, {
				toast,
				t
			}), errorMsg && (0, react.createElement)(ErrorModal, {
				message: errorMsg.message,
				repo: errorMsg.repo,
				kind: errorMsg.kind,
				command: errorMsg.command,
				attempts: errorMsg.attempts,
				t,
				env,
				onCopy: (text) => {
					doCopy(text);
					setToast({
						id: Date.now(),
						kind: "errCopied"
					});
				},
				onRunDiagnostics: openDiagnostics,
				onClose: () => setErrorMsg(null)
			}), showRestartConfirm && (0, react.createElement)(RestartConfirmModal, {
				t,
				restarting,
				onClose: () => setShowRestartConfirm(false),
				onRestartNow: () => {
					setShowRestartConfirm(false);
					requestRestart();
				}
			}));
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/tokens.module.css.mjs
		const css = ":root,body[data-ds-dark-theme]{--hub-text-primary:var(--dsw-alias-label-primary,#1f2328);--hub-text-secondary:var(--dsw-alias-label-secondary,#6b7280);--hub-text-tertiary:var(--dsw-alias-label-tertiary,#8b93a1);--hub-text-disabled:var(--dsw-alias-label-disabled,#aab1bd);--hub-text-on-fill:var(--dsw-alias-label-primary-foreground,#fff);--hub-bg-1:var(--dsw-alias-bg-layer-1,#fff);--hub-bg-2:var(--dsw-alias-bg-layer-2,#80808014);--hub-bg-3:#8080801a;--hub-bg-btn:#8080801f;--hub-bg-hover:var(--dsw-alias-interactive-bg-hover,#80808029);--hub-bg-on-fill:#80808038;--hub-border-1:var(--dsw-alias-border-l1,#eceef1);--hub-border-2:var(--dsw-alias-border-l2,#e5e7eb);--hub-border-ghost:var(--dsw-alias-button-ghost-active-border,#4f6ef740);--hub-border-input:var(--dsw-alias-input-border,#6b728040);--hub-brand:var(--dsw-alias-state-business-primary,#4f6ef7);--hub-brand-hover:#3b5bdb;--hub-brand-tint:#4f6ef70f;--hub-brand-tint-strong:#4f6ef71f;--hub-brand-border:#4f6ef759;--hub-brand-border-soft:#4f6ef738;--hub-purple-1:#4f46e5;--hub-purple-2:#7c3aed;--hub-purple-border:#8b5cf68c;--hub-purple-tint:#4f46e514;--hub-purple-shadow:#4f46e547;--hub-purple-shadow-strong:#7c3aed6b;--hub-btn-fill:var(--dsw-alias-button-primary-fill,#1f2328);--hub-btn-hover:var(--dsw-alias-button-primary-hover,#43454a);--hub-success:#16a34a;--hub-success-tint:#16a34a1f;--hub-success-border:#16a34a4d;--hub-warn:var(--dsw-alias-state-warn-primary,#b8860b);--hub-warn-tint:#b8860b14;--hub-warn-border:#b8860b59;--hub-warn-strong:#b8860bd9;--hub-warning:var(--dsw-alias-state-warning-primary,#b45309);--hub-warning-hover:#92400e;--hub-warning-tint:#b4530914;--hub-warning-border:#b453094d;--hub-danger:var(--dsw-alias-state-danger-primary,#d1242f);--hub-danger-hover:var(--dsw-alias-state-danger-hover,#b91c1c);--hub-danger-strong:#b0202a;--hub-danger-text:#e5484d;--hub-danger-tint:#e5484d14;--hub-danger-tint-weak:#e5484d0d;--hub-danger-border:#e5484d59;--hub-danger-border-soft:#e5484d47;--hub-danger-soft:#d1242f14}body[data-ds-dark-theme]{--hub-bg-btn:#ffffff1f;--hub-brand:#6b6b76;--hub-brand-hover:#7d7d88;--hub-brand-tint:#ffffff14;--hub-brand-tint-strong:#ffffff21;--hub-brand-border:#ffffff4d;--hub-brand-border-soft:#fff3;--hub-purple-1:#6b6b76;--hub-purple-2:#7d7d88;--hub-purple-border:#ffffff59;--hub-purple-tint:#ffffff14;--hub-purple-shadow:#00000059;--hub-purple-shadow-strong:#00000080;--hub-warn:#6b6b76;--hub-warn-tint:#ffffff14;--hub-warn-border:#ffffff4d;--hub-warn-strong:#7d7d88;--hub-warning:#6b6b76;--hub-warning-hover:#7d7d88;--hub-warning-tint:#ffffff14;--hub-warning-border:#ffffff4d;--hub-success:#9a9aa4;--hub-success-tint:#ffffff1a;--hub-success-border:#ffffff4d}";
		const tagId = "dsh-plugin/tokens.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		const cssRegistry = globalThis.__DSH_PLUGIN_CSS__ ??= [];
		if (!cssRegistry.some((e) => e.tagId === tagId)) cssRegistry.push({
			tagId,
			css
		});
		//#endregion
		//#region src/client/index.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* dsh-plugin client entry: wires the Plugin Hub into the host settings via
		* the module-loader bundle (see tsdown.config.ts). All UI logic lives in
		* PluginHubSection; this file only performs the cordis apply wiring.
		*/
		const NS = "dsh-plugin";
		const name = NS;
		const inject = ["slots", "locale"];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), `${NS}: dictionaries`);
			const t = ctx.locale.bind(NS);
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: NS,
				order: 60,
				label: () => t("nav"),
				locale: NS,
				inject: () => ({
					t,
					locale: ctx.locale
				})
			}, () => (0, react.createElement)(PluginHubSection, {
				t,
				locale: ctx.locale
			})));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map