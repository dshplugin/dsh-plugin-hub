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
		* 插件中心设置板块的 zh/en 字典。
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
			githubHint: "在 GitHub 查看源码",
			fork: "Fork",
			loading: "正在加载插件数据…",
			failed: "插件数据加载失败",
			failedDescNoProxy: "无法获取插件目录数据（有数 MB）。网络较慢时首次加载可能超时，可重试或点「强制刷新」跳过本地缓存重新下载；加载成功后会缓存 1 小时。若持续失败，请点「网络诊断」确认目录站点可达。",
			failedDescProxy: "无法获取插件目录数据（有数 MB）。网络较慢，或设置里的 HTTP 代理不可达/链路抖动时，首次加载可能超时；可重试或点「强制刷新」跳过缓存重新下载。加载成功后会缓存 1 小时。",
			retry: "重试",
			forceReload: "强制刷新",
			forceReloadHint: "跳过本地缓存的插件目录，重新从服务器下载（缓存异常或弱网重试时用）",
			install: "安装",
			cliOnlyHint: "此插件的安装需要在 dsh 终端里完成（网页端无法代跑它所需的构建或装配步骤），请复制上方命令到终端执行",
			manualInstallOnlyHint: "此插件需要你在 dsh 终端手动安装：网页端的一键安装替代不了终端里的构建与装配步骤。请复制上方命令到终端执行（Windows 用 Git Bash 或 PowerShell，macOS/Linux 用终端），完整步骤见作者仓库的安装说明。",
			failedCopyHint: "安装失败。请复制上方安装命令到 dsh 终端手动执行（原生依赖构建脚本可能需要人工放行，如 pnpm approve-builds）",
			toastCopied: "安装命令已复制，去 dsh 终端粘贴即可安装",
			installed: "已安装",
			viewMarket: "插件市场",
			viewInstalled: "已安装",
			viewCustom: "自定义安装",
			viewSettings: "设置",
			viewMarketHint: "浏览与发现插件",
			viewInstalledHint: "管理已安装插件",
			viewCustomHint: "手动安装 NPM 包",
			viewSettingsHint: "网络通道与偏好设置",
			installedEmpty: "还没有安装插件",
			installedEmptyDesc: "可以去「自定义安装」，手动安装 NPM 包",
			npmInstallLabel: "NPM 包 / 命令",
			npmInstallPlaceholder: "npm install <包名> 或直接输包名",
			npmInstallExample: "支持原生命令：npm install lodash、npm i lodash、pnpm add @scope/pkg",
			npmInstallExample2: "全局安装 CLI：npm install -g @scope/cli；或直接输入包名 lodash",
			npmInstallInvalid: "请输入 npm 包名（如 lodash、@scope/pkg），或原生安装命令（如 npm install lodash、npm i lodash、pnpm add @scope/pkg、npm install -g @scope/cli）",
			installHelp: "帮助",
			helpModalTitle: "支持的命令格式",
			npmInstallHelp: "lodash、@scope/pkg	直接输入包名\nnpm install lodash\nnpm i lodash\npnpm add @scope/pkg\npnpm i @scope/pkg\nnpm install -g @scope/cli	全局安装 CLI 工具，不进「已安装」列表",
			globalNpmHint: "将全局安装 CLI 工具（npm install -g），不会出现在「已安装」列表，无需重启宿主",
			installCliBtn: "安装",
			channelDisabledHint: "该安装通道已关闭，请在「设置 → 安全信任」中打开开关",
			goToSettings: "前往设置",
			customViewDesc: "手动安装目录外的 NPM 包。装完的条目会出现在「已安装」列表，并标记为自定义安装。",
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
			statusInactive: "未激活（宿主加载失败，可能不是有效的 dsh 插件）",
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
			proxyCheckRevocation: "证书吊销检查受阻（Windows Schannel 取不到 CRL/OCSP），握手被中断；属本机 TLS 环境问题，非代理地址不通",
			settingsMirror: "npm 镜像源",
			settingsMirrorDesc: "默认跟随本机 npm 配置；官方源慢可换国内镜像",
			settingsRegistryFallback: "连不上时自动换源",
			settingsRegistryFallbackDesc: "公共源超时或被拦截时，自动改用下一个镜像重试（最多 3 个）；自定义/内网源不会切换，避免私有包名外泄",
			mirrorNone: "未配置（跟随本机 npm 配置）",
			mirrorOfficial: "官方源 registry.npmjs.org",
			mirrorNpmmirror: "阿里云 npmmirror",
			mirrorTencent: "腾讯云镜像",
			mirrorTsinghua: "清华大学 TUNA 镜像",
			settingsSecurity: "安全信任",
			settingsSecurityDesc: "命令行安装的开关：NPM 包",
			settingsEnableNpm: "启用 NPM 安装",
			settingsEnableNpmDesc: "允许通过命令行安装 npm 包；关闭后输入包名安装会被拦截",
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
			diagFailRevocation: "证书校验受阻",
			diagFailRevocationHint: "系统 curl 取不到证书吊销信息（Windows Schannel 必需 CRL/OCSP），TLS 握手被中断 —— 这不是网络不通，npm/git 可能照常可用。升级 curl 到 7.70+ 可自动按「尽力而为」处理，或换一个能访问吊销服务的网络。",
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
			restarting: "正在重启…",
			restartHint: "重启会中断正在进行的安装/卸载任务，其进度将丢失。部分插件（如插件市场、顶层 bundle）需重启后才会生效。",
			toastRestartDesktop: "桌面端的宿主由应用管理，请在应用菜单（或托盘）选择退出后重新打开，重启后生效",
			reloadHint: "插件已加载，关闭本窗口后会自动刷新页面生效。",
			toastInstalledLive: "安装成功，已立即生效",
			toastInstalledReload: "安装成功，正在自动刷新页面…",
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
			cancel: "取消",
			cancelling: "正在取消…",
			errorTitle: "操作失败",
			errorTitleInstall: "安装失败",
			errorTitleUninstall: "卸载失败",
			errorTitleUpdate: "更新失败",
			actionInstall: "安装",
			actionUpdate: "更新",
			actionUninstall: "卸载",
			errorPlugin: "插件",
			errorClose: "知道了",
			errorCopy: "复制错误信息",
			errCopied: "错误信息已复制",
			failCopy: "复制完整错误信息",
			failIssueHint: "带着错误日志去作者仓库一键提交 Issue（正文含官网收录链接）",
			failIssueBig: "一键提交 BUG 到 GitHub Issue 为开源作贡献",
			failHubIssueHint: "此失败已被判定为环境或插件中心自身问题（非插件作者问题），带着错误日志到插件中心仓库一键提交 Issue",
			failHubIssueBig: "反馈给插件中心排查",
			failUnclassifiedHint: "{action}失败，原因未能自动识别。这通常不是插件自身的问题（可能与本机环境或插件中心有关），请将错误信息反馈给插件中心，由维护者排查。",
			failHubStateHint: "插件列表状态已过期或与本地不一致：这次{action}的目标可能已经在列表里了（要升级请点「更新」），也可能已经不在已安装列表中，或已在队列中。这不是插件本身的问题 —— 请刷新页面后重试。",
			failTimeoutHint: "本次操作耗时超过本地上限、已被中断 —— 但很可能其实已经生效了（安装器在超时后会先核对本地已安装列表）。请刷新页面确认当前状态；若确实没生效，可在终端手动执行一次对应命令查看完整输出。这不是插件本身的问题。",
			failProfileLockHint: "DSH 在写入插件清单时等不到文件锁、超时中止 —— 通常是同时有另一个 DSH 进程或安装任务在写同一个 profile（也可能是上一次的进程没退干净留下的锁）。请先关掉其他 dsh 窗口或正在跑的命令，再重试一次；若反复出现，重启一次 DSH。这不是插件本身的问题，也不需要重复{action}。",
			failHostCliSpawnHint: "DSH 没能启动自身来完成这次操作（系统报「找不到可执行文件」）：通常是因为 DSH 的安装目录被移动或正在更新，或该 profile 目录还不存在。请重启一次 DSH 后重试；若反复出现，重新安装 DSH。这不是插件本身的问题，换别的插件也一样。",
			failPrepareHint: "该插件安装时的构建脚本执行失败（npm 分发物不完整），属插件打包分发问题。请向作者仓库提交 Issue 反馈。",
			failMisjudgeHint: "如果这个插件其实能正常安装（上面这个判定是插件中心误报的），请反馈给插件中心：文字提示里的判据由市场自身产出，误报只有靠你的反馈才能被发现。",
			failMisjudgeLink: "插件能装却被拦下？反馈给插件中心",
			failPackagingHint: "该插件的 npm 分发物不完整：缺少它需要的文件（`main` / `exports` 声明的入口、补丁按本包名 mount 的入口，或 `dsh.bundle.patch` 声明的补丁）。请到作者仓库提交 Issue 反馈，请其发布包含完整构建产物的 npm 包。",
			failIgnoredBuild: "该插件（或其依赖）需要在安装时执行构建脚本，被 pnpm 的安全白名单（allowBuilds）默认拦截，本次操作因此失败（如原生模块 node-pty，或 git 安装时插件自己的 prepare 脚本）。安装器已自动放行该 key 并重试过一次；仍失败说明构建本身没通过、任何用户都装不上。可先在终端手动执行一次安装命令查看完整构建错误；这属插件的构建/分发问题，请到作者仓库反馈：建议作者预置构建产物、发布含构建产物的 npm 包或提供预构建 .tgz。",
			failNpmTooLow: "怀疑本机 npm 版本过低：npm 解析插件依赖时内部崩溃（这是 npm 自身的已知缺陷，不是插件问题）。请升级 npm 后重试：npm install -g npm@latest",
			failNpmTooLowV: "本机 npm 版本过低（当前 v{v}）：npm 解析插件依赖时内部崩溃（这是 npm 自身的已知缺陷，不是插件问题）。请升级 npm 后重试：npm install -g npm@latest",
			failNetworkHint: "{action}前检测到网络不通：无法连接到安装源（可能是断网、DNS 解析失败、被防火墙拦截，或代理配置有问题）。这不是插件本身的问题 —— 请检查网络连接，或到「设置」里确认 HTTP 代理配置，再到「系统诊断」运行一次连通性检测，然后重试。",
			failNetworkRegistryHint: "你的 npm/pnpm 源（registry）被配置为 {host}，插件包需从该源下载但失败了。这通常是内网/自定义源没有同步该包（或需要内网认证）—— 请把 npm/pnpm 的 registry 指回官方源 https://registry.npmjs.org（或确认此源可访问该包）后重试。",
			failNetworkTarget: "无法访问 {url} —— 你的网络连接不通",
			failNetworkRunDiag: "去系统诊断检测网络",
			failOriginRejectedHint: "这次安装请求没有通过插件市场的来源校验，被本地服务直接拒绝，所以安装根本没有开始 —— 与插件本身无关。通常是因为市场页面不是从本机地址打开的（比如用了局域网 IP），或宿主页面的来源未被识别。请从本机的插件市场地址（localhost）重新打开页面后重试；桌面端用户重启一次宿主即可。若重启宿主后仍然失败，说明当前 dsh-plugin 版本与宿主不兼容，请用以下命令把市场升级到最新版，再重启一次宿主：dsh plugin --profile {profile} add dsh-plugin@latest。",
			failDshMissingHint: "系统找不到 dsh 命令（dsh 未加入系统 PATH），无法调用安装器执行安装。请确认 DeepSeek Harness 已正确安装、dsh 已加入 PATH（或重新安装），然后重试。这不是插件本身的问题。",
			failGitMissingHint: "系统找不到 git 命令（Git 未安装或未加入系统 PATH），无法从 GitHub 源安装插件。请先安装 Git（如 git-scm.com/downloads）或把 git 加入 PATH，重启 DSH 后重试。这不是插件本身的问题。",
			failPnpmMissingHint: "安装器找到了 dsh，但系统里没有 pnpm 命令（dsh 用它来管理 profile 插件）。请先安装 pnpm（如 npm install -g pnpm），确认 pnpm 已加入 PATH 后重试。这不是插件本身的问题。",
			failNpmMissingHint: "系统找不到 npm 命令（npm 未安装或未加入系统 PATH），无法执行全局安装。请先安装 Node.js（自带 npm），确认 npm 已加入 PATH 后重试。这不是插件本身的问题。",
			failBuildToolchainHint: "这个插件依赖需要在本机编译的原生模块，但机器上缺少可用的编译工具链。请按系统安装后重试：Windows 安装 Visual Studio Build Tools（含「使用 C++ 的桌面开发」）；macOS 执行 xcode-select --install；Linux 安装 build-essential、python3 与 make。若装好工具链后仍然失败，再向插件作者反馈，请其提供预构建产物。",
			bundleDeselectedHint: "注意：插件市场在当前 profile 的 bundle 列表中被取消勾选，重启宿主后它不会出现。请到「设置 → 插件」重新勾选 dsh-plugin。",
			failPnpmStoreHint: "安装器调用 pnpm 时报「store 位置不匹配」（ERR_PNPM_UNEXPECTED_STORE）：你的 profile 目录里旧插件依赖是用另一个大版本的 pnpm 生成的，当前 pnpm 出于安全不认旧目录，导致任何插件装进该 profile 都会失败。请删除该 profile 目录下的 node_modules 与 pnpm-lock.yaml（可先到「系统日志」或 ~/.dsh/profiles/<profile>/hub.log 查看完整报错），再重新安装。这不是插件本身的问题。",
			failPnpmUnusedPatchHint: "安装器调用 pnpm 时报「有些补丁没有被使用」（ERR_PNPM_UNUSED_PATCH）：你的 profile 里留着一条指向旧版本 dsh-plugin 的补丁声明（例如 dsh-plugin@1.4.2），而本次安装解析到的版本已经不是它，pnpm 出于安全直接中止整次安装，因此任何插件都装不进来。这不是插件本身的问题——请在 profile 目录（~/.dsh/profiles/<profile>）的 pnpm-workspace.yaml（pnpm 11 及以上）或 package.json 的 pnpm.patchedDependencies（pnpm 10）里删除该 dsh-plugin 补丁条目后重试。",
			failProfileStateHint: "安装器调用 pnpm 时报 profile 的元数据与当前环境对不上（如 ERR_PNPM_OUTDATED_LOCKFILE / ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND / ERR_PNPM_BAD_PM_VERSION / ERR_PNPM_PATCH_NOT_APPLIED）：profile 里的 pnpm-lock.yaml、package.json 或补丁声明与当前 pnpm 版本不一致，pnpm 在真正装插件之前就中止了，所以这个 profile 里装任何插件都会失败。这不是插件本身的问题——请在 profile 目录（~/.dsh/profiles/<profile>）里删除 pnpm-lock.yaml 后重试（pnpm 会按当前依赖重新生成）；若报的是 packageManager 版本不符，把 package.json 里的 packageManager 字段改成当前 pnpm 的大版本或直接删掉该字段；仍不行请重建该 profile 的依赖。",
			failNodeEngineHint: "这个插件（或它的某个依赖）声明了更高的 Node / pnpm 版本要求（ERR_PNPM_UNSUPPORTED_ENGINE / EBADENGINE），当前版本不满足，pnpm 在安装阶段直接拒绝。这不是插件本身的问题——请把 Node 升级到要求的版本（nvm / fnm 切换，或安装新版 Node.js），确认 node -v 与 pnpm -v 都满足要求后重试。",
			failPnpmMissingDepTarget: "{pkg} 在 npm registry 上不存在（404）",
			failPnpmMissingDepHint: "安装器调用 pnpm 时报「包不存在」（ERR_PNPM_FETCH_404）：你的 profile 里留着一条指向 registry 上未发布包的依赖，pnpm 每次解析依赖都会先卡在它上面，因此任何插件都装不进来。这不是插件本身的问题——请在 profile 目录（~/.dsh/profiles/<profile>）的 package.json 里删除该依赖条目（同时删掉对应的 pnpm-lock.yaml 条目或整个锁文件）后重试。",
			failRegistryMirrorLagHint: "安装器调用 pnpm 时报「包不存在」（ERR_PNPM_FETCH_404）：该包在官方 npm 源上是有的，但你本机配置的 npm/pnpm 源（registry 或镜像）没有同步到它。请把 npm/pnpm 的 registry 指回官方源 https://registry.npmjs.org（或换一个已同步该包的镜像）后重试。这不是插件本身的问题。",
			failPluginMissingDepTarget: "{pkg} 在官方 npm 源上不存在",
			failPluginMissingDepHint: "该插件依赖的包在官方 npm 源上并不存在（已删除或从未发布）：这是插件作者侧的依赖问题，不是你环境的问题。请向插件作者仓库反馈，请作者补上或修正该依赖，或改为随插件一起分发。",
			failHostIncompatibleKind: "插件不支持当前的 DSH 版本",
			failHostIncompatibleReason: "当前 DSH {version} 不在该插件的兼容清单里，宿主在安装前就拒绝了 —— 什么都没装。",
			failHostIncompatibleHint: "① 请作者把该版本加入兼容清单后发新版（下方按钮直达作者仓库）\n② 在桌面应用的插件管理器里为这个精确版本授权（宿主会提示崩溃/数据风险）",
			failKind_npmTooOld: "本机 npm 版本过低",
			failReason_npmTooOld: "当前 npm 版本处理不了这个包的依赖树，安装被中断。",
			failKind_dshMissing: "本机缺少 dsh",
			failReason_dshMissing: "安装器需要调用 dsh，但在你的机器上找不到它。",
			failKind_gitMissing: "本机缺少 git",
			failReason_gitMissing: "这个包的依赖需要 git，但机器上找不到 git。",
			failKind_pnpmMissing: "本机缺少 pnpm",
			failReason_pnpmMissing: "安装器通过 pnpm 安装插件，但机器上找不到 pnpm。",
			failKind_npmMissing: "本机缺少 npm",
			failReason_npmMissing: "安装流程需要 npm，但机器上找不到它。",
			failKind_buildToolchainMissing: "本机缺少原生构建工具链",
			failReason_buildToolchainMissing: "这个插件依赖需要在本机编译的原生模块，但找不到可用的编译器。",
			failKind_pnpmStore: "pnpm store 版本不匹配",
			failReason_pnpmStore: "profile 里的依赖由另一大版本的 pnpm 生成，当前 pnpm 不认。",
			failKind_pnpmModulesMismatch: "profile 的依赖目录与当前 pnpm 配置不一致",
			failReason_pnpmModulesMismatch: "node_modules 是用另一套 pnpm 配置（hoist / 虚拟目录长度等）创建的，pnpm 拒绝复用。",
			failPnpmModulesMismatchHint: "安装器调用 pnpm 时报「modules 目录与当前配置不一致」（`ERR_PNPM_*_DIFF`，例如 virtual-store-dir-max-length、public-hoist-pattern、hoist 规则、node-linker）：profile 里的 node_modules 是在另一套 pnpm 配置下生成的（常见于改过 .npmrc、换过 pnpm 大版本，或桌面端内置 pnpm 与 PATH 上的 pnpm 不是同一个），当前 pnpm 出于安全拒绝在它上面继续操作 —— 所以这个 profile 里的安装/卸载都会失败。修复（任选其一，在 profile 目录 ~/.dsh/profiles/<profile> 下操作）：① 执行一次 pnpm install，让它按当前配置重建 modules 目录；② 删掉该目录下的 node_modules，下次安装/卸载会自动重建；③ 如果你在 .npmrc 里设过这些配置项，把它们统一成同一个值（或删掉自定义、回到默认）。这不是插件本身的问题。",
			failKind_pnpmWorkspace: "workspace 根校验阻止了安装",
			failReason_pnpmWorkspace: "profile 被当作 workspace 根，但没有声明根操作，pnpm 中止了安装。",
			failKind_originRejected: "本地服务的来源校验未通过",
			failReason_originRejected: "请求根本没进安装流程：本地服务拒绝了它的来源。",
			failKind_pnpmPolicy: "被 pnpm 供应链策略拦截",
			failReason_pnpmPolicy: "版本未满最小发布年龄，或缺完整性校验 / 来源不可信。",
			failKind_pnpmUnusedPatch: "profile 残留旧补丁声明",
			failReason_pnpmUnusedPatch: "profile 里留着指向旧版本 dsh-plugin 的补丁，pnpm 出于安全中止了安装。",
			failKind_profileState: "profile 的 pnpm 元数据与本机不一致",
			failReason_profileState: "profile 的 lockfile / package.json / packageManager 版本与当前 pnpm 对不上，安装没开始就被中止。",
			failKind_nodeEngine: "本机 Node / pnpm 版本不满足要求",
			failReason_nodeEngine: "这个插件（或其依赖）要求更高的 Node / pnpm 版本，当前版本被 pnpm 拒绝。",
			failKind_pnpmMissingDep: "依赖包在 registry 上不存在",
			failReason_pnpmMissingDep: "profile 里有一条指向未发布包的依赖，pnpm 每次解析都卡在它上面。",
			failKind_pluginMissingDep: "插件依赖未发布",
			failReason_pluginMissingDep: "插件声明依赖的包在官方 npm 源上不存在（已删除或从未发布）。",
			failKind_registryVersionStale: "该版本在所用源上不存在",
			failReason_registryVersionStale: "实际安装用的源还没同步到这个版本，或版本号写错。",
			failKind_registryAuth: "npm 源拒绝了访问",
			failReason_registryAuth: "registry 返回 401/403：这个源需要登录凭据，或当前网络不被允许。",
			failKind_profileExclusive: "profile 由桌面应用独占管理",
			failReason_profileExclusive: "命令行 dsh 无权管理桌面应用的 profile，安装前就被宿主拒绝。",
			failKind_pnpmLinkedDirMissing: "profile 里有失效的本地依赖",
			failReason_pnpmLinkedDirMissing: "有一条指向本机不存在目录的 link/file 依赖，pnpm 每次解析都卡住。",
			failKind_fileLocked: "文件被其他程序占用",
			failReason_fileLocked: "pnpm 无法替换 profile 里的文件：有程序正持有它。",
			failKind_accessDenied: "没有写入权限",
			failReason_accessDenied: "系统拒绝 pnpm 写入 profile 里的文件。",
			failKind_fsUnavailable: "磁盘不可写",
			failReason_fsUnavailable: "磁盘已满、处于只读，或文件句柄耗尽。",
			failKind_pnpmIgnoredBuild: "原生模块构建被拦截",
			failReason_pnpmIgnoredBuild: "插件依赖需要在你的机器上现场编译，pnpm 默认拦住构建脚本。",
			failKind_pluginPrepare: "插件分发不完整",
			failReason_pluginPrepare: "作者发布的包里缺文件，或构建脚本执行失败。",
			failKind_hostIncompatible: "插件不支持当前的 DSH 版本（{version}）",
			failReason_hostIncompatible: "插件声明的兼容清单里没有你正在运行的 DSH 版本。",
			failKind_network: "网络连接失败",
			failReason_network: "安装过程中连不上 npm 源或代理，请求没有完成。",
			failKind_tlsTrust: "HTTPS 证书校验失败",
			failReason_tlsTrust: "本机有程序替换了 HTTPS 证书，Node / pnpm 不信任它的根证书。",
			failTlsTrustHint: "安装器访问 npm 源时 TLS 证书校验失败（`ERR_PNPM_META_FETCH_FAIL` / unable to verify the first certificate）：本机有程序在替换 HTTPS 证书 —— 公司网络的 SSL 审计、杀毒软件的网页防护、Fiddler / Charles 这类抓包工具，或本机代理的 HTTPS 解密 —— 而 Node / pnpm 不信任它的根证书。这不是插件本身的问题，任何插件都会一样失败。按顺序处理：① 如果公司网络有 SSL 审计，找 IT 要根证书（.cer / .pem），把环境变量 NODE_EXTRA_CA_CERTS 指向该文件后重试；② Node ≥ 22.15 可以设置 NODE_OPTIONS=--use-system-ca，让 Node 直接信任系统证书库；③ 如果只是本机代理开了 HTTPS 解密，把 registry.npmjs.org 加进直连（跳过 MITM）；④ 也可以先临时切到公共镜像源 https://registry.npmmirror.com 重试。不建议直接关闭 strict-ssl：那等于放弃校验，会把你暴露在中间人攻击下。",
			failKind_hostCliSpawn: "无法启动 DSH 宿主",
			failReason_hostCliSpawn: "解析到的宿主入口起不来，安装命令没有真正执行。",
			failKind_hubState: "插件中心状态不同步",
			failReason_hubState: "本地记录的安装状态与实际不一致，这次操作没有生效。",
			failKind_profileBundleMissing: "profile 的依赖没装全",
			failReason_profileBundleMissing: "宿主找不到 profile 里声明的某个 bundle，安装命令还没执行就失败了。",
			failProfileBundleMissingHint: "宿主在启动插件管理时找不到 profile 依赖「{pkg}」—— 说明这个 profile 里声明的依赖没有装全（node_modules 被删过、上次安装中断，或桌面应用升级不完整）。这与你要装的插件无关，换任何插件都会一样失败。修复：① 让宿主把这个 profile 的依赖装回来（在桌面应用内重新打开插件中心，或执行 `dsh plugin --profile {profile} install`；桌面 profile 需在应用内执行，外部 CLI 无权管理）；② 仍然报同样的错，说明是应用本体不完整，请重装或升级 DeepSeek Harness 桌面端。",
			failKind_timeout: "操作超时",
			failReason_timeout: "安装耗时超过上限仍未完成，已经中止。",
			failKind_profileLock: "profile 被其他进程占用",
			failReason_profileLock: "另一个 dsh 进程正在使用这个 profile。",
			failKind_hub: "出现未知错误",
			failReason_hub: "我们还没能识别这条报错，你可以一键反馈给我们。",
			failKind_localEnv: "本机环境异常",
			failReason_localEnv: "报错特征指向你的本机环境（系统错误码 / 证书代理 / 本地配置），没有发现插件侧原因。",
			failKind_dshTooOld: "DSH 版本低于插件要求",
			failReason_dshTooOld: "插件声明的最低 DSH 版本高于你当前运行的宿主版本。",
			failDshTooOldHint: "插件「{pkg}」声明需要 DSH {floor} 或更高，而你当前运行的是 {current} —— 版本不够时装不上（或装上后无法正常加载），这不是插件本身的问题，也不是插件市场的误判。请先把 DeepSeek Harness 升级到 {floor} 以上，再回到插件中心重试。如果升级后仍然失败，把新的报错发给我们。",
			failLocalEnvHint: "从日志能确认的只有一点：没有插件侧的失败证据；报错特征落在本机环境（系统调用错误码、证书/代理校验、本地配置文件损坏等），但还不足以精确到某一类。这类问题装别的插件同样会失败，不是插件本身的问题。请按顺序自查：① 点下面的「运行系统诊断」看本机检查项；② 确认 profile 目录（~/.dsh/profiles/<profile>）可写、磁盘有空间、杀毒软件没拦截；③ 若在用代理或公司镜像源，先临时切回官方源 https://registry.npmjs.org 重试；④ 完全退出 DeepSeek Harness 后重试。排查后仍然失败、且你确信环境没问题，再用下面的链接反馈给我们，并附上通知中心里复制的完整日志。",
			failRegistryVersionStaleHint: "安装器调用 pnpm 时报「找不到匹配的版本」（ERR_PNPM_NO_MATCHING_VERSION）：要装的这个版本在实际执行安装的 npm 源里查不到。常见原因是你设置的 npmRegistry 与本机 ~/.npmrc 用的不是同一个源——官方源刚发布、镜像还没同步上来（快则几分钟、慢则几小时），也可能只是版本号写错了。这不是插件本身的问题。可在插件市场设置里把 npmRegistry 改成与本机 ~/.npmrc 一致（或反过来），或那一次显式走官方源（https://registry.npmjs.org）、改用离线包后重试；若该版本刚发布不久，等镜像同步后重试即可。",
			failRegistryAuthHint: "安装器访问 npm 源时被拒绝（HTTP 401/403）：这个源需要登录凭据，或不允许当前网络/IP 访问。如果你在用公司或私有源，请先配好认证（npm login，或在 ~/.npmrc 写入 //{host}/:_authToken=…）；如果不需要私有源，把 registry 换回官方源 https://registry.npmjs.org，或在插件市场设置里切换到公共镜像后重试。这不是插件本身的问题。",
			failRegistryAuthHintNoHost: "安装器访问 npm 源时被拒绝（HTTP 401/403）：这个源需要登录凭据，或不允许当前网络/IP 访问。如果你在用公司或私有源，请先配好认证（npm login，或在 ~/.npmrc 写入 //<registry>/:_authToken=…）；如果不需要私有源，把 registry 换回官方源 https://registry.npmjs.org，或在插件市场设置里切换到公共镜像后重试。这不是插件本身的问题。",
			failProfileExclusiveHint: "profile「{profile}」由桌面应用独占管理，命令行 dsh 无权安装 —— 这不是插件本身的问题。请在 DeepSeek Harness 桌面应用的「设置 → 插件市场」里安装；或改用非桌面独占的 profile（例如 web）后重试。如果你就是在桌面应用内看到这条错误，请到插件市场的「通知」里打开这条失败记录点「复制」，把完整日志发给我们。",
			failProfileExclusiveHintNoProfile: "当前 profile 由桌面应用独占管理，命令行 dsh 无权安装 —— 这不是插件本身的问题。请在 DeepSeek Harness 桌面应用的「设置 → 插件市场」里安装；或改用非桌面独占的 profile（例如 web）后重试。如果你就是在桌面应用内看到这条错误，请到插件市场的「通知」里打开这条失败记录点「复制」，把完整日志发给我们。",
			failDesktopCliFallbackHint: "这次是安装器没找到桌面应用内置的 CLI 引导脚本、退回命令行 dsh 才被拒绝 —— 属于插件中心自身的问题，不是你的环境问题。点下面的按钮把完整日志发给我们，我们会补上路径推导。",
			failPnpmLinkedDirMissingHint: "安装器调用 pnpm 时报「要安装的目录不存在」（ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND）：你的 profile 里留着一条指向本机不存在目录的本地依赖（link: / file: 形式，例如用 dsh plugin add <本地路径> 装过开发中的插件，之后那个目录被删除或移动了）。pnpm 每次解析 profile 依赖都会先卡在它上面，因此任何插件都装不进来。这不是插件本身的问题——请在 profile 目录（~/.dsh/profiles/<profile>）的 package.json 里删除该本地依赖条目（同时删掉对应的 pnpm-lock.yaml 条目或整个锁文件），或把该目录恢复回原路径后重试。",
			failLinkedDirTarget: "缺失的本地目录：{path}",
			failFileLockedHint: "安装过程中 pnpm 无法替换 profile 里的文件：有程序正占用着它（Windows 常见报错 os error 32「另一个程序正在使用此文件」）。通常是 DeepSeek Harness 自身或杀毒软件的实时扫描持有文件句柄。这不是插件本身的问题——请完全退出 DeepSeek Harness（Windows 可在任务管理器确认进程已结束，必要时临时关闭杀毒软件实时防护）后重试。",
			failAccessDeniedHint: "安装过程中 pnpm 写入 profile 里的文件被系统拒绝访问（Windows 常见报错 os error 5「拒绝访问」，英文为 Access is denied；Node 下的 EPERM / EACCES 同理）。常见原因是该文件或目录正被其他进程占用、文件带只读属性、目录权限受限，或杀毒软件实时防护拦截了写入——这与「文件正被占用」（os error 32）同属本机文件系统问题，任何插件装进该目录都会一样失败，不是插件本身的问题。请完全退出 DeepSeek Harness（Windows 可在任务管理器确认进程已结束，必要时临时关闭杀毒软件实时防护）后重试；若仍然失败，请检查 profile 目录及其文件是否被设为只读，并以管理员身份重新运行。",
			failFsUnavailableHint: "安装过程中 pnpm 无法把文件写进本机磁盘（这类报错与装哪个插件无关，任何插件装在同一目录都会失败，不是插件本身的问题）。请按报错对号入座：① 磁盘空间不足（ENOSPC / no space left on device，Windows 为 os error 112）——请清理 profile 所在磁盘的剩余空间后重试；② 磁盘或挂载点只读、带写保护（EROFS / read-only file system，Windows 为 os error 19）——请确认 profile 目录所在磁盘可写（外接盘/U 盘、带写保护的移动盘或只读挂载的分区都会触发），必要时把插件目录换到系统盘的可写位置；③ 进程可用的文件句柄被耗尽（EMFILE / ENFILE / too many open files）——请关闭占用大量文件的程序并重启 DeepSeek Harness 后重试。",
			failPnpmWorkspaceHint: "安装器调用 pnpm 时报「不能把依赖装到 workspace 根目录」（ERR_PNPM_ADDING_TO_ROOT）：你的 profile 目录被 pnpm 视为 workspace 根目录，而本次安装命令没有声明在根目录操作，pnpm 直接拒绝执行，因此任何插件装进来都会失败。这不是插件本身的问题——可在 profile 目录（~/.dsh/profiles/<profile>）的 .npmrc 里加一行 ignore-workspace-root-check=true 后重试，或把 DeepSeek Harness 升级到最新版再试。",
			failPnpmTarballIntegrityHint: "pnpm 报 ERR_PNPM_MISSING_TARBALL_INTEGRITY：锁文件中的 tarball 条目没有校验值，无法验证下载的包。先查看完整日志，完全退出 DeepSeek Harness，并检查、备份当前 profile 的 package.json、pnpm-lock.yaml 和 pnpm-workspace.yaml。确认依赖来源后，将 pnpm-lock.yaml 改名保留，再通过同一 DSH 安装器安装适配当前宿主版本的插件，重新生成锁文件。重建会重新解析 profile 依赖，请核对新旧版本；保持完整性校验开启。",
			failPnpmTarballMismatchHint: "pnpm 报 ERR_PNPM_TARBALL_INTEGRITY：profile 里某个从 GitHub 分支安装的依赖（例如 github:owner/repo#main）在远端更新了，tarball 内容变了，但 pnpm-lock.yaml 里存的还是旧校验和，于是整个 profile 的依赖安装都会卡在它上面。处理：打开 ~/.dsh/profiles/<profile>/pnpm-lock.yaml，删掉该 GitHub 依赖对应的条目（不确定是哪个就把整份锁文件改名备份），再重新安装；长期做法是把依赖固定到具体 commit（github:owner/repo#<commit>），分支再更新也不会改变校验和。",
			failPnpmPolicyHint: "安装器调用 pnpm 时被其供应链安全策略拦截——装任何插件都会撞墙，不是插件本身的问题。分两种情况处理：① 提示「Minimum release age」（ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION）：包发布还不满 24 小时，pnpm 11 出于安全会拒收这种刚发布的新包。可在 pnpm 配置（pnpm-workspace.yaml）里加 minimumReleaseAge: 0 豁免，或等满 24 小时后重试。② 提示「untrusted origin」（ERR_PNPM_UNTRUSTED_ORIGIN）：依赖来源不被本机 pnpm 信任，通常是该 profile 里之前用 github: 或非官方 npm 源装过插件，锁文件记录了不受信任的来源。请删除该 profile 目录下的 node_modules 与 pnpm-lock.yaml 后重新安装（可先到「系统日志」或 ~/.dsh/profiles/<profile>/hub.log 查看完整报错）。",
			failPnpmReleaseAgeHint: "安装器调用 pnpm 时被其供应链安全策略拦住了，任何插件装进这个 profile 都会先撞上它——与插件本身无关。原因是这个包发布还不满 24 小时，pnpm 11 出于安全会拒收刚发布的新包，这段时间内该 profile 的安装与卸载都会被拦下。可重试时间：{time}（即该包发布满 24 小时后）。如确需立刻安装，可在 profile 目录（~/.dsh/profiles/<profile>）的 pnpm-workspace.yaml 里加 minimumReleaseAge: 0 豁免，但这会放宽整个 profile 的供应链保护。",
			installChannelNpm: "NPM 包",
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
			updatePending: "暂缓到 {time} 后可更新",
			updatePendingHint: "新版本发布未满 24 小时，pnpm 供应链门禁会拦下；到时间后再更新即可",
			hubUpdateHint: "检测到 DSH Plugin Hub 新版本，点击查看更新内容并更新",
			hubUpdateTitle: "DSH Plugin Hub 有新版本",
			hubUpdateDesc: "v{version} 已发布，点击下方按钮即可更新，完成后需重启宿主生效。",
			hubUpdatePublished: "发布于",
			hubUpdateNotes: "更新记录",
			hubUpdateLater: "稍后再说",
			versionHint: "查看版本信息与更新记录",
			hubCurrentTitle: "当前版本",
			hubCurrentDesc: "你正在使用 v{version}，已是最新版本。",
			hubPendingDesc: "最新版 v{version} 已发布，但发布尚未满 24 小时：此时更新会被 pnpm 静默回退到旧版本，因此暂不提示。稍后这里会自动出现更新入口。",
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
			failedDescNoProxy: "The plugin catalog could not be loaded (a few MB). The first load can time out on a slow connection — retry, or use \"Force refresh\" to skip the local cache and download it again. Once it succeeds the catalog is cached for an hour. If it keeps failing, run the network diagnostic.",
			failedDescProxy: "The plugin catalog could not be loaded (a few MB). A slow connection, or an unreachable/unstable HTTP proxy in Settings, can make the first load time out — retry, or use \"Force refresh\" to skip the cache. Once it succeeds the catalog is cached for an hour.",
			retry: "Retry",
			forceReload: "Force refresh",
			forceReloadHint: "Skip the cached catalog and download it again from the server (use when the cache looks wrong or on a slow network)",
			install: "Install",
			cliOnlyHint: "This plugin has to be installed in your dsh terminal (the web UI cannot run the build or assembly steps it needs) — copy the command above and run it there",
			manualInstallOnlyHint: "This plugin has to be installed by hand in your dsh terminal — one-click install from the web UI cannot run the build and assembly steps it needs. Copy the command above and run it there (Git Bash or PowerShell on Windows, Terminal on macOS/Linux); the author's repo has the full steps.",
			failedCopyHint: "Install failed. Copy the command above and run it manually in your dsh terminal (native build scripts may need manual approval, e.g. pnpm approve-builds)",
			toastCopied: "Install command copied — paste it in your dsh terminal",
			installed: "Installed",
			viewMarket: "Market",
			viewInstalled: "Installed",
			viewCustom: "Custom",
			viewSettings: "Settings",
			viewMarketHint: "Browse and discover plugins",
			viewInstalledHint: "Manage installed plugins",
			viewCustomHint: "Install npm packages manually",
			viewSettingsHint: "Network sources and preferences",
			installedEmpty: "No plugins installed yet",
			installedEmptyDesc: "Go to Custom to add an npm package manually",
			npmInstallLabel: "npm package / command",
			npmInstallPlaceholder: "npm install <pkg> or a bare package name",
			npmInstallExample: "Native commands: npm install lodash, npm i lodash, pnpm add @scope/pkg",
			npmInstallExample2: "Global CLI: npm install -g @scope/cli; or just type a package name like lodash",
			npmInstallInvalid: "Enter an npm package name (e.g. lodash, @scope/pkg), or a native install command (e.g. npm install lodash, npm i lodash, pnpm add @scope/pkg, npm install -g @scope/cli)",
			installHelp: "Help",
			helpModalTitle: "Supported command formats",
			npmInstallHelp: "lodash or @scope/pkg	just type the package name\nnpm install lodash\nnpm i lodash\npnpm add @scope/pkg\npnpm i @scope/pkg\nnpm install -g @scope/cli	installs the CLI globally, not shown in Installed",
			globalNpmHint: "This installs CLI tools globally (npm install -g). They won't appear in Installed and no host restart is needed.",
			installCliBtn: "Install",
			channelDisabledHint: "This install channel is disabled — enable it in Settings → Security & Trust",
			goToSettings: "Go to Settings",
			customViewDesc: "Manually install an npm package outside the catalog. Finished installs appear in Installed, marked as custom.",
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
			statusInactive: "Not active (the host failed to load it — possibly not a valid dsh plugin)",
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
			settingsProxy: "HTTP proxy",
			settingsProxyDesc: "Route npm, git and catalog requests through this proxy; leave empty to connect directly",
			proxyCheckChecking: "Testing this proxy address…",
			proxyCheckOk: "Reachable — installs and catalog requests will route through it",
			proxyCheckFail: "Unreachable, but you can still save it; make sure the proxy is running and the address and port are correct",
			proxyCheckRevocation: "Certificate revocation check blocked (Windows Schannel could not fetch CRL/OCSP), so the handshake was aborted — a local TLS issue, not a bad proxy address",
			settingsMirror: "npm mirror",
			settingsMirrorDesc: "Unset by default — follows local npm config; pick a domestic mirror if slow",
			settingsRegistryFallback: "Switch mirrors on failure",
			settingsRegistryFallbackDesc: "When a public registry times out or is blocked, retry with the next mirror (up to 3). Custom/intranet registries are never switched, so private package names do not leak.",
			mirrorNone: "Unset (follow local npm config)",
			mirrorOfficial: "Official registry.npmjs.org",
			mirrorNpmmirror: "Alibaba npmmirror",
			mirrorTencent: "Tencent Cloud mirror",
			mirrorTsinghua: "Tsinghua TUNA mirror",
			settingsSecurity: "Security & Trust",
			settingsSecurityDesc: "Toggles for command-line installs: npm packages",
			settingsEnableNpm: "Enable npm installs",
			settingsEnableNpmDesc: "Allow installing npm packages from the command line; turning this off rejects package-name installs",
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
			diagFailRevocation: "Cert check blocked",
			diagFailRevocationHint: "The system curl cannot fetch certificate revocation info (CRL/OCSP, required by Windows Schannel), so the TLS handshake is aborted — this is not a network outage, and npm/git may still work. curl 7.70+ downgrades the check to best-effort, or switch to a network that can reach the revocation service.",
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
			restarting: "Restarting…",
			restartHint: "Restarting interrupts any in-progress install / uninstall task — its progress will be lost. Some plugins (such as plugin markets / top-level bundles) only take effect after a restart.",
			toastRestartDesktop: "In the desktop app the host is managed by the app: quit from the app menu (or tray) and open it again — the change takes effect after that restart",
			reloadHint: "The plugin is loaded — closing this window will refresh the page automatically.",
			toastInstalledLive: "Installed — active now",
			toastInstalledReload: "Installed — refreshing the page automatically…",
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
			actionInstall: "install",
			actionUpdate: "update",
			actionUninstall: "removal",
			errorPlugin: "Plugin",
			errorClose: "Got it",
			errorCopy: "Copy error",
			errCopied: "Error copied",
			failCopy: "Copy full log",
			failIssueHint: "Open a pre-filled issue on the author repo with this error log (includes catalog links)",
			failIssueBig: "Report this bug to GitHub — contribute to open source",
			failHubIssueHint: "This failure was classified as an environment or Plugin Hub issue (not a plugin-author issue). Open a pre-filled issue on the Plugin Hub repo with this error log.",
			failHubIssueBig: "Report to the Plugin Hub for triage",
			failUnclassifiedHint: "The {action} failed and the cause could not be identified automatically. This is usually not the plugin itself (it may relate to your local environment or the Plugin Hub). Please report the error to the Plugin Hub so the maintainers can triage it.",
			failHubStateHint: "The plugin list is out of date or out of sync: the target of this {action} may already be in the list (use \"Update\" to upgrade), may no longer be in the installed list, or may already be queued. This is not a plugin problem — refresh the page and retry.",
			failTimeoutHint: "This operation exceeded the local time limit and was interrupted — but it may well have taken effect already (the installer re-checks the installed list after a timeout). Refresh the page to confirm the current state; if it did not take effect, run the corresponding command in a terminal to see the full output. This is not a plugin problem.",
			failProfileLockHint: "DSH timed out waiting for the file lock while writing the plugin list — usually because another DSH process or install task is writing the same profile (sometimes a previous run left the lock behind). Close other dsh windows or running commands, then retry; if it keeps happening, restart DSH once. This is not a plugin problem, and there is no need to repeat the {action}.",
			failHostCliSpawnHint: "DSH could not start itself to perform this operation (the system reported that the executable was not found). This usually means the DSH installation folder has been moved or is being updated, or that the profile directory does not exist yet. Restart DSH and retry; if it keeps happening, reinstall DSH. This is not a plugin problem — other plugins would fail the same way.",
			failPrepareHint: "This plugin failed while running its build scripts during install (the published npm package is incomplete). This is a packaging issue of the plugin itself — please report it to the author repository.",
			failMisjudgeHint: "If this plugin actually installs fine (the verdict above is the Plugin Hub misjudging it), please report it to the Hub: that verdict is produced by the marketplace itself, so a false positive can only be found through your feedback.",
			failMisjudgeLink: "Plugin installs fine but got blocked? Report to the Plugin Hub",
			failPackagingHint: "This plugin does not support the official default install method: its git distribution lacks a file the package needs (the entry from `main` / `exports`, an entry its own patch mounts by name, or the patch declared by `dsh.bundle.patch`), so it has not been adapted to the official install flow. Please file an Issue on the author's repo asking for committed build output, a prebuilt release `.tgz` (`releases/download/<tag>/<asset>.tgz`), or a complete npm release.",
			failIgnoredBuild: "This plugin (or one of its dependencies) needs to run build scripts at install time, which pnpm blocks by default via its allowBuilds allowlist — so this operation fails (e.g. native modules like node-pty, or the plugin's own prepare script on git installs). The installer already auto-allows that key and retries once; if it still fails, the build itself is the problem, so no user can install it. Run the install command in a terminal to see the full build error; this is a build/distribution issue of the plugin itself — please report it to the author repository, asking them to ship prebuilt output, a complete npm release, or a prebuilt .tgz.",
			failNpmTooLow: "Your local npm may be too old: npm crashed internally while resolving the plugin's dependencies (a known npm bug — not a plugin issue). Please upgrade npm and retry: npm install -g npm@latest",
			failNpmTooLowV: "Your local npm is too old (v{v}): npm crashed internally while resolving the plugin's dependencies (a known npm bug — not a plugin issue). Please upgrade npm and retry: npm install -g npm@latest",
			failNetworkHint: "The network could not be reached before the {action}: the install source is unreachable (offline, DNS failure, firewall block, or a misconfigured proxy). This is not a problem with the plugin itself — please check your connection, confirm the HTTP proxy in Settings, run a connectivity check under System Diagnostics, then retry.",
			failNetworkRegistryHint: "Your npm/pnpm registry is set to {host}, and the package tarball could not be downloaded from it. This usually means a private/internal mirror that has not synced the package (or requires intranet auth) — point the registry back to https://registry.npmjs.org (or make sure this source can serve the package), then retry.",
			failNetworkTarget: "Cannot reach {url} — your network connection is down",
			failNetworkRunDiag: "Run a network diagnostic",
			failOriginRejectedHint: "This install request did not pass the marketplace origin check and was rejected by the local service, so the install never started — this is not about the plugin itself. It usually means the marketplace page was not opened from a local address (for example a LAN IP), or the host page origin was not recognized. Reopen the marketplace from localhost and retry; on the desktop app, restart the host once. If it still fails after restarting the host, your dsh-plugin version is incompatible with the host — upgrade the marketplace with dsh plugin --profile {profile} add dsh-plugin@latest, then restart the host again.",
			failDshMissingHint: "The dsh command could not be found (it is not on the system PATH), so the installer could not run. Please make sure DeepSeek Harness is installed correctly and dsh is on your PATH (or reinstall it), then retry. This is not a problem with the plugin itself.",
			failGitMissingHint: "The git command could not be found (Git is not installed or not on the system PATH), so GitHub-source plugins cannot be installed. Please install Git (e.g. from git-scm.com/downloads) or add git to your PATH, restart DSH, then retry. This is not a problem with the plugin itself.",
			failPnpmMissingHint: "The installer found dsh, but pnpm is missing on this machine (dsh uses it to manage profile plugins). Please install pnpm first (e.g. npm install -g pnpm), make sure it is on your PATH, then retry. This is not a problem with the plugin itself.",
			failNpmMissingHint: "The npm command could not be found (npm is not installed or not on the system PATH), so a global install cannot run. Please install Node.js (which bundles npm), make sure npm is on your PATH, then retry. This is not a problem with the plugin itself.",
			failBuildToolchainHint: "This plugin depends on a native module that must be compiled on your machine, but no usable build toolchain is available. Install one and retry: on Windows install Visual Studio Build Tools with the \"Desktop development with C++\" workload; on macOS run xcode-select --install; on Linux install build-essential, python3 and make. If it still fails after the toolchain is installed, report it to the plugin author and ask for a prebuilt package.",
			bundleDeselectedHint: "Note: the marketplace is unchecked in this profile's bundle list, so it will not appear after the host restarts. Re-check dsh-plugin under Settings → Plugins.",
			failPnpmStoreHint: "pnpm reported an unexpected store location (ERR_PNPM_UNEXPECTED_STORE): the profile directory was previously set up with a different major version of pnpm, and the current pnpm refuses to reuse it — no plugin can be installed into that profile. Delete node_modules and pnpm-lock.yaml under the profile directory (see System Logs or ~/.dsh/profiles/<profile>/hub.log for the full output), then reinstall. This is not a problem with the plugin itself.",
			failPnpmUnusedPatchHint: "pnpm reported that some patches were not used (ERR_PNPM_UNUSED_PATCH): your profile still holds a patch entry for an older dsh-plugin version (for example dsh-plugin@1.4.2), while this install resolved a different version, so pnpm aborts the whole install for safety — no plugin can be installed into that profile. This is not a problem with the plugin itself. Remove that dsh-plugin patch entry from pnpm-workspace.yaml (pnpm 11+) or from pnpm.patchedDependencies in package.json (pnpm 10) inside the profile directory (~/.dsh/profiles/<profile>), then retry.",
			failProfileStateHint: "pnpm reported that the profile metadata does not match the current environment (e.g. ERR_PNPM_OUTDATED_LOCKFILE / ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND / ERR_PNPM_BAD_PM_VERSION / ERR_PNPM_PATCH_NOT_APPLIED): pnpm-lock.yaml, package.json or the patch declarations inside the profile disagree with the pnpm version in use, so pnpm aborts before installing anything — every plugin install into this profile will fail. This is not a problem with the plugin itself. Delete pnpm-lock.yaml inside the profile directory (~/.dsh/profiles/<profile>) and retry (pnpm regenerates it from the declared dependencies); if the error is about packageManager, set that field in package.json to the current pnpm major or remove it; if it still fails, rebuild the profile dependencies.",
			failNodeEngineHint: "This plugin (or one of its dependencies) declares a higher Node / pnpm version (ERR_PNPM_UNSUPPORTED_ENGINE / EBADENGINE), which the current one does not satisfy, so pnpm refuses at install time. This is not a problem with the plugin itself. Upgrade Node to the required version (switch with nvm / fnm, or install a newer Node.js), confirm node -v and pnpm -v both satisfy it, then retry.",
			failPnpmMissingDepTarget: "{pkg} was not found on the npm registry (404)",
			failPnpmMissingDepHint: "pnpm reported that a package does not exist on the npm registry (ERR_PNPM_FETCH_404): your profile keeps a dependency on a package that was never published, and pnpm hits it every time it resolves dependencies — no plugin can be installed into that profile. This is not a problem with the plugin itself. Remove that dependency from package.json inside the profile directory (~/.dsh/profiles/<profile>) — along with its entry in pnpm-lock.yaml, or the lockfile itself — then retry.",
			failRegistryMirrorLagHint: "pnpm reported that a package does not exist on the npm registry (ERR_PNPM_FETCH_404): that package does exist on the official npm registry, but the npm/pnpm registry (or mirror) configured on your machine has not synced it. Point the npm/pnpm registry back at the official one (https://registry.npmjs.org), or switch to a mirror that has the package, then retry. This is not a problem with the plugin itself.",
			failPluginMissingDepTarget: "{pkg} does not exist on the official npm registry",
			failPluginMissingDepHint: "A package this plugin depends on does not exist on the official npm registry (removed, or never published). This is a dependency problem on the plugin author side, not a problem with your environment. Please report it to the plugin repository so the author can fix that dependency or ship it together with the plugin.",
			failHostIncompatibleKind: "Plugin does not support the DSH version in use",
			failHostIncompatibleReason: "The current DSH ({version}) is not in this plugin's compatibility list, so the host refused before installing anything.",
			failHostIncompatibleHint: "① Ask the author to extend the supported dsh versions and publish a release (button below).\n② Grant an exact-version exemption in the plugin manager of the desktop app (the host warns about crash / data-loss risk).",
			failKind_npmTooOld: "npm on this machine is too old",
			failReason_npmTooOld: "The installed npm cannot resolve the dependency tree of this package, so it aborted.",
			failKind_dshMissing: "dsh is not installed on this machine",
			failReason_dshMissing: "The installer needs to call dsh, but it cannot be found on your machine.",
			failKind_gitMissing: "git is not installed on this machine",
			failReason_gitMissing: "A dependency of this package needs git, but git cannot be found.",
			failKind_pnpmMissing: "pnpm is not installed on this machine",
			failReason_pnpmMissing: "The installer uses pnpm to add plugins, but pnpm cannot be found.",
			failKind_npmMissing: "npm is not installed on this machine",
			failReason_npmMissing: "The install flow needs npm, but it cannot be found.",
			failKind_buildToolchainMissing: "native build toolchain is missing",
			failReason_buildToolchainMissing: "A dependency of this plugin must be compiled locally, but no usable compiler was found.",
			failKind_pnpmStore: "pnpm store version mismatch",
			failReason_pnpmStore: "The profile dependencies were written by a different pnpm major, which the current pnpm does not accept.",
			failKind_pnpmModulesMismatch: "profile dependency directory does not match the current pnpm config",
			failReason_pnpmModulesMismatch: "node_modules was created with a different pnpm config (hoisting / virtual store length), so pnpm refuses to reuse it.",
			failPnpmModulesMismatchHint: "pnpm reported that the modules directory does not match the current configuration (`ERR_PNPM_*_DIFF`, e.g. virtual-store-dir-max-length, public-hoist-pattern, hoisting rules, node-linker): node_modules inside the profile was built under a different pnpm config (typically after editing .npmrc, switching pnpm majors, or when the pnpm bundled with the desktop app differs from the one on PATH), so the current pnpm refuses to operate on it — installs and removals in this profile will keep failing. Fix it (any one of these, run inside the profile directory ~/.dsh/profiles/<profile>): ① run pnpm install once so it recreates the modules directory with the current config; ② delete node_modules there — the next install/removal recreates it; ③ if you set these options in .npmrc, make the values consistent (or drop the overrides and go back to the defaults). This is not a problem with the plugin itself.",
			failKind_pnpmWorkspace: "workspace-root check blocked the install",
			failReason_pnpmWorkspace: "The profile is treated as a workspace root without a root operation declared, so pnpm aborted.",
			failKind_originRejected: "request origin rejected by the local service",
			failReason_originRejected: "The request never reached the install flow: the local service rejected its origin.",
			failKind_pnpmPolicy: "blocked by the pnpm supply-chain policy",
			failReason_pnpmPolicy: "The version is younger than the minimum release age, or an integrity / trust check failed.",
			failKind_pnpmUnusedPatch: "stale patch entry in the profile",
			failReason_pnpmUnusedPatch: "The profile keeps a patch for an older dsh-plugin version, so pnpm aborted for safety.",
			failKind_profileState: "profile pnpm metadata does not match this machine",
			failReason_profileState: "The profile lockfile / package.json / packageManager version disagrees with the current pnpm, so the install aborts before starting.",
			failKind_nodeEngine: "Node / pnpm on this machine is below the required version",
			failReason_nodeEngine: "This plugin (or a dependency) requires a newer Node / pnpm, so pnpm rejects the install.",
			failKind_pnpmMissingDep: "a dependency does not exist on the registry",
			failReason_pnpmMissingDep: "The profile keeps a dependency on an unpublished package, which pnpm hits on every resolve.",
			failKind_pluginMissingDep: "plugin dependency is not published",
			failReason_pluginMissingDep: "A package the plugin depends on does not exist on the official npm registry.",
			failKind_registryVersionStale: "this version is not available on the registry in use",
			failReason_registryVersionStale: "The registry that actually performs the install has not synced this version yet, or the version is mistyped.",
			failKind_registryAuth: "the npm registry rejected access",
			failReason_registryAuth: "The registry returned 401/403: it needs credentials, or the current network is not allowed.",
			failKind_profileExclusive: "the profile is managed only by the desktop app",
			failReason_profileExclusive: "The dsh CLI may not manage the desktop profile, so the host refused before installing.",
			failKind_pnpmLinkedDirMissing: "dangling local dependency in the profile",
			failReason_pnpmLinkedDirMissing: "A link/file dependency points at a directory that no longer exists, so pnpm stalls on it.",
			failKind_fileLocked: "a file is held by another program",
			failReason_fileLocked: "pnpm could not replace a file inside the profile because another program is holding it.",
			failKind_accessDenied: "write access denied",
			failReason_accessDenied: "The system denied pnpm write access to files inside the profile.",
			failKind_fsUnavailable: "the disk is not writable",
			failReason_fsUnavailable: "The disk is full or read-only, or file handles are exhausted.",
			failKind_pnpmIgnoredBuild: "native build scripts blocked",
			failReason_pnpmIgnoredBuild: "A plugin dependency has to be compiled on your machine, and pnpm blocks build scripts by default.",
			failKind_pluginPrepare: "plugin distribution is incomplete",
			failReason_pluginPrepare: "The published package is missing files, or its build script failed.",
			failKind_hostIncompatible: "plugin does not support the DSH version in use ({version})",
			failReason_hostIncompatible: "The plugin's declared compatibility list does not include the DSH version you are running.",
			failKind_network: "network connection failed",
			failReason_network: "The install could not reach the npm registry or the proxy, so the request never completed.",
			failKind_tlsTrust: "HTTPS certificate verification failed",
			failReason_tlsTrust: "Something on this machine is replacing HTTPS certificates, and Node / pnpm does not trust its root CA.",
			failTlsTrustHint: "TLS certificate verification failed while reaching the npm registry (`ERR_PNPM_META_FETCH_FAIL` / unable to verify the first certificate): something on this machine is replacing HTTPS certificates — corporate SSL inspection, an antivirus web shield, a debugging proxy such as Fiddler / Charles, or HTTPS decryption in a local proxy — and Node / pnpm does not trust its root CA. This is not a problem with the plugin; every plugin would fail the same way. In order: ① if your network performs SSL inspection, ask IT for the root certificate (.cer / .pem) and point the NODE_EXTRA_CA_CERTS environment variable at it; ② on Node ≥ 22.15 you can set NODE_OPTIONS=--use-system-ca so Node trusts the system certificate store; ③ if only your local proxy decrypts HTTPS, add registry.npmjs.org to its direct (no-MITM) list; ④ as a temporary workaround, switch to a public mirror such as https://registry.npmmirror.com and retry. We do not recommend disabling strict-ssl: that gives up verification entirely and exposes you to man-in-the-middle attacks.",
			failKind_hostCliSpawn: "the DSH host could not be launched",
			failReason_hostCliSpawn: "The resolved host entry point would not start, so the install command never ran.",
			failKind_hubState: "plugin hub state is out of sync",
			failReason_hubState: "The locally recorded install state does not match reality, so this operation had no effect.",
			failKind_profileBundleMissing: "profile dependencies are incomplete",
			failReason_profileBundleMissing: "The host cannot find a bundle the profile declares, so the install failed before it even started.",
			failProfileBundleMissingHint: "The host could not resolve the profile dependency \"{pkg}\" while starting plugin management — the dependencies declared by this profile are not fully installed (node_modules was deleted, a previous install was interrupted, or the desktop app update was incomplete). This has nothing to do with the plugin you were installing; any plugin would fail the same way. Fix it: ① let the host install the profile dependencies again (reopen the Plugin Hub inside the desktop app, or run `dsh plugin --profile {profile} install`; a desktop-managed profile has to be handled from inside the app, an external CLI is not allowed); ② if the same error persists, the app installation itself is incomplete — reinstall or upgrade DeepSeek Harness Desktop.",
			failKind_timeout: "operation timed out",
			failReason_timeout: "The install exceeded the time limit and was aborted.",
			failKind_profileLock: "profile is locked by another process",
			failReason_profileLock: "Another dsh process is using this profile right now.",
			failKind_hub: "unknown error",
			failReason_hub: "We could not identify this error yet — you can report it to us in one click.",
			failKind_localEnv: "local environment failure",
			failReason_localEnv: "The error points at your local environment (system error codes, certificates/proxy, or local config), and no plugin-side cause was found.",
			failKind_dshTooOld: "DSH is older than the plugin requires",
			failReason_dshTooOld: "The plugin declares a minimum DSH version that is newer than the host you are running.",
			failDshTooOldHint: "The plugin \"{pkg}\" requires DSH {floor} or newer, but this host runs {current} — the install cannot succeed on an older host (or the plugin will not load properly). This is not a problem with the plugin itself, and not a mistake by the marketplace. Upgrade DeepSeek Harness to {floor} or newer, then retry from the Plugin Hub. If it still fails after upgrading, send us the new error.",
			failLocalEnvHint: "The log only tells us one thing for sure: there is no evidence of a plugin-side failure — the signals point at your local environment (system call error codes, certificate/proxy validation, a broken local config file), but not precisely enough to name one. Any plugin would fail the same way on this machine, so it is not a problem with the plugin itself. Check in order: ① press \"Run diagnostics\" below; ② make sure the profile directory (~/.dsh/profiles/<profile>) is writable, the disk has free space, and antivirus is not blocking it; ③ if you use a proxy or a company mirror, switch back to the official registry (https://registry.npmjs.org) for one retry; ④ fully quit DeepSeek Harness and retry. If it still fails and you are sure your environment is fine, use the link below to report it with the full log copied from the Hub notifications.",
			failRegistryVersionStaleHint: "pnpm reported that no matching version was found (ERR_PNPM_NO_MATCHING_VERSION): the version being installed does not exist in the npm registry that actually performs the install. This usually means the npmRegistry configured in the hub differs from the source in your local ~/.npmrc — the official registry has published it but the mirror has not synced yet (it can take minutes to hours) — or the version number was simply mistyped. This is not a problem with the plugin itself. Align the hub's npmRegistry with your local ~/.npmrc (or the other way round), or explicitly use the official registry (https://registry.npmjs.org) for that one install, or use an offline package, then retry; if the version was published only recently, waiting for the mirror to sync is enough.",
			failRegistryAuthHint: "The installer was denied access to the npm registry (HTTP 401/403): that registry requires credentials, or it does not allow the current network/IP. If you are using a company or private registry, configure authentication first (npm login, or write //{host}/:_authToken=… into ~/.npmrc). If you do not need a private registry, point the registry back to the official one (https://registry.npmjs.org), or switch to a public mirror in the hub settings, then retry. This is not a problem with the plugin itself.",
			failRegistryAuthHintNoHost: "The installer was denied access to the npm registry (HTTP 401/403): that registry requires credentials, or it does not allow the current network/IP. If you are using a company or private registry, configure authentication first (npm login, or write //<registry>/:_authToken=… into ~/.npmrc). If you do not need a private registry, point the registry back to the official one (https://registry.npmjs.org), or switch to a public mirror in the hub settings, then retry. This is not a problem with the plugin itself.",
			failProfileExclusiveHint: "Profile \"{profile}\" is managed exclusively by the desktop app, and the command-line dsh is not allowed to install into it — this is not a problem with the plugin itself. Install from \"Settings → Plugin Hub\" inside DeepSeek Harness Desktop, or retry with a profile that is not desktop-managed (for example web). If you hit this inside the desktop app, open the Hub notifications, select the failed record and press \"Copy\" so you can send us the full log.",
			failProfileExclusiveHintNoProfile: "The current profile is managed exclusively by the desktop app, and the command-line dsh is not allowed to install into it — this is not a problem with the plugin itself. Install from \"Settings → Plugin Hub\" inside DeepSeek Harness Desktop, or retry with a profile that is not desktop-managed (for example web). If you hit this inside the desktop app, open the Hub notifications, select the failed record and press \"Copy\" so you can send us the full log.",
			failDesktopCliFallbackHint: "This failed because the installer could not find the desktop app's bundled CLI bootstrap and fell back to the command-line dsh, which is then refused — that is a bug in the plugin hub, not your environment. Use the button below to send us the full log and we will fix the path detection.",
			failPnpmLinkedDirMissingHint: "pnpm reported that a directory it needs to install from does not exist (ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND): your profile keeps a local dependency (a link: / file: entry, e.g. from `dsh plugin add <local path>`) whose target directory has since been deleted or moved. pnpm hits it every time it resolves profile dependencies, so no plugin can be installed into that profile. This is not a problem with the plugin itself. Remove that local dependency from package.json inside the profile directory (~/.dsh/profiles/<profile>) — along with its entry in pnpm-lock.yaml, or the lockfile itself — or restore the directory to its original path, then retry.",
			failLinkedDirTarget: "Missing local directory: {path}",
			failFileLockedHint: "During install, pnpm could not replace a file inside the profile because another program is holding it (on Windows this shows as os error 32, \"the process cannot access the file because it is being used by another process\"). Usually DeepSeek Harness itself or a real-time antivirus scan holds the handle. This is not a problem with the plugin itself — fully quit DeepSeek Harness (on Windows, confirm in Task Manager that the process has ended, and temporarily disable real-time antivirus protection if needed), then retry.",
			failAccessDeniedHint: "During install, Windows denied pnpm access to a file inside the profile (this shows as os error 5, \"Access is denied\"; on Node the equivalent codes are EPERM / EACCES). Typical causes: the file or directory is held by another process, the file is marked read-only, the directory permissions are restricted, or a real-time antivirus scan blocked the write. This is the same class of local file-system problem as a locked file (os error 32) — no plugin can be installed into that directory, so it is not a problem with the plugin itself. Fully quit DeepSeek Harness (on Windows, confirm in Task Manager that the process has ended, and temporarily disable real-time antivirus protection if needed), then retry. If it still fails, check whether the profile directory or its files are read-only and run as administrator.",
			failFsUnavailableHint: "During install, pnpm could not write files to the local disk — this has nothing to do with which plugin you are installing: any plugin installed into the same directory would fail the same way, so it is not a problem with the plugin itself. Match the error you see: ① Out of space (ENOSPC / no space left on device, os error 112 on Windows) — free up space on the drive that holds the profile and retry. ② Read-only or write-protected volume (EROFS / read-only file system, os error 19 on Windows) — make sure the drive holding the profile directory is writable (external or USB drives, write-protected media, and read-only mounts all trigger this); move the plugin directory to a writable location on the system drive if needed. ③ File handles exhausted (EMFILE / ENFILE / too many open files) — close programs that hold many files open, restart DeepSeek Harness, then retry.",
			failPnpmWorkspaceHint: "pnpm refused to add the dependency to the workspace root (ERR_PNPM_ADDING_TO_ROOT): the profile directory is treated as a pnpm workspace root, and this install command did not declare that it operates at the root, so pnpm rejected it outright — no plugin can be installed into that profile. This is not a problem with the plugin itself. Add `ignore-workspace-root-check=true` to the `.npmrc` inside the profile directory (~/.dsh/profiles/<profile>) and retry, or upgrade DeepSeek Harness and try again.",
			failPnpmTarballIntegrityHint: "pnpm reported ERR_PNPM_MISSING_TARBALL_INTEGRITY: a tarball entry in the lockfile has no checksum to verify the downloaded package. Read the full log, fully quit DeepSeek Harness, and inspect and back up package.json, pnpm-lock.yaml and pnpm-workspace.yaml in the affected profile. Once the dependency sources are verified, rename pnpm-lock.yaml to preserve it, then use the same DSH installer to install a plugin version compatible with the host and regenerate the lockfile. This resolves profile dependencies again: compare the old and new versions, and keep integrity checks enabled.",
			failPnpmTarballMismatchHint: "pnpm reported ERR_PNPM_TARBALL_INTEGRITY: a dependency installed from a GitHub branch (for example github:owner/repo#main) changed upstream, so the tarball content no longer matches the checksum stored in pnpm-lock.yaml — and every install into that profile now stops on it. To fix: open ~/.dsh/profiles/<profile>/pnpm-lock.yaml, remove the entry for that GitHub dependency (or rename the whole lockfile as a backup if unsure which one it is), then reinstall. Long term, pin the dependency to a commit (github:owner/repo#<commit>) so branch updates no longer change its checksum.",
			failPnpmPolicyHint: "The installer was blocked by pnpm supply-chain security policy — every plugin install would hit the same wall, so this is not a problem with the plugin itself. Two cases: ① \"Minimum release age\" (ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION): the package was published less than 24 hours ago, and pnpm 11 refuses freshly-published packages for safety. Add minimumReleaseAge: 0 to your pnpm config (pnpm-workspace.yaml) to opt out, or wait until the 24 hours have passed and retry. ② \"untrusted origin\" (ERR_PNPM_UNTRUSTED_ORIGIN): a dependency source is not trusted by this machine, usually because plugins were previously installed via github: or a non-official npm registry, so the lockfile records an untrusted source. Delete node_modules and pnpm-lock.yaml under the profile directory (see System Logs or ~/.dsh/profiles/<profile>/hub.log for the full output), then reinstall.",
			failPnpmReleaseAgeHint: "The installer was blocked by pnpm supply-chain security policy, and every plugin installed into this profile would hit the same wall — this is not a problem with the plugin itself. The package was published less than 24 hours ago, and pnpm 11 refuses freshly-published packages for safety, so both installs and removals are blocked for this profile in the meantime. Retry after: {time} (i.e. 24 hours after the package was published). If you must install right now, add minimumReleaseAge: 0 to pnpm-workspace.yaml inside the profile directory (~/.dsh/profiles/<profile>) to opt out, but that loosens supply-chain protection for the whole profile.",
			installChannelNpm: "NPM package",
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
			updatePending: "Update available after {time}",
			updatePendingHint: "The new release is less than 24 hours old, so the pnpm supply-chain hold rejects it until then",
			hubUpdateHint: "A new DSH Plugin Hub version is available — click to view the changelog and update",
			hubUpdateTitle: "A new DSH Plugin Hub version is available",
			hubUpdateDesc: "v{version} has been released — click below to update, then restart the host to apply it.",
			hubUpdatePublished: "Published",
			hubUpdateNotes: "What's new",
			hubUpdateLater: "Later",
			versionHint: "View version info and changelog",
			hubCurrentTitle: "Current version",
			hubCurrentDesc: "You are on v{version} — this is the latest version.",
			hubPendingDesc: "v{version} has been released, but it is still within the 24-hour window where pnpm silently falls back to the older version, so the update is not offered yet. The update entry will appear here shortly.",
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
			"segLabel": "qikqja_segLabel",
			"root": "qikqja_root",
			"headerTitleRow": "qikqja_headerTitleRow",
			"tabCount": "qikqja_tabCount",
			"search": "qikqja_search",
			"tagline": "qikqja_tagline",
			"resultCount": "qikqja_resultCount",
			"taglineLink": "qikqja_taglineLink",
			"title": "qikqja_title",
			"segBtnActive": "qikqja_segBtnActive",
			"versionBtn": "qikqja_versionBtn",
			"tab": "qikqja_tab",
			"segBtn": "qikqja_segBtn",
			"searchRow": "qikqja_searchRow",
			"logoIcon": "qikqja_logoIcon",
			"sortGroup": "qikqja_sortGroup",
			"header": "qikqja_header",
			"controls": "qikqja_controls",
			"langBtn": "qikqja_langBtn",
			"githubLink": "qikqja_githubLink",
			"githubIcon": "qikqja_githubIcon",
			"brandTitle": "qikqja_brandTitle",
			"adBanner": "qikqja_adBanner",
			"tabActive": "qikqja_tabActive",
			"segGroup": "qikqja_segGroup",
			"tabsRow": "qikqja_tabsRow",
			"copyIcon": "qikqja_copyIcon",
			"version": "qikqja_version",
			"resultSeg": "qikqja_resultSeg",
			"headerRight": "qikqja_headerRight",
			"hubUpdateBadge": "qikqja_hubUpdateBadge",
			"adBadge": "qikqja_adBadge",
			"adText": "qikqja_adText",
			"adArrow": "qikqja_adArrow",
			"aboutBtn": "qikqja_aboutBtn",
			"tabs": "qikqja_tabs"
		};
		//#endregion
		//#region \0dsh-css:src/client/styles/Modal.module.css.mjs
		const css$10 = ".BiQ1zG_overlay{z-index:998;-webkit-user-select:none;user-select:none;background:#00000061;justify-content:center;align-items:center;animation:.16s ease-out BiQ1zG_overlayIn;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.BiQ1zG_modal,.BiQ1zG_errorModal{background:var(--hub-bg-1);border:1px solid var(--hub-border-2);border-radius:10px;flex-direction:column;gap:10px;width:540px;max-width:calc(100vw - 32px);max-height:calc(100vh - 64px);padding:14px 16px;animation:.18s ease-out BiQ1zG_modalIn;display:flex;box-shadow:0 12px 40px #0000003d}.BiQ1zG_errorModal{width:720px;max-width:calc(100vw - 48px)}.BiQ1zG_modalWide{width:640px;max-width:calc(100vw - 48px)}.BiQ1zG_helpModal{width:760px;max-width:calc(100vw - 48px)}.BiQ1zG_logModal{width:820px;max-width:calc(100vw - 48px);height:min(540px,100vh - 64px)}.BiQ1zG_modalHead{flex-shrink:0;justify-content:space-between;align-items:center;gap:8px;display:flex}.BiQ1zG_modalTitle{color:var(--hub-text-primary);font-size:14px;font-weight:600;line-height:20px}.BiQ1zG_modalTitleBusy{color:var(--hub-brand)}.BiQ1zG_modalTitleQueued{color:var(--hub-warning)}.BiQ1zG_modalClose{width:24px;height:24px;color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;font-size:16px;line-height:1;display:inline-flex}.BiQ1zG_modalClose:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.BiQ1zG_modalCloseIcon{flex-shrink:0;width:14px;height:14px}.BiQ1zG_confirmIconWrap{justify-content:center;padding:2px 0 6px;display:flex}.BiQ1zG_confirmIcon{background:var(--hub-brand);border-radius:50%;flex:none;justify-content:center;align-items:center;width:48px;height:48px;display:inline-flex;box-shadow:0 4px 12px #4f6ef747}.BiQ1zG_confirmIconDanger{background:var(--hub-danger);box-shadow:0 4px 12px #d1242f4d}.BiQ1zG_dangerConfirm{color:#fff;background:var(--hub-danger);border:1px solid var(--hub-danger);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;flex:none;height:28px;padding:0 14px;font-size:12px;font-weight:600;transition:background-color .12s,border-color .12s}.BiQ1zG_dangerConfirm:hover:not(:disabled){background:var(--hub-danger-hover);border-color:var(--hub-danger-hover)}.BiQ1zG_dangerConfirm:disabled{opacity:.55;cursor:default}.BiQ1zG_confirmPrimary{color:#fff;background:var(--hub-brand);border:1px solid var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;flex:none;height:28px;padding:0 14px;font-size:12px;font-weight:600;transition:filter .12s}.BiQ1zG_confirmPrimary:hover:not(:disabled){filter:brightness(1.08)}.BiQ1zG_confirmPrimary:disabled{opacity:.55;cursor:default}.BiQ1zG_modalDesc{color:var(--hub-text-secondary);font-size:12px;line-height:18px}.BiQ1zG_trustHint{color:var(--hub-danger-text);background:var(--hub-danger-tint);border:1px solid var(--hub-danger-border-soft);border-radius:6px;padding:6px 10px;font-size:12px;font-weight:500;line-height:18px}.BiQ1zG_cliOnlyHint{color:var(--hub-text-secondary);background:var(--hub-bg-hover);border-radius:6px;padding:6px 10px;font-size:12px;line-height:18px}.BiQ1zG_failedCopyHint{color:var(--hub-danger-text);background:var(--hub-danger-tint);border:1px solid var(--hub-danger-border-soft);border-radius:6px;padding:6px 10px;font-size:12px;font-weight:500;line-height:18px}.BiQ1zG_modalRow{align-items:baseline;gap:8px;min-width:0;font-size:12px;line-height:18px;display:flex}.BiQ1zG_modalLabel{min-width:64px;color:var(--hub-text-tertiary);flex-shrink:0}.BiQ1zG_modalValue{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--hub-text-primary);font-weight:500;overflow:hidden}.BiQ1zG_modalLink{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;gap:4px;font-weight:500;text-decoration:none;transition:color .12s;display:inline-flex;overflow:hidden}.BiQ1zG_modalLink:hover{color:var(--hub-brand-hover);text-decoration:underline}.BiQ1zG_linkIcon{flex-shrink:0}.BiQ1zG_modalCmd{color:var(--hub-text-primary);background:var(--hub-bg-2);border:1px solid var(--hub-border-2);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;justify-content:space-between;align-items:center;gap:8px;padding:6px 6px 6px 10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:18px;transition:border-color .12s,background .12s;display:flex}.BiQ1zG_modalCmd:hover{border-color:var(--hub-border-ghost);background:var(--hub-bg-3)}.BiQ1zG_modalCmdText{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.BiQ1zG_modalCmdCopy{color:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:4px;flex-shrink:0;align-items:center;gap:3px;padding:1px 7px;font-family:inherit;font-size:11px;line-height:16px;transition:color .12s,background .12s;display:inline-flex}.BiQ1zG_modalCmdCopy:hover{color:var(--hub-brand-hover);background:var(--hub-bg-2)}.BiQ1zG_modalActions{justify-content:flex-end;align-items:center;gap:8px;margin-top:2px;display:flex}.BiQ1zG_modalBody{flex-direction:column;flex:auto;gap:10px;min-height:0;display:flex;overflow-y:auto}.BiQ1zG_toast{z-index:1000;background:var(--hub-btn-fill);color:var(--hub-text-on-fill);pointer-events:none;white-space:nowrap;border:none;border-radius:8px;padding:10px 16px;font-size:12px;font-weight:500;line-height:18px;animation:.22s ease-out BiQ1zG_toastIn;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 6px 24px #00000047}@keyframes BiQ1zG_toastIn{0%{opacity:0;transform:translate(-50%,-44%)}to{opacity:1;transform:translate(-50%,-50%)}}.BiQ1zG_toastFail{background:var(--hub-danger);color:#fff;border-color:#ffffff3d}.BiQ1zG_queueSection{flex-direction:column;gap:6px;display:flex}.BiQ1zG_queueSectionTitle{color:var(--hub-text-secondary);padding:4px 2px 0;font-size:12px;font-weight:600;line-height:18px}.BiQ1zG_pendingRowStatus{color:var(--hub-warn);flex-shrink:0;font-weight:500}.BiQ1zG_pendingRowActions{flex-shrink:0;gap:8px;margin-left:auto;display:flex}.BiQ1zG_queueRow{border:1px solid var(--hub-border-2);background:var(--hub-bg-2);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:8px;flex-direction:column;gap:5px;padding:8px 10px;font-size:12px;line-height:18px;transition:background .12s;display:flex}.BiQ1zG_queueRow:hover{background:var(--hub-brand-tint)}.BiQ1zG_queueRowHead{align-items:center;gap:10px;display:flex}.BiQ1zG_queueRowTarget{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--hub-text-primary);flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow:hidden}.BiQ1zG_queueRowDesc{color:var(--hub-text-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.BiQ1zG_queueRowBody{align-items:center;gap:8px;display:flex}.BiQ1zG_queueRowStatus{color:var(--hub-brand);flex-shrink:0;font-weight:500}.BiQ1zG_queueRowTrack{flex:1;min-width:0}.BiQ1zG_queueRowPct{color:var(--hub-text-tertiary);font-variant-numeric:tabular-nums;flex-shrink:0}.BiQ1zG_stripCancel{color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;flex-shrink:0;padding:2px 10px;font-size:12px;line-height:18px;transition:background .12s,color .12s}.BiQ1zG_stripCancel:hover{background:var(--hub-danger-tint);color:var(--hub-danger-text)}.BiQ1zG_stripCancel:disabled{opacity:.45;cursor:default}.BiQ1zG_queuedHint{color:var(--hub-brand);background:var(--hub-brand-tint);border:1px solid var(--hub-brand-border-soft);border-radius:6px;padding:5px 10px;font-size:12px;line-height:18px}.BiQ1zG_errorTitle{color:var(--hub-danger-text);font-size:14px;font-weight:600;line-height:20px}.BiQ1zG_errorBox{border:1px solid var(--hub-danger-border);background:var(--hub-danger-tint-weak);max-height:72px;color:var(--hub-text-primary);white-space:pre-wrap;word-break:break-word;-webkit-user-select:none;user-select:none;border-radius:6px;margin:0;padding:10px 12px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:17px;overflow:auto}.BiQ1zG_errorCopySoft{color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:4px;flex-shrink:0;align-items:center;padding:2px 8px;font-size:11px;line-height:16px;transition:color .12s,background .12s;display:inline-flex}.BiQ1zG_errorCopySoft:hover{color:var(--hub-text-secondary);background:var(--hub-bg-2)}.BiQ1zG_errorHint{color:var(--hub-text-tertiary);font-size:12px;line-height:18px}.BiQ1zG_modalCancel,.BiQ1zG_modalCopy{color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:color .12s,background .12s}.BiQ1zG_modalCancel:hover,.BiQ1zG_modalCopy:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.BiQ1zG_modalInstall{color:var(--hub-text-on-fill);background:var(--hub-btn-fill);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.BiQ1zG_modalInstall:hover{background:var(--hub-btn-hover)}.BiQ1zG_modalCopy:disabled,.BiQ1zG_modalInstall:disabled,.BiQ1zG_modalCancel:disabled,.BiQ1zG_modalClose:disabled,.BiQ1zG_uninstallConfirm:disabled{opacity:.55;cursor:not-allowed;pointer-events:none}.BiQ1zG_uninstallConfirm{color:#fff;background:var(--hub-danger);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.BiQ1zG_uninstallConfirm:hover{background:var(--hub-danger-hover)}.BiQ1zG_result{text-align:center;flex-direction:column;align-items:center;gap:5px;padding:10px 0 2px;display:flex}.BiQ1zG_resultCheck{background:var(--hub-success-tint);width:40px;height:40px;color:var(--hub-success);border-radius:50%;justify-content:center;align-items:center;margin-bottom:3px;display:inline-flex}.BiQ1zG_resultCheckIcon{flex-shrink:0;width:20px;height:20px}.BiQ1zG_resultTitle{color:var(--hub-text-primary);font-size:13px;font-weight:600;line-height:20px}.BiQ1zG_resultDesc{color:var(--hub-text-secondary);font-size:12px;line-height:18px}.BiQ1zG_resultRestarting{color:var(--hub-text-tertiary);padding:12px 0 6px;font-size:12px;line-height:18px}.BiQ1zG_bundleDeselectedHint{text-align:left;color:var(--hub-warning);padding:12px 0 6px;font-size:12px;line-height:18px}.BiQ1zG_restartLater{color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:color .12s,background .12s}.BiQ1zG_restartLater:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.BiQ1zG_restartNow{color:var(--hub-text-on-fill);background:var(--hub-btn-fill);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.BiQ1zG_restartNow:hover{background:var(--hub-btn-hover)}.BiQ1zG_restartNow:disabled{opacity:.55;cursor:not-allowed;pointer-events:none}.BiQ1zG_restartNowWarning{color:#fff;background:var(--hub-warning);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.BiQ1zG_restartNowWarning:hover{background:var(--hub-warning-hover)}.BiQ1zG_restartNowWarning:disabled{opacity:.55;cursor:not-allowed;pointer-events:none}.BiQ1zG_result .BiQ1zG_modalActions{justify-content:center;gap:10px;margin-top:0;padding:6px 0 2px}.BiQ1zG_result .BiQ1zG_modalActions .BiQ1zG_restartLater,.BiQ1zG_result .BiQ1zG_modalActions .BiQ1zG_restartNow,.BiQ1zG_result .BiQ1zG_modalActions .BiQ1zG_restartNowWarning{min-width:100px}.BiQ1zG_progress{margin:10px 0 2px}.BiQ1zG_progressHead{justify-content:flex-end;align-items:center;margin-bottom:3px;display:flex}.BiQ1zG_progressText{color:var(--hub-text-secondary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:14px}.BiQ1zG_progressTrack{background:var(--hub-border-2);border-radius:2px;height:4px;overflow:hidden}.BiQ1zG_progressFill{background:var(--hub-brand);border-radius:2px;height:100%;transition:width .32s}.BiQ1zG_progressFillFail{background:var(--hub-danger)}@keyframes BiQ1zG_overlayIn{0%{opacity:0}to{opacity:1}}@keyframes BiQ1zG_modalIn{0%{opacity:0;transform:translateY(6px)scale(.98)}to{opacity:1;transform:translateY(0)scale(1)}}.BiQ1zG_failList{flex-direction:column;gap:12px;padding-right:2px;display:flex}.BiQ1zG_failRow{border:1px solid var(--hub-border-2);background:var(--hub-bg-2);border-radius:8px;flex-direction:column;gap:8px;padding:10px 12px;display:flex}.BiQ1zG_failHead{align-items:center;gap:8px;min-width:0;display:flex}.BiQ1zG_noticeList{flex-direction:column;gap:10px;padding-right:2px;display:flex}.BiQ1zG_noticeRow{border:1px solid var(--hub-border-2);background:var(--hub-bg-2);border-radius:8px;flex-direction:column;align-items:stretch;gap:6px;padding:10px 12px;display:flex}.BiQ1zG_noticeRowMain{align-items:center;gap:10px;width:100%;min-width:0;display:flex}.BiQ1zG_noticeBadgeOk,.BiQ1zG_noticeBadgeFail{border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;width:28px;height:28px;display:inline-flex;box-shadow:0 2px 6px #0000002e}.BiQ1zG_noticeBadgeOk{background:var(--hub-success)}.BiQ1zG_noticeBadgeFail{background:var(--hub-danger)}.BiQ1zG_noticeBadgeIcon{flex-shrink:0;width:12px;height:12px}.BiQ1zG_noticeMain{flex-direction:column;flex:1;gap:8px;min-width:0;display:flex}.BiQ1zG_noticeHead{align-items:center;gap:8px;min-width:0;display:flex}.BiQ1zG_noticeTextOk{color:var(--hub-success);flex-shrink:0;font-size:12px;font-weight:600;line-height:18px}.BiQ1zG_noticeTextFail{color:var(--hub-danger-text);flex-shrink:0;font-size:12px;font-weight:600;line-height:18px}.BiQ1zG_noticeFoot{justify-content:flex-end;align-items:center;display:flex}.BiQ1zG_noticeTime{color:var(--hub-text-tertiary);font-variant-numeric:tabular-nums;flex-shrink:0;font-size:11px;line-height:16px}.BiQ1zG_noticeRemove{width:22px;height:22px;color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:5px;flex-shrink:0;justify-content:center;align-items:center;margin-left:auto;transition:color .12s,background .12s;display:inline-flex}.BiQ1zG_noticeRemove:hover{color:var(--hub-danger-text);background:var(--hub-danger-tint)}.BiQ1zG_noticeRowOk .BiQ1zG_noticeRemove{margin-left:0}.BiQ1zG_noticeRowOk .BiQ1zG_noticeTime{margin-left:auto}.BiQ1zG_noticeRowUpdate{cursor:pointer;transition:border-color .12s,background .12s}.BiQ1zG_noticeRowUpdate:hover{border-color:var(--hub-brand);background:var(--hub-brand-tint)}.BiQ1zG_noticeVersion{color:var(--hub-brand);background:var(--hub-brand-tint);border:1px solid var(--hub-brand-border);font-variant-numeric:tabular-nums;border-radius:5px;flex-shrink:0;padding:0 6px;font-size:11px;font-weight:600;line-height:18px}.BiQ1zG_noticeUpdateGo{color:#fff;background:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:5px;flex-shrink:0;margin-left:2px;padding:2px 8px;font-size:11px;font-weight:600;line-height:16px;transition:background .12s}.BiQ1zG_noticeUpdateGo:hover{background:var(--hub-brand-hover)}.BiQ1zG_noticeIgnore{color:var(--hub-text-secondary);border:1px solid var(--hub-border-2);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:5px;flex-shrink:0;margin-left:2px;padding:1px 8px;font-size:11px;font-weight:500;line-height:16px;transition:color .12s,border-color .12s,background .12s}.BiQ1zG_noticeIgnore:hover{color:var(--hub-danger-text);border-color:var(--hub-danger-border);background:var(--hub-danger-tint)}.BiQ1zG_failKind{border:1px solid #0000;border-radius:4px;flex-shrink:0;padding:0 6px;font-size:10px;font-weight:500;line-height:16px}.BiQ1zG_failKindInstall{color:var(--hub-danger-text);border-color:var(--hub-danger-border);background:var(--hub-danger-tint)}.BiQ1zG_failKindUninstall{color:var(--hub-warn);border-color:var(--hub-warn-border);background:var(--hub-warn-tint)}.BiQ1zG_failRepo{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:18px;text-decoration:none;overflow:hidden}.BiQ1zG_failRepo:hover{text-decoration:none}a.BiQ1zG_failRepo{color:#2f6feb}.BiQ1zG_failRepoLabel{color:var(--hub-text-secondary)}a.BiQ1zG_failRepo:hover .BiQ1zG_failRepoUrl{text-decoration:underline}.BiQ1zG_failCopy{color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:4px;flex-shrink:0;align-items:center;padding:2px 8px;font-size:11px;line-height:16px;transition:color .12s,background .12s;display:inline-flex}.BiQ1zG_failCopy:hover{color:var(--hub-text-secondary);background:var(--hub-bg-2)}.BiQ1zG_failEmpty{text-align:center;color:var(--hub-text-tertiary);padding:24px 0;font-size:12px;line-height:18px}.BiQ1zG_failClear{color:var(--hub-danger);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:color .12s,background .12s}.BiQ1zG_failClear:hover{color:#fff;background:var(--hub-danger)}.BiQ1zG_failBigIssue{box-sizing:border-box;text-align:center;color:#fff;background:var(--hub-danger);border:1px solid var(--hub-danger);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:8px;width:100%;margin-top:4px;padding:3px 16px;font-size:13px;font-weight:600;line-height:18px;text-decoration:none;transition:background .12s,border-color .12s,box-shadow .12s;display:block}.BiQ1zG_failBigIssue:hover{background:var(--hub-danger-hover);border-color:var(--hub-danger-hover);box-shadow:0 3px 10px #d1242f59}.BiQ1zG_failKindTitle{text-align:left;color:var(--hub-danger-text);margin-top:10px;font-size:15px;font-weight:700;line-height:22px}.BiQ1zG_failReason{white-space:pre-line;text-align:left;color:var(--hub-text-secondary);margin-top:2px;font-size:12.5px;font-weight:400;line-height:19px}.BiQ1zG_failPrepareHint{white-space:pre-line;text-align:left;color:var(--hub-warning);background:var(--hub-warning-tint);border:1px solid var(--hub-warning-border);border-radius:6px;margin-top:6px;margin-bottom:12px;padding:8px 12px;font-size:12px;line-height:18px}.BiQ1zG_failDiagBtn{box-sizing:border-box;text-align:center;width:100%;color:var(--hub-text-on-fill);background:var(--hub-btn-fill);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:8px;margin-top:8px;padding:5px 16px;font-size:13px;font-weight:600;line-height:18px;transition:background .12s,box-shadow .12s;display:block}.BiQ1zG_failDiagBtn:hover{background:var(--hub-btn-hover);box-shadow:0 3px 10px #0000001f}.BiQ1zG_failMisjudgeLink{color:var(--hub-text-tertiary);cursor:pointer;margin-top:6px;font-size:12px;line-height:18px;text-decoration:underline;display:inline-block}.BiQ1zG_failMisjudgeLink:hover{color:var(--hub-text-secondary)}.BiQ1zG_failNetworkTarget{word-break:break-all;color:var(--hub-danger);background:var(--hub-danger-tint);border:1px solid var(--hub-danger-border);border-radius:6px;margin-top:6px;padding:8px 12px;font-size:13px;font-weight:700;line-height:20px}.BiQ1zG_aboutModal{width:560px;max-width:calc(100vw - 48px)}.BiQ1zG_aboutContent{min-height:0;max-height:340px;color:var(--hub-text-secondary);background:var(--hub-bg-2);border:1px solid var(--hub-border-2);border-radius:8px;flex:auto;padding:10px 12px;font-size:12px;line-height:18px;overflow-y:auto}.BiQ1zG_aboutContent>:first-child{margin-top:0}.BiQ1zG_aboutContent>:last-child{margin-bottom:0}.BiQ1zG_aboutContent h2,.BiQ1zG_aboutContent h3,.BiQ1zG_aboutContent h4,.BiQ1zG_aboutContent h5{color:var(--hub-text-primary);margin:10px 0 4px;font-size:13px;font-weight:600;line-height:20px}.BiQ1zG_aboutContent h2{font-size:14px}.BiQ1zG_aboutContent p{margin:4px 0}.BiQ1zG_aboutContent ul,.BiQ1zG_aboutContent ol{margin:4px 0;padding-left:18px}.BiQ1zG_aboutContent li{margin:2px 0}.BiQ1zG_aboutContent code{background:var(--hub-bg-hover);color:var(--hub-text-primary);border-radius:4px;padding:1px 4px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}.BiQ1zG_aboutContent pre{background:var(--hub-bg-1);border:1px solid var(--hub-border-2);border-radius:6px;margin:6px 0;padding:8px 10px;overflow-x:auto}.BiQ1zG_aboutContent pre code{background:0 0;border-radius:0;padding:0}.BiQ1zG_aboutContent blockquote{border-left:3px solid var(--hub-brand);background:var(--hub-bg-hover);color:var(--hub-text-tertiary);border-radius:0 6px 6px 0;margin:6px 0;padding:2px 10px}.BiQ1zG_aboutContent a{color:var(--hub-brand);text-decoration:none}.BiQ1zG_aboutContent a:hover{color:var(--hub-brand-hover);text-decoration:underline}.BiQ1zG_aboutContent img{border-radius:8px;max-width:100%;max-height:220px;margin:8px auto;display:block;box-shadow:0 2px 8px #0000001f}.BiQ1zG_aboutContent img[width=\"100\"]{object-fit:contain;width:100px;height:100px;max-height:100px}.BiQ1zG_aboutMeta{color:var(--hub-text-tertiary);font-size:11px;line-height:16px}.BiQ1zG_hubUpdateModal{width:620px;max-width:calc(100vw - 48px)}.BiQ1zG_hubUpdateMeta{flex-wrap:wrap;align-items:center;gap:4px 14px;font-size:12px;line-height:18px;display:flex}.BiQ1zG_hubUpdateMetaItem{color:var(--hub-text-tertiary)}.BiQ1zG_hubUpdateNotes{min-height:0;max-height:300px;color:var(--hub-text-secondary);background:var(--hub-bg-2);border:1px solid var(--hub-border-2);border-radius:8px;flex:auto;padding:10px 12px;font-size:12px;line-height:18px;overflow-y:auto}.BiQ1zG_hubUpdateNotes>:first-child{margin-top:0}.BiQ1zG_hubUpdateNotes>:last-child{margin-bottom:0}.BiQ1zG_hubUpdateNotes h2,.BiQ1zG_hubUpdateNotes h3,.BiQ1zG_hubUpdateNotes h4,.BiQ1zG_hubUpdateNotes h5{color:var(--hub-text-primary);margin:10px 0 4px;font-size:13px;font-weight:600;line-height:20px}.BiQ1zG_hubUpdateNotes h2{font-size:14px}.BiQ1zG_hubUpdateNotes p{margin:4px 0}.BiQ1zG_hubUpdateNotes ul,.BiQ1zG_hubUpdateNotes ol{margin:4px 0;padding-left:18px}.BiQ1zG_hubUpdateNotes li{margin:2px 0}.BiQ1zG_hubUpdateNotes code{background:var(--hub-bg-hover);color:var(--hub-text-primary);border-radius:4px;padding:1px 4px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}.BiQ1zG_hubUpdateNotes pre{background:var(--hub-bg-1);border:1px solid var(--hub-border-2);border-radius:6px;margin:6px 0;padding:8px 10px;overflow-x:auto}.BiQ1zG_hubUpdateNotes pre code{background:0 0;border-radius:0;padding:0}.BiQ1zG_hubUpdateNotes blockquote{border-left:3px solid var(--hub-brand);background:var(--hub-bg-hover);color:var(--hub-text-tertiary);border-radius:0 6px 6px 0;margin:6px 0;padding:2px 10px}.BiQ1zG_hubUpdateNotes a{color:var(--hub-brand);text-decoration:none}.BiQ1zG_hubUpdateNotes a:hover{color:var(--hub-brand-hover);text-decoration:underline}.BiQ1zG_detailModal{width:580px;max-width:calc(100vw - 48px)}.BiQ1zG_detailUpdateHint{color:var(--hub-brand);background:var(--hub-brand-tint);border:1px solid var(--hub-brand-border-soft);border-radius:6px;padding:6px 10px;font-size:12px;line-height:18px}.BiQ1zG_detailGrid{flex-direction:column;gap:6px;display:flex}.BiQ1zG_detailRow{align-items:baseline;gap:10px;min-width:0;font-size:12px;line-height:20px;display:flex}.BiQ1zG_detailLabel{text-align:right;width:76px;color:var(--hub-text-tertiary);flex-shrink:0}.BiQ1zG_detailValue{min-width:0;color:var(--hub-text-primary);flex-wrap:wrap;flex:auto;align-items:baseline;gap:4px 6px;font-weight:500;display:flex}.BiQ1zG_detailMono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;font-weight:500}.BiQ1zG_detailArrow{color:var(--hub-text-tertiary);align-items:baseline;gap:4px;display:inline-flex}.BiQ1zG_detailDim{color:var(--hub-text-tertiary);font-size:11px;font-weight:400}.BiQ1zG_detailLink{min-width:0;color:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;gap:4px;font-weight:500;text-decoration:none;transition:color .12s;display:inline-flex}.BiQ1zG_detailLink:hover{color:var(--hub-brand-hover);text-decoration:underline}.BiQ1zG_detailStars{color:#b45309;font-weight:600}.BiQ1zG_detailPath{min-width:0;color:var(--hub-text-primary);background:var(--hub-bg-2);border:1px solid var(--hub-border-2);border-radius:6px;flex:auto;justify-content:space-between;align-items:center;gap:6px;padding:3px 3px 3px 8px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:18px;transition:border-color .12s,background .12s;display:flex}.BiQ1zG_detailPath:hover{border-color:var(--hub-border-ghost);background:var(--hub-bg-3)}.BiQ1zG_detailPathText{text-overflow:ellipsis;white-space:nowrap;cursor:pointer;-webkit-user-select:none;user-select:none;min-width:0;overflow:hidden}.BiQ1zG_detailPathActions{flex-shrink:0;align-items:center;gap:4px;display:inline-flex}.BiQ1zG_detailPathBtn{width:28px;height:28px;color:var(--hub-brand);background:var(--hub-brand-tint);border:1px solid var(--hub-brand-border-soft);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;justify-content:center;align-items:center;transition:color .12s,background .12s,border-color .12s;display:inline-flex}.BiQ1zG_detailPathBtn svg{width:15px;height:15px}.BiQ1zG_detailPathBtn:hover{color:#fff;background:var(--hub-brand);border-color:var(--hub-brand)}.BiQ1zG_detailStatusRunning,.BiQ1zG_detailStatusPending{border-radius:50%;flex-shrink:0;align-self:center;width:8px;height:8px}.BiQ1zG_detailStatusRunning{background:var(--hub-success)}.BiQ1zG_detailStatusPending{background:var(--hub-warning)}.BiQ1zG_detailStatusText{font-weight:500}";
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
			"detailPathActions": "BiQ1zG_detailPathActions",
			"noticeHead": "BiQ1zG_noticeHead",
			"failRepoLabel": "BiQ1zG_failRepoLabel",
			"queueSection": "BiQ1zG_queueSection",
			"failKind": "BiQ1zG_failKind",
			"noticeTextFail": "BiQ1zG_noticeTextFail",
			"failRow": "BiQ1zG_failRow",
			"progressFill": "BiQ1zG_progressFill",
			"queueRowTrack": "BiQ1zG_queueRowTrack",
			"detailStatusPending": "BiQ1zG_detailStatusPending",
			"overlay": "BiQ1zG_overlay",
			"failKindInstall": "BiQ1zG_failKindInstall",
			"detailPathBtn": "BiQ1zG_detailPathBtn",
			"confirmIcon": "BiQ1zG_confirmIcon",
			"modalValue": "BiQ1zG_modalValue",
			"noticeTime": "BiQ1zG_noticeTime",
			"failReason": "BiQ1zG_failReason",
			"restartNowWarning": "BiQ1zG_restartNowWarning",
			"failEmpty": "BiQ1zG_failEmpty",
			"noticeRow": "BiQ1zG_noticeRow",
			"aboutModal": "BiQ1zG_aboutModal",
			"uninstallConfirm": "BiQ1zG_uninstallConfirm",
			"noticeBadgeIcon": "BiQ1zG_noticeBadgeIcon",
			"progressFillFail": "BiQ1zG_progressFillFail",
			"failCopy": "BiQ1zG_failCopy",
			"modalLabel": "BiQ1zG_modalLabel",
			"failedCopyHint": "BiQ1zG_failedCopyHint",
			"queueRowPct": "BiQ1zG_queueRowPct",
			"modalCmd": "BiQ1zG_modalCmd",
			"detailModal": "BiQ1zG_detailModal",
			"failPrepareHint": "BiQ1zG_failPrepareHint",
			"queueRow": "BiQ1zG_queueRow",
			"trustHint": "BiQ1zG_trustHint",
			"errorBox": "BiQ1zG_errorBox",
			"progressHead": "BiQ1zG_progressHead",
			"noticeIgnore": "BiQ1zG_noticeIgnore",
			"noticeUpdateGo": "BiQ1zG_noticeUpdateGo",
			"confirmIconDanger": "BiQ1zG_confirmIconDanger",
			"dangerConfirm": "BiQ1zG_dangerConfirm",
			"detailRow": "BiQ1zG_detailRow",
			"detailDim": "BiQ1zG_detailDim",
			"detailStatusRunning": "BiQ1zG_detailStatusRunning",
			"modalIn": "BiQ1zG_modalIn",
			"detailStars": "BiQ1zG_detailStars",
			"detailLabel": "BiQ1zG_detailLabel",
			"modalTitleBusy": "BiQ1zG_modalTitleBusy",
			"noticeRemove": "BiQ1zG_noticeRemove",
			"queueRowHead": "BiQ1zG_queueRowHead",
			"failClear": "BiQ1zG_failClear",
			"detailPath": "BiQ1zG_detailPath",
			"pendingRowStatus": "BiQ1zG_pendingRowStatus",
			"failNetworkTarget": "BiQ1zG_failNetworkTarget",
			"modalRow": "BiQ1zG_modalRow",
			"queueRowDesc": "BiQ1zG_queueRowDesc",
			"hubUpdateModal": "BiQ1zG_hubUpdateModal",
			"hubUpdateNotes": "BiQ1zG_hubUpdateNotes",
			"noticeMain": "BiQ1zG_noticeMain",
			"stripCancel": "BiQ1zG_stripCancel",
			"modalHead": "BiQ1zG_modalHead",
			"modalCancel": "BiQ1zG_modalCancel",
			"hubUpdateMetaItem": "BiQ1zG_hubUpdateMetaItem",
			"modalClose": "BiQ1zG_modalClose",
			"queueRowBody": "BiQ1zG_queueRowBody",
			"queuedHint": "BiQ1zG_queuedHint",
			"failKindUninstall": "BiQ1zG_failKindUninstall",
			"restartNow": "BiQ1zG_restartNow",
			"failList": "BiQ1zG_failList",
			"hubUpdateMeta": "BiQ1zG_hubUpdateMeta",
			"detailArrow": "BiQ1zG_detailArrow",
			"cliOnlyHint": "BiQ1zG_cliOnlyHint",
			"noticeRowMain": "BiQ1zG_noticeRowMain",
			"modalCmdText": "BiQ1zG_modalCmdText",
			"resultCheckIcon": "BiQ1zG_resultCheckIcon",
			"progress": "BiQ1zG_progress",
			"detailMono": "BiQ1zG_detailMono",
			"modalBody": "BiQ1zG_modalBody",
			"confirmIconWrap": "BiQ1zG_confirmIconWrap",
			"errorCopySoft": "BiQ1zG_errorCopySoft",
			"modal": "BiQ1zG_modal",
			"toastIn": "BiQ1zG_toastIn",
			"modalInstall": "BiQ1zG_modalInstall",
			"detailGrid": "BiQ1zG_detailGrid",
			"resultDesc": "BiQ1zG_resultDesc",
			"noticeVersion": "BiQ1zG_noticeVersion",
			"modalActions": "BiQ1zG_modalActions",
			"modalCmdCopy": "BiQ1zG_modalCmdCopy",
			"modalDesc": "BiQ1zG_modalDesc",
			"toastFail": "BiQ1zG_toastFail",
			"noticeTextOk": "BiQ1zG_noticeTextOk",
			"bundleDeselectedHint": "BiQ1zG_bundleDeselectedHint",
			"aboutContent": "BiQ1zG_aboutContent",
			"aboutMeta": "BiQ1zG_aboutMeta",
			"detailLink": "BiQ1zG_detailLink",
			"modalTitleQueued": "BiQ1zG_modalTitleQueued",
			"modalLink": "BiQ1zG_modalLink",
			"overlayIn": "BiQ1zG_overlayIn",
			"errorTitle": "BiQ1zG_errorTitle",
			"resultRestarting": "BiQ1zG_resultRestarting",
			"modalWide": "BiQ1zG_modalWide",
			"failDiagBtn": "BiQ1zG_failDiagBtn",
			"failHead": "BiQ1zG_failHead",
			"noticeBadgeFail": "BiQ1zG_noticeBadgeFail",
			"detailPathText": "BiQ1zG_detailPathText",
			"detailValue": "BiQ1zG_detailValue",
			"queueRowTarget": "BiQ1zG_queueRowTarget",
			"failKindTitle": "BiQ1zG_failKindTitle",
			"confirmPrimary": "BiQ1zG_confirmPrimary",
			"errorModal": "BiQ1zG_errorModal",
			"progressTrack": "BiQ1zG_progressTrack",
			"failMisjudgeLink": "BiQ1zG_failMisjudgeLink",
			"helpModal": "BiQ1zG_helpModal",
			"result": "BiQ1zG_result",
			"noticeRowOk": "BiQ1zG_noticeRowOk",
			"noticeRowUpdate": "BiQ1zG_noticeRowUpdate",
			"detailStatusText": "BiQ1zG_detailStatusText",
			"modalCloseIcon": "BiQ1zG_modalCloseIcon",
			"restartLater": "BiQ1zG_restartLater",
			"pendingRowActions": "BiQ1zG_pendingRowActions",
			"errorHint": "BiQ1zG_errorHint",
			"noticeList": "BiQ1zG_noticeList",
			"failRepoUrl": "BiQ1zG_failRepoUrl",
			"linkIcon": "BiQ1zG_linkIcon",
			"failRepo": "BiQ1zG_failRepo",
			"failBigIssue": "BiQ1zG_failBigIssue",
			"toast": "BiQ1zG_toast",
			"detailUpdateHint": "BiQ1zG_detailUpdateHint",
			"noticeFoot": "BiQ1zG_noticeFoot",
			"modalCopy": "BiQ1zG_modalCopy",
			"noticeBadgeOk": "BiQ1zG_noticeBadgeOk",
			"modalTitle": "BiQ1zG_modalTitle",
			"resultCheck": "BiQ1zG_resultCheck",
			"queueSectionTitle": "BiQ1zG_queueSectionTitle",
			"resultTitle": "BiQ1zG_resultTitle",
			"logModal": "BiQ1zG_logModal",
			"queueRowStatus": "BiQ1zG_queueRowStatus",
			"progressText": "BiQ1zG_progressText"
		};
		//#endregion
		//#region src/server/services/install/release-target.ts
		/** 完整命令前缀：`dsh plugin --profile <p> add|update <target>`（与 profile.ts installTargetOf 同口径）。 */
		const DSH_PLUGIN_CMD_RE = /^dsh[ \t]+plugin[ \t]+--profile(?:[ \t]+|=)[A-Za-z0-9_-]+[ \t]+(?:add|update)[ \t]+(.+)$/i;
		/** 固定形态的 release .tgz 直链：主机、路径段与扩展名全部锁死。 */
		const RELEASE_URL_RE = /^https:\/\/github\.com\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)\/releases\/download\/([A-Za-z0-9._+-]+)\/([A-Za-z0-9._+-]+\.tgz)$/;
		/**
		* 解析一个历史安装目标里的 release 直链。
		* @param value - 完整命令（`dsh plugin --profile web add <url>`）或裸直链。
		* @returns 命中返回 `{ target, repo }`，否则 null。
		*/
		function githubReleaseTarget(value) {
			const input = typeof value === "string" ? value.trim() : "";
			if (input === "") return null;
			const command = DSH_PLUGIN_CMD_RE.exec(input);
			const raw = command !== null ? command[1].trim() : input;
			const match = RELEASE_URL_RE.exec(raw);
			if (match === null) return null;
			if (match.slice(1).some((part) => part === "." || part === "..")) return null;
			return {
				target: raw,
				repo: `${match[1]}/${match[2]}`
			};
		}
		//#endregion
		//#region src/client/logic/install-command.ts
		/** 后端 attempts 按时间先后排列：取最后一次实际执行的命令，取不到再回退到展示用命令。
		* 这里匹配的是任务队列记录的指令形态，不是要在此执行的命令。
		*/
		function executedCommandOf(command, attempts) {
			if (attempts === void 0) return command;
			return attempts.slice().reverse().find((attempt) => /^dsh plugin --profile(?:=| )\S+ (?:add|remove|update) \S/.test(attempt) || /^npm install -g \S/.test(attempt));
		}
		/**
		* 目录条目的安装目标（用户无感知）：目录条目必带 npm 包名，直接用该包名安装
		* （走 npm registry tarball）。
		* 返回值即传给后端 /install 的安装目标（npm 包名）。
		*/
		function installTargetOf(p) {
			return (p.source?.npmPackage ?? "").trim();
		}
		/** 展示用安装命令（复制/弹窗）：目录下发的权威命令优先（CLI-only 插件如 dsh-tui
		*  需专属 profile（--profile dsh-tui），无法从 npm 包名推断，必须用官方命令）；
		*  常规插件无目录命令时用 npm 包名回退生成。 */
		function installCommandOf(p, withProfile = false) {
			const cmd = p.install?.command;
			if (cmd) return cmd;
			return `${`dsh plugin${withProfile ? " --profile web" : ""} add `}${installTargetOf(p)}`;
		}
		/** 把任务/安装目标归一化为 owner/repo 展示身份。 */
		function repoFromInstallTarget(value) {
			const input = value.trim();
			const release = githubReleaseTarget(input);
			if (release !== null) return release.repo;
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
		/** Hub 自身在目录数据里的仓库标识：头部版本号旁的「可更新」徽标按它定位自己。 */
		const HUB_REPO = "dshplugin/dsh-plugin-hub";
		/**
		* Hub 自我更新版本控制（接口中心 Pages：api.dsh-plugin.org，静态 JSON 发布）。
		* 发新版 = 在 api-center 的 releases/ 写发版记录 + 重新部署，hub.json 随之更新，
		* 所有已装用户的「可更新」徽标即可见，不经过主站目录数据管道。
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
		const PLUGIN_VERSION = "2.2.4";
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
		/** 补注入 DOM 中缺失的已登记样式表，幂等。 */
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
		/** 批量查询已安装插件 npm 包的最新版本发布时间（供应链门禁用）；失败返回 null（调用方按原逻辑照常提示）。 */
		async function fetchNpmReleaseAge(packages) {
			if (packages.length === 0) return {};
			try {
				const res = await fetch("/dsh-plugin-hub/npm-release-age", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ packages }),
					cache: "no-store"
				});
				if (!res.ok) return null;
				return (await res.json()).packages ?? null;
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
				install: raw.wi === false || raw.mi === true || typeof raw.ic === "string" || typeof raw.igc === "string" ? {
					webInstallable: raw.wi === false ? false : void 0,
					manualInstall: raw.mi === true ? true : void 0,
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
		const PLUGINS_URL = (lang, refresh) => `${PROXY_BASE}?lang=${lang}${refresh ? "&refresh=1" : ""}`;
		const STATS_URL = (refresh) => `${PROXY_BASE}?stats=1${refresh ? "&refresh=1" : ""}`;
		async function fetchJson(url, signal) {
			const res = await fetch(url, {
				cache: "no-store",
				signal
			});
			if (!res.ok) throw new Error(String(res.status));
			return res.json();
		}
		/** 目录插件列表（在线 API 已只返回 verified；过滤与排序由上层负责）。
		*  signal 可选：宿主重启/代理抖动导致请求挂起时，上层可中止旧请求释放连接。
		*  refresh=true 跳过服务端缓存，强制回源。 */
		async function fetchCatalog(lang, signal, refresh = false) {
			const data = await fetchJson(PLUGINS_URL(lang, refresh), signal);
			return (Array.isArray(data) ? data : []).map((item) => normalize(item));
		}
		/** 收录/精选统计（/api/stats.json）；字段不完整返回 null。 */
		async function fetchStats(signal, refresh = false) {
			const s = await fetchJson(STATS_URL(refresh), signal);
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
		/** 归一化接口下发的 recentVersions：只保留带版本号的条目，其余字段按类型补。
		*  这条数据是「最新版还在 24.5h 门禁内时回退到更早的已过门槛版本」的唯一依据；
		*  入口处漏传会让候选只剩最新版，整体变成 pending —— 用户就永远看不到更新入口。 */
		function recentVersionsOf(value) {
			if (!Array.isArray(value)) return [];
			const list = [];
			for (const item of value) {
				if (item === null || typeof item !== "object") continue;
				const entry = item;
				if (typeof entry.version !== "string" || entry.version === "") continue;
				list.push({
					version: entry.version,
					...typeof entry.publishedAt === "string" ? { publishedAt: entry.publishedAt } : {},
					...entry.notes === void 0 ? {} : { notes: entry.notes }
				});
			}
			return list;
		}
		/** 版本控制中心：最新版本 + Markdown 变更记录 + 最近发版（门禁回退用）；不可用返回 null。 */
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
					notes: data.notes ?? null,
					recentVersions: recentVersionsOf(data.recentVersions)
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
		//#region src/client/logic/release-age.ts
		/** pnpm 供应链门禁：dsh profile 默认 minimumReleaseAge=1440（分钟）；+30 分钟缓冲抵消网络/CDN 边缘时间偏差。 */
		const MIN_RELEASE_AGE_MS = 882e5;
		/** 发布时间是否仍在门禁窗口内（太新 → 暂缓提示）；无值/解析不出返回 false（不拦真实更新）。 */
		function isReleaseTooFresh(publishedAt, now) {
			if (typeof publishedAt !== "string" || publishedAt === "") return false;
			const ms = Date.parse(publishedAt);
			if (Number.isNaN(ms)) return false;
			return now - ms < MIN_RELEASE_AGE_MS;
		}
		/** 版本号比较（逐段数字；缺失段按 0）。返回负数/0/正数，非法输入按相等处理。
		*  兼容目录里的 `v1.1.8` 与 npm 的 `1.1.8`：每段先剥掉前导非数字，再取整。
		*  预发布后缀单独处理：`1.0.0` 高于 `1.0.0-beta.1`，两个预发布版按标识符比较
		*  （纯数字段按数值，数字段低于字母段）。 */
		function compareVersions(a, b) {
			const core = (v) => (v ?? "").split("+")[0].split("-")[0].split(".").map((part) => Number.parseInt(part.replace(/^[^\d]+/, ""), 10)).filter((n) => !Number.isNaN(n));
			const pre = (v) => {
				const rest = (v ?? "").split("+")[0].split("-").slice(1);
				return rest.length === 0 ? [] : rest.join("-").split(".");
			};
			const va = core(a);
			const vb = core(b);
			const len = Math.max(va.length, vb.length);
			for (let i = 0; i < len; i++) {
				const d = (va[i] ?? 0) - (vb[i] ?? 0);
				if (d !== 0) return d;
			}
			const pa = pre(a);
			const pb = pre(b);
			if (pa.length === 0 && pb.length === 0) return 0;
			if (pa.length === 0) return 1;
			if (pb.length === 0) return -1;
			for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
				const x = pa[i];
				const y = pb[i];
				if (x === void 0) return -1;
				if (y === void 0) return 1;
				const nx = /^\d+$/.test(x) ? Number(x) : null;
				const ny = /^\d+$/.test(y) ? Number(y) : null;
				if (nx !== null && ny !== null) {
					if (nx !== ny) return nx - ny;
				} else if (x !== y) return x < y ? -1 : 1;
			}
			return 0;
		}
		/**
		* 是否值得提示「可更新」：npm 上最新可安装版本确实比已装版本新，且已过供应链门禁。
		*
		* 更新命令执行的是 `pkg@latest`，所以「目录里标的版本」不是最终能装上的版本：
		* 作者可能只打了 GitHub release 没发 npm —— 此时提示会变成永远点不掉的循环。
		* 任一信息缺失（查不到发布信息 / 没有已装版本记录）返回 offered，交回调用方原有判定：
		* 宁可提示，也不因为一次查询失败把真实更新吃掉。
		*/
		function updateDecision(release, installedVersion, now) {
			if (release === null) return {
				offered: true,
				pendingUntil: null
			};
			if (isReleaseTooFresh(release.publishedAt, now)) {
				const ms = Date.parse(release.publishedAt);
				return {
					offered: false,
					pendingUntil: Number.isNaN(ms) ? null : ms + MIN_RELEASE_AGE_MS
				};
			}
			if (installedVersion !== null && compareVersions(release.version, installedVersion) <= 0) return {
				offered: false,
				pendingUntil: null
			};
			return {
				offered: true,
				pendingUntil: null
			};
		}
		/**
		* 选出本次真正该提示的更新版本。
		*
		* 只看最新版会漏更新：连续发版时间隔小于供应链门禁时，最新版永远「太新」，
		* 提示被整体跳过。这里把最新版与 recentVersions 一起当候选，取「高于当前版本且已过门禁」
		* 的最高版本；一个都没有但仍存在更高版本 → pending（暂缓，不谎称已是最新）。
		*/
		function pickHubUpdate(info, currentVersion, now) {
			if (currentVersion === "") return {
				state: "latest",
				target: null
			};
			const seen = /* @__PURE__ */ new Set();
			const candidates = [];
			for (const entry of [{
				version: info.version,
				publishedAt: info.publishedAt,
				notes: info.notes
			}, ...info.recentVersions ?? []]) {
				if (typeof entry.version !== "string" || entry.version === "" || seen.has(entry.version)) continue;
				seen.add(entry.version);
				candidates.push(entry);
			}
			const higher = candidates.filter((c) => compareVersions(c.version, currentVersion) > 0).sort((a, b) => compareVersions(b.version, a.version));
			if (higher.length === 0) return {
				state: "latest",
				target: null
			};
			const ready = higher.find((c) => !isReleaseTooFresh(c.publishedAt, now));
			return ready !== void 0 ? {
				state: "available",
				target: ready
			} : {
				state: "pending",
				target: higher[0]
			};
		}
		//#endregion
		//#region src/client/logic/installed.ts
		/** 本地路径安装（file:/link:/绝对或相对路径）：身份在本机，不能按 npm 包名认领目录条目。 */
		function isLocalSpec(value) {
			const v = value.trim();
			return /^(file|link):/i.test(v) || v.startsWith(".") || v.startsWith("/") || /^[A-Za-z]:[\\/]/.test(v);
		}
		/** 安装时记录的目录信号（按仓库小写 key 查表）。 */
		function signalOf(repo, versions) {
			if (!repo) return null;
			return versions[repo.toLowerCase()] ?? null;
		}
		/** 插件是否已安装：匹配 Git spec 中的 owner/repo，或 npm 安装的依赖包名；命中返回 npm 包名。 */
		function installedNameOf(plugin, installed, versions) {
			const repo = plugin.source?.repo;
			if (!repo) return null;
			const needle = repo.toLowerCase();
			for (const [name, spec] of Object.entries(installed)) if (repoFromInstallTarget(spec).toLowerCase() === needle) return name;
			const pkg = ((plugin.source?.npmPackage || versions[repo.toLowerCase()]?.npmPackage) ?? "").toLowerCase();
			if (pkg) for (const [name, spec] of Object.entries(installed)) {
				if (isLocalSpec(spec)) continue;
				if (isRepoLike(repoFromInstallTarget(spec))) continue;
				if (name.toLowerCase() === pkg) return name;
			}
			return null;
		}
		/** 该插件安装时记录的目录版本（无记录/未安装 → null）。 */
		function installedVersionOf(plugin, versions) {
			const repo = plugin.source?.repo;
			if (!repo) return null;
			return signalOf(repo, versions)?.version || null;
		}
		/** 该插件对应的 npm 包名（目录下发，或安装时持久化的映射）；无则 null。决定更新是否走 npm registry。 */
		function npmPackageOf(plugin, versions) {
			const repo = plugin.source?.repo;
			const pkg = (plugin.source?.npmPackage || (repo ? versions[repo.toLowerCase()]?.npmPackage : void 0) || "").trim();
			return pkg === "" ? null : pkg;
		}
		/**
		* 是否有更新：仅对已安装插件有意义。
		* 双信号判定——有 release 版本的比版本；无版本（repo 不打 tag）的比仓库最近更新时间
		* （repoUpdatedAt，ISO 字符串字典序 = 时间序），更新时间变新说明有新提交。
		* 版本用「目录 > 已装」判断，不做 != 比较：目录可能滞后于 npm，若直接用不等，
		* 会把「已装 1.1.10、目录还写 1.1.8」判成有更新，反而引导用户降级。
		*/
		function hasUpdateOf(plugin, installed, versions) {
			if (installedNameOf(plugin, installed, versions) === null) return false;
			const repo = plugin.source?.repo;
			if (!repo) return false;
			const rec = versions[repo.toLowerCase()];
			if (!rec) return false;
			const recorded = typeof rec.version === "string" ? rec.version : "";
			if (plugin.version && recorded !== "") return compareVersions(plugin.version, recorded) > 0;
			const current = plugin.dates?.repoUpdatedAt;
			const seen = typeof rec.updatedAt === "string" ? rec.updatedAt : "";
			return Boolean(current && seen && current > seen);
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
					installedVersion: rec?.version || null,
					installedAt: rec?.installedAt ?? null,
					catalogVersion: p.version ?? null,
					hasUpdate: hasUpdateOf(p, installed, versions),
					pendingUntil: null,
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
					installedVersion: rec?.version || null,
					installedAt: rec?.installedAt ?? null,
					catalogVersion: null,
					hasUpdate: false,
					pendingUntil: null,
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
		* 插件中心的数据 + 视图状态。
		*
		* 掌管在线数据管道（从 api.dsh-plugin.org 实时拉取）、本地已装插件表，以及
		* 筛选/搜索/排序/安装状态等视图状态，对外暴露派生出的可见列表与各分类计数。
		*/
		/** 插件市场自身仓库：DSH Plugin Hub 不显示在目录里（自己不进自己的插件列表） */
		const SELF_REPO = "dshplugin/dsh-plugin-hub";
		/** 共享的空发布信息表：无候选包时复用，避免每次渲染新建对象。 */
		const EMPTY_RELEASES = {};
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
			/** 目录加载超时阈值：超过即判定挂起，强制刷新一次（服务端代理 curl 上限 60s，客户端 30s 先兜底） */
			const LOAD_TIMEOUT_MS = 3e4;
			/** 挂起后最多自动重试次数：避免代理持续不通时无限循环刷新（每次重试仍 30s，2 次后转失败界面可手动重试） */
			const MAX_LOAD_RETRIES = 2;
			/** 本次 reload 是否强制回源（跳过服务端 1 小时缓存）：由「强制刷新」置位，读取后立即复位 */
			const forceRefreshRef = (0, react.useRef)(false);
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
			*  npmPackage 为安装时记录的包名映射（目录数据未下发时客户端靠它把依赖 key 匹配回仓库） */
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
				const refresh = forceRefreshRef.current;
				forceRefreshRef.current = false;
				setPlugins(null);
				setHubPlugin(null);
				setStats(null);
				setFailed(false);
				const load = () => Promise.all([fetchCatalog(lang, controller.signal, refresh), fetchStats(controller.signal, refresh)]);
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
			/** 插件是否已安装：匹配 Git spec 中的 owner/repo，或 npm 安装的依赖包名；命中返回 npm 包名。 */
			const installedName = (p) => installedNameOf(p, installed, versions);
			/** 该插件安装时记录的目录版本（无记录/未安装 → null）。 */
			const installedVersion = (p) => installedVersionOf(p, versions);
			/**
			* 更新可用性校验状态：npm registry 上每个包的最新可安装版本与发布时间。
			* key 是这批候选包名的指纹，与已查出的 key 一致才算就绪，避免查询未回来时先显示更新。
			*/
			const [releaseAge, setReleaseAge] = (0, react.useState)({
				key: "",
				releases: EMPTY_RELEASES
			});
			/** 已安装项原始列表（未套校验）：先算出来才能收集需要查发布信息的候选包名。 */
			const rawInstalledItems = (0, react.useMemo)(() => installedItemsOf(plugins, installed, versions, installPaths, loadedNames, dshCapableNames), [
				plugins,
				installed,
				versions,
				installPaths,
				loadedNames,
				dshCapableNames
			]);
			/** 校验候选：有更新、且有 npm 包名（更新走 npm registry）的已安装插件包名。 */
			const releaseAgeCandidates = (0, react.useMemo)(() => {
				const names = /* @__PURE__ */ new Set();
				for (const item of rawInstalledItems) {
					if (!item.hasUpdate || !item.plugin) continue;
					const pkg = npmPackageOf(item.plugin, versions);
					if (pkg !== null) names.add(pkg);
				}
				return [...names].sort();
			}, [rawInstalledItems, versions]);
			const releaseAgeKey = releaseAgeCandidates.join("\n");
			/** 包名 → 已装版本：判断 npm 上最新版是否真的比已装版本新。 */
			const installedByPackage = (0, react.useMemo)(() => {
				const map = /* @__PURE__ */ new Map();
				for (const item of rawInstalledItems) {
					if (!item.plugin) continue;
					const pkg = npmPackageOf(item.plugin, versions);
					const version = installedVersionOf(item.plugin, versions);
					if (pkg !== null && version !== null) map.set(pkg, version);
				}
				return map;
			}, [rawInstalledItems, versions]);
			(0, react.useEffect)(() => {
				if (releaseAgeKey === releaseAge.key) return;
				if (releaseAgeCandidates.length === 0) {
					setReleaseAge({
						key: "",
						releases: EMPTY_RELEASES
					});
					return;
				}
				let cancelled = false;
				fetchNpmReleaseAge(releaseAgeCandidates).then((result) => {
					if (cancelled) return;
					setReleaseAge({
						key: releaseAgeKey,
						releases: result ?? EMPTY_RELEASES
					});
				});
				return () => {
					cancelled = true;
				};
			}, [releaseAgeKey, releaseAge.key]);
			/** 校验结果是否已就绪（候选为空也算就绪）：未就绪时不写更新提醒，等查询回来再定。 */
			const releaseAgeReady = releaseAgeKey === releaseAge.key;
			/**
			* 不能提示更新的包：
			*  - npm 上最新版还没过供应链门禁（发布不满 24h，pnpm 会静默回退，点了也装不上）；
			*  - npm 上最新版并不高于已装版本 —— 更新走的是 `pkg@latest`，此时无论目录标到哪个 tag，
			*    都不可能装上（作者可能只打了 GitHub release 没发 npm），提示只会变成永远点不掉的循环。
			*/
			const updateDecisions = (0, react.useMemo)(() => {
				const map = /* @__PURE__ */ new Map();
				if (!releaseAgeReady) return map;
				const now = Date.now();
				for (const pkg of releaseAgeCandidates) map.set(pkg, updateDecision(releaseAge.releases[pkg] ?? null, installedByPackage.get(pkg) ?? null, now));
				return map;
			}, [
				releaseAgeReady,
				releaseAgeCandidates,
				releaseAge.releases,
				installedByPackage
			]);
			const updateBlocked = (0, react.useMemo)(() => {
				const blocked = /* @__PURE__ */ new Set();
				for (const [pkg, decision] of updateDecisions) if (!decision.offered) blocked.add(pkg);
				return blocked;
			}, [updateDecisions]);
			/**
			* 是否有更新：仅对已安装插件有意义。
			* 双信号判定——有 release 版本的比版本；无版本（repo 不打 tag）的比仓库最近更新时间
			* （repoUpdatedAt，ISO 字符串字典序 = 时间序），更新时间变新说明有新提交。
			* 再用 npm registry 的实际最新版本复核：装不上的（太新 / 不比已装新）不打更新标记。
			*/
			const hasUpdate = (p) => {
				if (!hasUpdateOf(p, installed, versions)) return false;
				const pkg = npmPackageOf(p, versions);
				if (pkg === null) return true;
				return releaseAgeReady && !updateBlocked.has(pkg);
			};
			/** 更新被门禁暂缓时的可重试时刻（毫秒）；未安装/无更新/非门禁原因 → null。 */
			const updatePendingUntil = (p) => {
				if (!hasUpdateOf(p, installed, versions)) return null;
				const pkg = npmPackageOf(p, versions);
				if (pkg === null) return null;
				return updateDecisions.get(pkg)?.pendingUntil ?? null;
			};
			/** 已安装项统一列表（目录元数据 + 运行时信息合并）：校验未就绪/被拦下的去掉更新标记、
			*  门禁暂缓的带上可重试时刻，驱动「已安装」tab。 */
			const installedItems = (0, react.useMemo)(() => {
				return rawInstalledItems.map((item) => {
					if (!item.hasUpdate || !item.plugin) return item;
					const pkg = npmPackageOf(item.plugin, versions);
					if (pkg === null) return item;
					if (!releaseAgeReady) return {
						...item,
						hasUpdate: false
					};
					const decision = updateDecisions.get(pkg);
					return decision === void 0 || decision.offered ? item : {
						...item,
						hasUpdate: false,
						pendingUntil: decision.pendingUntil
					};
				});
			}, [
				rawInstalledItems,
				releaseAgeReady,
				updateDecisions,
				versions
			]);
			/**
			* Hub 自身更新状态：Hub 就是当前运行的应用（始终已安装，无需 installedName 命中）。
			* 以 Worker 版本控制中心返回的「最新版本」为准，与当前运行的版本号比对——
			* 构建时注入的 PLUGIN_VERSION 是运行 bundle 的真实版本；测试/异常场景缺失时
			* 回退到安装时记录的版本。版本号不等即新版（版本号只在发版时变更，绝无降级场景）。
			*
			* 另加 pnpm 供应链安全门槛：新版本发布还不满 24 小时（+30 分钟缓冲）时，pnpm 会静默
			* 回退到旧版本，此时若提示「可更新」用户点了也更新不到。publishedAt 由接口中心按 npm
			* registry 真实发布时间下发（同源），据此判断最准。门槛命中要单列成 `pending` 而不是
			* 落回「无更新」——回落会让弹窗在本机版本落后时谎称「已是最新」。
			*/
			const hubCurrentVersion = "2.2.4";
			const hubUpdateResult = hubUpdateInfo === null ? {
				state: "none",
				target: null
			} : pickHubUpdate(hubUpdateInfo, hubCurrentVersion, Date.now());
			const hubUpdateState = hubUpdateResult.state;
			/** 本次提示的目标版本（available 时有值；pending 时是暂缓中的最高版本） */
			const hubUpdateTarget = hubUpdateResult.target;
			const hubHasUpdate = hubUpdateState === "available";
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
			/** 分类 chip 上展示的各分类插件计数。 */
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
				/** 强制刷新：跳过服务端 1 小时缓存直接回源，成功后覆盖缓存（失败仍回退旧缓存） */
				forceReload: () => {
					loadRetriesRef.current = 0;
					forceRefreshRef.current = true;
					setReloadKey((k) => k + 1);
				},
				installed,
				installedItems,
				installedName,
				installedVersion,
				hasUpdate,
				updatePendingUntil,
				hubHasUpdate,
				hubUpdateState,
				hubUpdateTarget,
				releaseAgeReady,
				hubCurrentVersion,
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
		/** 动作词（英文）：名词短语，标题与句子里都成立。 */
		function actionWordEn(action) {
			return action === "uninstall" ? "removal" : action === "update" ? "update" : "install";
		}
		/** 动作词（中文）：安装 / 更新 / 卸载。 */
		function actionWordZh(action) {
			return action === "uninstall" ? "卸载" : action === "update" ? "更新" : "安装";
		}
		/** 记录的动作：老记录只有 kind，按 kind 兜底。 */
		function actionOfRecord(rec) {
			if (rec.action !== void 0) return rec.action;
			return rec.kind === "uninstall" ? "uninstall" : rec.kind === "update" ? "update" : "install";
		}
		/** 只匹配 pnpm 的错误码，不匹配泛泛出现的 checksum / integrity 字样。 */
		function missingTarballIntegrity(message) {
			return /\bERR_PNPM_MISSING_TARBALL_INTEGRITY\b/.test(message);
		}
		/** GitHub 分支 tarball 内容变了、锁文件里还是旧校验和（ERR_PNPM_TARBALL_INTEGRITY）。
		*  \b 保证不会命中 ERR_PNPM_MISSING_TARBALL_INTEGRITY：前者是有校验值但对不上，
		*  后者是锁文件里压根没有校验值。 */
		function mismatchedTarballIntegrity(message) {
			return /\bERR_PNPM_TARBALL_INTEGRITY\b/.test(message);
		}
		/** pnpm 拒收「刚发布」包时，报错里带着发布时间；这里从报错文本算出「发布满 24h」的可重试时刻（UTC，分钟精度）。 */
		function releaseAgeRetryAfter(message) {
			const match = /published at (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)/.exec(message);
			if (match === null) return null;
			const published = Date.parse(match[1]);
			if (Number.isNaN(published)) return null;
			return `${new Date(published + 864e5).toISOString().slice(0, 16)}Z`;
		}
		/**
		* 同一策略子类型也用于选择实时/已保存失败的提示文案：minimumReleaseAge 只有在能算出
		* 可重试时刻时才走专属文案（给出确切的「何时可再试」），算不出时退回通用文案，
		* 避免出现「预计可重试时间：」后接空值的残缺句子。
		*/
		function pnpmPolicyHintOf(message) {
			if (mismatchedTarballIntegrity(message)) return "failPnpmTarballMismatchHint";
			if (missingTarballIntegrity(message)) return "failPnpmTarballIntegrityHint";
			if (/ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION|ERR_PNPM_NO_MATURE_MATCHING_VERSION|Minimum release age|minimumReleaseAge/i.test(message) && releaseAgeRetryAfter(message) !== null) return "failPnpmReleaseAgeHint";
			return "failPnpmPolicyHint";
		}
		/** 与 pnpmPolicyHintOf 配套的文案参数：release-age 场景给出可重试时刻（{time}）。 */
		function pnpmPolicyHintParams(message) {
			return { time: releaseAgeRetryAfter(message) ?? "" };
		}
		/**
		* 失败归类：把安装输出归到具体成因，供弹窗文案与是否引导提 Issue 使用。
		* 分界是「本机环境问题」（装任何插件都会同样失败 → 不引导提 Issue）与「插件分发问题」
		* （只影响这个插件 → 才引导提 Issue）。各分支判定顺序有依赖，见函数内注释。
		*/
		function classifyFailure(message) {
			if (/installation rejected:.*incompatible with dsh/i.test(message)) return "hostIncompatible";
			if (/is managed exclusively by the Electron application|managed exclusively by the desktop app/i.test(message)) return "profileExclusive";
			if (/\[npm-too-low\]|edgesOut/i.test(message)) return "npmTooOld";
			if (/ERR_PNPM_UNSUPPORTED_ENGINE|ERR_PNPM_INVALID_NODE_VERSION|\bEBADENGINE\b/i.test(message)) return "nodeEngine";
			if (/\[pnpm-missing\]|pnpm not found|pnpm: command not found|spawn pnpm ENOENT|'pnpm' 不是内部或外部命令|"pnpm" 不是内部或外部命令|pnpm['"]?\s*is not recognized/i.test(message)) return "pnpmMissing";
			if (/\[git-missing\]|spawn git ENOENT|'git' 不是内部或外部命令|"git" 不是内部或外部命令|git['"]?\s*is not recognized|git: command not found/i.test(message)) return "gitMissing";
			if (/\[npm-missing\]|spawn npm ENOENT|'npm' 不是内部或外部命令|"npm" 不是内部或外部命令|npm['"]?\s*is not recognized|npm: command not found/i.test(message)) return "npmMissing";
			if (/\[dsh-missing\]|不是内部或外部命令|is not recognized as an internal or external command|command not found|spawn dsh ENOENT/i.test(message)) return "dshMissing";
			if (/ERR_PNPM_[A-Z0-9_]*DIFF\b|modules directory was created using a different/i.test(message)) return "pnpmModulesMismatch";
			if (/ERR_PNPM_UNEXPECTED_(VIRTUAL_)?STORE|ERR_PNPM_UNEXPECTED_PKG_CONTENT_IN_STORE|Unexpected (virtual )?store location/i.test(message)) return "pnpmStore";
			if (/ERR_PNPM_ADDING_TO_ROOT|add the dependency to the workspace root/i.test(message)) return "pnpmWorkspace";
			if (/(^|\n)untrusted origin\s*$/.test(message)) return "originRejected";
			if (missingTarballIntegrity(message) || mismatchedTarballIntegrity(message) || /ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION|ERR_PNPM_NO_MATURE_MATCHING_VERSION|Minimum release age|minimumReleaseAge|untrusted origin/i.test(message)) return "pnpmPolicy";
			if (/ERR_PNPM_UNUSED_PATCH|patches were not used/i.test(message)) return "pnpmUnusedPatch";
			if (/ERR_PNPM_OUTDATED_LOCKFILE|ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND|ERR_PNPM_NO_PKG_MANIFEST|ERR_PNPM_BAD_PM_VERSION|ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY|ERR_PNPM_PATCH_NOT_APPLIED|ERR_PNPM_WORKSPACE_PKG_NOT_FOUND|ERR_PNPM_JSON_PARSE|ERR_PNPM_PKG_MANIFEST_IS_NOT_OBJECT|ERR_PNPM_MISSING_HOIST_PATTERN|Cannot install with "frozen-lockfile"/i.test(message)) return "profileState";
			if (/os error 32|EBUSY|resource busy or locked|being used by another process/i.test(message)) return "fileLocked";
			if (/os error 5\b|ERROR_ACCESS_DENIED|\bEPERM\b|\bEACCES\b|access is denied/i.test(message)) return "accessDenied";
			if (/os error 112\b|os error 19\b|ERROR_DISK_FULL|ERROR_WRITE_PROTECT|\bENOSPC\b|\bEROFS\b|\bEMFILE\b|\bENFILE\b|no space left on device|read-only file system|too many open files/i.test(message)) return "fsUnavailable";
			if (/ERR_PNPM_IGNORED_BUILDS|Ignored build scripts:|ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED/i.test(message)) return "pnpmIgnoredBuild";
			if (/ERR_PNPM_FETCH_40[13]\b|\bE40[13]\b|(?:Unauthorized|Forbidden)\s*-\s*40[13]\b/i.test(message)) return "registryAuth";
			if (/ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND|Could not install from .+ as it does not exist|pnpm:\s*ENOENT: no such file or directory,\s*(?:lstat|scandir|readlink)/i.test(message)) return "pnpmLinkedDirMissing";
			if (/unable to verify the first certificate|SELF_SIGNED_CERT_IN_CHAIN|UNABLE_TO_VERIFY_LEAF_SIGNATURE|ERR_TLS_CERT_ALTNAME_INVALID|CERT_HAS_EXPIRED|certificate has expired|UNABLE_TO_GET_ISSUER_CERT|CERT_UNTRUSTED|ERR_TLS_CERT/i.test(message)) return "tlsTrust";
			if (/\[network\]|ERR_PNPM_GIT_FETCH_FAILED|ERR_PNPM_FETCH_5\d\d|ERR_PNPM_META_FETCH_FAIL|ERR_SOCKET_TIMEOUT|ETIMEDOUT|ECONNREFUSED|ECONNRESET|ENOTFOUND|EAI_AGAIN|EPIPE|EHOSTUNREACH|ENETUNREACH|UND_ERR_[A-Z0-9_]+|getaddrinfo|Could not connect|Could not resolve host|Network unreachable|Failed to connect|socket hang up|CERT_HAS_EXPIRED|SSL certificate problem|SSL routines|TLS handshake|SSL handshake|ERR_SSL_|ssl_error|fetch failed|failed to fetch|\bGET https?:\/\/\S+\.tgz\s+error \([A-Za-z0-9_]+\)/i.test(message)) return "network";
			if (/\[request-timeout\]/i.test(message)) return "network";
			if (/\[packaging\]|entry file missing/i.test(message)) return "pluginPrepare";
			if (/\[registry-missing\]/i.test(message)) return "pluginMissingDep";
			if (/ERR_PNPM_FETCH_404|404 Not Found|Not Found - 404/i.test(message)) return "pnpmMissingDep";
			if (/\bERR_PNPM_NO_MATCHING_VERSION\b|\bETARGET\b|No matching version found/i.test(message)) return "registryVersionStale";
			if (/Unable to detect compiler type|gyp ERR!|Could not find any Visual Studio|No Xcode or CLT version detected|xcode-select|python(?:3)? is (?:not set|not found)|Could not find Python|\bmake: not found\b|\bgcc: not found\b|\bg\+\+: not found\b|\bMSB\d{4}\b/i.test(message)) return "buildToolchainMissing";
			if (/ERR_PNPM_PREPARE_PACKAGE|ELIFECYCLE|prepare-guard/i.test(message) || /Command failed/.test(message)) return "pluginPrepare";
			if (/plugin is not installed|plugin cannot be uninstalled here|already queued:|^already installed: \S+$/im.test(message)) return "hubState";
			if (/^\[timed out\]$/m.test(message)) return "timeout";
			if (/atomic-write: timed out waiting for the writer lock|timed out waiting for the writer lock/i.test(message)) return "profileLock";
			if (/git-hosted plugins build on install via their prepare script|add the exact key pnpm printed above under allowBuilds/i.test(message)) return "pnpmIgnoredBuild";
			if (/cannot resolve profile bundle/i.test(message)) return "profileBundleMissing";
			if (/\[host-spawn\]/i.test(message)) return "hostCliSpawn";
			if (/\[dsh-too-old\]/i.test(message)) return "dshTooOld";
			if (/spawn .+ ENOENT/i.test(message)) return "hub";
			if (LOCAL_ENV_RE.test(message)) return "localEnv";
			return "hub";
		}
		/** 「特征指向本机环境但说不清具体哪一类」的兜底判据：系统调用错误码（权限/路径过长/设备异常）、
		*  证书与代理校验失败、本地配置文件（~/.npmrc、profile 的 package.json）损坏。
		*  只做排除用：命中它表示「不是插件侧问题」，不代表我们已经定位到原因。 */
		const LOCAL_ENV_RE = /os error \d{1,3}\b|ERROR_[A-Z_]{4,}|\bE(?:ACCES|PERM|NOENT|NAMETOOLONG|INVAL|PROTO|ISDIR|NOTDIR|EXIST|BADF|NOTEMPTY|JSONPARSE|NOMEM)\b|JavaScript heap out of memory|Unexpected token .{0,60}in JSON|SELF_SIGNED_CERT_IN_CHAIN|UNABLE_TO_VERIFY_LEAF_SIGNATURE|ERR_TLS_CERT_ALTNAME_INVALID|unable to verify the first certificate|self[- ]signed certificate|ERR_INVALID_URL|invalid registry|proxy authentication|407 Proxy/i;
		/** 从服务端 `[npm-too-low]` 标记行提取本机 npm 版本（如 `[npm-too-low] npm@11.3.0` → "11.3.0"）；
		*  历史记录无标记时返回 null，前端据此决定提示文案是否带具体版本。 */
		function npmTooLowVersion(message) {
			const m = message.match(/\[npm-too-low\]\s*npm@(\d+\.\d+\.\d+)/i);
			return m ? m[1] : null;
		}
		/** 核心行特征：错误代码 / 生命周期脚本失败 / prepare 失败 / 描述性报错（子模块缺失、找不到等）/ 退出与宿主提示信息。 */
		const CORE_LINE_RE = /ERR_[A-Z_]+|ELIFECYCLE|Command failed|prepare-guard|Failed to prepare|exit code|\bprepare\b|pnpm failed in profile|git-hosted plugins build|incompatible with dsh|submodule|not found|cannot find|no such|unable to|fatal|missing|error/i;
		/** pnpm 的 peer 依赖告警行（`missing peer …` / `Issues with peer dependencies found` /
		*  `Peer dependencies that should be installed`）：宿主提供的 peer（@deepseek-ai/*、react、
		*  dsh-client-* 等，DSH profile 用 autoInstallPeers:false 不自动装）缺失是无害噪音，与插件本身
		*  无关 —— 抓核心错误时必须跳过，否则会被 CORE_LINE_RE 的 `missing` 分支误抓、淹没真正的
		*  错误码（如 git 源的 ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED），让 issue 正文只剩一堆 peer WARN。 */
		const PEER_WARN_RE = /missing peer|issues with peer dependencies|peer dependencies that should be installed/i;
		/** 安装器自己打的诊断标记行：它们本身就是「为什么没有日志 / 卡在哪一步」的证据，
		*  不含 CORE_LINE_RE 的关键词，必须无条件保留 —— 否则上报正文会退回成只剩宿主那句摘要，
		*  我们又拿不到任何可排查的信息（#382/#393 就是这样）。 */
		const MARKER_LINE_RE = /^\[(?:pnpm log|no-output|desktop-cli-fallback|dsh-too-old|host-spawn|npm-too-low|git-missing|npm-missing|pnpm-missing|dsh-missing|network|packaging|registry-missing|registry-mirror-lag|registry-fallback|allow build|stale pipe|install-channel|internal|exit\b|timed out)/i;
		/** 提交 issue 时正文里错误摘要的上限字符数。GitHub 请求行上限 8192 字节，
		* 固定模板与 URL 编码开销约 1~2K，核心错误（以 ASCII 日志为主）可安全带到 ~5K；
		* 仍超长时 pluginIssueUrl 会逐档缩小核心预算，最终 URL 不会超限。 */
		const MAX_CORE_CHARS = 5e3;
		/** 摘要里单行上限：允许构建 key 等长行也被截短。 */
		const MAX_LINE_CHARS = 400;
		/**
		* 展示用格式化：宿主门禁消息里的 peerDependencies 是压缩成一行的 JSON，
		* 直接展示像一团乱码；展开成缩进格式，解析失败则原样返回。
		*/
		function formatFailureMessage(message) {
			return message.replace(/peerDependencies (\{.*?\})/g, (whole, json) => {
				try {
					return `peerDependencies ${JSON.stringify(JSON.parse(json), null, 2)}`;
				} catch {
					return whole;
				}
			});
		}
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
				if (!line || PEER_WARN_RE.test(line)) continue;
				if (!MARKER_LINE_RE.test(line) && !CORE_LINE_RE.test(line)) continue;
				const short = line.length > MAX_LINE_CHARS ? `${line.slice(0, MAX_LINE_CHARS)}…` : line;
				if (!seen.has(short)) {
					seen.add(short);
					core.push(short);
				}
			}
			let out;
			if (core.length === 0) {
				const whole = message.trim();
				if (whole.length <= maxChars) return whole;
				const tail = message.trimEnd().slice(-1e3);
				const sep = "\n…\n";
				const headBudget = Math.max(maxChars - tail.length - 3, 0);
				const head = message.slice(0, 500).trim();
				out = `${head.length > headBudget ? head.slice(0, headBudget) : head}${sep}${tail}`;
			} else out = core.join("\n");
			return out.length > maxChars ? `${out.slice(0, maxChars)}\n… (truncated)` : out;
		}
		/** 提取首个错误代码（如 ERR_PNPM_PREPARE_PACKAGE），无则 null。
		*  代码里可能含数字（ERR_PNPM_FETCH_404 / ERR_PNPM_EBADPLATFORM_...），字符类需带上 0-9，
		*  否则会被截断成 `ERR_PNPM_FETCH_`。 */
		function coreErrorCode(message) {
			const m = message.match(/\[?ERR_[A-Z0-9_]+\]?/);
			return m ? m[0].replace(/^\[|\]$/g, "") : null;
		}
		/** 「包在 registry 不存在」失败的提示变体：服务端用官方源复核过（会注入 `[registry-mirror-lag]`）
		*  时，说明包在官方源上存在、是本机镜像源未同步 → 提示换源；否则按「profile 残留依赖」提示
		*  （删掉 profile 里那条依赖即可）。 */
		function registryMissingHintOf(message) {
			return /\[registry-mirror-lag\]/i.test(message) ? "failRegistryMirrorLagHint" : "failPnpmMissingDepHint";
		}
		/** 提取「registry 上不存在的包名」：从 404 行（`ERR_PNPM_FETCH_404 GET <registry>/<pkg>: Not Found - 404`）
		*  里取请求路径中的包名（含 scope，如 `@scope/name`）；非 404 或提取不到返回 null。 */
		function missingRegistryPackageOf(message) {
			for (const line of message.split(/\r?\n/)) {
				if (!/ERR_PNPM_FETCH_404|404/.test(line)) continue;
				const m = line.match(/GET\s+https?:\/\/[^\s/]+\/((?:@[^/\s:]+\/)?[^/\s:]+)/);
				if (m) return m[1].replace(/%40/gi, "@").replace(/%2f/gi, "/");
			}
			return null;
		}
		/**
		* 从网络类失败消息里提取「具体连不上的地址」，供弹窗精准提示（你的网络无法访问什么）。
		* 优先取服务端 [network] 网络探测消息括号里的探测地址（中文「（…）」/ 英文「(…)」），
		* 否则取消息里出现的第一个 URL（git fetch 的仓库地址、registry 域名等）。
		* 提取不到返回 null —— 调用方据此跳过地址行。
		*/
		function unreachableTargetOf(message) {
			const paren = message.match(/[（(](https?:\/\/[^\s'"`<>（)+]+)[)）]/);
			if (paren) return paren[1];
			const url = message.match(/https?:\/\/[^\s'"`<>（）()]+/);
			return url ? url[0].replace(/[.,;:）)\]]+$/, "") : null;
		}
		/** npm registry 的官方/常见公开镜像主机名：tarball 从这里下载属正常配置，
		* 失败按「网络不通」提示即可，不需要额外的换源指引。 */
		const PUBLIC_REGISTRY_HOSTS = /* @__PURE__ */ new Set([
			"registry.npmjs.org",
			"registry.yarnpkg.com",
			"registry.npmmirror.com",
			"mirrors.cloud.tencent.com",
			"mirrors.huaweicloud.com"
		]);
		/**
		* 网络类失败消息里，判断是否「npm/pnpm 的 registry 被指向了内网/自定义源导致拉包失败」。
		* pnpm 下载包文件的 URL 形如 `<registry>/<pkg>/-/<pkg>-<ver>.tgz`（路径含 `/-/`）；
		* 若该 tarball 的主机不属于官方/常见公开镜像，说明本机 registry 被配成了私有/内网源
		* （如公司 Artifactory）—— 常因源未同步该包、需内网认证或网络策略拦截而失败。
		* 返回该主机名供前端给出「检查 registry 配置」的精准提示；官方/公开源或提取不到返回 null，
		* 调用方按通用网络问题提示即可。
		*/
		function registryHostOf(message) {
			const m = message.match(/https?:\/\/([^/\s]+)\/[^\s'"`<>]*\/-\/[^\s'"`<>]+/);
			if (!m) return null;
			const host = m[1].replace(/:\d+$/, "");
			return PUBLIC_REGISTRY_HOSTS.has(host) ? null : host;
		}
		/**
		* 「本地依赖目录不存在」失败里缺失的路径：
		* `pnpm: ENOENT: no such file or directory, lstat '<path>'`
		* 或 `Could not install from "<path>" as it does not exist`。取不到返回 null。
		*/
		function missingLocalDirOf(message) {
			const lstat = /ENOENT: no such file or directory,\s*(?:lstat|scandir|readlink)\s+'([^']+)'/i.exec(message);
			if (lstat !== null) return lstat[1];
			const quoted = /Could not install from\s+"([^"]+)"\s+as it does not exist/i.exec(message) ?? /Could not install from\s+'([^']+)'\s+as it does not exist/i.exec(message);
			return quoted === null ? null : quoted[1];
		}
		/**
		* 「profile 由桌面应用独占」错误里的 profile 名：
		* `error: profile "desktop" is managed exclusively by the Electron application`。
		* 取不到返回 null（提示文案退回通用说法）。
		*/
		function exclusiveProfileOf(message) {
			const m = /profile\s+"?([A-Za-z0-9_-]+)"?\s+is managed exclusively/i.exec(message);
			return m === null ? null : m[1];
		}
		/**
		* 日志里有安装器的 `[desktop-cli-fallback]` 标记：没找到桌面应用内置的 CLI 引导脚本，
		* 退回 PATH 上的 dsh 才被「profile 独占」拒绝 —— 是我们的路径推导问题，不是用户环境问题。
		*/
		function desktopCliFallbackOf(message) {
			return /\[desktop-cli-fallback\]/i.test(message);
		}
		/** `[dsh-too-old]` 标记里的三方信息（包名 / 插件要求的 DSH 下限 / 当前宿主版本）；取不到返回 null。 */
		function dshTooOldInfoOf(message) {
			const m = /\[dsh-too-old\]\s*(\S+)\s+requires DSH >= (\S+).*?runs (\S+)/i.exec(message);
			return m === null ? null : {
				pkg: m[1],
				floor: m[2],
				current: m[3]
			};
		}
		/**
		* `cannot resolve profile bundle "<pkg>" from the dsh installation or <profileDir>` 里的
		* 缺失包名与 profile 目录；只取到包名也算成功（profile 目录可能被换行截断）。
		*/
		function unresolvedBundleOf(message) {
			const m = /cannot resolve profile bundle\s+"([^"]+)"\s+from the dsh installation or\s+(.+?)\s*(?:;|$)/im.exec(message);
			if (m !== null) return {
				pkg: m[1],
				profileDir: m[2].trim()
			};
			const only = /cannot resolve profile bundle\s+"([^"]+)"/i.exec(message);
			return only === null ? null : {
				pkg: only[1],
				profileDir: ""
			};
		}
		/**
		* 鉴权失败（401/403）时被拒绝的源主机名：从 `ERR_PNPM_FETCH_401 GET https://host/pkg: Unauthorized - 401`
		* 里取，取不到返回 null（提示文案退回通用说法，不拼出残缺句子）。
		*/
		function authRegistryHostOf(message) {
			const m = /ERR_PNPM_FETCH_40[13]\s+GET\s+https?:\/\/([^\s/:]+)/i.exec(message) ?? /GET\s+https?:\/\/([^\s/:]+)\S*\s*:?\s*(?:Unauthorized|Forbidden)\s*-\s*40[13]/i.exec(message);
			return m === null ? null : m[1];
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
		/** 错误原因标题（对外英文）：点明问题出在哪一侧，便于 issue 列表分流；
		*  动作级原因（未分类/超时…）带动作词，卸载失败不写成 install failed。 */
		function reasonTitleOf(kind, action) {
			const word = actionWordEn(action);
			switch (kind) {
				case "npmTooOld": return `npm too old for this ${word}`;
				case "nodeEngine": return `Node / pnpm on the user machine is below the version this ${word} requires`;
				case "profileState": return `the user profile's pnpm metadata does not match the local pnpm for this ${word}`;
				case "dshMissing": return "dsh command not found on the user machine";
				case "pnpmMissing": return "pnpm command not found on the user machine";
				case "pnpmStore": return "pnpm store version mismatch on the user machine";
				case "pnpmModulesMismatch": return "the profile modules directory was built with a different pnpm config on the user machine";
				case "pnpmWorkspace": return `pnpm workspace-root check blocked the ${word} on the user machine`;
				case "originRejected": return "request origin rejected by the local service on the user machine";
				case "pnpmPolicy": return `pnpm supply-chain policy blocked the ${word} on the user machine`;
				case "pnpmUnusedPatch": return "stale pnpm patch entry on the user machine";
				case "pnpmMissingDep": return "dependency not found on the npm registry on the user machine";
				case "registryVersionStale": return `requested version not available on the npm registry in use on the user machine`;
				case "registryAuth": return `npm registry rejected the credentials for this ${word} on the user machine`;
				case "profileExclusive": return `the desktop profile is managed only by the Electron app, so the CLI refused the ${word}`;
				case "pnpmLinkedDirMissing": return "dangling local (link:) dependency in the user profile";
				case "fileLocked": return "file locked by another process on the user machine";
				case "accessDenied": return "file write access denied on the user machine";
				case "fsUnavailable": return "local file system unavailable on the user machine";
				case "pnpmIgnoredBuild": return "build scripts blocked by pnpm allowlist";
				case "pluginPrepare": return "plugin distribution incomplete";
				case "hostIncompatible": return "plugin does not support the DSH version in use";
				case "network": return "network failure on the user side";
				case "tlsTrust": return `TLS certificate verification failed on the user machine during the ${word}`;
				case "hostCliSpawn": return "the DSH host could not be launched on the user machine";
				case "hubState": return `stale ${word} state in the plugin hub`;
				case "profileBundleMissing": return "the DSH profile is missing a bundle it declares";
				case "timeout": return `${word} timed out`;
				case "profileLock": return "DSH profile is locked by another process";
				case "pluginMissingDep": return "a dependency of the plugin is not published on npm";
				case "dshTooOld": return "the plugin requires a newer DSH than the host runs";
				case "localEnv": return `no plugin-side cause found — the failure points at the local environment for this ${word}`;
				case "hub": return `${word} failed (cause unclassified)`;
				default: return `plugin ${word} failed`;
			}
		}
		/**
		* 一键反馈 GitHub Issue 的预填链接：标题带「来自 dsh-plugin.org」标识 + 错误原因，
		* 正文只带核心信息 —— 原因判定 + 关键错误代码 + 尝试过的安装方式 + 宿主机器环境快照 +
		* 错误核心摘要（完整日志太长，塞进 URL 会被 GitHub 以「request URL too long」拒绝，
		* 故只收集重点）。错误弹窗、失败记录共用此逻辑。
		* env 取不到时为 null，链接照常生成、只是少环境段。
		* attempts（尝试过的安装方式，实际执行过的命令）：作者看到我们试过的命令，
		* 组织 scope 与 GitHub 用户名不一致时也能直接指认正确的 npm 包名。
		*/
		function pluginIssueUrl(repo, message, env, command, attempts, action = "install") {
			const kind = classifyFailure(message);
			const executed = executedCommandOf(command, attempts);
			const zhWord = actionWordZh(action);
			const title = `[dsh-plugin.org | dsh-plugin-hub] ${reasonTitleOf(kind, action)}: ${repo}`;
			const reason = kind === "hostIncompatible" ? "the plugin declares a dsh compatibility range that does not include the runtime in use, so the host rejects it before installing anything; please extend the supported dsh versions or publish a compatible release" : /\[packaging\]/i.test(message) ? "plugin distribution is incomplete — a file the package needs (its entry from main / exports, an entry a bundled patch mounts, or the patch declared by dsh.bundle.patch) is missing from the published npm package; please publish a complete package" : /\[registry-missing\]/i.test(message) ? "a dependency declared by the plugin is not published on the public npm registry (missing, removed, or never released); please publish or correct that dependency, or ship it with the plugin" : kind === "network" ? "network connectivity issue on the user side (DNS, proxy, firewall, or a blocked connection)" : kind === "tlsTrust" ? "the local certificate chain is not trusted by Node/pnpm (corporate SSL inspection, antivirus web shield, or a local MITM proxy) — local environment issue" : kind === "localEnv" ? "no evidence of a plugin-side cause; the log shows local-environment signals (system error codes, certificates/proxy, or a broken local config), so this is reported for triage of the classifier only" : kind === "dshTooOld" ? "the plugin declares a minimum DSH version this host does not meet — upgrade DSH first (local environment issue)" : kind === "pnpmModulesMismatch" ? "the profile node_modules was created with a different pnpm config (hoisting / virtual store settings), so pnpm refuses to reuse it (local environment issue)" : kind === "profileBundleMissing" ? "the profile declares a bundle that is not installed in it (interrupted install or incomplete app update), so the host aborts before installing anything (local environment issue)" : kind === "registryAuth" ? "the npm registry rejected the request with 401/403 — the configured registry needs credentials or blocks this network (local environment issue)" : kind === "profileExclusive" ? "the desktop profile can only be managed by the Electron app, and the install was attempted from an external CLI (local environment issue)" : kind === "pluginPrepare" ? "plugin prepare/build script failed during install (packaging/distribution issue)" : kind === "pnpmIgnoredBuild" ? "plugin depends on a native module whose build script pnpm blocks by default (use a prebuilt variant)" : kind === "originRejected" ? "the request never reached the install flow — the local service rejected its origin (local environment issue)" : kind === "pnpmPolicy" ? pnpmPolicyHintOf(message) === "failPnpmTarballIntegrityHint" ? "pnpm rejected a lockfile entry without tarball integrity; inspect and back up the profile lockfile before resolving it again, keeping integrity checks enabled" : "the pnpm supply-chain policy on the user machine blocked the install (minimum release age for freshly published packages / untrusted origin)" : kind === "pnpmUnusedPatch" ? "the profile keeps a pnpm patch entry for an older dsh-plugin version, so pnpm aborted the install (local config issue)" : kind === "fileLocked" ? "a file in the profile is locked by another process on the user machine (local environment issue)" : kind === "accessDenied" ? "the system denied write access to a file in the profile on the user machine (local environment issue)" : kind === "fsUnavailable" ? "the local file system could not accept the write — no space left, read-only volume, or too many open file handles on the user machine (local environment issue)" : "plugin-side install failure";
			const code = coreErrorCode(message);
			const build = (coreChars) => {
				const body = [
					"## Summary",
					`- Cause: ${reason}`,
					...code ? [`- Key error: \`${code}\``] : [],
					"",
					`## [DSH Plugin 插件市场](${SITE_URL}) · ${zhWord} Plugin 失败错误信息`,
					`本错误信息由 [dsh-plugin-hub](${GITHUB_URL}) 插件市场的安装程序自动生成，随本次${zhWord}失败一并提交。`,
					`- 实际执行的${zhWord}命令：${executed ? `\`${executed}\`` : "unknown (no executed command recorded)"}`,
					`- 执行结果：${zhWord}失败，未能${zhWord}该插件。`,
					...attempts && attempts.length > 0 ? [
						"",
						"## Attempted channels（已尝试的方式）",
						...attempts.map((a) => `- ${a}`)
					] : [],
					.../\[packaging\]/i.test(message) ? [
						"",
						"## 安装方式说明",
						"当前插件的 npm 分发物缺少它需要的文件（`main` / `exports` 声明的入口、补丁按本包名 mount 的入口，或 `dsh.bundle.patch` 声明的补丁）。请发布包含完整构建产物的 npm 包后重试。"
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
						"- Full log: open the Hub notifications, select the failed record and press \"Copy\""
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
		function hubIssueUrl(pluginRepo, message, env, command, attempts, variant = "triage", action = "install") {
			const kind = classifyFailure(message);
			const executed = executedCommandOf(command, attempts);
			const zhWord = actionWordZh(action);
			const repo = pluginRepo && pluginRepo.trim() !== "" ? pluginRepo.trim() : "unknown";
			const title = variant === "misjudge" ? `[dsh-plugin-hub] possible misjudgment: ${repo}` : `[dsh-plugin-hub] ${reasonTitleOf(kind, action)}: ${repo}`;
			const code = coreErrorCode(message);
			const build = (coreChars) => {
				const body = [
					"## Summary",
					`- Auto-classified cause: ${reasonTitleOf(kind, action)}`,
					`- Target plugin: \`${repo}\``,
					...code ? [`- Key error: \`${code}\``] : [],
					...variant === "misjudge" ? ["- Filed from: a branch that normally routes to the plugin repo — filed here because that verdict may be our own misjudgment.", "- Source of that verdict: produced by dsh-plugin-hub's own check or its auto-allow retry, not by plain pnpm output."] : ["- Why filed here: the installer only routes a failure to the plugin repo when the cause is demonstrably the plugin's own build/distribution (pluginPrepare, or build scripts pnpm blocks that even an auto-allow retry cannot get past). This failure does not match that, so it is routed here for triage."],
					"",
					`## [DSH Plugin 插件市场](${SITE_URL}) · ${zhWord} Plugin 失败错误信息`,
					`本错误信息由 [dsh-plugin-hub](${GITHUB_URL}) 插件市场的安装程序自动生成，随本次${zhWord}失败一并提交。`,
					`- 实际执行的${zhWord}命令：${executed ? `\`${executed}\`` : "unknown (no executed command recorded)"}`,
					`- 执行结果：${zhWord}失败，未能${zhWord}该插件。`,
					...attempts && attempts.length > 0 ? [
						"",
						"## Attempted channels（已尝试的方式）",
						...attempts.map((a) => `- ${a}`)
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
						"- Full log: open the Hub notifications, select the failed record and press \"Copy\""
					] : [],
					...repo !== "unknown" ? [`- Catalog: [${pluginSiteUrl(repo)}](${pluginSiteUrl(repo)})`] : [],
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
				return `https://github.com/${HUB_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
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
		* 板块的语言状态：Hub 与宿主（系统）locale 共用 —— 头部语言开关通过 setLocale 写入
		* 宿主语言偏好，让宿主界面（左侧菜单、设置弹窗）与 Hub 面板一起切换、不会各说各话。
		* 对外暴露本地化字典查询 `t()`、zh/en 语言标记与 /zh/ URL 路径前缀。
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
		* 插件中心设置状态：从宿主本地 /settings 路由加载一次（持久化在
		* ~/.dsh/profiles/<profile>/hub-settings.json），并按乐观方式更新。
		* 每次改动立即 POST 补丁，切换过的开关刷新后仍在；宿主未挂服务端路由时退回默认值
		* 继续可用（设置不持久化而已）。
		*/
		const DEFAULT_SETTINGS = {
			checkUpdatesOnStart: true,
			proxy: "",
			npmRegistry: "",
			registryFallback: true,
			enableNpmInstall: true,
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
		* 插件中心的后台安装/卸载任务队列。
		*
		* 通过轮询 /active 镜像服务端 FIFO 活动队列，对消失的任务用 /status 收尾，并暴露
		* 队列动作（安装、卸载、取消）以及弹窗用的任务查找。
		*/
		/** 安装/卸载请求超时（ms）：服务端入队前要做目录包校验与网络探测（各自有超时，合计可达十几秒），
		*  给足余量；超时主动中止，避免服务端网络挂起时前端永久卡「安装中 0%」。 */
		const REQUEST_TIMEOUT_MS = 6e4;
		/** 失败消息的入口溯源前缀：自定义安装（带渠道）在错误正文顶部精准指出从哪张卡片发起；
		*  目录插件安装（无渠道）返回 null，错误正文保持原样。 */
		const entryLineOf = (t, channel) => channel ? t("installEntryLine", { c: t("installChannelNpm") }) : null;
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
			/** 向宿主记录某插件的安装时目录信号（version + updatedAt）。
			*  版本未知时**不写**：服务端把空版本当作「卸载清理」会删掉整条记录（连 npm 包名映射一起），
			*  刷新页面后任务丢了快照就会走到这条路径 —— 宁可保留旧记录，也不能把账本清空。 */
			const syncInstalledVersion = async (repo, version, updatedAt) => {
				if (!repo || version === void 0 || version === "") return;
				try {
					await fetch("/dsh-plugin-hub/installed-version", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({
							repo,
							version,
							updatedAt
						})
					});
				} catch {}
			};
			/** 清除某仓库的版本记录（卸载成功后调用）：空版本是服务端的「删除记录」语义，只在这里显式发送。 */
			const clearInstalledVersion = async (repo) => {
				if (!repo) return;
				try {
					await fetch("/dsh-plugin-hub/installed-version", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({
							repo,
							version: null
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
						clearInstalledVersion(q.repo);
						onUninstallDone(modalTaskRef.current === q.id, q.repo, q.needsRestart, q.needsReload ?? false);
					} else {
						const recordedVersion = q.installedVersion ?? q.version;
						syncInstalledVersion(q.repo, recordedVersion, q.updatedAt);
						pendingInfoRef.current.set(q.target, {
							desc: q.desc,
							version: recordedVersion
						});
						onInstallDone(modalTaskRef.current === q.id, q.repo, q.needsRestart, q.action === "update", q.needsReload ?? false, q.bundleDeselected === true);
					}
				} else {
					const rawDetail = lines.length > 0 ? [...lines].reverse().join("\n") : q.kind === "uninstall" ? t("uninstallFail") : t("installFail");
					const entry = entryLineOf(t, q.channel);
					onError(entry ? `${entry}\n${rawDetail}` : rawDetail, q.repo, q.kind, executedCommandOf(q.command, q.attempts), q.attempts, q.action === "update");
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
				let bundleDeselected;
				let installedVersion;
				try {
					const res = await fetch(`/dsh-plugin-hub/status?task=${q.id}`, { cache: "no-store" });
					if (res.ok) {
						const task = (await res.json()).task;
						if (task !== void 0) {
							status = task.status ?? "failed";
							lines = task.lines ?? [];
							attempts = Array.isArray(task.attempts) ? task.attempts : void 0;
							bundleDeselected = task.bundleDeselected === true ? true : void 0;
							installedVersion = typeof task.installedVersion === "string" && task.installedVersion !== "" ? task.installedVersion : void 0;
							const needsRestart = typeof task.needsRestart === "boolean" ? task.needsRestart : q.needsRestart;
							const needsReload = typeof task.needsReload === "boolean" ? task.needsReload : q.needsReload ?? false;
							if (status === "done") {
								const settled = {
									...q,
									needsRestart,
									needsReload,
									bundleDeselected: bundleDeselected === true ? true : q.bundleDeselected,
									installedVersion
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
									bundleDeselected: a.bundleDeselected === true || prevTask?.bundleDeselected === true,
									channel: a.installChannel === "npm" ? "npm" : prevTask?.channel
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
								channel: a.installChannel === "npm" ? "npm" : void 0
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
			*  实际安装目标（target）为 npm 包名。 */
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
							...input.pinVersion ? { version: input.pinVersion } : {},
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
					const reason = err?.name === "AbortError" ? `${t("requestTimeout")}\n[request-timeout]` : err instanceof Error && err.message ? err.message : String(err ?? "");
					const entry = entryLineOf(t, input.channel);
					const msg = reason ? `${t("installFail")} — ${reason}` : t("installFail");
					onError(entry ? `${entry}\n${msg}` : msg, input.repo, "install", input.command);
				} finally {
					window.clearTimeout(timeout);
					submittingRef.current.delete(input.repo);
					setSubmitting(false);
				}
			};
			/** 目录插件安装：安装目标取目录数据的 npm 包名，走 catalog 白名单。 */
			const installNow = async (p, opts) => {
				const repo = p.source?.repo ?? "";
				if (!repo) return;
				const target = installTargetOf(p);
				if (!target) return;
				await submitInstall({
					target,
					repo,
					desc: p.description,
					version: p.version,
					updatedAt: p.dates?.repoUpdatedAt,
					command: installCommandOf(p, true),
					source: "catalog",
					update: opts?.update,
					pinVersion: opts?.pinVersion
				});
			};
			/** 命令行安装：用户手输 npm 包名，走 custom 源（受安全开关控制）。
			*  update=true 时对已安装目标放行覆盖重装（与目录插件「更新」同一语义）。
			*  channel=入口渠道（NPM 包卡片）：上报服务端落日志，失败弹窗/通知据此精准溯源。
			*  队列展示/防重一律用归一化身份：与服务端 /active 合并、弹窗目标匹配同口径，
			*  npm 包名透传不受影响。 */
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
					const reason = err?.name === "AbortError" ? `${t("requestTimeout")}\n[request-timeout]` : err instanceof Error && err.message ? err.message : String(err ?? "");
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
		* 客户端各处使用的内联 SVG 图标。图标继承 currentColor，自动适配主题与禁用态。
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
		* 安装与卸载弹窗共用的内联进度块：真实百分比进度条（服务端估算、客户端轮询）。
		* 不做实时终端窗口 —— pnpm 在 git clone/构建期间几乎无输出，日志面板大部分时间是空的；
		* 失败时完整输出在 ErrorModal 里展示。
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
		* 插件中心的弹窗层：安装确认弹窗、卸载弹窗与全局 Toast。两个弹窗在变更执行期间
		* 自我锁定，随后切到只有一个动作的结果视图 —— 常见情况给「完成」（关闭时刷新页面即生效），
		* 刷新解决不了的少数情况才给单个「立即重启」。
		*/
		/** 完成结果视图：绿色对勾 + 标题/描述；
		*  终态只有两种：
		*  - needsRestart=true（刷新解决不了：热挂载失败 / 非 dsh 插件 / 更新）→ 仅一个「立即重启」
		*    按钮（重启会中断进行中的任务，故仍需用户确认），关闭即放弃；
		*  - 其余（含 needsReload=true 的「已热挂载、仅剩客户端 UI」）→ 仅「完成」按钮：关闭结果弹窗时
		*    上层自动刷新页面让插件生效，不再给「稍后/立即刷新」手动选择。 */
		function ResultView({ title, desc, t, restarting, needsRestart, needsReload, bundleDeselected, onRestart, onClose }) {
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
			}))), (0, react.createElement)("div", { className: Modal_module_css_default.resultTitle }, title), desc ? (0, react.createElement)("div", { className: Modal_module_css_default.resultDesc }, desc) : null, bundleDeselected ? (0, react.createElement)("div", { className: Modal_module_css_default.bundleDeselectedHint }, t("bundleDeselectedHint")) : null, needsRestart ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.resultRestarting }, restarting ? t("restarting") : t("restartHint")), (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartNowWarning,
				onClick: onRestart,
				disabled: restarting
			}, restarting ? t("restarting") : t("restartNow")))]) : (0, react.createElement)("div", null, [needsReload ? (0, react.createElement)("div", { className: Modal_module_css_default.resultRestarting }, t("reloadHint")) : null, (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartNow,
				onClick: onClose
			}, t("done")))]));
		}
		/**
		* 信任确认弹窗：安装进入后台队列后弹窗仍可关闭（任务继续），
		* 只在本任务执行中展示实时进度；完成后切换为结果视图，与卸载一致。
		* 目录插件与命令行安装（customTarget 模式）共用同一套确认/进度/结果流程。
		*/
		function InstallModal(props) {
			const { plugin, customTarget, globalNpm, done, task, t, langPath, restarting, submitting, update, cliOnly, needsRestart, needsReload, bundleDeselected, onClose, onCopy, onInstall, onRestart } = props;
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
				needsReload,
				bundleDeselected,
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
			}, (0, react.createElement)("span", { className: Modal_module_css_default.modalCmdText }, globalNpm !== void 0 && globalNpm.length > 0 ? `npm install -g ${globalNpm.join(" ")}` : customTarget ? `pnpm add ${customTarget}` : installCommandOf(plugin)), (0, react.createElement)("span", { className: Modal_module_css_default.modalCmdCopy }, (0, react.createElement)(CopyIcon), t("copyCmdLabel"))), globalNpm !== void 0 && globalNpm.length > 0 ? (0, react.createElement)("div", { className: Modal_module_css_default.cliOnlyHint }, t("globalNpmHint")) : null, cliOnly ? (0, react.createElement)("div", { className: Modal_module_css_default.cliOnlyHint }, t(plugin?.install?.manualInstall === true ? "manualInstallOnlyHint" : "cliOnlyHint")) : null, task && task.status === "pending" ? (0, react.createElement)("div", { className: Modal_module_css_default.queuedHint }, t("queuedHint")) : null, task ? (0, react.createElement)(ProgressView, { task }) : null, task && task.status === "failed" ? (0, react.createElement)("div", { className: Modal_module_css_default.failedCopyHint }, t("failedCopyHint")) : null, (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.modalCopy,
				disabled: busy,
				onClick: onCopy
			}, t("copyInstallCommand")), cliOnly ? null : (0, react.createElement)("button", {
				className: Modal_module_css_default.modalInstall,
				disabled: busy,
				onClick: onInstall
			}, busy ? task && task.status === "pending" ? update ? t("queuedUpdateTitle") : t("queuedTitle") : update ? t("updating") : t("installing") : update ? t("updateNow") : t("installNow"))))));
		}
		/** 卸载确认弹窗：确认/进行中（后台队列，可关闭）；完成后切换为结果视图（成功即生效，仅「完成」关闭）。 */
		function UninstallModal(props) {
			const { plugin, done, task, t, langPath, restarting, submitting, needsRestart, needsReload, onClose, onCancel, onCopyCommand, onConfirm, onRestart } = props;
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
				needsReload,
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
		/** 安装/更新/卸载失败弹窗：标题、徽标、提示文案与 issue 正文都按传入的动作取词。 */
		function ErrorModal({ message, repo, action, command, attempts, t, env, onCopy, onClose, onRunDiagnostics }) {
			const failureKind = classifyFailure(message);
			const actionWord = t(action === "uninstall" ? "actionUninstall" : action === "update" ? "actionUpdate" : "actionInstall");
			const npmVersion = npmTooLowVersion(message);
			const displayMessage = formatFailureMessage(message);
			const copyText = [
				...command ? [command] : [],
				...attempts ?? [],
				displayMessage
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
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.errorTitle }, t(action === "uninstall" ? "errorTitleUninstall" : action === "update" ? "errorTitleUpdate" : "errorTitleInstall")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("errorClose"),
				onClick: onClose
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, (0, react.createElement)("div", { className: Modal_module_css_default.failRow }, (0, react.createElement)("div", { className: Modal_module_css_default.failHead }, repo ? (() => {
				const url = pluginSiteUrl(repo);
				return (0, react.createElement)("a", {
					className: Modal_module_css_default.failRepo,
					href: url,
					target: "_blank",
					rel: "noopener noreferrer",
					title: url
				}, (0, react.createElement)("span", { className: Modal_module_css_default.failRepoLabel }, `${t("detailTitle")} · `), (0, react.createElement)("span", { className: Modal_module_css_default.failRepoUrl }, url.replace(/^https?:\/\//, "").split("?")[0]));
			})() : null, (0, react.createElement)("button", {
				className: Modal_module_css_default.errorCopySoft,
				onClick: () => onCopy(copyText)
			}, t("errorCopy"))), (0, react.createElement)("pre", { className: Modal_module_css_default.errorBox }, displayMessage), (0, react.createElement)("div", { className: Modal_module_css_default.failKindTitle }, t(`failKind_${failureKind}`, failureKind === "hostIncompatible" ? { version: /incompatible with dsh\s+([^\s:;,]+)/i.exec(message)?.[1] ?? "" } : void 0)), failureKind === "hostIncompatible" ? null : (0, react.createElement)("div", { className: Modal_module_css_default.failReason }, t(`failReason_${failureKind}`)), failureKind === "npmTooOld" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t(npmVersion ? "failNpmTooLowV" : "failNpmTooLow", npmVersion ? { v: npmVersion } : void 0)) : failureKind === "dshMissing" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failDshMissingHint")) : failureKind === "gitMissing" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failGitMissingHint")) : failureKind === "pnpmMissing" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmMissingHint")) : failureKind === "npmMissing" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failNpmMissingHint")) : failureKind === "buildToolchainMissing" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failBuildToolchainHint")) : failureKind === "pnpmWorkspace" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmWorkspaceHint")) : failureKind === "pnpmModulesMismatch" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmModulesMismatchHint")) : failureKind === "pnpmStore" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmStoreHint")) : failureKind === "pnpmPolicy" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t(pnpmPolicyHintOf(message), pnpmPolicyHintParams(message))) : failureKind === "pnpmUnusedPatch" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmUnusedPatchHint")) : failureKind === "profileState" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failProfileStateHint")) : failureKind === "nodeEngine" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failNodeEngineHint")) : failureKind === "pnpmMissingDep" ? (0, react.createElement)("div", null, [(() => {
				const pkg = missingRegistryPackageOf(message);
				return pkg ? (0, react.createElement)("div", { className: Modal_module_css_default.failNetworkTarget }, t("failPnpmMissingDepTarget", { pkg })) : null;
			})(), (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t(registryMissingHintOf(message)))]) : failureKind === "pluginMissingDep" ? (0, react.createElement)("div", null, [
				(() => {
					const pkg = missingRegistryPackageOf(message);
					return pkg ? (0, react.createElement)("div", { className: Modal_module_css_default.failNetworkTarget }, t("failPluginMissingDepTarget", { pkg })) : null;
				})(),
				(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPluginMissingDepHint")),
				repo ? (0, react.createElement)("a", {
					className: Modal_module_css_default.failBigIssue,
					href: pluginIssueUrl(repo, message, env, command, attempts, action),
					target: "_blank",
					rel: "noopener noreferrer",
					title: t("failIssueHint")
				}, t("failIssueBig")) : null
			]) : failureKind === "hostIncompatible" ? (0, react.createElement)("div", null, [(() => {
				const version = /incompatible with dsh\s+([^\s:;,]+)/i.exec(message)?.[1] ?? "";
				return (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failReason }, t("failHostIncompatibleReason", { version })), (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failHostIncompatibleHint"))]);
			})(), repo ? (0, react.createElement)("a", {
				className: Modal_module_css_default.failBigIssue,
				href: pluginIssueUrl(repo, message, env, command, attempts, action),
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("failIssueHint")
			}, t("failIssueBig")) : null]) : failureKind === "registryVersionStale" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failRegistryVersionStaleHint")) : failureKind === "pnpmLinkedDirMissing" ? (0, react.createElement)("div", null, [(() => {
				const dir = missingLocalDirOf(message);
				return dir ? (0, react.createElement)("div", { className: Modal_module_css_default.failNetworkTarget }, t("failLinkedDirTarget", { path: dir })) : null;
			})(), (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmLinkedDirMissingHint"))]) : failureKind === "fileLocked" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failFileLockedHint")) : failureKind === "accessDenied" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failAccessDeniedHint")) : failureKind === "fsUnavailable" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failFsUnavailableHint")) : failureKind === "originRejected" ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failOriginRejectedHint", { profile: env?.profile ?? "<profile>" })) : failureKind === "profileExclusive" ? (() => {
				const profile = exclusiveProfileOf(message);
				const ourBug = desktopCliFallbackOf(message);
				return (0, react.createElement)("div", null, [
					(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t(profile ? "failProfileExclusiveHint" : "failProfileExclusiveHintNoProfile", profile ? { profile } : void 0)),
					ourBug ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failDesktopCliFallbackHint")) : null,
					ourBug ? (0, react.createElement)("a", {
						className: Modal_module_css_default.failBigIssue,
						href: hubIssueUrl(repo, message, env, command, attempts, "triage", action),
						target: "_blank",
						rel: "noopener noreferrer",
						title: t("failHubIssueHint")
					}, t("failIssueBig")) : null
				]);
			})() : failureKind === "registryAuth" ? (() => {
				const host = authRegistryHostOf(message);
				return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t(host ? "failRegistryAuthHint" : "failRegistryAuthHintNoHost", host ? { host } : void 0));
			})() : failureKind === "dshTooOld" ? (() => {
				const info = dshTooOldInfoOf(message);
				return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failDshTooOldHint", info ?? {
					pkg: repo ?? "plugin",
					floor: "?",
					current: "?"
				}));
			})() : failureKind === "localEnv" ? (0, react.createElement)("div", null, [
				(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failLocalEnvHint")),
				onRunDiagnostics ? (0, react.createElement)("button", {
					className: Modal_module_css_default.failDiagBtn,
					onClick: onRunDiagnostics
				}, t("failNetworkRunDiag")) : null,
				(0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failMisjudgeHint")), (0, react.createElement)("a", {
					className: Modal_module_css_default.failMisjudgeLink,
					href: hubIssueUrl(repo, message, env, command, attempts, "triage", action),
					target: "_blank",
					rel: "noopener noreferrer",
					title: t("failHubIssueHint")
				}, t("failMisjudgeLink"))])
			]) : failureKind === "tlsTrust" ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failTlsTrustHint")), onRunDiagnostics ? (0, react.createElement)("button", {
				className: Modal_module_css_default.failDiagBtn,
				onClick: onRunDiagnostics
			}, t("failNetworkRunDiag")) : null]) : failureKind === "network" ? (0, react.createElement)("div", null, [
				(() => {
					const target = unreachableTargetOf(message);
					return target ? (0, react.createElement)("div", { className: Modal_module_css_default.failNetworkTarget }, t("failNetworkTarget", { url: target })) : null;
				})(),
				(() => {
					const host = registryHostOf(message);
					return host ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failNetworkRegistryHint", { host })) : null;
				})(),
				(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failNetworkHint", { action: actionWord })),
				onRunDiagnostics ? (0, react.createElement)("button", {
					className: Modal_module_css_default.failDiagBtn,
					onClick: onRunDiagnostics
				}, t("failNetworkRunDiag")) : null
			]) : failureKind === "pluginPrepare" ? (0, react.createElement)("div", null, [
				(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, /\[packaging\]/i.test(message) ? t("failPackagingHint") : t("failPrepareHint")),
				repo ? (0, react.createElement)("a", {
					className: Modal_module_css_default.failBigIssue,
					href: pluginIssueUrl(repo, message, env, command, attempts, action),
					target: "_blank",
					rel: "noopener noreferrer",
					title: t("failIssueHint")
				}, t("failIssueBig")) : null,
				repo ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failMisjudgeHint")), (0, react.createElement)("a", {
					className: Modal_module_css_default.failMisjudgeLink,
					href: hubIssueUrl(repo, message, env, command, attempts, "misjudge", action),
					target: "_blank",
					rel: "noopener noreferrer",
					title: t("failHubIssueHint")
				}, t("failMisjudgeLink"))]) : null
			]) : failureKind === "profileBundleMissing" ? (() => {
				const info = unresolvedBundleOf(message);
				return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failProfileBundleMissingHint", {
					pkg: info?.pkg ?? "unknown",
					profile: env?.profile ?? "<profile>"
				}));
			})() : failureKind === "hubState" ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failHubStateHint", { action: actionWord }))]) : failureKind === "timeout" ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failTimeoutHint"))]) : failureKind === "profileLock" ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failProfileLockHint", { action: actionWord }))]) : failureKind === "hostCliSpawn" ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failHostCliSpawnHint"))]) : failureKind === "pnpmIgnoredBuild" ? (0, react.createElement)("div", null, [
				(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failIgnoredBuild")),
				repo ? (0, react.createElement)("a", {
					className: Modal_module_css_default.failBigIssue,
					href: pluginIssueUrl(repo, message, env, command, attempts, action),
					target: "_blank",
					rel: "noopener noreferrer",
					title: t("failIssueHint")
				}, t("failIssueBig")) : null,
				repo ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failMisjudgeHint")), (0, react.createElement)("a", {
					className: Modal_module_css_default.failMisjudgeLink,
					href: hubIssueUrl(repo, message, env, command, attempts, "misjudge", action),
					target: "_blank",
					rel: "noopener noreferrer",
					title: t("failHubIssueHint")
				}, t("failMisjudgeLink"))]) : null
			]) : (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failUnclassifiedHint", { action: actionWord })), (0, react.createElement)("a", {
				className: Modal_module_css_default.failBigIssue,
				href: hubIssueUrl(repo, message, env, command, attempts, "triage", action),
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("failHubIssueHint")
			}, t("failHubIssueBig"))])), (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartLater,
				onClick: onClose
			}, t("errorClose"))))));
		}
		/** 全局反馈 Toast：复制成功（反色）/ 安装完成（反色）/ 安装失败（红色）/ 卸载结果 */
		function Toast({ toast, t }) {
			const text = toast.kind === "copied" ? t("toastCopied") : toast.kind === "errCopied" ? t("errCopied") : toast.kind === "done" ? t("installDone") : toast.kind === "fail" ? t("installFail") : toast.kind === "removed" ? t("uninstallDone") : toast.kind === "revealFail" ? t("openFolderFail") : toast.kind === "restartDesktop" ? t("toastRestartDesktop") : toast.kind === "installedLive" ? t("toastInstalledLive") : toast.kind === "installedReload" ? t("toastInstalledReload") : t("uninstallFail");
			const fail = toast.kind === "fail" || toast.kind === "removeFail" || toast.kind === "revealFail" || toast.kind === "restartDesktop";
			return (0, react.createElement)("div", {
				key: toast.id,
				className: fail ? `${Modal_module_css_default.toast} ${Modal_module_css_default.toastFail}` : Modal_module_css_default.toast
			}, text);
		}
		/** 待重启确认弹窗：已安装列表行内「重启」按钮点击后弹出，
		*  与通知中心待重启条目同一交互（红色警告说明 + 单个「立即重启」），
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
				if (/\/dsh-plugin-user-group-qr[^/]*$/i.test(src)) return `<img src="${src}" alt="${String(alt)}" width="100" height="100" loading="lazy">`;
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
		/**
		* 反馈群二维码 URL 恒定（每次换码都是同名覆盖，文件名不变），浏览器 / CDN 会按
		* URL 缓存旧图。这里在渲染前给二维码 URL 实时拼一个新的时间戳，强制每次打开
		* 「关注我们」都回源拉取最新图片，无需重新构建 / 部署接口中心。
		* 匹配规则与 renderMarkdown 的二维码识别保持一致（dsh-plugin-user-group-qr 前缀）。
		*/
		function bustQrCache(md, ts) {
			return md.replace(/(!\[[^\]]*\]\()([^)\s]*dsh-plugin-user-group-qr[^)\s]*)/g, (_m, pre, url) => `${pre}${String(url).split("?")[0]}?v=${ts}`);
		}
		function AboutModal({ info, lang, t, onClose }) {
			const contentRaw = info ? typeof info.content === "string" ? info.content : info.content && typeof info.content === "object" ? lang === "en" ? info.content.en ?? info.content.zh ?? "" : info.content.zh ?? info.content.en ?? "" : "" : "";
			const qrTs = (0, react.useMemo)(() => Date.now(), []);
			const contentHtml = contentRaw.trim() ? renderMarkdown(bustQrCache(contentRaw, qrTs)) : null;
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
		*  - 有更新（state='available'）：标题「有新版本」，展示新版本号、发布时间与 Worker 下发的
		*    Markdown 变更记录（renderMarkdown 渲染，双语言按界面语言取 {zh,en} 对象），
		*    按钮「稍后再说 / 直接更新」，确认后进入安装弹窗执行覆盖重装。
		*  - 暂缓提示（state='pending'）：远端确有新版本，但发布未满供应链安全门槛，pnpm 此时会
		*    静默回退到旧版本 —— 仍按「有新版本」展示，只给「稍后再说」，并说明稍后会自动提示。
		*  - 无更新 / 信息缺失（state='latest' / 'none'）：标题「当前版本」，版本号与本机版本取自
		*    currentVersion（构建注入的 PLUGIN_VERSION），**不得**用远端最新版号冒充本机版本。
		* 点击头部版本号（或「可更新」徽标）打开 —— 无论有无更新都能看到更新内容。
		*/
		function HubUpdateModal({ info, state, currentVersion, lang, t, onProceed, onClose }) {
			const hasUpdate = state === "available";
			const pending = state === "pending";
			const shownVersion = hasUpdate || pending ? info.version : currentVersion || info.version;
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
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: Modal_module_css_default.modalTitle }, t(hasUpdate || pending ? "hubUpdateTitle" : "hubCurrentTitle")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("confirmCancel"),
				onClick: () => onClose()
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Modal_module_css_default.modalDesc }, t(hasUpdate ? "hubUpdateDesc" : pending ? "hubPendingDesc" : "hubCurrentDesc", { version: shownVersion })), (0, react.createElement)("div", { className: Modal_module_css_default.hubUpdateMeta }, (0, react.createElement)("span", { className: Modal_module_css_default.hubUpdateMetaItem }, `${t("version")} ${shownVersion}`), published ? (0, react.createElement)("span", { className: Modal_module_css_default.hubUpdateMetaItem }, `${t("hubUpdatePublished")} ${published}`) : null), notesHtml ? (0, react.createElement)("div", {
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
			}, t(pending ? "hubUpdateLater" : "hubUpToDate")))));
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
		/** 具体时刻：当天只给「时:分」，跨天再补「月/日」，用于「暂缓到何时可更新」。 */
		function clockTime(ms) {
			const at = new Date(ms);
			const now = /* @__PURE__ */ new Date();
			const hh = String(at.getHours()).padStart(2, "0");
			const mm = String(at.getMinutes()).padStart(2, "0");
			return at.getFullYear() === now.getFullYear() && at.getMonth() === now.getMonth() && at.getDate() === now.getDate() ? `${hh}:${mm}` : `${at.getMonth() + 1}/${at.getDate()} ${hh}:${mm}`;
		}
		//#endregion
		//#region src/client/components/modals/InstalledDetailModal.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* 已安装插件详情弹窗：从「已安装」视图打开（行点击或详情按钮），展示我们对某个已安装项
		* 掌握的全部信息 —— 目录元数据（分类、收录入口、Star/Fork、最新版本）与宿主运行时事实
		* （安装路径、已装版本、安装时间、最后更新）合并呈现。此处的更新/卸载动作与行内动作一致。
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
			}) : t("updateAvailableHint")) : item.pendingUntil != null ? (0, react.createElement)("div", { className: Modal_module_css_default.detailUpdateHint }, t("updatePending", { time: clockTime(item.pendingUntil) })) : null, (0, react.createElement)("div", { className: Modal_module_css_default.detailGrid }, p?.category ? (0, react.createElement)("div", { className: Modal_module_css_default.detailRow }, (0, react.createElement)("span", { className: Modal_module_css_default.detailLabel }, t("detailCategory")), (0, react.createElement)("span", { className: Modal_module_css_default.detailValue }, categoryLabel(CATEGORY_LABELS, p.category, lang))) : null, (0, react.createElement)("div", { className: Modal_module_css_default.detailRow }, (0, react.createElement)("span", { className: Modal_module_css_default.detailLabel }, t("statusLabel")), (0, react.createElement)("span", { className: Modal_module_css_default.detailValue }, (0, react.createElement)("span", {
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
		* 通用确认弹窗 —— 应用里所有「确定吗？」问题的唯一入口。规则：任何询问都必须是
		* 弹窗，绝不用按钮内双击。
		*
		* 中间的图标一眼说明类型：常规确认（安装/更新/重启/忽略）用蓝色问号，
		* 危险操作（清空/删除/卸载/重置）用红色动作图形。
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
		* 通知中心弹窗：每个已结算的安装/卸载任务（成功与失败）的持久化清单。
		*
		* 记录在结算时写入 localStorage（见 logic/failures.ts），即使弹窗被关闭或用户离开，
		* 结果也不会丢失。每条带圆形状态徽标（成功绿勾、失败红叉，白色图形）与消息文本；
		* 失败项保留复制/修复/提 Issue 动作。由头部入口按钮（「设置」tab 之后）打开。
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
				}, r.repo) : shownRepo ? (() => {
					const url = pluginSiteUrl(shownRepo);
					return (0, react.createElement)("a", {
						className: Modal_module_css_default.failRepo,
						href: url,
						target: "_blank",
						rel: "noopener noreferrer",
						title: url
					}, (0, react.createElement)("span", { className: Modal_module_css_default.failRepoLabel }, `${t("detailTitle")} · `), (0, react.createElement)("span", { className: Modal_module_css_default.failRepoUrl }, url.replace(/^https?:\/\//, "").split("?")[0]));
				})() : (0, react.createElement)("span", {
					className: Modal_module_css_default.failRepo,
					title: r.repo
				}, r.repo) : null, !r.ok && (0, react.createElement)("button", {
					className: Modal_module_css_default.failCopy,
					onClick: () => onCopy(formatFailureMessage(r.message))
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
					const k = classifyFailure(r.message);
					return (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failKindTitle }, t(`failKind_${k}`, k === "hostIncompatible" ? { version: /incompatible with dsh\s+([^\s:;,]+)/i.exec(r.message ?? "")?.[1] ?? "" } : void 0)), k === "hostIncompatible" ? null : (0, react.createElement)("div", { className: Modal_module_css_default.failReason }, t(`failReason_${k}`))]);
				})(), !r.ok && (() => {
					const kind = classifyFailure(r.message);
					const action = actionOfRecord(r);
					const actionWord = t(action === "uninstall" ? "actionUninstall" : action === "update" ? "actionUpdate" : "actionInstall");
					if (kind === "npmTooOld") {
						const v = npmTooLowVersion(r.message);
						return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t(v ? "failNpmTooLowV" : "failNpmTooLow", v ? { v } : void 0));
					}
					if (kind === "dshMissing") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failDshMissingHint"));
					if (kind === "gitMissing") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failGitMissingHint"));
					if (kind === "pnpmMissing") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmMissingHint"));
					if (kind === "npmMissing") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failNpmMissingHint"));
					if (kind === "buildToolchainMissing") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failBuildToolchainHint"));
					if (kind === "pnpmWorkspace") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmWorkspaceHint"));
					if (kind === "pnpmModulesMismatch") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmModulesMismatchHint"));
					if (kind === "pnpmStore") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmStoreHint"));
					if (kind === "pnpmPolicy") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t(pnpmPolicyHintOf(r.message), pnpmPolicyHintParams(r.message)));
					if (kind === "pnpmUnusedPatch") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmUnusedPatchHint"));
					if (kind === "profileState") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failProfileStateHint"));
					if (kind === "nodeEngine") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failNodeEngineHint"));
					if (kind === "pnpmMissingDep") {
						const pkg = missingRegistryPackageOf(r.message);
						return (0, react.createElement)("div", null, [pkg ? (0, react.createElement)("div", { className: Modal_module_css_default.failNetworkTarget }, t("failPnpmMissingDepTarget", { pkg })) : null, (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t(registryMissingHintOf(r.message)))]);
					}
					if (kind === "pluginMissingDep") {
						const pkg = missingRegistryPackageOf(r.message);
						return (0, react.createElement)("div", null, [
							pkg ? (0, react.createElement)("div", { className: Modal_module_css_default.failNetworkTarget }, t("failPluginMissingDepTarget", { pkg })) : null,
							(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPluginMissingDepHint")),
							r.repo && shownRepo ? (0, react.createElement)("a", {
								className: Modal_module_css_default.failBigIssue,
								href: pluginIssueUrl(shownRepo, r.message, env, r.command, r.attempts, action),
								target: "_blank",
								rel: "noopener noreferrer",
								title: t("failIssueHint")
							}, t("failIssueBig")) : null
						]);
					}
					if (kind === "hostIncompatible") {
						const version = /incompatible with dsh\s+([^\s:;,]+)/i.exec(r.message ?? "")?.[1] ?? "";
						return (0, react.createElement)("div", null, [
							(0, react.createElement)("div", { className: Modal_module_css_default.failReason }, t("failHostIncompatibleReason", { version })),
							(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failHostIncompatibleHint")),
							r.repo && shownRepo ? (0, react.createElement)("a", {
								className: Modal_module_css_default.failBigIssue,
								href: pluginIssueUrl(shownRepo, r.message, env, r.command, r.attempts, action),
								target: "_blank",
								rel: "noopener noreferrer",
								title: t("failIssueHint")
							}, t("failIssueBig")) : null
						]);
					}
					if (kind === "registryVersionStale") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failRegistryVersionStaleHint"));
					if (kind === "pnpmLinkedDirMissing") {
						const dir = missingLocalDirOf(r.message);
						return (0, react.createElement)("div", null, [dir ? (0, react.createElement)("div", { className: Modal_module_css_default.failNetworkTarget }, t("failLinkedDirTarget", { path: dir })) : null, (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failPnpmLinkedDirMissingHint"))]);
					}
					if (kind === "fileLocked") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failFileLockedHint"));
					if (kind === "accessDenied") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failAccessDeniedHint"));
					if (kind === "fsUnavailable") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failFsUnavailableHint"));
					if (kind === "originRejected") return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failOriginRejectedHint", { profile: env?.profile ?? "<profile>" }));
					if (kind === "profileExclusive") {
						const profile = exclusiveProfileOf(r.message);
						const ourBug = desktopCliFallbackOf(r.message);
						return (0, react.createElement)("div", null, [
							(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t(profile ? "failProfileExclusiveHint" : "failProfileExclusiveHintNoProfile", profile ? { profile } : void 0)),
							ourBug ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failDesktopCliFallbackHint")) : null,
							ourBug ? (0, react.createElement)("a", {
								className: Modal_module_css_default.failBigIssue,
								href: hubIssueUrl(shownRepo || r.repo, r.message, env, r.command, r.attempts, "triage", action),
								target: "_blank",
								rel: "noopener noreferrer",
								title: t("failHubIssueHint")
							}, t("failIssueBig")) : null
						]);
					}
					if (kind === "registryAuth") {
						const host = authRegistryHostOf(r.message);
						return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t(host ? "failRegistryAuthHint" : "failRegistryAuthHintNoHost", host ? { host } : void 0));
					}
					if (kind === "dshTooOld") {
						const info = dshTooOldInfoOf(r.message);
						return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failDshTooOldHint", info ?? {
							pkg: shownRepo || r.repo || "plugin",
							floor: "?",
							current: "?"
						}));
					}
					if (kind === "localEnv") return (0, react.createElement)("div", null, [
						(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failLocalEnvHint")),
						onRunDiagnostics ? (0, react.createElement)("button", {
							className: Modal_module_css_default.failDiagBtn,
							onClick: onRunDiagnostics
						}, t("failNetworkRunDiag")) : null,
						(0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failMisjudgeHint")), (0, react.createElement)("a", {
							className: Modal_module_css_default.failMisjudgeLink,
							href: hubIssueUrl(shownRepo || r.repo, r.message, env, r.command, r.attempts, "triage", action),
							target: "_blank",
							rel: "noopener noreferrer",
							title: t("failHubIssueHint")
						}, t("failMisjudgeLink"))])
					]);
					if (kind === "tlsTrust") return (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failTlsTrustHint")), onRunDiagnostics ? (0, react.createElement)("button", {
						className: Modal_module_css_default.failDiagBtn,
						onClick: onRunDiagnostics
					}, t("failNetworkRunDiag")) : null]);
					if (kind === "network") return (0, react.createElement)("div", null, [
						(() => {
							const target = unreachableTargetOf(r.message);
							return target ? (0, react.createElement)("div", { className: Modal_module_css_default.failNetworkTarget }, t("failNetworkTarget", { url: target })) : null;
						})(),
						(() => {
							const host = registryHostOf(r.message);
							return host ? (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failNetworkRegistryHint", { host })) : null;
						})(),
						(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failNetworkHint", { action: actionWord })),
						onRunDiagnostics ? (0, react.createElement)("button", {
							className: Modal_module_css_default.failDiagBtn,
							onClick: onRunDiagnostics
						}, t("failNetworkRunDiag")) : null
					]);
					if (kind === "pluginPrepare") return (0, react.createElement)("div", null, [
						(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, /\[packaging\]/i.test(r.message) ? t("failPackagingHint") : t("failPrepareHint")),
						r.repo && shownRepo ? (0, react.createElement)("a", {
							className: Modal_module_css_default.failBigIssue,
							href: pluginIssueUrl(shownRepo, r.message, env, r.command, r.attempts, action),
							target: "_blank",
							rel: "noopener noreferrer",
							title: t("failIssueHint")
						}, t("failIssueBig")) : null,
						r.repo && shownRepo ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failMisjudgeHint")), (0, react.createElement)("a", {
							className: Modal_module_css_default.failMisjudgeLink,
							href: hubIssueUrl(shownRepo, r.message, env, r.command, r.attempts, "misjudge", action),
							target: "_blank",
							rel: "noopener noreferrer",
							title: t("failHubIssueHint")
						}, t("failMisjudgeLink"))]) : null
					]);
					if (kind === "profileBundleMissing") {
						const info = unresolvedBundleOf(r.message);
						return (0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failProfileBundleMissingHint", {
							pkg: info?.pkg ?? "unknown",
							profile: env?.profile ?? "<profile>"
						}));
					}
					if (kind === "hubState") return (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failHubStateHint", { action: actionWord }))]);
					if (kind === "timeout") return (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failTimeoutHint"))]);
					if (kind === "profileLock") return (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failProfileLockHint", { action: actionWord }))]);
					if (kind === "hostCliSpawn") return (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failHostCliSpawnHint"))]);
					if (kind === "pnpmIgnoredBuild") return (0, react.createElement)("div", null, [
						(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failIgnoredBuild")),
						r.repo && shownRepo ? (0, react.createElement)("a", {
							className: Modal_module_css_default.failBigIssue,
							href: pluginIssueUrl(shownRepo, r.message, env, r.command, r.attempts, action),
							target: "_blank",
							rel: "noopener noreferrer",
							title: t("failIssueHint")
						}, t("failIssueBig")) : null,
						r.repo && shownRepo ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failMisjudgeHint")), (0, react.createElement)("a", {
							className: Modal_module_css_default.failMisjudgeLink,
							href: hubIssueUrl(shownRepo, r.message, env, r.command, r.attempts, "misjudge", action),
							target: "_blank",
							rel: "noopener noreferrer",
							title: t("failHubIssueHint")
						}, t("failMisjudgeLink"))]) : null
					]);
					return (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, t("failUnclassifiedHint", { action: actionWord })), (0, react.createElement)("a", {
						className: Modal_module_css_default.failBigIssue,
						href: hubIssueUrl(shownRepo || r.repo, r.message, env, r.command, r.attempts, "triage", action),
						target: "_blank",
						rel: "noopener noreferrer",
						title: t("failHubIssueHint")
					}, t("failHubIssueBig"))]);
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
		* 板块头部：品牌标题行（H1 + 官网入口按钮）+ 副标题，其后是宣传目录统计的紫色广告条。
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
		* 分类 Tab：先是「全部」chip，其后每个目录分类一个 chip。「全部」chip 带插件总数，
		* 各分类 chip 不带计数以保持宽度一致。
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
		* 市场列表上方的工具栏：
		* 第一行 —— 整行宽的搜索框；
		* 第二行 —— 左侧结果计数，右侧排序分段控件
		* （与已安装视图一致：点同一排序切换正/倒序，点新排序用其默认方向；
		*  激活按钮显示当前方向的上/下箭头）。
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
			"installBtnInstalled": "_3XaZHa_installBtnInstalled",
			"actions": "_3XaZHa_actions",
			"uninstallBtn": "_3XaZHa_uninstallBtn",
			"footer": "_3XaZHa_footer",
			"state": "_3XaZHa_state",
			"body": "_3XaZHa_body",
			"stateTitle": "_3XaZHa_stateTitle",
			"stateDesc": "_3XaZHa_stateDesc",
			"stats": "_3XaZHa_stats",
			"verified": "_3XaZHa_verified",
			"versionBadge": "_3XaZHa_versionBadge",
			"list": "_3XaZHa_list",
			"updateBadge": "_3XaZHa_updateBadge",
			"cardSide": "_3XaZHa_cardSide",
			"date": "_3XaZHa_date",
			"installBtnUpdate": "_3XaZHa_installBtnUpdate",
			"cardMain": "_3XaZHa_cardMain",
			"installBtnCopied": "_3XaZHa_installBtnCopied",
			"topics": "_3XaZHa_topics",
			"footLink": "_3XaZHa_footLink",
			"installBtn": "_3XaZHa_installBtn",
			"star": "_3XaZHa_star",
			"retryBtn": "_3XaZHa_retryBtn",
			"cardTitle": "_3XaZHa_cardTitle",
			"fork": "_3XaZHa_fork",
			"detailBtn": "_3XaZHa_detailBtn",
			"topic": "_3XaZHa_topic",
			"card": "_3XaZHa_card",
			"cardHead": "_3XaZHa_cardHead",
			"moreSentinel": "_3XaZHa_moreSentinel",
			"desc": "_3XaZHa_desc",
			"categoryBadge": "_3XaZHa_categoryBadge",
			"diagBtn": "_3XaZHa_diagBtn",
			"stateActions": "_3XaZHa_stateActions"
		};
		//#endregion
		//#region src/client/hooks/useIncrementalList.ts
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* 增量列表：只渲染（可能很大的）结果集的第一批，末尾哨兵滚入视口时就追加下一批，
		* 让插件市场绝不一次性挂载成千上万张卡片。
		* items 引用即列表身份 —— 分类/搜索/排序变化会产出新数组，窗口随之重置回第一批。
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
		* 目录列表里的单张插件卡片：名称/分类/verified 徽标、描述 + 标签、Star/Fork/日期
		* 统计，以及详情/安装/卸载动作。
		*/
		function PluginCard({ plugin: p, copied, installedName, installedVersion, hasUpdate, updatePendingUntil, t, langKey, langPath, onInstall, onUninstall }) {
			const repo = p.source?.repo ?? "";
			const isCopied = copied === repo;
			const isInstalled = installedName(p) !== null;
			const update = hasUpdate(p);
			const pendingUntil = isInstalled && !update ? updatePendingUntil(p) : null;
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
			}, t("updateAvailable")) : null, pendingUntil !== null ? (0, react.createElement)("span", {
				className: List_module_css_default.updateBadge,
				title: t("updatePendingHint")
			}, t("updatePending", { time: clockTime(pendingUntil) })) : null, p.category ? (0, react.createElement)("span", { className: List_module_css_default.categoryBadge }, categoryLabel(CATEGORY_LABELS, p.category, langKey)) : null, p.compatibility?.status === "verified" ? (0, react.createElement)("span", { className: List_module_css_default.verified }, t("verified")) : null), p.description ? (0, react.createElement)("p", { className: List_module_css_default.desc }, p.description) : null, (p.topics?.length ?? 0) > 0 ? (0, react.createElement)("div", { className: List_module_css_default.topics }, p.topics.slice(0, 3).map((topic) => (0, react.createElement)("span", {
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
		* 目录列表：承载加载/失败/空三态、插件卡片与计数页脚的滚动容器。分类或安装状态
		* 筛选变化时重置滚动位置，避免替换后的内容被误当成「没变化」。
		*/
		function CatalogList({ plugins, failed, visible, total, t, langPath, reload, forceReload, category, copied, installedName, installedVersion, hasUpdate, updatePendingUntil, langKey, onInstall, onUninstall, hasProxy, onOpenDiagnostics }) {
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
				className: List_module_css_default.retryBtn,
				onClick: () => forceReload(),
				title: t("forceReloadHint")
			}, t("forceReload")), (0, react.createElement)("button", {
				className: List_module_css_default.diagBtn,
				onClick: onOpenDiagnostics
			}, t("failNetworkRunDiag")))), plugins !== null && !failed && visible.length === 0 && (0, react.createElement)("div", { className: List_module_css_default.state }, (0, react.createElement)("div", { className: List_module_css_default.stateTitle }, t("noResult")), (0, react.createElement)("div", { className: List_module_css_default.stateDesc }, t("noResultDesc"))), plugins !== null && !failed && shown.map((p) => (0, react.createElement)(PluginCard, {
				key: p.ownerSlug ? `${p.ownerSlug}/${p.slug}` : p.slug,
				plugin: p,
				copied,
				installedName,
				installedVersion,
				hasUpdate,
				updatePendingUntil,
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
		* 市场视图：目录的浏览体验 —— 分类 Tab、搜索/排序/安装状态控件与插件列表。自身不持有状态，
		* 只把目录状态（query/sort/filter/category）接到小型展示组件上，让 PluginHubSection 不掺视图细节。
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
				forceReload: catalog.forceReload,
				category: catalog.category,
				copied,
				installedName: catalog.installedName,
				installedVersion: catalog.installedVersion,
				hasUpdate: catalog.hasUpdate,
				updatePendingUntil: catalog.updatePendingUntil,
				langKey,
				onInstall,
				onUninstall,
				hasProxy,
				onOpenDiagnostics
			}));
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/SectionTabs.module.css.mjs
		const css$8 = "._7tvizq_root{border-bottom:1px solid var(--hub-border-1);flex-shrink:0;align-items:stretch;gap:28px;padding:0 2px;display:flex;container-type:inline-size}._7tvizq_tab,._7tvizq_tabActive{white-space:nowrap;cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;flex-shrink:0;align-items:center;gap:7px;height:38px;padding:0 4px;font-size:14px;line-height:38px;transition:color .12s;display:inline-flex;position:relative}._7tvizq_tab{color:var(--hub-text-secondary)}._7tvizq_tab:hover{color:var(--hub-text-primary)}._7tvizq_tabActive{color:var(--hub-text-primary);font-weight:600}@container (width<=440px){._7tvizq_tabLabel{display:none}._7tvizq_tab,._7tvizq_tabActive{padding:0 2px}}._7tvizq_tabIcon{flex-shrink:0;align-items:center;line-height:1;display:inline-flex}._7tvizq_tabActive:after{content:\"\";background:var(--hub-brand);border-radius:1px;height:2px;position:absolute;bottom:-1px;left:0;right:0}._7tvizq_tabCount,._7tvizq_tabCountActive{text-align:center;border-radius:999px;min-width:18px;padding:0 6px;font-size:11px;line-height:16px}._7tvizq_tabCount{color:var(--hub-text-tertiary);background:var(--hub-bg-btn)}._7tvizq_tabActive ._7tvizq_tabCountActive{color:var(--hub-text-on-fill);background:var(--hub-btn-fill)}._7tvizq_noticeBtn{box-sizing:border-box;height:26px;color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:1px solid #0000;border-radius:6px;flex-shrink:0;align-self:center;align-items:center;gap:5px;margin-left:auto;padding:0 8px;font-size:12px;line-height:24px;transition:color .12s,background .12s;display:inline-flex;position:relative}._7tvizq_noticeBtn:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover);border-color:var(--hub-border-2)}._7tvizq_noticeIcon{align-items:center;line-height:1;display:inline-flex}._7tvizq_noticeCount{text-align:center;color:#fff;background:var(--hub-danger);border-radius:999px;min-width:17px;height:17px;padding:0 5px;font-size:11px;font-weight:600;line-height:17px;box-shadow:0 1px 3px #d1242f59}";
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
			"tabCount": "_7tvizq_tabCount",
			"tabCountActive": "_7tvizq_tabCountActive",
			"tabIcon": "_7tvizq_tabIcon",
			"noticeIcon": "_7tvizq_noticeIcon",
			"tab": "_7tvizq_tab",
			"root": "_7tvizq_root",
			"tabLabel": "_7tvizq_tabLabel",
			"noticeBtn": "_7tvizq_noticeBtn",
			"noticeCount": "_7tvizq_noticeCount",
			"tabActive": "_7tvizq_tabActive"
		};
		//#endregion
		//#region src/client/components/layout/SectionTabs.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* 一级导航：紧凑分段控件，在四个顶层板块间切换 —— 市场（浏览）、已安装（管理）、
		* 自定义（手动命令安装）与设置（网络源与偏好）。与分类 chip 视觉上区分开，
		* 让层级清晰：板块 → 分类 → 插件。
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
				"aria-label": t(labelKey),
				className: view === id ? SectionTabs_module_css_default.tabActive : SectionTabs_module_css_default.tab,
				onClick: () => setView(id)
			}, (0, react.createElement)("span", { className: SectionTabs_module_css_default.tabIcon }, (0, react.createElement)(Icon)), (0, react.createElement)("span", { className: SectionTabs_module_css_default.tabLabel }, t(labelKey)), id === "installed" && installedCount > 0 ? (0, react.createElement)("span", { className: view === id ? SectionTabs_module_css_default.tabCountActive : SectionTabs_module_css_default.tabCount }, installedCount) : null)), (0, react.createElement)("button", {
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
			"rowMeta": "_1nXeGW_rowMeta",
			"versionBadge": "_1nXeGW_versionBadge",
			"searchInput": "_1nXeGW_searchInput",
			"segBtnActive": "_1nXeGW_segBtnActive",
			"rowRestart": "_1nXeGW_rowRestart",
			"rowDetail": "_1nXeGW_rowDetail",
			"toolbar": "_1nXeGW_toolbar",
			"empty": "_1nXeGW_empty",
			"rowActions": "_1nXeGW_rowActions",
			"rowTitleLine": "_1nXeGW_rowTitleLine",
			"rowDesc": "_1nXeGW_rowDesc",
			"statusDot": "_1nXeGW_statusDot",
			"list": "_1nXeGW_list",
			"exampleRow": "_1nXeGW_exampleRow",
			"rowUninstall": "_1nXeGW_rowUninstall",
			"rowRepo": "_1nXeGW_rowRepo",
			"rowCategory": "_1nXeGW_rowCategory",
			"rowMain": "_1nXeGW_rowMain",
			"exampleBadge": "_1nXeGW_exampleBadge",
			"statusPending": "_1nXeGW_statusPending",
			"rowSourceTag": "_1nXeGW_rowSourceTag",
			"updateBadge": "_1nXeGW_updateBadge",
			"rowTitle": "_1nXeGW_rowTitle",
			"searchWrap": "_1nXeGW_searchWrap",
			"rowUpdate": "_1nXeGW_rowUpdate",
			"emptyTitle": "_1nXeGW_emptyTitle",
			"statusInactive": "_1nXeGW_statusInactive",
			"segRow": "_1nXeGW_segRow",
			"segLabel": "_1nXeGW_segLabel",
			"emptyDesc": "_1nXeGW_emptyDesc",
			"root": "_1nXeGW_root",
			"segGroup": "_1nXeGW_segGroup",
			"segBtn": "_1nXeGW_segBtn",
			"row": "_1nXeGW_row",
			"rowSourceTagHub": "_1nXeGW_rowSourceTagHub",
			"rowSourceTagManual": "_1nXeGW_rowSourceTagManual"
		};
		//#endregion
		//#region src/client/components/views/InstalledView.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* 已安装视图：管理安装进当前 profile 的插件。沿用主流扩展管理器模式（VSCode 已安装 tab）——
		* 可搜索、可排序的已安装清单，混排目录插件（完整元数据）与命令行自定义安装（目录之外，
		* 只有运行时信息，打「自定义」徽标）。工具栏含搜索框与两组分段单选：来源筛选
		* （全部/目录/自定义）与排序（名称/最近安装/Star/Fork）。每行带重启（待重启时）、更新与
		* 卸载动作，并打开含完整安装元数据的详情弹窗。
		*
		* 纯展示组件：只持有本地搜索/排序状态；InstalledItem 模型来自目录 hook，动作经回调上抛。
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
		function InstalledRow({ item, t, langKey, canReveal, revealLabel, pendingRestart, onOpenDetail, onReveal, onUpdate, onUninstall, onRestart }) {
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
				className: item.loaded ? InstalledView_module_css_default.statusDot : item.dshCapable && pendingRestart ? `${InstalledView_module_css_default.statusDot} ${InstalledView_module_css_default.statusPending}` : `${InstalledView_module_css_default.statusDot} ${InstalledView_module_css_default.statusInactive}`,
				title: item.loaded ? t("statusRunning") : item.dshCapable && pendingRestart ? t("statusPending") : item.dshCapable ? t("statusInactive") : t("exampleHint"),
				"aria-label": item.loaded ? t("statusRunning") : item.dshCapable && pendingRestart ? t("statusPending") : item.dshCapable ? t("statusInactive") : t("exampleHint")
			}), (0, react.createElement)("div", { className: InstalledView_module_css_default.rowMain }, (0, react.createElement)("span", { className: InstalledView_module_css_default.rowTitle }, name), item.installedVersion ? (0, react.createElement)("span", {
				className: InstalledView_module_css_default.versionBadge,
				title: t("installedVersionLabel")
			}, item.installedVersion) : null, item.hasUpdate ? (0, react.createElement)("span", {
				className: InstalledView_module_css_default.updateBadge,
				title: t("updateAvailableHint")
			}, t("updateAvailable")) : item.pendingUntil != null ? (0, react.createElement)("span", {
				className: InstalledView_module_css_default.updateBadge,
				title: t("updatePendingHint")
			}, t("updatePending", { time: clockTime(item.pendingUntil) })) : null), (0, react.createElement)("span", {
				className: isCustom ? `${InstalledView_module_css_default.rowSourceTag} ${InstalledView_module_css_default.rowSourceTagManual}` : `${InstalledView_module_css_default.rowSourceTag} ${InstalledView_module_css_default.rowSourceTagHub}`,
				title: isCustom ? t("manualInstallHint") : t("hubInstallHint")
			}, isCustom ? t("manualInstall") : t("hubInstall")), (0, react.createElement)("div", { className: InstalledView_module_css_default.rowActions }, !item.loaded && item.dshCapable && pendingRestart ? (0, react.createElement)("button", {
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
		function RowList({ items, t, langKey, canReveal, revealLabel, pendingRestarts, onOpenDetail, onReveal, onUpdate, onUninstall, onRestart }) {
			const pendingSet = new Set(pendingRestarts.map((r) => r.toLowerCase()));
			return (0, react.createElement)("ul", { className: InstalledView_module_css_default.list }, items.map((item) => (0, react.createElement)(InstalledRow, {
				key: item.name,
				item,
				t,
				langKey,
				canReveal,
				revealLabel,
				pendingRestart: item.repo !== null && pendingSet.has(item.repo.toLowerCase()),
				onOpenDetail,
				onReveal,
				onUpdate,
				onUninstall,
				onRestart
			})));
		}
		function InstalledView({ items, t, langKey, platform, pendingRestarts, onOpenDetail, onReveal, onUpdate, onUninstall, onRestart }) {
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
				pendingRestarts,
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
		const css$6 = ".zISxCG_root{flex-direction:column;gap:10px;min-width:0;max-width:560px;display:flex}.zISxCG_desc{color:var(--hub-text-tertiary);margin:0;font-size:12px;line-height:18px}.zISxCG_installCards{flex-direction:column;flex-shrink:0;gap:10px;min-width:0;display:flex}.zISxCG_installCard{background:var(--hub-bg-1);border:1px solid var(--hub-border-1);border-radius:8px;flex-direction:column;gap:8px;min-width:0;padding:10px 12px;display:flex}.zISxCG_installCardHead{align-items:center;min-width:0;display:flex}.zISxCG_installLabel{color:var(--hub-text-primary);font-size:12px;font-weight:600;line-height:18px}.zISxCG_installHelpBtn{width:18px;height:18px;color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:1px solid #0000;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;margin-left:6px;padding:0;transition:color .12s,background .12s,border-color .12s;display:inline-flex}.zISxCG_installHelpBtn:hover{color:var(--hub-brand);background:var(--hub-brand-tint);border-color:var(--hub-brand-border-soft)}.zISxCG_installExample{color:var(--hub-text-tertiary);white-space:nowrap;text-overflow:ellipsis;min-width:0;font-size:11px;line-height:16px;overflow:hidden}.zISxCG_installRow{align-items:center;gap:8px;min-width:0;display:flex}.zISxCG_installInput{min-width:0;height:28px;color:var(--hub-text-primary);border:1px solid var(--hub-border-2);background:0 0;border-radius:6px;outline:none;flex:auto;padding:0 9px;font-size:12px;line-height:26px;transition:border-color .12s}.zISxCG_installInput::placeholder{color:var(--hub-text-tertiary)}.zISxCG_installInput:focus{border-color:var(--hub-brand)}.zISxCG_installInputError,.zISxCG_installInputError:focus{border-color:var(--hub-danger-text)}.zISxCG_installBtn{color:#fff;background:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;flex-shrink:0;padding:5px 14px;font-family:inherit;font-size:12px;font-weight:500;line-height:18px;transition:background .12s,opacity .12s}.zISxCG_installBtn:hover{background:var(--hub-brand-hover)}.zISxCG_installBtn:disabled{opacity:.45;cursor:default}.zISxCG_installCardDisabled{opacity:.8}.zISxCG_channelOff{min-width:0;color:var(--hub-warn);background:var(--hub-warn-tint);border:1px solid var(--hub-warn-border);border-radius:6px;justify-content:space-between;align-items:center;gap:8px;padding:6px 9px;font-size:12px;line-height:16px;display:flex}.zISxCG_channelOffText{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.zISxCG_channelOffBtn{color:var(--hub-warn-strong);border:1px solid var(--hub-warn-border);cursor:pointer;white-space:nowrap;background:0 0;border-radius:6px;flex-shrink:0;padding:3px 10px;font-family:inherit;font-size:12px;font-weight:500;line-height:18px;transition:background .12s,color .12s}.zISxCG_channelOffBtn:hover{background:var(--hub-warn-tint);color:var(--hub-warn)}.zISxCG_installError{color:var(--hub-danger-text);background:var(--hub-danger-tint);border:1px solid var(--hub-danger-border);border-radius:6px;padding:5px 8px;font-size:12px;line-height:16px}.zISxCG_helpBody{flex-direction:column;gap:7px;padding:4px 2px;display:flex}.zISxCG_helpLine{align-items:baseline;gap:12px;min-width:0;font-size:12px;line-height:20px;display:flex}.zISxCG_helpCmd{color:var(--hub-text-primary);white-space:nowrap;flex-shrink:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}.zISxCG_helpNote{min-width:0;color:var(--hub-text-tertiary);font-size:11px}";
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
			"installHelpBtn": "zISxCG_installHelpBtn",
			"installCardDisabled": "zISxCG_installCardDisabled",
			"channelOffText": "zISxCG_channelOffText",
			"installCard": "zISxCG_installCard",
			"helpBody": "zISxCG_helpBody",
			"helpCmd": "zISxCG_helpCmd",
			"helpNote": "zISxCG_helpNote",
			"channelOff": "zISxCG_channelOff",
			"installBtn": "zISxCG_installBtn",
			"installCards": "zISxCG_installCards",
			"root": "zISxCG_root",
			"helpLine": "zISxCG_helpLine",
			"channelOffBtn": "zISxCG_channelOffBtn",
			"desc": "zISxCG_desc",
			"installLabel": "zISxCG_installLabel",
			"installExample": "zISxCG_installExample",
			"installInput": "zISxCG_installInput",
			"installCardHead": "zISxCG_installCardHead",
			"installInputError": "zISxCG_installInputError",
			"installRow": "zISxCG_installRow",
			"installError": "zISxCG_installError"
		};
		//#endregion
		//#region src/client/components/views/CustomInstallView.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* 自定义安装视图：独立一级板块，用于手动安装目录之外的 npm 包。安装卡片接受裸包名或完整的
		* npm/pnpm 安装命令（含官方全局 `npm install -g`），输入框上方带示例并自带格式校验。
		* 装完的插件出现在「已安装」视图，标记为自定义安装。
		*
		* 纯展示组件：只持有本地输入/错误状态；真正的安装（custom 源，受安全开关控制）经
		* onInstallCustom 上抛。
		*/
		/** npm 包名（含 @scope/pkg） */
		const NPM_PACKAGE_RE = /^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/;
		/** npm 全局安装命令（官方 README 格式，如 `npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui`）——
		* 提取 -g 之后的包列表；任一包名非法返回 null（交给格式错误提示）。与 server 端 globalNpmPackagesOf 口径一致。 */
		const NPM_GLOBAL_CMD_RE = /^npm\s+(?:install|i)\s+(?:-g|--global)\s+(.+)$/i;
		/** 常规 npm/pnpm 安装命令（装进当前 profile，如 `npm install lodash`、`pnpm add @scope/pkg`）——
		* 提取命令后的包列表；包列表在 splitPackages 里逐个校验。 */
		const NPM_INSTALL_CMD_RE = /^(?:npm\s+(?:install|i)|pnpm\s+(?:add|i|install))\s+(.+)$/i;
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
		/** 卡片标题旁的「帮助」弹窗：该卡片的标题与格式清单语言包 key。 */
		const HELP_CARDS = { npm: {
			titleKey: "npmInstallLabel",
			contentKey: "npmInstallHelp"
		} };
		function CustomInstallView({ t, onInstallCustom, enableNpm, onOpenSettings }) {
			/** 自定义安装：NPM 包输入与格式错误（'' = 无错误） */
			const [npmQuery, setNpmQuery] = (0, react.useState)("");
			const [npmError, setNpmError] = (0, react.useState)("");
			/** 卡片标题旁「帮助」弹窗：null = 未打开；'npm' = 打开该卡片的格式清单 */
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
			"settingControl": "_506LLG_settingControl",
			"proxyControl": "_506LLG_proxyControl",
			"proxyHint": "_506LLG_proxyHint",
			"pageTitle": "_506LLG_pageTitle",
			"content": "_506LLG_content",
			"textInput": "_506LLG_textInput",
			"proxyHintFail": "_506LLG_proxyHintFail",
			"navIcon": "_506LLG_navIcon",
			"navItem": "_506LLG_navItem",
			"settingDesc": "_506LLG_settingDesc",
			"card": "_506LLG_card",
			"resetBtn": "_506LLG_resetBtn",
			"navItemActive": "_506LLG_navItemActive",
			"settingControlStack": "_506LLG_settingControlStack",
			"proxyHintOk": "_506LLG_proxyHintOk",
			"settingRow": "_506LLG_settingRow",
			"sidebar": "_506LLG_sidebar",
			"pageHeader": "_506LLG_pageHeader",
			"settingTitle": "_506LLG_settingTitle",
			"settingLabel": "_506LLG_settingLabel",
			"settingRowStack": "_506LLG_settingRowStack",
			"root": "_506LLG_root",
			"controlDropdown": "_506LLG_controlDropdown",
			"pageDesc": "_506LLG_pageDesc"
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
			"dropdownFill": "B_Gxsq_dropdownFill",
			"dropdownArrowOpen": "B_Gxsq_dropdownArrowOpen",
			"dropdownPanel": "B_Gxsq_dropdownPanel",
			"dropdownArrow": "B_Gxsq_dropdownArrow",
			"dropdownItem": "B_Gxsq_dropdownItem",
			"dropdownItemActive": "B_Gxsq_dropdownItemActive",
			"dropdownItemLabel": "B_Gxsq_dropdownItemLabel",
			"dropdownLabel": "B_Gxsq_dropdownLabel",
			"dropdown": "B_Gxsq_dropdown",
			"dropdownBtn": "B_Gxsq_dropdownBtn",
			"dropdownCount": "B_Gxsq_dropdownCount",
			"dropdownCountActive": "B_Gxsq_dropdownCountActive"
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
			"toggle": "k-cD4G_toggle",
			"knob": "k-cD4G_knob",
			"toggleOn": "k-cD4G_toggleOn"
		};
		//#endregion
		//#region src/client/components/ui/Toggle.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* 设置行用的紧凑开关。基于原生 button，可键盘聚焦并通过 aria-checked 播报状态；
		* 样式由 --hub-* 变量驱动（开 = 品牌填充，关 = 中性轨道）。
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
		* 按钮式下拉框（替代原生 <select>）。
		*
		* 触发器是紧凑的工具栏按钮 —— 细边框 + 淡灰填充 + 当前值 + 箭头 —— 与其它工具栏按钮
		* 并排自然，只占一格横向空间。点击外部或按 Esc 关闭面板；选项有 hover 填充、
		* 激活项为品牌高亮，全部由 --hub-* 变量驱动。
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
			"head": "k9eRya_head",
			"envLabel": "k9eRya_envLabel",
			"summary": "k9eRya_summary",
			"envDesc": "k9eRya_envDesc",
			"summaryOk": "k9eRya_summaryOk",
			"headHint": "k9eRya_headHint",
			"panel": "k9eRya_panel",
			"name": "k9eRya_name",
			"envTitle": "k9eRya_envTitle",
			"runBtn": "k9eRya_runBtn",
			"display": "k9eRya_display",
			"badgeOk": "k9eRya_badgeOk",
			"summaryFail": "k9eRya_summaryFail",
			"badgeFail": "k9eRya_badgeFail",
			"badge": "k9eRya_badge",
			"meta": "k9eRya_meta",
			"envRow": "k9eRya_envRow",
			"envCopyBtn": "k9eRya_envCopyBtn",
			"row": "k9eRya_row",
			"badgeIdle": "k9eRya_badgeIdle",
			"badgeRunning": "k9eRya_badgeRunning",
			"diagPulse": "k9eRya_diagPulse",
			"summaryRunning": "k9eRya_summaryRunning"
		};
		//#endregion
		//#region src/client/components/views/DiagnosticsView.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* 系统诊断列表：每个连通性通道（npm registry / GitHub API / 目录站点）一行，各带实时
		* 状态徽标 —— 200 OK 绿、不可达红、探测中显示「检测中…」。页面打开时自动跑一轮；
		* 每行都是按钮，点击只重测该通道，因此点击总有可见反馈（行脉冲 → 徽标翻转 → 延迟刷新）。
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
					statusCode: null,
					reason: null
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
										display: typeof ev.display === "string" ? ev.display : "",
										reason: typeof ev.reason === "string" ? ev.reason : null
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
				const revokeBlocked = r.status === "fail" && r.reason === "tlsRevocation";
				const badge = r.status === "running" ? (0, react.createElement)("span", { className: `${DiagnosticsView_module_css_default.badge} ${DiagnosticsView_module_css_default.badgeRunning}` }, t("diagChecking")) : r.status === "ok" ? (0, react.createElement)("span", { className: `${DiagnosticsView_module_css_default.badge} ${DiagnosticsView_module_css_default.badgeOk}` }, r.statusCode !== null ? `HTTP ${r.statusCode} ${t("diagOk")}` : t("diagOk")) : r.status === "fail" ? (0, react.createElement)("span", { className: `${DiagnosticsView_module_css_default.badge} ${DiagnosticsView_module_css_default.badgeFail}` }, revokeBlocked ? t("diagFailRevocation") : t("settingsDiagFail")) : (0, react.createElement)("span", { className: `${DiagnosticsView_module_css_default.badge} ${DiagnosticsView_module_css_default.badgeIdle}` }, t("diagIdle"));
				return (0, react.createElement)("button", {
					key: r.key,
					type: "button",
					className: DiagnosticsView_module_css_default.row,
					disabled: r.status === "running",
					onClick: () => run(r.key),
					title: revokeBlocked ? t("diagFailRevocationHint") : t("diagRecheck")
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
			"catSettings": "_3j77BW_catSettings",
			"catDiagnostics": "_3j77BW_catDiagnostics",
			"catSystem": "_3j77BW_catSystem",
			"catBadge": "_3j77BW_catBadge",
			"badge": "_3j77BW_badge",
			"logList": "_3j77BW_logList",
			"filterBar": "_3j77BW_filterBar",
			"pathText": "_3j77BW_pathText",
			"pathDialogHint": "_3j77BW_pathDialogHint",
			"head": "_3j77BW_head",
			"footActions": "_3j77BW_footActions",
			"moreEnd": "_3j77BW_moreEnd",
			"btn": "_3j77BW_btn",
			"list": "_3j77BW_list",
			"pathDialogReset": "_3j77BW_pathDialogReset",
			"headHint": "_3j77BW_headHint",
			"pathDialogRow": "_3j77BW_pathDialogRow",
			"filterChipActive": "_3j77BW_filterChipActive",
			"event": "_3j77BW_event",
			"pathDialog": "_3j77BW_pathDialog",
			"more": "_3j77BW_more",
			"footCount": "_3j77BW_footCount",
			"badgeError": "_3j77BW_badgeError",
			"badgeInfo": "_3j77BW_badgeInfo",
			"badgeDebug": "_3j77BW_badgeDebug",
			"time": "_3j77BW_time",
			"filterChip": "_3j77BW_filterChip",
			"message": "_3j77BW_message",
			"panel": "_3j77BW_panel",
			"pathDialogDesc": "_3j77BW_pathDialogDesc",
			"linkBtn": "_3j77BW_linkBtn",
			"pathDialogFoot": "_3j77BW_pathDialogFoot",
			"pathDraft": "_3j77BW_pathDraft",
			"clearBtn": "_3j77BW_clearBtn",
			"search": "_3j77BW_search",
			"headActions": "_3j77BW_headActions",
			"badgeSuccess": "_3j77BW_badgeSuccess",
			"badgeWarn": "_3j77BW_badgeWarn",
			"actions": "_3j77BW_actions",
			"catUpdate": "_3j77BW_catUpdate",
			"footFail": "_3j77BW_footFail",
			"catUninstall": "_3j77BW_catUninstall",
			"entry": "_3j77BW_entry",
			"previewRow": "_3j77BW_previewRow",
			"pathLabel": "_3j77BW_pathLabel",
			"searchInput": "_3j77BW_searchInput",
			"pathRow": "_3j77BW_pathRow",
			"catInstall": "_3j77BW_catInstall",
			"empty": "_3j77BW_empty",
			"footPath": "_3j77BW_footPath",
			"foot": "_3j77BW_foot"
		};
		//#endregion
		//#region src/client/components/modals/LogsModal.tsx
		/**
		* DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
		* Website: https://dsh-plugin.org
		* GitHub: https://github.com/dshplugin/dsh-plugin-hub
		*
		* 内置日志查看器弹窗：无需外部软件 —— 应用自己开窗，从服务端直接分页加载本地系统日志
		* （JSONL，位于 ~/.dsh/profiles/<profile>/hub.log）。
		*
		* 每行双重归类：功能域（安装/卸载/更新/诊断/设置/系统）与严重级别（debug/info/success/
		* warn/error）。两轴筛选可只盯某类，比如只看安装错误 —— 便于定位安装（或卸载）中真正
		* 卡住的那一步；搜索按事件码或消息缩小范围。
		*
		* 服务端分页：GET /dsh-plugin-hub/logs?offset=&limit=&category=&level=&query=
		* → { entries, total, hasMore, path }。底部展示日志真实路径并可在系统文件管理器中定位。
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
		* 设置视图：桌面设置式导航 —— 固定左侧栏列出各分组（图标 + 名称，点击切换），
		* 右侧面板展示当前分组的设置行。新增设置只加行，新增区域只加一条侧栏项。
		*
		* 各分组对应本地服务端实际强制的行为：
		*   更新与源 —— 启动检查更新 / npm 镜像 / HTTP 代理（都接进安装命令链路）
		*   安全与信任 —— 受限的自定义安装（服务端 403 门禁）
		*   诊断 —— 实时连通性探测 + 环境快照
		*   日志 —— 系统日志查看器 + 存放位置
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
			const [proxyProbeReason, setProxyProbeReason] = (0, react.useState)(null);
			const proxyProbeTimer = (0, react.useRef)(null);
			const proxyProbeSeq = (0, react.useRef)(0);
			(0, react.useEffect)(() => () => {
				if (proxyProbeTimer.current !== null) window.clearTimeout(proxyProbeTimer.current);
				proxyProbeSeq.current += 1;
			}, []);
			(0, react.useEffect)(() => {
				if (settings.proxy === "") {
					setProxyProbe("idle");
					setProxyProbeReason(null);
				}
			}, [settings.proxy]);
			const probeProxyNow = (value) => {
				const v = value.trim();
				if (v === "") {
					setProxyProbe("idle");
					setProxyProbeReason(null);
					return;
				}
				const seq = ++proxyProbeSeq.current;
				setProxyProbe("checking");
				setProxyProbeReason(null);
				fetch("/dsh-plugin-hub/proxy-check", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ proxy: v }),
					cache: "no-store"
				}).then((res) => res.json()).then((data) => {
					if (seq !== proxyProbeSeq.current) return;
					setProxyProbe(data.ok ? "ok" : "fail");
					setProxyProbeReason(typeof data.reason === "string" ? data.reason : null);
				}).catch(() => {
					if (seq !== proxyProbeSeq.current) return;
					setProxyProbe("fail");
					setProxyProbeReason(null);
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
				title: t("settingsRegistryFallback"),
				desc: t("settingsRegistryFallbackDesc"),
				children: (0, react.createElement)(Toggle, {
					checked: settings.registryFallback,
					onChange: (v) => update({ registryFallback: v }),
					title: t("settingsRegistryFallback")
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
				}), proxyProbe === "checking" ? (0, react.createElement)("div", { className: SettingsView_module_css_default.proxyHint }, t("proxyCheckChecking")) : proxyProbe === "ok" ? (0, react.createElement)("div", { className: `${SettingsView_module_css_default.proxyHint} ${SettingsView_module_css_default.proxyHintOk}` }, t("proxyCheckOk")) : proxyProbe === "fail" ? (0, react.createElement)("div", { className: `${SettingsView_module_css_default.proxyHint} ${SettingsView_module_css_default.proxyHintFail}` }, proxyProbeReason === "tlsRevocation" ? t("proxyCheckRevocation") : t("proxyCheckFail")) : null)
			}));
			const securityCard = (0, react.createElement)("div", { className: SettingsView_module_css_default.card }, (0, react.createElement)(SettingRow, {
				title: t("settingsEnableNpm"),
				desc: t("settingsEnableNpmDesc"),
				children: (0, react.createElement)(Toggle, {
					checked: settings.enableNpmInstall,
					onChange: (v) => update({ enableNpmInstall: v }),
					title: t("settingsEnableNpm")
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
		* 插件中心板块：把目录数据管道、后台任务队列与反馈状态接在一起。数据/队列逻辑在 hooks/，
		* 渲染交给本目录下的小型展示组件；本文件托管各弹窗/Toast 与板块级复制动作。
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
			/** Hub 自我更新指定的精确版本：连续发版时提示的是「已过供应链门禁」的旧一版，
			*  安装必须钉在该版本上，否则又会被 @latest 带回门禁内的最新版。 */
			const [confirmPinVersion, setConfirmPinVersion] = (0, react.useState)(null);
			/** 命令行安装确认弹窗：记录待安装的裸目标（npm 包名）——
			*  与应用商店同一套确认/进度/结果弹窗，提供时 plugin 传 null 走 customTarget 模式 */
			const [confirmCustomTarget, setConfirmCustomTarget] = (0, react.useState)(null);
			/** 自定义安装入口渠道（NPM 包卡片）：随确认弹窗记录，提交时上报服务端，
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
			/** 结果视图是否给「立即重启」：服务端任务终态带出。仅刷新解决不了的兜底场景
			*  （热挂载失败 / 非 dsh 插件 / 更新）为 true；其余（热挂载成功、卸载已即时停用）为 false，
			*  结果视图只给「完成」，关闭时自动刷新页面生效 */
			const [installNeedsRestart, setInstallNeedsRestart] = (0, react.useState)(false);
			const [uninstallNeedsRestart, setUninstallNeedsRestart] = (0, react.useState)(false);
			/** 结果视图是否显示「关闭后自动刷新」说明：插件已热挂进运行中 loader（安装）、或卸载后
			*  插件面板仍残留在当前页面（卸载）。关闭弹窗即整页刷新，不给手动刷新按钮。 */
			const [installNeedsReload, setInstallNeedsReload] = (0, react.useState)(false);
			/** 市场自更新成功、但 profile 的 bundle 列表里已不含 dsh-plugin：结果页提示重新勾选 */
			const [installBundleDeselected, setInstallBundleDeselected] = (0, react.useState)(false);
			const [uninstallNeedsReload, setUninstallNeedsReload] = (0, react.useState)(false);
			/** 结果视图「立即重启」：请求宿主重启后进入等待，服务回来后整页刷新 */
			const [restarting, setRestarting] = (0, react.useState)(false);
			/** 操作失败信息 + 归属仓库 + 动作（决定弹窗标题与上报措辞）+ 命令与尝试记录（issue 预填用） */
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
			/** 后台任务（弹窗已关）完成且只需刷新页面即生效时，等结果 Toast 读完再整页刷新：
			*  新插件（或卸载后残留）的客户端资源要重新加载页面才会生效，无需重启宿主。 */
			const scheduleAutoReload = () => {
				window.setTimeout(() => window.location.reload(), 1600);
			};
			const queue = useTaskQueue({
				t,
				langKey,
				refreshInstalled: catalog.refreshInstalled,
				onInstallDone: (viaModal, repo, needsRestart, update, needsReload, bundleDeselected) => {
					const reload = needsReload === true;
					setInstallNeedsRestart(needsRestart);
					setInstallNeedsReload(reload);
					setInstallBundleDeselected(bundleDeselected === true);
					if (viaModal) setInstallDone(true);
					else setToast({
						id: Date.now(),
						kind: reload ? "installedReload" : needsRestart ? "done" : "installedLive"
					});
					if (!viaModal && reload) scheduleAutoReload();
					setNotifications(addSuccess({
						kind: "install",
						action: update ? "update" : "install",
						repo: repo ?? ""
					}));
				},
				onUninstallDone: (viaModal, repo, needsRestart, needsReload) => {
					const reload = needsReload === true;
					setUninstallNeedsRestart(needsRestart);
					setUninstallNeedsReload(reload);
					if (viaModal) setUninstallDone(true);
					else setToast({
						id: Date.now(),
						kind: "removed"
					});
					if (!viaModal && reload) scheduleAutoReload();
					setNotifications(addSuccess({
						kind: "uninstall",
						repo: repo ?? ""
					}));
				},
				onError: (message, repo, kind, command, attempts, update) => {
					setInstallDone(false);
					setUninstallDone(false);
					setConfirmPlugin(null);
					setConfirmCustomTarget(null);
					setConfirmCustomChannel(null);
					setConfirmGlobalNpm(null);
					setUninstallPlugin(null);
					setUninstallItem(null);
					const issueRepo = issueRepoOf(repo ?? "", catalog.installedItems, catalog.plugins);
					setErrorMsg({
						message,
						repo: issueRepo,
						action: update ? "update" : kind,
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
				if (!catalog.releaseAgeReady) return;
				startupCheckedRef.current = true;
				if (!hubSettings.checkUpdatesOnStart) return;
				syncUpdateNotices();
			}, [
				settingsReady,
				hubSettings,
				catalog.plugins,
				catalog.failed,
				catalog.installedItems,
				catalog.releaseAgeReady,
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
			/** 弹窗动作一：复制安装命令到剪贴板，引导去终端粘贴执行（npm 安装显示包名命令）。 */
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
			/** 「立即重启」：POST 同源 /restart，宿主进程自杀重启；随后轮询服务恢复后整页刷新。
			*  只在刷新解决不了的兜底场景（热挂载失败 / 非 dsh 插件 / 更新）出现。
			*  桌面端宿主归应用壳管（服务端回 `desktop: true` 且不重启）：不轮询，改提示退出重开。 */
			const requestRestart = async () => {
				if (restarting) return;
				setRestarting(true);
				let desktop = false;
				try {
					desktop = (await (await fetch("/dsh-plugin-hub/restart", { method: "POST" })).json()).desktop === true;
				} catch {}
				if (desktop) {
					setRestarting(false);
					setToast({
						id: Date.now(),
						kind: "restartDesktop"
					});
					return;
				}
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
					if (hubSettings.checkUpdatesOnStart && catalog.releaseAgeReady) syncUpdateNotices();
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
					setConfirmPinVersion(null);
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
				pendingRestarts: queue.pendingRestarts.map((p) => p.target),
				onOpenDetail: (item) => setDetailItem(item),
				onReveal: (item) => {
					revealFolder(item);
				},
				onUpdate: (item) => {
					if (!item.plugin) return;
					setDetailItem(null);
					setInstallDone(false);
					setConfirmIsUpdate(true);
					setConfirmPinVersion(null);
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
				onOpenSettings: () => setView("settings"),
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
				info: catalog.hubUpdateTarget ?? catalog.hubUpdateInfo ?? { version: "2.2.4" },
				state: catalog.hubUpdateState,
				currentVersion: catalog.hubCurrentVersion,
				lang,
				t,
				onClose: () => setShowHubUpdate(false),
				onProceed: () => {
					setShowHubUpdate(false);
					if (hubEntry) {
						setInstallDone(false);
						setConfirmIsUpdate(true);
						setConfirmPinVersion(catalog.hubUpdateTarget?.version ?? null);
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
					setConfirmPinVersion(null);
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
				cliOnly: confirmPlugin.install?.webInstallable === false || confirmPlugin.install?.manualInstall === true,
				submitting: queue.submitting,
				needsRestart: installNeedsRestart,
				needsReload: installNeedsReload,
				bundleDeselected: installBundleDeselected,
				onClose: () => {
					const reload = installDone && installNeedsReload;
					setConfirmPlugin(null);
					setInstallBundleDeselected(false);
					if (reload) window.location.reload();
				},
				onCopy: () => copyCommand(confirmPlugin),
				onInstall: () => queue.installNow(confirmPlugin, confirmIsUpdate ? {
					update: true,
					pinVersion: confirmPinVersion ?? void 0
				} : void 0),
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
				needsReload: installNeedsReload,
				onClose: () => {
					const reload = installDone && installNeedsReload;
					setInstallDone(false);
					setConfirmCustomTarget(null);
					setConfirmCustomChannel(null);
					if (reload) window.location.reload();
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
				needsReload: installNeedsReload,
				onClose: () => {
					const reload = installDone && installNeedsReload;
					setInstallDone(false);
					setConfirmGlobalNpm(null);
					setConfirmCustomChannel(null);
					if (reload) window.location.reload();
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
				needsReload: uninstallNeedsReload,
				onClose: () => {
					const reload = uninstallDone && uninstallNeedsReload;
					setUninstallDone(false);
					setUninstallPlugin(null);
					setUninstallItem(null);
					if (reload) window.location.reload();
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
				action: errorMsg.action,
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
		* dsh-plugin 客户端入口：通过模块加载器 bundle（见 tsdown.config.ts）把插件中心接入宿主设置。
		* 全部 UI 逻辑都在 PluginHubSection；本文件只做 cordis apply 接线。
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