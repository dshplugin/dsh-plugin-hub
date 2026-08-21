window.__ModuleLoader__.load({ id: "dsh-plugin", factory: (require) => {


		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		//#region src/client/locales.ts
		/** zh/en dictionaries for the DSH-Plugin Hub settings section. */
		const zh = {
			nav: "插件中心",
			title: "DSH-Plugin Hub",
			tagline: "DSH-Plugin 插件中心：面向 DeepSeek Harness 插件收录平台，人工审验、来源可溯，免费安装",
			adBadge: "推荐",
			ad: "DSH-Plugin 插件中心：收录 {total} 款插件，{verified} 款人工精选验证，每日更新",
			search: "搜索插件名称、描述、标签…",
			all: "全部",
			sortStars: "Star 最多",
			sortForks: "Fork 最多",
			sortUpdated: "最近更新",
			sortNewest: "最新收录",
			openHint: "打开 dsh-plugin.org",
			fork: "Fork",
			loading: "正在加载插件数据…",
			failed: "插件数据加载失败",
			failedDesc: "请稍后重试，或点击右上角按钮在浏览器中打开插件中心。",
			retry: "重试",
			install: "安装",
			toastCopied: "安装命令已复制，去 dsh 终端粘贴即可安装",
			installed: "已安装",
			notInstalled: "未安装",
			filterAllHint: "显示全部插件",
			filterInstalledHint: "筛选当前分类下的已安装插件",
			filterNotInstalledHint: "筛选当前分类下的未安装插件",
			filterInstalledNone: "当前分类下没有已安装插件",
			filterNotInstalledNone: "当前分类下没有未安装插件",
			uninstall: "卸载",
			uninstalling: "卸载中…",
			uninstallTitle: "确认卸载",
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
			installNow: "直接安装",
			installing: "安装中…",
			installDone: "安装成功",
			installResultTitle: "安装完成",
			installResultDesc: "插件已安装。",
			installFail: "安装失败",
			confirmCancel: "取消",
			doneBtn: "完成",
			restartNow: "立即重启",
			restartLater: "稍后重启",
			restarting: "正在重启…",
			restartHint: "部分插件（如插件市场、顶层 bundle）需重启后才会生效。",
			restartPendingHint: "安装成功，重启后生效",
			restartPendingHintUninstall: "卸载成功，重启后移除",
			sectionPendingRestart: "待重启",
			sectionInProgress: "进行中",
			queuedTitle: "已加入安装排队",
			queuedUninstallTitle: "已加入卸载排队",
			queuedHint: "已加入排队，前序任务完成后将自动开始，可关闭本窗口继续浏览。",
			cancelTask: "取消任务",
			cancelling: "正在取消…",
			errorTitle: "操作失败",
			errorTitleInstall: "安装失败",
			errorTitleUninstall: "卸载失败",
			errorPlugin: "插件",
			errorClose: "知道了",
			errorCopy: "复制错误信息",
			errCopied: "错误信息已复制",
			notifications: "通知",
			notificationsBtn: "通知",
			notificationsHint: "查看安装/卸载通知（含失败记录）",
			notificationsDesc: "安装、卸载任务的成败都会记录在这里，即使错过提示也能随时回来查看。",
			notificationsEmpty: "暂无通知记录",
			notificationsClear: "清空通知",
			failCopy: "复制完整错误信息",
			failIssueHint: "带着错误日志去作者仓库一键提交 Issue（正文含官网收录链接）",
			failIssueBig: "一键提交 BUG 到 GitHub Issue 为开源作贡献",
			failPrepareHint: "该插件安装时的构建脚本执行失败（git 分发常缺失子模块或构建产物），属插件打包分发问题。请向作者仓库提交 Issue 反馈。",
			failPackagingHint: "该插件不支持官方默认安装方式：其 git 分发缺少构建产物（package.json 声明的入口文件在仓库中不存在），说明作者未适配官方安装流程。请到作者仓库提交 Issue 反馈，请其提交构建产物或发布 npm 版。",
			failIgnoredBuild: "该插件依赖了需要编译的原生模块（如 node-pty），pnpm 默认拦截这类构建脚本导致安装失败 —— 其他插件不受影响，属该插件的依赖/打包问题。建议向作者仓库一键反馈，请作者改用预编译版本（如 node-pty-prebuilt-multiarch）。",
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
			empty: "该分类暂无插件",
			dataFrom: "数据源 dsh-plugin.org · 每日人工更新"
		};
		const en = {
			nav: "Plugin Hub",
			title: "DSH-Plugin Hub",
			tagline: "DSH-Plugin Hub: the plugin marketplace for DeepSeek Harness — human-verified, traceable, free to install",
			adBadge: "Featured",
			ad: "DSH-Plugin Hub: {total} plugins indexed, {verified} human-verified, updated daily",
			search: "Search plugins by name, description, tags…",
			all: "All",
			sortStars: "Most stars",
			sortForks: "Most forks",
			sortUpdated: "Recently updated",
			sortNewest: "Newest added",
			openHint: "Open dsh-plugin.org",
			githubHint: "View source on GitHub",
			fork: "Fork",
			loading: "Loading plugin data…",
			failed: "Failed to load plugin data",
			failedDesc: "Please retry, or open the hub in your browser with the button above.",
			retry: "Retry",
			install: "Install",
			toastCopied: "Install command copied — paste it in your dsh terminal",
			installed: "Installed",
			notInstalled: "Not installed",
			filterAllHint: "Show all plugins",
			filterInstalledHint: "Filter to installed plugins in this category",
			filterNotInstalledHint: "Filter to uninstalled plugins in this category",
			filterInstalledNone: "No installed plugins in this category",
			filterNotInstalledNone: "No uninstalled plugins in this category",
			uninstall: "Uninstall",
			uninstalling: "Removing…",
			uninstallTitle: "Confirm uninstall",
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
			installNow: "Install",
			installing: "Installing…",
			installDone: "Installed",
			installResultTitle: "Installed",
			installResultDesc: "The plugin has been installed.",
			installFail: "Install failed — copy the command instead",
			confirmCancel: "Cancel",
			doneBtn: "Done",
			restartNow: "Restart now",
			restartLater: "Later",
			restarting: "Restarting…",
			restartHint: "Some plugins (such as plugin markets / top-level bundles) only take effect after a restart.",
			restartPendingHint: "Installed — takes effect after restart",
			restartPendingHintUninstall: "Removed — cleaned up after restart",
			sectionPendingRestart: "Pending restart",
			sectionInProgress: "In progress",
			queuedTitle: "Queued…",
			queuedUninstallTitle: "Queued for removal…",
			queuedHint: "Queued — starts automatically after earlier tasks finish. You may close this window.",
			cancelTask: "Cancel task",
			cancelling: "Cancelling…",
			errorTitle: "Operation failed",
			errorTitleInstall: "Install failed",
			errorTitleUninstall: "Removal failed",
			errorPlugin: "Plugin",
			errorClose: "Got it",
			errorCopy: "Copy error",
			errCopied: "Error copied",
			notifications: "Notifications",
			notificationsBtn: "Notice",
			notificationsHint: "View install/remove notifications (including failures)",
			notificationsDesc: "Every install and remove result is logged here — even if you missed the prompt, you can always check back.",
			notificationsEmpty: "No notifications yet",
			notificationsClear: "Clear notifications",
			failCopy: "Copy full log",
			failIssueHint: "Open a pre-filled issue on the author repo with this error log (includes catalog links)",
			failIssueBig: "Report this bug to GitHub — contribute to open source",
			failPrepareHint: "This plugin failed while running its build scripts during install (git tarballs often miss submodules or build output). This is a packaging issue of the plugin itself — please report it to the author repository.",
			failPackagingHint: "This plugin does not support the official default install method: its git distribution lacks the build output (the entry file declared in package.json is not in the repository), so it has not been adapted to the official install flow. Please file an Issue on the author's repo asking for committed build output or an npm release.",
			failIgnoredBuild: "This plugin depends on a native module (e.g. node-pty) whose build script pnpm blocks by default, so the install fails — other plugins are unaffected. This is a dependency/packaging issue of the plugin itself. Please report it to the author repository and ask the author to switch to a prebuilt variant (e.g. node-pty-prebuilt-multiarch).",
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
			empty: "No plugins in this category yet",
			dataFrom: "Data from dsh-plugin.org · curated daily"
		};
		//#endregion
		//#region \0dsh-css:src/client/styles/Header.module.css.mjs
		const css$4 = ".qikqja_root{min-width:0;height:100%;color:var(--hub-text-primary);flex-direction:column;gap:8px;display:flex}.qikqja_header{flex-direction:column;gap:2px;padding:2px 2px 0;display:flex}.qikqja_githubLink{color:var(--hub-text-tertiary);cursor:pointer;border-radius:6px;flex-shrink:0;align-items:center;padding:3px;text-decoration:none;transition:color .15s,background-color .15s;display:inline-flex}.qikqja_githubLink:hover{color:var(--hub-purple-1);background-color:var(--hub-purple-tint)}.qikqja_githubIcon{flex-shrink:0;display:block}.qikqja_headerTitleRow{justify-content:space-between;align-items:center;gap:8px;min-width:0;display:flex}.qikqja_brandTitle{min-width:0;color:inherit;cursor:pointer;align-items:center;gap:10px;text-decoration:none;display:flex}.qikqja_taglineLink{min-width:0;max-width:100%;color:inherit;cursor:pointer;align-self:flex-start;text-decoration:none}.qikqja_title{margin:0;font-size:14px;font-weight:600;line-height:20px}.qikqja_version{color:var(--hub-text-secondary)}.qikqja_logoIcon{flex-shrink:0;display:block}.qikqja_copyIcon{flex-shrink:0}.qikqja_tagline{color:var(--hub-text-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0;font-size:12px;line-height:18px;display:-webkit-box;overflow:hidden}.qikqja_controls{flex-shrink:0;align-items:center;gap:8px;display:flex}.qikqja_filterResults{color:var(--hub-text-tertiary);white-space:nowrap;flex-shrink:0;align-items:baseline;font-size:12px;line-height:18px;display:inline-flex}.qikqja_resultCount{font-variant-numeric:tabular-nums;text-align:center;min-width:5ch}.qikqja_adBanner{border:1px solid var(--hub-purple-border);background:linear-gradient(90deg, var(--hub-purple-1) 0%, var(--hub-purple-2) 100%);color:#fff;cursor:pointer;-webkit-user-select:none;user-select:none;box-shadow:0 2px 10px var(--hub-purple-shadow);border-radius:8px;align-items:center;gap:8px;padding:7px 12px;text-decoration:none;transition:filter .15s,box-shadow .15s;display:flex}.qikqja_adBanner:hover{filter:brightness(1.1);box-shadow:0 4px 16px var(--hub-purple-shadow-strong)}.qikqja_adBadge{letter-spacing:.04em;color:#fff;white-space:nowrap;background:#ffffff29;border:1px solid #ffffff8c;border-radius:4px;flex-shrink:0;padding:3px 6px;font-size:10px;font-weight:700;line-height:1}.qikqja_adText{text-overflow:ellipsis;white-space:nowrap;color:#fff;min-width:0;font-size:12px;line-height:18px;overflow:hidden}.qikqja_adArrow{color:#fff;flex-shrink:0;margin-left:auto;font-size:13px}.qikqja_searchRow{padding:0 2px;display:flex}.qikqja_search{width:50%;color:inherit;border:1px solid var(--hub-border-2);background:0 0;border-radius:6px;outline:none;padding:4px 9px;font-size:12px;line-height:18px;transition:border-color .12s}.qikqja_search::placeholder{color:var(--hub-text-tertiary)}.qikqja_search:focus{border-color:var(--hub-brand)}.qikqja_installedBtn,.qikqja_installedBtnActive,.qikqja_installedBtnDisabled{cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;flex-shrink:0;align-items:center;gap:5px;height:24px;padding:0 10px;font-size:12px;line-height:22px;transition:color .12s,background .12s;display:inline-flex}.qikqja_installedBtn{color:var(--hub-text-primary);background:0 0}.qikqja_installedBtn:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.qikqja_installedBtnDisabled,.qikqja_installedBtnDisabled:hover{color:var(--hub-text-disabled);cursor:not-allowed;background:0 0}.qikqja_installedBtnDisabled .qikqja_segCount{color:var(--hub-text-disabled);background:#8080800f}.qikqja_installedBtnActive{color:var(--hub-text-on-fill);background:var(--hub-btn-fill)}.qikqja_segCount,.qikqja_segCountActive{text-align:center;border-radius:999px;min-width:16px;padding:0 5px;font-size:10px;line-height:14px}.qikqja_segCount{color:var(--hub-text-tertiary);background:var(--hub-bg-btn)}.qikqja_installedBtnActive .qikqja_segCountActive{color:var(--hub-text-on-fill);background:var(--hub-bg-on-fill)}.qikqja_tabs{border-bottom:1px solid var(--hub-border-1);flex-wrap:wrap;align-items:center;gap:6px;padding:2px 2px 8px;display:flex}.qikqja_tab,.qikqja_tabActive{cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:999px;flex-shrink:0;align-items:center;gap:6px;padding:3px 10px;font-size:12px;line-height:18px;transition:color .12s,background .12s;display:inline-flex}.qikqja_tab{color:var(--hub-text-secondary);background:0 0}.qikqja_tab:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.qikqja_tabActive{color:var(--hub-text-on-fill);background:var(--hub-btn-fill)}.qikqja_tabCount{text-align:center;min-width:16px;color:var(--hub-text-tertiary);background:var(--hub-bg-btn);border-radius:999px;padding:0 5px;font-size:10px;line-height:14px}.qikqja_tabActive .qikqja_tabCount{color:var(--hub-text-on-fill);background:var(--hub-bg-on-fill)}.qikqja_failBtn{box-sizing:border-box;border:1px solid var(--hub-border-2);height:24px;color:var(--hub-text-primary);background:var(--hub-bg-hover);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;flex-shrink:0;align-items:center;margin-left:auto;padding:0 10px;font-size:12px;line-height:22px;transition:color .12s,background .12s;display:inline-flex;position:relative}.qikqja_failBtn:hover{color:var(--hub-text-primary);background:#80808047}.qikqja_failBadge{z-index:1;text-align:center;color:#fff;background:var(--hub-danger);border-radius:999px;min-width:16px;height:16px;padding:0 5px;font-size:10px;font-weight:600;line-height:16px;position:absolute;top:-16px;right:-7px;box-shadow:0 1px 4px #d1242f66}";
		const tagId$4 = "dsh-plugin/Header.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var Header_module_css_default = {
			"taglineLink": "qikqja_taglineLink",
			"copyIcon": "qikqja_copyIcon",
			"adBanner": "qikqja_adBanner",
			"adText": "qikqja_adText",
			"segCount": "qikqja_segCount",
			"header": "qikqja_header",
			"controls": "qikqja_controls",
			"segCountActive": "qikqja_segCountActive",
			"failBadge": "qikqja_failBadge",
			"tabCount": "qikqja_tabCount",
			"installedBtnActive": "qikqja_installedBtnActive",
			"title": "qikqja_title",
			"tagline": "qikqja_tagline",
			"installedBtnDisabled": "qikqja_installedBtnDisabled",
			"tabs": "qikqja_tabs",
			"adArrow": "qikqja_adArrow",
			"githubLink": "qikqja_githubLink",
			"logoIcon": "qikqja_logoIcon",
			"searchRow": "qikqja_searchRow",
			"filterResults": "qikqja_filterResults",
			"failBtn": "qikqja_failBtn",
			"root": "qikqja_root",
			"headerTitleRow": "qikqja_headerTitleRow",
			"resultCount": "qikqja_resultCount",
			"tab": "qikqja_tab",
			"brandTitle": "qikqja_brandTitle",
			"version": "qikqja_version",
			"adBadge": "qikqja_adBadge",
			"search": "qikqja_search",
			"tabActive": "qikqja_tabActive",
			"githubIcon": "qikqja_githubIcon",
			"installedBtn": "qikqja_installedBtn"
		};
		//#endregion
		//#region src/client/lib/failures.ts
		const KEY = "gro.ngilp-hsd.failure-records";
		const MAX = 50;
		/**
		* 失败归类，三态。无论底层机制如何（pnpm 白名单拦截 / 构建脚本被忽略 / prepare 失败），
		* 对用户而言结果都一样 —— 用官方默认安装方式装不上，就是插件仓库的问题，一律引导提 Issue：
		* - pnpmIgnoredBuild：插件依赖里的原生模块构建脚本被 pnpm 默认拦截（如 node-pty，
		*   `ERR_PNPM_IGNORED_BUILDS`）。只影响带原生模块的插件，其他插件不受影响 —— 差异在
		*   插件的依赖选择，属插件依赖/打包问题 → 引导去仓库提 Issue（建议改用预编译版本）
		* - pluginPrepare：插件的 prepare/构建脚本实际执行失败（git tarball 常因缺失子模块或
		*   构建产物导致）—— 属插件打包/分发问题，应引导去仓库提 Issue
		* - repo：其余失败（含 git prepare 被 pnpm 白名单拦截等），默认按插件仓库问题引导提 Issue
		*/
		function classifyFailure(message) {
			if (/\[packaging\]|entry file missing/i.test(message)) return "pluginPrepare";
			if (/ERR_PNPM_IGNORED_BUILDS|Ignored build scripts:/i.test(message)) return "pnpmIgnoredBuild";
			if (/ERR_PNPM_PREPARE_PACKAGE|ELIFECYCLE|Command failed|prepare-guard/i.test(message)) return "pluginPrepare";
			return "repo";
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
		/** 清空全部通知记录，返回空列表。 */
		function clearNotifications() {
			save([]);
			return [];
		}
		//#endregion
		//#region src/client/lib/catalog.ts
		/** 插件中心官网地址。 */
		const SITE_URL = "https://dsh-plugin.org/";
		/** 插件中心源码仓库：头部右上角 GitHub 图标的跳转地址 */
		const GITHUB_URL = "https://github.com/dshplugin/dsh-plugin-hub";
		/**
		* 插件当前版本号，供头部标题展示「DSH-Plugin Hub v0.1.1」。
		* tsdown 构建时用 define 把 __PLUGIN_VERSION__ 替换成 package.json 的版本号；
		* node --test 直接 import 本模块时该标识符不存在，typeof 守卫兜底为空串。
		*/
		const PLUGIN_VERSION = "0.1.1";
		/** dsh-plugin.org 中文页挂在 /zh/ 前缀下，英文在根路径。 */
		function langPathOf(lang) {
			return lang === "zh" ? "zh/" : "";
		}
		/**
		* 官网详情页两级路径：/plugins/{ownerSlug}/{slug}；
		* 旧数据缺 ownerSlug 时从 repo 推导（卡片详情按钮与弹窗来源行共用）。
		*/
		function pluginDetailUrl(plugin, langPath) {
			const repo = plugin.source?.repo ?? "";
			return `${SITE_URL}${langPath}plugins/${plugin.ownerSlug ?? repo.split("/")[0]?.toLowerCase() ?? ""}/${plugin.slug}`;
		}
		/**
		* 失败弹窗里仓库地址的跳转目标：官网详情页（含插件收录信息），
		* 与 issue 正文的 Catalog 链接同一形式（单级 /plugins/{repo}）。
		*/
		function pluginSiteUrl(repo) {
			return `${SITE_URL}plugins/${repo}`;
		}
		/**
		* 一键反馈 GitHub Issue 的预填链接：标题带「来自 dsh-plugin.org」标识，正文只带
		* 核心信息 —— 原因判定 + 关键错误代码 + 宿主机器环境快照 + 错误核心摘要（完整日志
		* 太长，塞进 URL 会被 GitHub 以「request URL too long」拒绝，故只收集重点）。
		* 错误弹窗、失败记录共用此逻辑。
		* env 取不到时为 null，链接照常生成、只是少环境段。
		*/
		function pluginIssueUrl(repo, message, env) {
			const title = `[dsh-plugin.org | dsh-plugin-hub] Install/Remove failed: ${repo}`;
			const kind = classifyFailure(message);
			const reason = /\[packaging\]/i.test(message) ? "plugin does NOT support the official default install method (dsh plugin add github:owner/repo — requires build output committed to the repo or a prepare script); its git distribution lacks the entry file declared in package.json" : kind === "pluginPrepare" ? "plugin prepare/build script failed during install (packaging/distribution issue)" : kind === "pnpmIgnoredBuild" ? "plugin depends on a native module whose build script pnpm blocks by default (use a prebuilt variant)" : "plugin-side install failure";
			const code = coreErrorCode(message);
			const build = (coreChars) => {
				const body = [
					"## Summary",
					`- Cause: ${reason}`,
					...code ? [`- Key error: \`${code}\``] : [],
					"",
					`## [DSH-Plugin 插件中心](${SITE_URL}) · 安装 Plugin 失败错误信息`,
					`本错误信息由 [dsh-plugin-hub](${GITHUB_URL}) 插件中心的安装程序自动生成，随本次安装失败一并提交。`,
					`- 使用的安装命令（官方默认安装方式）：\`dsh plugin${env?.profile ? ` --profile ${env.profile}` : ""} add github:${repo}\``,
					`- 执行结果：安装失败，未能安装该插件。`,
					.../\[packaging\]/i.test(message) ? [
						"",
						"## 官方默认安装方式",
						"DSH 生态的官方默认安装方式是 `dsh plugin add github:owner/repo`（git 直装）：插件仓库需提交构建产物，或在 package.json 提供 `prepare` 脚本让 pnpm 安装时自动构建。当前插件两者皆不具备，因此无法按官方方式安装。"
					] : [],
					"",
					"## Environment",
					`- Plugin: \`${repo}\``,
					...env ? [
						`- DSH: ${env.dshVersion ? `v${env.dshVersion}` : "unknown"}`,
						`- Plugin Hub: v${PLUGIN_VERSION}`,
						`- Node: ${env.nodeVersion}`,
						`- OS: ${env.platform} ${env.arch} (${env.release})`,
						`- Profile: \`${env.profile}\``,
						`- DSH Home: \`${env.dshHome}\``
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
		/**
		* 归一化在线 API（dsh-plugin.org/api/plugins.{lang}.json）返回的短 key 结构
		* （s/o/n/vr/c/t/f/d/r/v/u/a/sg/fk），统一为 HubPlugin，保证渲染逻辑只认一种结构。
		*/
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
				source: typeof raw.r === "string" ? { repo: raw.r } : void 0,
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
		//#region src/client/lib/env.ts
		let envPromise = null;
		function getEnv() {
			envPromise ??= fetch("/dsh-plugin-hub/env", { cache: "no-store" }).then((res) => res.ok ? res.json() : null).catch(() => null);
			return envPromise;
		}
		//#endregion
		//#region src/client/hooks/useCatalog.ts
		/**
		* Catalog data + view state for the Plugin Hub section.
		*
		* Owns the online-data pipeline (live fetch from dsh-plugin.org), the local
		* installed-plugin table, and the filter/search/sort/install-status view
		* state, exposing the derived visible list and per-category counts.
		*/
		const PLUGINS_URL = (lang) => `https://dsh-plugin.org/api/plugins.${lang}.json`;
		const STATS_URL = "https://dsh-plugin.org/api/stats.json";
		function useCatalog(lang) {
			/** 目录插件（仅保留人工验证通过的条目） */
			const [plugins, setPlugins] = (0, react.useState)(null);
			/** 收录/精选统计（官网 /api/stats.json 实时拉取） */
			const [stats, setStats] = (0, react.useState)(null);
			const [failed, setFailed] = (0, react.useState)(false);
			const [reloadKey, setReloadKey] = (0, react.useState)(0);
			const [category, setCategory] = (0, react.useState)("all");
			const [query, setQuery] = (0, react.useState)("");
			const [sort, setSort] = (0, react.useState)("sortStars");
			/** 列表安装状态筛选：全部 / 已安装 / 未安装（分段按钮，单列表内切换，不引入第二个列表） */
			const [installedFilter, setInstalledFilter] = (0, react.useState)("all");
			/** 当前 profile 已安装插件：npm 包名 -> manifest spec（来自宿主本地路由） */
			const [installed, setInstalled] = (0, react.useState)({});
			/** 安装时记录的目录信号：repo(小写) -> { version, updatedAt }（来自宿主本地路由） */
			const [versions, setVersions] = (0, react.useState)({});
			(0, react.useEffect)(() => {
				let cancelled = false;
				setPlugins(null);
				setStats(null);
				setFailed(false);
				const fetchData = (url) => fetch(url, { cache: "no-store" }).then((res) => {
					if (!res.ok) throw new Error(String(res.status));
					return res.json();
				});
				fetchData(PLUGINS_URL(lang)).then((data) => {
					if (cancelled) return;
					const list = (Array.isArray(data) ? data : []).map((item) => normalize(item));
					setPlugins(list.filter((p) => p.compatibility?.status === "verified"));
				}).catch(() => {
					if (!cancelled) setFailed(true);
				});
				fetchData(STATS_URL).then((s) => {
					const stats = s;
					if (!cancelled && stats && typeof stats.total === "number" && typeof stats.verified === "number") setStats({
						total: stats.total,
						verified: stats.verified
					});
				}).catch(() => {});
				return () => {
					cancelled = true;
				};
			}, [reloadKey]);
			/** 刷新当前 profile 已安装插件表；宿主未挂本地路由时静默降级为空表。 */
			const refreshInstalled = async () => {
				try {
					const res = await fetch("/dsh-plugin-hub/installed", { cache: "no-store" });
					if (!res.ok) return;
					const data = await res.json();
					setInstalled(data.installed ?? {});
					setVersions(data.versions ?? {});
				} catch {}
			};
			(0, react.useEffect)(() => {
				refreshInstalled();
			}, []);
			/** 插件是否已安装：匹配 installed spec 中的 `github:<owner>/<repo>`；命中返回 npm 包名。 */
			const installedName = (p) => {
				const repo = p.source?.repo;
				if (!repo) return null;
				const needle = `github:${repo.toLowerCase()}`;
				for (const [name, spec] of Object.entries(installed)) if (spec.toLowerCase().includes(needle)) return name;
				return null;
			};
			/** 该插件安装时记录的目录版本（无记录/未安装 → null）。 */
			const installedVersion = (p) => {
				const repo = p.source?.repo;
				if (!repo) return null;
				return versions[repo.toLowerCase()]?.version ?? null;
			};
			/**
			* 是否有更新：仅对已安装插件有意义。
			* 双信号判定——有 release 版本的比版本；无版本（repo 不打 tag）的比仓库最近更新时间
			* （repoUpdatedAt，ISO 字符串字典序 = 时间序），更新时间变新说明有新提交。
			*/
			const hasUpdate = (p) => {
				if (installedName(p) === null) return false;
				const repo = p.source?.repo;
				if (!repo) return false;
				const rec = versions[repo.toLowerCase()];
				if (!rec) return false;
				if (p.version) return p.version !== rec.version;
				const current = p.dates?.repoUpdatedAt;
				return Boolean(current && rec.updatedAt && current > rec.updatedAt);
			};
			/** 当前分类下的插件（「全部」时为整个目录）。 */
			const categoryPlugins = (0, react.useMemo)(() => {
				if (!plugins) return [];
				if (category === "all") return plugins;
				return plugins.filter((p) => p.category === category);
			}, [plugins, category]);
			/** 当前分类下已安装插件数：已安装/未安装按钮上的计数跟随分类，不再用全局口径。 */
			const installedCountInCategory = (0, react.useMemo)(() => {
				return categoryPlugins.reduce((n, p) => n + (installedName(p) !== null ? 1 : 0), 0);
			}, [categoryPlugins, installed]);
			/** 当前分类下未安装插件数。 */
			const notInstalledCountInCategory = Math.max(0, categoryPlugins.length - installedCountInCategory);
			(0, react.useEffect)(() => {
				if (installedFilter === "all") return;
				if ((installedFilter === "installed" ? installedCountInCategory : notInstalledCountInCategory) === 0) setInstalledFilter("all");
			}, [
				installedFilter,
				installedCountInCategory,
				notInstalledCountInCategory
			]);
			const visible = (0, react.useMemo)(() => {
				if (!plugins) return [];
				const q = query.trim().toLowerCase();
				return [...plugins.filter((p) => {
					if (category !== "all" && p.category !== category) return false;
					if (installedFilter === "installed" && installedName(p) === null) return false;
					if (installedFilter === "notInstalled" && installedName(p) !== null) return false;
					if (!q) return true;
					return (p.displayName ?? "").toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q) || (p.topics ?? []).some((topic) => topic.toLowerCase().includes(q));
				})].sort((a, b) => {
					if (sort === "sortStars") return (b.stats?.stargazers_count ?? 0) - (a.stats?.stargazers_count ?? 0);
					if (sort === "sortForks") return (b.stats?.forks_count ?? 0) - (a.stats?.forks_count ?? 0);
					if (sort === "sortNewest") return (b.dates?.addedAt ?? "").localeCompare(a.dates?.addedAt ?? "");
					return (b.dates?.repoUpdatedAt ?? "").localeCompare(a.dates?.repoUpdatedAt ?? "");
				});
			}, [
				plugins,
				category,
				query,
				sort,
				installed,
				installedFilter
			]);
			/** Per-category plugin counts shown on the category chips. */
			const categoryCounts = (0, react.useMemo)(() => {
				const counts = {};
				for (const p of plugins ?? []) if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1;
				return counts;
			}, [plugins]);
			return {
				plugins,
				stats,
				failed,
				reload: () => setReloadKey((k) => k + 1),
				installed,
				installedName,
				installedVersion,
				hasUpdate,
				refreshInstalled,
				category,
				setCategory,
				query,
				setQuery,
				sort,
				setSort,
				installedFilter,
				setInstalledFilter,
				visible,
				total: plugins?.length ?? 0,
				installedCountInCategory,
				notInstalledCountInCategory,
				categoryCounts
			};
		}
		//#endregion
		//#region src/client/hooks/useTaskQueue.ts
		/**
		* Background install/remove task queue for the Plugin Hub.
		*
		* Mirrors the server-side FIFO active queue by polling /active, settles
		* vanished tasks against /status, and exposes the queue actions (install,
		* uninstall, cancel) plus the modal task lookups used by the dialogs.
		*/
		function useTaskQueue(opts) {
			const { t, refreshInstalled, onInstallDone, onUninstallDone, onError, installPlugin, uninstallPlugin, installedName, resolvePending } = opts;
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
			/** 轮询定时器句柄（队列清空/组件卸载时清理） */
			const pollRef = (0, react.useRef)(null);
			/** 请求在途的目标集合（同步防重）：双击安装/卸载时第二击直接忽略。
			*  本地队列任务要等 fetch 返回后才入队，仅靠 queueRef 检查拦不住请求窗口内的重复点击。 */
			const submittingRef = (0, react.useRef)(/* @__PURE__ */ new Set());
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
			/** 解析服务端待重启列表（`github:` 前缀已去掉，与安装任务的 target 对齐）。 */
			const parsePendingRestarts = (value) => {
				if (!Array.isArray(value)) return [];
				const out = [];
				for (const x of value) {
					if (typeof x !== "object" || x === null) continue;
					const target = x.target;
					if (typeof target !== "string" || target === "") continue;
					const at = x.at;
					out.push({
						target: target.replace(/^github:/, ""),
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
						onUninstallDone(modalTaskRef.current === q.id, q.repo);
					} else {
						syncInstalledVersion(q.repo, q.version, q.updatedAt);
						pendingInfoRef.current.set(q.target, {
							desc: q.desc,
							version: q.version
						});
						onInstallDone(modalTaskRef.current === q.id, q.repo);
					}
				} else {
					const detail = lines.length > 0 ? [...lines].reverse().join("\n") : q.kind === "uninstall" ? t("uninstallFail") : t("installFail");
					onError(detail, q.repo, q.kind);
				}
				maybeStopPoll();
			};
			/** 任务在 /active 中消失 = 已结束：查 /status 拿终态并收尾（cancelled 静默移除）。 */
			const settleTask = async (q) => {
				let status = "failed";
				let lines = [];
				try {
					const res = await fetch(`/dsh-plugin-hub/status?task=${q.id}`, { cache: "no-store" });
					if (res.ok) {
						const data = await res.json();
						status = data.task?.status ?? "failed";
						lines = data.task?.lines ?? [];
					}
				} catch {}
				if (status === "done") finishQueueTask(true, q, lines);
				else if (status === "failed") finishQueueTask(false, q, lines);
				else {
					applyQueue((prev) => prev.filter((x) => x.id !== q.id));
					maybeStopPoll();
				}
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
									target: typeof a.target === "string" ? a.target.replace(/^github:/, "") : prevTask?.target ?? "",
									desc: prevTask?.desc,
									repo: prevTask?.repo ?? (isRemove ? null : typeof a.target === "string" ? a.target.replace(/^github:/, "") : null),
									version: prevTask?.version,
									updatedAt: prevTask?.updatedAt,
									status: a.status === "running" ? "running" : "pending",
									progress: typeof a.progress === "number" ? a.progress : prevTask?.progress ?? 0,
									lines: Array.isArray(a.lines) ? a.lines : prevTask?.lines ?? []
								});
							}
							return next;
						});
						const gone = prevQueue.filter((q) => !byId.has(q.id) && q.status !== "cancelling");
						for (const q of gone) await settleTask(q);
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
							return {
								id: a.id,
								kind: isRemove ? "uninstall" : "install",
								target: typeof a.target === "string" ? a.target.replace(/^github:/, "") : "",
								repo: isRemove ? null : typeof a.target === "string" ? a.target.replace(/^github:/, "") : null,
								status: a.status === "running" ? "running" : "pending",
								progress: typeof a.progress === "number" ? a.progress : 0,
								lines: Array.isArray(a.lines) ? a.lines : []
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
			const installNow = async (p) => {
				const repo = p.source?.repo ?? "";
				if (!repo) return;
				if (queueRef.current.some((q) => q.kind === "install" && q.target === repo)) return;
				if (submittingRef.current.has(repo)) return;
				submittingRef.current.add(repo);
				setSubmitting(true);
				try {
					const res = await fetch("/dsh-plugin-hub/install", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ repo })
					});
					const data = await res.json();
					if (!data.ok || typeof data.task !== "number") {
						onError(data.error ?? `HTTP ${res.status}`, repo, "install");
						return;
					}
					const taskId = data.task;
					modalTaskRef.current = taskId;
					applyQueue((prev) => [...prev, {
						id: taskId,
						kind: "install",
						target: repo,
						repo,
						desc: p.description,
						version: p.version,
						updatedAt: p.dates?.repoUpdatedAt,
						status: "pending",
						progress: 0,
						lines: []
					}]);
					pendingInfoRef.current.set(repo, {
						desc: p.description,
						version: p.version
					});
					pollQueue();
				} catch {
					onError(t("installFail"), repo, "install");
				} finally {
					submittingRef.current.delete(repo);
					setSubmitting(false);
				}
			};
			/** 弹窗动作：直接卸载。与安装同一队列机制，弹窗内实时显示进度。 */
			const uninstallNow = async (p) => {
				const name = installedName(p);
				if (!name) return;
				const repo = p.source?.repo ?? null;
				if (queueRef.current.some((q) => q.kind === "uninstall" && q.target === name)) return;
				if (submittingRef.current.has(name)) return;
				submittingRef.current.add(name);
				setSubmitting(true);
				try {
					const res = await fetch("/dsh-plugin-hub/uninstall", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({
							name,
							repo: repo ?? void 0
						})
					});
					const data = await res.json();
					if (!data.ok || typeof data.task !== "number") {
						onError(data.error ?? `HTTP ${res.status}`, repo, "uninstall");
						return;
					}
					const taskId = data.task;
					modalTaskRef.current = taskId;
					applyQueue((prev) => [...prev, {
						id: taskId,
						kind: "uninstall",
						target: name,
						desc: p.description,
						repo,
						status: "pending",
						progress: 0,
						lines: []
					}]);
					pollQueue();
				} catch {
					onError(t("uninstallFail"), repo, "uninstall");
				} finally {
					submittingRef.current.delete(name);
					setSubmitting(false);
				}
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
			return {
				queue,
				pendingRestarts,
				installModalTask: installPlugin ? queue.find((q) => q.id === modalTaskRef.current && q.status !== "cancelling") ?? queue.find((q) => q.kind === "install" && q.target === (installPlugin.source?.repo ?? "") && q.status !== "cancelling") ?? null : null,
				uninstallModalTask: uninstallPlugin ? queue.find((q) => q.id === modalTaskRef.current && q.status !== "cancelling") ?? queue.find((q) => q.kind === "uninstall" && q.target === (installedName(uninstallPlugin) ?? "") && q.status !== "cancelling") ?? null : null,
				submitting,
				installNow,
				uninstallNow,
				cancelTask,
				clearModalTask
			};
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/Modal.module.css.mjs
		const css$3 = ".BiQ1zG_overlay{z-index:998;-webkit-user-select:none;user-select:none;background:#00000061;justify-content:center;align-items:center;animation:.16s ease-out BiQ1zG_overlayIn;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.BiQ1zG_modal,.BiQ1zG_errorModal{background:var(--hub-bg-1);border:1px solid var(--hub-border-2);border-radius:10px;flex-direction:column;gap:10px;width:420px;max-width:calc(100vw - 32px);max-height:calc(100vh - 64px);padding:14px 16px;animation:.18s ease-out BiQ1zG_modalIn;display:flex;box-shadow:0 12px 40px #0000003d}.BiQ1zG_errorModal{width:640px;max-width:calc(100vw - 48px)}.BiQ1zG_modalHead{flex-shrink:0;justify-content:space-between;align-items:center;gap:8px;display:flex}.BiQ1zG_modalTitle{color:var(--hub-text-primary);font-size:14px;font-weight:600;line-height:20px}.BiQ1zG_modalTitleBusy{color:var(--hub-brand)}.BiQ1zG_modalTitleQueued{color:var(--hub-warning)}.BiQ1zG_modalClose{width:24px;height:24px;color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;font-size:16px;line-height:1;display:inline-flex}.BiQ1zG_modalClose:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.BiQ1zG_modalCloseIcon{flex-shrink:0;width:14px;height:14px}.BiQ1zG_modalDesc{color:var(--hub-text-secondary);font-size:12px;line-height:18px}.BiQ1zG_trustHint{color:var(--hub-danger-text);background:var(--hub-danger-tint);border:1px solid var(--hub-danger-border-soft);border-radius:6px;padding:6px 10px;font-size:12px;font-weight:500;line-height:18px}.BiQ1zG_modalRow{align-items:baseline;gap:8px;min-width:0;font-size:12px;line-height:18px;display:flex}.BiQ1zG_modalLabel{min-width:64px;color:var(--hub-text-tertiary);flex-shrink:0}.BiQ1zG_modalValue{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--hub-text-primary);font-weight:500;overflow:hidden}.BiQ1zG_modalLink{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;gap:4px;font-weight:500;text-decoration:none;transition:color .12s;display:inline-flex;overflow:hidden}.BiQ1zG_modalLink:hover{color:var(--hub-brand-hover);text-decoration:underline}.BiQ1zG_linkIcon{flex-shrink:0}.BiQ1zG_modalCmd{color:var(--hub-text-primary);background:var(--hub-bg-2);border:1px solid var(--hub-border-2);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;justify-content:space-between;align-items:center;gap:8px;padding:6px 6px 6px 10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:18px;transition:border-color .12s,background .12s;display:flex}.BiQ1zG_modalCmd:hover{border-color:var(--hub-border-ghost);background:var(--hub-bg-3)}.BiQ1zG_modalCmdText{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.BiQ1zG_modalCmdCopy{color:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:4px;flex-shrink:0;align-items:center;gap:3px;padding:1px 7px;font-family:inherit;font-size:11px;line-height:16px;transition:color .12s,background .12s;display:inline-flex}.BiQ1zG_modalCmdCopy:hover{color:var(--hub-brand-hover);background:var(--hub-bg-2)}.BiQ1zG_modalActions{justify-content:flex-end;align-items:center;gap:8px;margin-top:2px;display:flex}.BiQ1zG_modalBody{flex-direction:column;flex:auto;gap:10px;min-height:0;display:flex;overflow-y:auto}.BiQ1zG_toast{z-index:1000;background:var(--hub-btn-fill);color:var(--hub-text-on-fill);pointer-events:none;white-space:nowrap;border:none;border-radius:8px;padding:10px 16px;font-size:12px;font-weight:500;line-height:18px;animation:.22s ease-out BiQ1zG_toastIn;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 6px 24px #00000047}@keyframes BiQ1zG_toastIn{0%{opacity:0;transform:translate(-50%,-44%)}to{opacity:1;transform:translate(-50%,-50%)}}.BiQ1zG_toastFail{background:var(--hub-danger);color:#fff;border-color:#ffffff3d}.BiQ1zG_queueSection{flex-direction:column;gap:6px;display:flex}.BiQ1zG_queueSectionTitle{color:var(--hub-text-secondary);padding:4px 2px 0;font-size:12px;font-weight:600;line-height:18px}.BiQ1zG_pendingRowStatus{color:var(--hub-warn);flex-shrink:0;font-weight:500}.BiQ1zG_pendingRowActions{flex-shrink:0;gap:8px;margin-left:auto;display:flex}.BiQ1zG_queueRow{border:1px solid var(--hub-border-2);background:var(--hub-bg-2);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:8px;flex-direction:column;gap:5px;padding:8px 10px;font-size:12px;line-height:18px;transition:background .12s;display:flex}.BiQ1zG_queueRow:hover{background:var(--hub-brand-tint)}.BiQ1zG_queueRowHead{align-items:center;gap:10px;display:flex}.BiQ1zG_queueRowTarget{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--hub-text-primary);flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow:hidden}.BiQ1zG_queueRowDesc{color:var(--hub-text-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.BiQ1zG_queueRowBody{align-items:center;gap:8px;display:flex}.BiQ1zG_queueRowStatus{color:var(--hub-brand);flex-shrink:0;font-weight:500}.BiQ1zG_queueRowTrack{flex:1;min-width:0}.BiQ1zG_queueRowPct{color:var(--hub-text-tertiary);font-variant-numeric:tabular-nums;flex-shrink:0}.BiQ1zG_stripCancel{color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;flex-shrink:0;padding:2px 10px;font-size:12px;line-height:18px;transition:background .12s,color .12s}.BiQ1zG_stripCancel:hover{background:var(--hub-danger-tint);color:var(--hub-danger-text)}.BiQ1zG_stripCancel:disabled{opacity:.45;cursor:default}.BiQ1zG_queuedHint{color:var(--hub-brand);background:var(--hub-brand-tint);border:1px solid var(--hub-brand-border-soft);border-radius:6px;padding:5px 10px;font-size:12px;line-height:18px}.BiQ1zG_errorTitle{color:var(--hub-danger-text);font-size:14px;font-weight:600;line-height:20px}.BiQ1zG_errorBox{border:1px solid var(--hub-danger-border);background:var(--hub-danger-tint-weak);max-height:240px;color:var(--hub-text-primary);white-space:pre-wrap;word-break:break-word;-webkit-user-select:none;user-select:none;border-radius:6px;margin:0;padding:10px 12px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:17px;overflow:auto}.BiQ1zG_errorCopySoft{color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:4px;flex-shrink:0;align-items:center;padding:2px 8px;font-size:11px;line-height:16px;transition:color .12s,background .12s;display:inline-flex}.BiQ1zG_errorCopySoft:hover{color:var(--hub-text-secondary);background:var(--hub-bg-2)}.BiQ1zG_errorHint{color:var(--hub-text-tertiary);font-size:12px;line-height:18px}.BiQ1zG_modalCancel,.BiQ1zG_modalCopy{color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:color .12s,background .12s}.BiQ1zG_modalCancel:hover,.BiQ1zG_modalCopy:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.BiQ1zG_modalInstall{color:var(--hub-text-on-fill);background:var(--hub-btn-fill);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.BiQ1zG_modalInstall:hover{background:var(--hub-btn-hover)}.BiQ1zG_modalCopy:disabled,.BiQ1zG_modalInstall:disabled,.BiQ1zG_modalCancel:disabled,.BiQ1zG_modalClose:disabled,.BiQ1zG_uninstallConfirm:disabled{opacity:.55;cursor:not-allowed;pointer-events:none}.BiQ1zG_uninstallConfirm{color:#fff;background:var(--hub-danger);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.BiQ1zG_uninstallConfirm:hover{background:var(--hub-danger-hover)}.BiQ1zG_result{text-align:center;flex-direction:column;align-items:center;gap:5px;padding:10px 0 2px;display:flex}.BiQ1zG_resultCheck{background:var(--hub-success-tint);width:40px;height:40px;color:var(--hub-success);border-radius:50%;justify-content:center;align-items:center;margin-bottom:3px;display:inline-flex}.BiQ1zG_resultCheckIcon{flex-shrink:0;width:20px;height:20px}.BiQ1zG_resultTitle{color:var(--hub-text-primary);font-size:13px;font-weight:600;line-height:20px}.BiQ1zG_resultDesc{color:var(--hub-text-secondary);font-size:12px;line-height:18px}.BiQ1zG_resultRestarting{color:var(--hub-text-tertiary);padding:12px 0 6px;font-size:12px;line-height:18px}.BiQ1zG_restartLater{color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:color .12s,background .12s}.BiQ1zG_restartLater:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}.BiQ1zG_restartNow{color:var(--hub-text-on-fill);background:var(--hub-btn-fill);cursor:pointer;-webkit-user-select:none;user-select:none;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.BiQ1zG_restartNow:hover{background:var(--hub-btn-hover)}.BiQ1zG_restartNow:disabled{opacity:.55;cursor:not-allowed;pointer-events:none}.BiQ1zG_result .BiQ1zG_modalActions{justify-content:center;gap:10px;margin-top:0;padding:6px 0 2px}.BiQ1zG_result .BiQ1zG_modalActions .BiQ1zG_restartLater,.BiQ1zG_result .BiQ1zG_modalActions .BiQ1zG_restartNow{min-width:100px}.BiQ1zG_progress{margin:10px 0 2px}.BiQ1zG_progressHead{justify-content:flex-end;align-items:center;margin-bottom:3px;display:flex}.BiQ1zG_progressText{color:var(--hub-text-secondary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:14px}.BiQ1zG_progressTrack{background:var(--hub-border-2);border-radius:2px;height:4px;overflow:hidden}.BiQ1zG_progressFill{background:var(--hub-brand);border-radius:2px;height:100%;transition:width .32s}.BiQ1zG_progressFillFail{background:var(--hub-danger)}@keyframes BiQ1zG_overlayIn{0%{opacity:0}to{opacity:1}}@keyframes BiQ1zG_modalIn{0%{opacity:0;transform:translateY(6px)scale(.98)}to{opacity:1;transform:translateY(0)scale(1)}}.BiQ1zG_noticeList{flex-direction:column;gap:10px;padding-right:2px;display:flex}.BiQ1zG_noticeRow{border:1px solid var(--hub-border-2);background:var(--hub-bg-2);border-radius:8px;align-items:center;gap:10px;padding:10px 12px;display:flex}.BiQ1zG_noticeBadgeOk,.BiQ1zG_noticeBadgeFail{border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;width:28px;height:28px;display:inline-flex;box-shadow:0 2px 6px #0000002e}.BiQ1zG_noticeBadgeOk{background:var(--hub-success)}.BiQ1zG_noticeBadgeFail{background:var(--hub-danger)}.BiQ1zG_noticeBadgeIcon{flex-shrink:0;width:12px;height:12px}.BiQ1zG_noticeMain{flex-direction:column;flex:1;gap:8px;min-width:0;display:flex}.BiQ1zG_noticeHead{align-items:center;gap:8px;min-width:0;display:flex}.BiQ1zG_noticeTextOk{color:var(--hub-success);flex-shrink:0;font-size:12px;font-weight:600;line-height:18px}.BiQ1zG_noticeTextFail{color:var(--hub-danger-text);flex-shrink:0;font-size:12px;font-weight:600;line-height:18px}.BiQ1zG_failList{flex-direction:column;gap:12px;padding-right:2px;display:flex}.BiQ1zG_failRow{border:1px solid var(--hub-border-2);background:var(--hub-bg-2);border-radius:8px;flex-direction:column;gap:8px;padding:10px 12px;display:flex}.BiQ1zG_failHead{align-items:center;gap:8px;min-width:0;display:flex}.BiQ1zG_failKind{border:1px solid #0000;border-radius:4px;flex-shrink:0;padding:0 6px;font-size:10px;font-weight:500;line-height:16px}.BiQ1zG_failKindInstall{color:var(--hub-danger-text);border-color:var(--hub-danger-border);background:var(--hub-danger-tint)}.BiQ1zG_failKindUninstall{color:var(--hub-warn);border-color:var(--hub-warn-border);background:var(--hub-warn-tint)}.BiQ1zG_failRepo{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--hub-brand);cursor:pointer;-webkit-user-select:none;user-select:none;flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:18px;text-decoration:none;overflow:hidden}.BiQ1zG_failRepo:hover{text-decoration:underline}.BiQ1zG_failTime{color:var(--hub-text-tertiary);font-variant-numeric:tabular-nums;flex-shrink:0;font-size:11px;line-height:16px}.BiQ1zG_failCopy{color:var(--hub-text-tertiary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:4px;flex-shrink:0;align-items:center;padding:2px 8px;font-size:11px;line-height:16px;transition:color .12s,background .12s;display:inline-flex}.BiQ1zG_failCopy:hover{color:var(--hub-text-secondary);background:var(--hub-bg-2)}.BiQ1zG_failEmpty{text-align:center;color:var(--hub-text-tertiary);padding:24px 0;font-size:12px;line-height:18px}.BiQ1zG_failClear{color:var(--hub-danger);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:color .12s,background .12s}.BiQ1zG_failClear:hover{color:#fff;background:var(--hub-danger)}.BiQ1zG_failBigIssue{box-sizing:border-box;text-align:center;color:#fff;background:var(--hub-danger);border:1px solid var(--hub-danger);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:8px;width:100%;margin-top:4px;padding:3px 16px;font-size:13px;font-weight:600;line-height:18px;text-decoration:none;transition:background .12s,border-color .12s,box-shadow .12s;display:block}.BiQ1zG_failBigIssue:hover{background:var(--hub-danger-hover);border-color:var(--hub-danger-hover);box-shadow:0 3px 10px #d1242f59}.BiQ1zG_failPrepareHint{color:var(--hub-warning);background:var(--hub-warning-tint);border:1px solid var(--hub-warning-border);border-radius:6px;margin-top:6px;padding:8px 12px;font-size:12px;line-height:18px}";
		const tagId$3 = "dsh-plugin/Modal.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var Modal_module_css_default = {
			"modalCmdCopy": "BiQ1zG_modalCmdCopy",
			"pendingRowStatus": "BiQ1zG_pendingRowStatus",
			"toastFail": "BiQ1zG_toastFail",
			"progressText": "BiQ1zG_progressText",
			"overlayIn": "BiQ1zG_overlayIn",
			"queueSectionTitle": "BiQ1zG_queueSectionTitle",
			"noticeRow": "BiQ1zG_noticeRow",
			"modalClose": "BiQ1zG_modalClose",
			"modalCancel": "BiQ1zG_modalCancel",
			"noticeBadgeFail": "BiQ1zG_noticeBadgeFail",
			"noticeBadgeIcon": "BiQ1zG_noticeBadgeIcon",
			"queueRowBody": "BiQ1zG_queueRowBody",
			"failKindInstall": "BiQ1zG_failKindInstall",
			"failPrepareHint": "BiQ1zG_failPrepareHint",
			"uninstallConfirm": "BiQ1zG_uninstallConfirm",
			"modalCloseIcon": "BiQ1zG_modalCloseIcon",
			"modalCmd": "BiQ1zG_modalCmd",
			"noticeHead": "BiQ1zG_noticeHead",
			"failBigIssue": "BiQ1zG_failBigIssue",
			"failKind": "BiQ1zG_failKind",
			"failRepo": "BiQ1zG_failRepo",
			"resultRestarting": "BiQ1zG_resultRestarting",
			"resultDesc": "BiQ1zG_resultDesc",
			"modalTitleBusy": "BiQ1zG_modalTitleBusy",
			"resultTitle": "BiQ1zG_resultTitle",
			"modalLabel": "BiQ1zG_modalLabel",
			"modalValue": "BiQ1zG_modalValue",
			"errorTitle": "BiQ1zG_errorTitle",
			"stripCancel": "BiQ1zG_stripCancel",
			"failClear": "BiQ1zG_failClear",
			"queueRowTarget": "BiQ1zG_queueRowTarget",
			"errorCopySoft": "BiQ1zG_errorCopySoft",
			"errorBox": "BiQ1zG_errorBox",
			"progressTrack": "BiQ1zG_progressTrack",
			"modalIn": "BiQ1zG_modalIn",
			"queueRowPct": "BiQ1zG_queueRowPct",
			"modalDesc": "BiQ1zG_modalDesc",
			"modalTitleQueued": "BiQ1zG_modalTitleQueued",
			"noticeMain": "BiQ1zG_noticeMain",
			"failCopy": "BiQ1zG_failCopy",
			"modalInstall": "BiQ1zG_modalInstall",
			"noticeList": "BiQ1zG_noticeList",
			"failTime": "BiQ1zG_failTime",
			"resultCheck": "BiQ1zG_resultCheck",
			"queueRowHead": "BiQ1zG_queueRowHead",
			"queueRowStatus": "BiQ1zG_queueRowStatus",
			"noticeTextOk": "BiQ1zG_noticeTextOk",
			"failHead": "BiQ1zG_failHead",
			"restartNow": "BiQ1zG_restartNow",
			"errorHint": "BiQ1zG_errorHint",
			"queueRowDesc": "BiQ1zG_queueRowDesc",
			"modalCopy": "BiQ1zG_modalCopy",
			"queueSection": "BiQ1zG_queueSection",
			"failEmpty": "BiQ1zG_failEmpty",
			"modalActions": "BiQ1zG_modalActions",
			"overlay": "BiQ1zG_overlay",
			"trustHint": "BiQ1zG_trustHint",
			"result": "BiQ1zG_result",
			"progress": "BiQ1zG_progress",
			"failList": "BiQ1zG_failList",
			"modalCmdText": "BiQ1zG_modalCmdText",
			"queueRow": "BiQ1zG_queueRow",
			"queuedHint": "BiQ1zG_queuedHint",
			"progressFill": "BiQ1zG_progressFill",
			"toastIn": "BiQ1zG_toastIn",
			"noticeTextFail": "BiQ1zG_noticeTextFail",
			"modalHead": "BiQ1zG_modalHead",
			"modal": "BiQ1zG_modal",
			"failRow": "BiQ1zG_failRow",
			"progressFillFail": "BiQ1zG_progressFillFail",
			"modalRow": "BiQ1zG_modalRow",
			"modalBody": "BiQ1zG_modalBody",
			"failKindUninstall": "BiQ1zG_failKindUninstall",
			"modalTitle": "BiQ1zG_modalTitle",
			"modalLink": "BiQ1zG_modalLink",
			"pendingRowActions": "BiQ1zG_pendingRowActions",
			"progressHead": "BiQ1zG_progressHead",
			"queueRowTrack": "BiQ1zG_queueRowTrack",
			"errorModal": "BiQ1zG_errorModal",
			"toast": "BiQ1zG_toast",
			"restartLater": "BiQ1zG_restartLater",
			"noticeBadgeOk": "BiQ1zG_noticeBadgeOk",
			"linkIcon": "BiQ1zG_linkIcon",
			"resultCheckIcon": "BiQ1zG_resultCheckIcon"
		};
		//#endregion
		//#region src/client/components/icons.tsx
		/**
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
		/** 下拉箭头图标：向下 V 形（stroke 继承 currentColor），下拉框触发器右侧提示可展开。 */
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
		//#endregion
		//#region src/client/components/ProgressView.tsx
		/**
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
		//#region src/client/components/modals.tsx
		/**
		* Dialog layer for the Plugin Hub: the install-confirm dialog, the uninstall
		* dialog and the global toast. Both dialogs lock themselves while a mutation
		* or restart is running, then switch to a result view offering an immediate
		* restart or a "later" deferral.
		*/
		/** 完成结果视图：绿色对勾 + 标题/描述 + 「稍后重启 / 立即重启」按钮对（部分插件需重启后才会挂载） */
		function ResultView({ title, desc, t, restarting, onRestart, onClose }) {
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
			}))), (0, react.createElement)("div", { className: Modal_module_css_default.resultTitle }, title), (0, react.createElement)("div", { className: Modal_module_css_default.resultDesc }, desc), (0, react.createElement)("div", { className: Modal_module_css_default.resultRestarting }, restarting ? t("restarting") : t("restartHint")), (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartLater,
				onClick: onClose,
				disabled: restarting
			}, t("restartLater")), (0, react.createElement)("button", {
				className: Modal_module_css_default.restartNow,
				onClick: onRestart,
				disabled: restarting
			}, restarting ? t("restarting") : t("restartNow"))));
		}
		/**
		* 信任确认弹窗：安装进入后台队列后弹窗仍可关闭（任务继续），
		* 只在本任务执行中展示实时进度；完成后切换为结果视图，与卸载一致。
		*/
		function InstallModal(props) {
			const { plugin, done, task, t, langPath, restarting, submitting, onClose, onCopy, onInstall, onRestart } = props;
			const busy = submitting || task !== null && (task.status === "pending" || task.status === "running");
			const name = plugin.displayName ?? plugin.slug;
			const busyTitle = (label) => langPath === "zh/" ? `${name} 插件${label}` : `${label} ${name}`;
			const title = busy ? task && task.status === "pending" ? busyTitle(t("queuedTitle")) : busyTitle(t("installing")) : done ? t("installResultTitle") : t("confirmTitle");
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
				title: t("installResultTitle"),
				desc: t("installResultDesc"),
				t,
				restarting,
				onRestart,
				onClose
			}) : (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, (0, react.createElement)("div", { className: Modal_module_css_default.trustHint }, t("confirmDesc")), (0, react.createElement)("div", { className: Modal_module_css_default.modalRow }, (0, react.createElement)("span", { className: Modal_module_css_default.modalLabel }, t("confirmPlugin")), (0, react.createElement)("span", {
				className: Modal_module_css_default.modalValue,
				title: plugin.displayName ?? plugin.slug
			}, plugin.displayName ?? plugin.slug)), plugin.source?.repo ? (0, react.createElement)("div", { className: Modal_module_css_default.modalRow }, (0, react.createElement)("span", { className: Modal_module_css_default.modalLabel }, t("confirmSource")), (0, react.createElement)("a", {
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
			}, (0, react.createElement)("span", { className: Modal_module_css_default.modalCmdText }, `dsh plugin add github:${plugin.source?.repo ?? ""}`), (0, react.createElement)("span", { className: Modal_module_css_default.modalCmdCopy }, (0, react.createElement)(CopyIcon), t("copyCmdLabel"))), task && task.status === "pending" ? (0, react.createElement)("div", { className: Modal_module_css_default.queuedHint }, t("queuedHint")) : null, task ? (0, react.createElement)(ProgressView, { task }) : null, (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.modalCopy,
				disabled: busy,
				onClick: onCopy
			}, t("copyInstallCommand")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalInstall,
				disabled: busy,
				onClick: onInstall
			}, busy ? task && task.status === "pending" ? t("queuedTitle") : t("installing") : t("installNow"))))));
		}
		/** 卸载确认弹窗：确认/进行中（后台队列，可关闭）；完成后切换为结果视图（成功即生效，仅「完成」关闭）。 */
		function UninstallModal(props) {
			const { plugin, done, task, t, langPath, restarting, submitting, onClose, onCancel, onCopyCommand, onConfirm, onRestart } = props;
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
			}, (0, react.createElement)("div", { className: Modal_module_css_default.modalHead }, (0, react.createElement)("div", { className: busy ? `${Modal_module_css_default.modalTitle} ${task.status === "pending" ? Modal_module_css_default.modalTitleQueued : Modal_module_css_default.modalTitleBusy}` : Modal_module_css_default.modalTitle }, title), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalClose,
				"aria-label": t("confirmCancel"),
				onClick: () => onClose()
			}, (0, react.createElement)(CloseIcon))), done ? (0, react.createElement)(ResultView, {
				title: t("uninstallResultTitle"),
				desc: t("uninstallResultDesc"),
				t,
				restarting,
				onRestart,
				onClose
			}) : (0, react.createElement)("div", { className: Modal_module_css_default.modalBody }, (0, react.createElement)("div", { className: Modal_module_css_default.modalDesc }, t("uninstallDesc")), (0, react.createElement)("div", { className: Modal_module_css_default.modalRow }, (0, react.createElement)("span", { className: Modal_module_css_default.modalLabel }, t("confirmPlugin")), (0, react.createElement)("span", {
				className: Modal_module_css_default.modalValue,
				title: plugin.displayName ?? plugin.slug
			}, plugin.displayName ?? plugin.slug)), plugin.source?.repo ? (0, react.createElement)("div", { className: Modal_module_css_default.modalRow }, (0, react.createElement)("span", { className: Modal_module_css_default.modalLabel }, t("confirmSource")), (0, react.createElement)("a", {
				className: Modal_module_css_default.modalLink,
				href: pluginDetailUrl(plugin, langPath),
				target: "_blank",
				rel: "noopener noreferrer",
				title: plugin.source.repo
			}, (0, react.createElement)(LinkIcon), plugin.source.repo)) : null, task && task.status === "pending" ? (0, react.createElement)("div", { className: Modal_module_css_default.queuedHint }, t("queuedHint")) : null, task ? (0, react.createElement)(ProgressView, { task }) : null, (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Modal_module_css_default.modalCancel,
				onClick: onCancel
			}, t("confirmCancel")), (0, react.createElement)("button", {
				className: Modal_module_css_default.modalCopy,
				disabled: busy,
				onClick: onCopyCommand
			}, t("copyUninstallCommand")), (0, react.createElement)("button", {
				className: Modal_module_css_default.uninstallConfirm,
				disabled: busy,
				onClick: onConfirm
			}, busy ? task && task.status === "pending" ? t("queuedUninstallTitle") : t("uninstalling") : t("uninstall"))))));
		}
		/** 预填插件仓库的 GitHub Issue 链接：标题带插件名，正文附完整错误信息，方便用户一键反馈。 */
		/** 安装/卸载失败弹窗：布局与失败记录一致（类型徽标 + 仓库超链接 + 隐蔽复制按钮），报错完整展示，底部一键提交 Issue。 */
		function ErrorModal({ message, repo, kind, t, env, onCopy, onClose }) {
			const failureKind = classifyFailure(message);
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
				onClick: () => onCopy(message)
			}, t("errorCopy"))), (0, react.createElement)("pre", { className: Modal_module_css_default.errorBox }, message), failureKind === "pluginPrepare" || failureKind === "pnpmIgnoredBuild" ? (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, failureKind === "pnpmIgnoredBuild" ? t("failIgnoredBuild") : /\[packaging\]/i.test(message) ? t("failPackagingHint") : t("failPrepareHint")), repo ? (0, react.createElement)("a", {
				className: Modal_module_css_default.failBigIssue,
				href: pluginIssueUrl(repo, message, env),
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("failIssueHint")
			}, t("failIssueBig")) : null]) : repo ? (0, react.createElement)("a", {
				className: Modal_module_css_default.failBigIssue,
				href: pluginIssueUrl(repo, message, env),
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
			const text = toast.kind === "copied" ? t("toastCopied") : toast.kind === "errCopied" ? t("errCopied") : toast.kind === "done" ? t("installDone") : toast.kind === "fail" ? t("installFail") : toast.kind === "removed" ? t("uninstallDone") : t("uninstallFail");
			const fail = toast.kind === "fail" || toast.kind === "removeFail";
			return (0, react.createElement)("div", {
				key: toast.id,
				className: fail ? `${Modal_module_css_default.toast} ${Modal_module_css_default.toastFail}` : Modal_module_css_default.toast
			}, text);
		}
		//#endregion
		//#region src/client/components/NotificationsModal.tsx
		/**
		* Notification-center dialog: a persistent log of every settled install /
		* remove task — successes and failures alike.
		*
		* Records are written to localStorage at settle time (see lib/failures.ts),
		* so a result is never lost even when the dialog was dismissed or the user
		* was away. Each entry carries a circular status badge (green check for
		* success, red cross for failure) with white glyph and message text;
		* failures keep their copy / fix / file-an-issue actions. Opened from the
		* header entry button.
		*/
		/** 记录时间紧凑展示：今年内 MM-DD HH:mm，跨年补年份前缀。 */
		function fmtTime(at) {
			const d = new Date(at);
			const pad = (n) => String(n).padStart(2, "0");
			const mmdd = `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
			return d.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear() ? mmdd : `${d.getFullYear()}-${mmdd}`;
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
		function NotificationsModal({ records, tasks, pendingRestarts, t, env, onClose, onCopy, onClear, cancelTask, restarting, onRestart }) {
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
				return (0, react.createElement)("div", {
					key: r.id,
					className: Modal_module_css_default.noticeRow
				}, (0, react.createElement)("div", { className: r.ok ? Modal_module_css_default.noticeBadgeOk : Modal_module_css_default.noticeBadgeFail }, (0, react.createElement)(BadgeGlyph, { ok: r.ok })), (0, react.createElement)("div", { className: Modal_module_css_default.noticeMain }, (0, react.createElement)("div", { className: Modal_module_css_default.noticeHead }, (0, react.createElement)("span", { className: r.ok ? Modal_module_css_default.noticeTextOk : Modal_module_css_default.noticeTextFail }, r.ok ? r.kind === "install" ? t("installDone") : t("uninstallDone") : r.kind === "install" ? t("errorTitleInstall") : t("errorTitleUninstall")), r.repo ? (0, react.createElement)("a", {
					className: Modal_module_css_default.failRepo,
					href: pluginSiteUrl(r.repo),
					target: "_blank",
					rel: "noopener noreferrer",
					title: r.repo
				}, r.repo) : null, (0, react.createElement)("span", {
					className: Modal_module_css_default.failTime,
					title: new Date(r.at).toLocaleString()
				}, fmtTime(r.at)), !r.ok && (0, react.createElement)("button", {
					className: Modal_module_css_default.failCopy,
					onClick: () => onCopy(r.message)
				}, t("failCopy"))), !r.ok && (() => {
					const kind = classifyFailure(r.message);
					if (kind === "pluginPrepare" || kind === "pnpmIgnoredBuild") return (0, react.createElement)("div", null, [(0, react.createElement)("div", { className: Modal_module_css_default.failPrepareHint }, kind === "pnpmIgnoredBuild" ? t("failIgnoredBuild") : /\[packaging\]/i.test(r.message) ? t("failPackagingHint") : t("failPrepareHint")), r.repo ? (0, react.createElement)("a", {
						className: Modal_module_css_default.failBigIssue,
						href: pluginIssueUrl(r.repo, r.message, env),
						target: "_blank",
						rel: "noopener noreferrer",
						title: t("failIssueHint")
					}, t("failIssueBig")) : null]);
					return r.repo ? (0, react.createElement)("a", {
						className: Modal_module_css_default.failBigIssue,
						href: pluginIssueUrl(r.repo, r.message, env),
						target: "_blank",
						rel: "noopener noreferrer",
						title: t("failIssueHint")
					}, t("failIssueBig")) : null;
				})()));
			})), (0, react.createElement)("div", { className: Modal_module_css_default.modalActions }, records.length > 0 ? (0, react.createElement)("button", {
				className: Modal_module_css_default.failClear,
				onClick: onClear
			}, t("notificationsClear")) : null, (0, react.createElement)("button", {
				className: Modal_module_css_default.restartNow,
				onClick: onClose
			}, t("errorClose"))))));
		}
		//#endregion
		//#region src/client/components/CatalogHeader.tsx
		/**
		* Section header: brand title row (H1 + open-site button) + tagline, followed
		* by the purple ad banner that promotes the catalog stats.
		*/
		function CatalogHeader({ t, langPath, statsTotal, statsVerified }) {
			return (0, react.createElement)(react.Fragment, null, (0, react.createElement)("div", { className: Header_module_css_default.header }, (0, react.createElement)("div", { className: Header_module_css_default.headerTitleRow }, (0, react.createElement)("a", {
				className: Header_module_css_default.brandTitle,
				href: `${SITE_URL}${langPath}`,
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("openHint"),
				"aria-label": t("openHint")
			}, (0, react.createElement)(LogoIcon), (0, react.createElement)("h1", { className: Header_module_css_default.title }, t("title"), (0, react.createElement)("span", { className: Header_module_css_default.version }, ` v${PLUGIN_VERSION}`))), (0, react.createElement)("a", {
				className: Header_module_css_default.githubLink,
				href: GITHUB_URL,
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("githubHint"),
				"aria-label": t("githubHint")
			}, (0, react.createElement)(GitHubIcon))), (0, react.createElement)("a", {
				className: Header_module_css_default.taglineLink,
				href: `${SITE_URL}${langPath}`,
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("openHint")
			}, (0, react.createElement)("div", { className: Header_module_css_default.tagline }, t("tagline", {
				total: statsTotal,
				verified: statsVerified
			})))), (0, react.createElement)("a", {
				className: Header_module_css_default.adBanner,
				href: `${SITE_URL}${langPath}`,
				target: "_blank",
				rel: "noopener noreferrer"
			}, (0, react.createElement)("span", { className: Header_module_css_default.adBadge }, t("adBadge")), (0, react.createElement)("span", { className: Header_module_css_default.adText }, t("ad", {
				total: statsTotal,
				verified: statsVerified
			})), (0, react.createElement)("span", { className: Header_module_css_default.adArrow }, "↗")));
		}
		//#endregion
		//#region src/client/components/CategoryTabs.tsx
		/**
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
		//#region \0dsh-css:src/client/styles/Dropdown.module.css.mjs
		const css$2 = ".B_Gxsq_dropdown{flex-shrink:0;display:inline-flex;position:relative}.B_Gxsq_dropdownBtn{height:24px;color:var(--hub-text-primary);cursor:pointer;-webkit-user-select:none;user-select:none;white-space:nowrap;background:0 0;border:none;border-radius:6px;align-items:center;gap:6px;padding:0 10px;font-size:12px;line-height:22px;transition:background .12s;display:inline-flex}.B_Gxsq_dropdownBtn:hover{background:var(--hub-bg-hover)}.B_Gxsq_dropdownLabel{text-overflow:ellipsis;min-width:0;overflow:hidden}.B_Gxsq_dropdownArrow,.B_Gxsq_dropdownArrowOpen{color:var(--hub-text-tertiary);justify-content:center;align-items:center;transition:transform .12s;display:inline-flex}.B_Gxsq_dropdownArrowOpen{transform:rotate(180deg)}.B_Gxsq_dropdownPanel{z-index:50;background:var(--hub-bg-1);border:1px solid var(--hub-border-2);border-radius:8px;flex-direction:column;gap:2px;min-width:100%;padding:4px;display:flex;position:absolute;top:calc(100% + 4px);left:0;box-shadow:0 8px 24px #00000024}.B_Gxsq_dropdownItem,.B_Gxsq_dropdownItemActive{cursor:pointer;-webkit-user-select:none;user-select:none;white-space:nowrap;text-align:left;border:none;border-radius:6px;justify-content:space-between;align-items:center;gap:10px;padding:4px 9px;font-size:12px;line-height:18px;transition:background .12s,color .12s;display:flex}.B_Gxsq_dropdownItem{color:var(--hub-text-primary);background:0 0}.B_Gxsq_dropdownItem:hover{background:var(--hub-bg-hover)}.B_Gxsq_dropdownItemActive{color:var(--hub-text-on-fill);background:var(--hub-btn-fill)}.B_Gxsq_dropdownItemLabel{text-overflow:ellipsis;min-width:0;overflow:hidden}.B_Gxsq_dropdownCount,.B_Gxsq_dropdownCountActive{text-align:center;border-radius:999px;min-width:16px;padding:0 6px;font-size:10px;line-height:14px}.B_Gxsq_dropdownCount{color:var(--hub-text-tertiary);background:var(--hub-bg-btn)}.B_Gxsq_dropdownItemActive .B_Gxsq_dropdownCountActive{color:var(--hub-text-on-fill);background:var(--hub-bg-on-fill)}";
		const tagId$2 = "dsh-plugin/Dropdown.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var Dropdown_module_css_default = {
			"dropdownBtn": "B_Gxsq_dropdownBtn",
			"dropdownItemActive": "B_Gxsq_dropdownItemActive",
			"dropdownCountActive": "B_Gxsq_dropdownCountActive",
			"dropdownLabel": "B_Gxsq_dropdownLabel",
			"dropdownArrow": "B_Gxsq_dropdownArrow",
			"dropdownItemLabel": "B_Gxsq_dropdownItemLabel",
			"dropdownPanel": "B_Gxsq_dropdownPanel",
			"dropdownCount": "B_Gxsq_dropdownCount",
			"dropdown": "B_Gxsq_dropdown",
			"dropdownItem": "B_Gxsq_dropdownItem",
			"dropdownArrowOpen": "B_Gxsq_dropdownArrowOpen"
		};
		//#endregion
		//#region src/client/components/Dropdown.tsx
		/**
		* Custom dropdown (native <select> replacement).
		*
		* macOS/浏览器原生下拉无法跟随宿主主题，这里自绘：触发器按钮 + 绝对定位面板，
		* 点外部/Esc 关闭；选项 hover 加重底色、激活项深色实心高亮，全部走 --dsw-alias-* 主题变量。
		*/
		function Dropdown({ value, options, onChange, title }) {
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
				className: Dropdown_module_css_default.dropdown,
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
		//#region src/client/components/CatalogControls.tsx
		/**
		* Toolbar above the list: search input + sort dropdown + installed / not
		* installed filter buttons + the notifications entry. All buttons share the
		* same size (24px high, like the notification entry button).
		*/
		function CatalogControls({ query, setQuery, sort, setSort, installedFilter, setInstalledFilter, installedCount, notInstalledCount, t, resultText, noticeCount, onOpenNotifications }) {
			return (0, react.createElement)(react.Fragment, null, (0, react.createElement)("div", { className: Header_module_css_default.searchRow }, (0, react.createElement)("input", {
				className: Header_module_css_default.search,
				type: "search",
				placeholder: t("search"),
				value: query,
				spellCheck: false,
				onInput: (e) => setQuery(e.target.value)
			})), (0, react.createElement)("div", { className: Header_module_css_default.controls }, resultText ? (0, react.createElement)("span", { className: Header_module_css_default.filterResults }, ...resultText.split(/(\d+)/).map((part, i) => /^\d+$/.test(part) ? (0, react.createElement)("span", {
				key: i,
				className: Header_module_css_default.resultCount
			}, part) : part)) : null, (0, react.createElement)("button", {
				className: installedFilter === "all" ? Header_module_css_default.installedBtnActive : Header_module_css_default.installedBtn,
				onClick: () => setInstalledFilter("all"),
				title: t("filterAllHint"),
				"aria-pressed": installedFilter === "all"
			}, t("all")), Dropdown({
				value: sort,
				options: SORTS.map((key) => ({
					value: key,
					label: t(key)
				})),
				onChange: setSort
			}), (0, react.createElement)("button", {
				className: installedFilter === "installed" ? Header_module_css_default.installedBtnActive : installedCount === 0 ? Header_module_css_default.installedBtnDisabled : Header_module_css_default.installedBtn,
				onClick: () => setInstalledFilter("installed"),
				disabled: installedCount === 0,
				title: installedCount === 0 ? t("filterInstalledNone") : t("filterInstalledHint"),
				"aria-pressed": installedFilter === "installed"
			}, t("installed"), (0, react.createElement)("span", { className: installedFilter === "installed" ? Header_module_css_default.segCountActive : Header_module_css_default.segCount }, installedCount)), (0, react.createElement)("button", {
				className: installedFilter === "notInstalled" ? Header_module_css_default.installedBtnActive : notInstalledCount === 0 ? Header_module_css_default.installedBtnDisabled : Header_module_css_default.installedBtn,
				onClick: () => setInstalledFilter("notInstalled"),
				disabled: notInstalledCount === 0,
				title: notInstalledCount === 0 ? t("filterNotInstalledNone") : t("filterNotInstalledHint"),
				"aria-pressed": installedFilter === "notInstalled"
			}, t("notInstalled"), (0, react.createElement)("span", { className: installedFilter === "notInstalled" ? Header_module_css_default.segCountActive : Header_module_css_default.segCount }, notInstalledCount)), (0, react.createElement)("button", {
				className: Header_module_css_default.failBtn,
				onClick: onOpenNotifications,
				title: t("notificationsHint"),
				"aria-label": t("notificationsHint")
			}, t("notificationsBtn"), noticeCount > 0 ? (0, react.createElement)("span", { className: Header_module_css_default.failBadge }, noticeCount) : null)));
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/List.module.css.mjs
		const css$1 = "._3XaZHa_body{flex-direction:column;flex:1;min-height:0;display:flex}._3XaZHa_list{flex-direction:column;flex:1;gap:6px;min-height:0;padding:2px 4px 4px 2px;display:flex;overflow-y:auto}._3XaZHa_card{border:1px solid var(--hub-border-2);background:var(--hub-bg-1);border-radius:8px;justify-content:space-between;align-items:stretch;gap:12px;padding:9px 12px;transition:border-color .12s,background .12s;display:flex}._3XaZHa_card:hover{border-color:var(--hub-brand);background:var(--hub-bg-2)}._3XaZHa_cardMain{flex-direction:column;gap:4px;min-width:0;display:flex}._3XaZHa_cardHead{align-items:center;gap:6px;min-width:0;display:flex}._3XaZHa_cardTitle{white-space:nowrap;text-overflow:ellipsis;font-size:13px;font-weight:600;line-height:18px;overflow:hidden}._3XaZHa_categoryBadge,._3XaZHa_verified,._3XaZHa_versionBadge,._3XaZHa_updateBadge{border:1px solid #0000;border-radius:4px;flex-shrink:0;padding:0 6px;font-size:10px;line-height:16px}._3XaZHa_categoryBadge{color:var(--hub-brand);border-color:var(--hub-border-ghost)}._3XaZHa_verified{color:var(--hub-success);border-color:var(--hub-success-border)}._3XaZHa_versionBadge{color:var(--hub-text-secondary);border-color:var(--hub-border-input)}._3XaZHa_updateBadge{color:var(--hub-warn);border-color:var(--hub-warn-border);background:var(--hub-warn-tint)}._3XaZHa_desc{color:var(--hub-text-secondary);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0;font-size:12px;line-height:18px;display:-webkit-box;overflow:hidden}._3XaZHa_topics{flex-wrap:wrap;align-items:center;gap:4px;min-width:0;display:flex}._3XaZHa_topic{color:var(--hub-text-tertiary);background:var(--hub-bg-3);white-space:nowrap;border-radius:4px;flex-shrink:0;padding:0 6px;font-size:10px;line-height:16px}._3XaZHa_cardSide{flex-direction:column;flex-shrink:0;justify-content:space-between;align-items:flex-end;gap:6px;display:flex}._3XaZHa_stats{flex-direction:column;align-items:flex-end;gap:1px;display:flex}._3XaZHa_star{color:var(--hub-warn);white-space:nowrap;font-size:11px;line-height:16px}._3XaZHa_fork{color:var(--hub-text-tertiary);white-space:nowrap;font-size:11px;line-height:16px}._3XaZHa_date{color:var(--hub-text-tertiary);white-space:nowrap;font-size:10px;line-height:14px}._3XaZHa_installBtn,._3XaZHa_installBtnCopied,._3XaZHa_installBtnInstalled,._3XaZHa_installBtnUpdate,._3XaZHa_uninstallBtn,._3XaZHa_detailBtn{cursor:pointer;border-radius:6px;padding:2px 10px;font-size:11px;line-height:18px;transition:color .12s,border-color .12s,background .12s}._3XaZHa_installBtnInstalled{color:var(--hub-success);background:var(--hub-success-tint);cursor:default;-webkit-user-select:none;user-select:none;border:none}._3XaZHa_installBtnUpdate{color:#fff;background:var(--hub-warn);-webkit-user-select:none;user-select:none;border:none;font-weight:500}._3XaZHa_installBtnUpdate:hover{background:var(--hub-warn-strong)}._3XaZHa_uninstallBtn{color:var(--hub-danger);-webkit-user-select:none;user-select:none;background:0 0;border:none}._3XaZHa_uninstallBtn:hover{color:#fff;background:var(--hub-danger)}._3XaZHa_installBtn{color:var(--hub-text-on-fill);background:var(--hub-btn-fill);-webkit-user-select:none;user-select:none;border:none;font-weight:500}._3XaZHa_installBtn:hover{background:var(--hub-btn-hover)}._3XaZHa_detailBtn{color:var(--hub-text-secondary);-webkit-user-select:none;user-select:none;background:0 0;border:none;align-items:center;text-decoration:none;display:inline-flex}._3XaZHa_detailBtn:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}._3XaZHa_actions{align-items:center;gap:6px;display:flex}._3XaZHa_installBtnCopied{color:var(--hub-success);background:var(--hub-success-tint);-webkit-user-select:none;user-select:none;border:none}._3XaZHa_state{text-align:center;min-height:160px;color:var(--hub-text-tertiary);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:8px;padding:24px;font-size:12px;line-height:18px;display:flex}._3XaZHa_stateTitle{color:var(--hub-text-primary);font-size:13px;font-weight:600}._3XaZHa_stateDesc{max-width:420px}._3XaZHa_retryBtn{color:var(--hub-text-secondary);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;margin-top:4px;padding:4px 12px;font-size:12px;line-height:18px}._3XaZHa_retryBtn:hover{color:var(--hub-text-primary);background:var(--hub-bg-hover)}._3XaZHa_footer{border-top:1px solid var(--hub-border-1);flex-shrink:0;justify-content:flex-end;align-items:center;gap:8px;padding:6px 4px 0;display:flex}._3XaZHa_footLink{color:var(--hub-brand);white-space:nowrap;-webkit-user-select:none;user-select:none;font-size:11px;line-height:16px;text-decoration:none}._3XaZHa_footLink:hover{text-decoration:underline}";
		const tagId$1 = "dsh-plugin/List.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var List_module_css_default = {
			"cardMain": "_3XaZHa_cardMain",
			"installBtnInstalled": "_3XaZHa_installBtnInstalled",
			"versionBadge": "_3XaZHa_versionBadge",
			"installBtn": "_3XaZHa_installBtn",
			"footer": "_3XaZHa_footer",
			"topic": "_3XaZHa_topic",
			"installBtnCopied": "_3XaZHa_installBtnCopied",
			"state": "_3XaZHa_state",
			"detailBtn": "_3XaZHa_detailBtn",
			"stateTitle": "_3XaZHa_stateTitle",
			"star": "_3XaZHa_star",
			"footLink": "_3XaZHa_footLink",
			"card": "_3XaZHa_card",
			"fork": "_3XaZHa_fork",
			"date": "_3XaZHa_date",
			"updateBadge": "_3XaZHa_updateBadge",
			"retryBtn": "_3XaZHa_retryBtn",
			"body": "_3XaZHa_body",
			"desc": "_3XaZHa_desc",
			"uninstallBtn": "_3XaZHa_uninstallBtn",
			"categoryBadge": "_3XaZHa_categoryBadge",
			"cardSide": "_3XaZHa_cardSide",
			"actions": "_3XaZHa_actions",
			"installBtnUpdate": "_3XaZHa_installBtnUpdate",
			"cardTitle": "_3XaZHa_cardTitle",
			"cardHead": "_3XaZHa_cardHead",
			"list": "_3XaZHa_list",
			"topics": "_3XaZHa_topics",
			"verified": "_3XaZHa_verified",
			"stats": "_3XaZHa_stats",
			"stateDesc": "_3XaZHa_stateDesc"
		};
		//#endregion
		//#region src/client/lib/format.ts
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
		//#region src/client/components/PluginCard.tsx
		/**
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
			}, t("updateAvailable")) : null, p.category ? (0, react.createElement)("span", { className: List_module_css_default.categoryBadge }, categoryLabel(CATEGORY_LABELS, p.category, langKey)) : null, p.compatibility?.status === "verified" ? (0, react.createElement)("span", { className: List_module_css_default.verified }, t("verified")) : null), p.description && (langKey === "zh" || !/[\u4e00-\u9fff]/.test(p.description)) ? (0, react.createElement)("p", { className: List_module_css_default.desc }, p.description) : null, (p.topics?.length ?? 0) > 0 ? (0, react.createElement)("div", { className: List_module_css_default.topics }, p.topics.slice(0, 3).map((topic) => (0, react.createElement)("span", {
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
				onClick: () => onInstall(p)
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
		//#region src/client/components/CatalogList.tsx
		/**
		* Catalog list: the scrollable container with the loading / failed / empty
		* states, the plugin cards, and the count footer. Resets scroll position when
		* the category or install-status filter changes so the replaced content is
		* not mistaken for a no-op update.
		*/
		function CatalogList({ plugins, failed, visible, total, t, langPath, reload, category, installedFilter, copied, installedName, installedVersion, hasUpdate, langKey, onInstall, onUninstall }) {
			/** 列表滚动容器：分类/搜索切换后列表内容替换但 scrollTop 保留，会让用户误以为列表没更新，需重置回顶部 */
			const listRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				listRef.current?.scrollTo({ top: 0 });
			}, [category, installedFilter]);
			return (0, react.createElement)("div", { className: List_module_css_default.body }, (0, react.createElement)("div", {
				ref: listRef,
				className: List_module_css_default.list
			}, plugins === null && !failed && (0, react.createElement)("div", { className: List_module_css_default.state }, t("loading")), failed && (0, react.createElement)("div", { className: List_module_css_default.state }, (0, react.createElement)("div", { className: List_module_css_default.stateTitle }, t("failed")), (0, react.createElement)("div", { className: List_module_css_default.stateDesc }, t("failedDesc")), (0, react.createElement)("button", {
				className: List_module_css_default.retryBtn,
				onClick: () => reload()
			}, t("retry"))), plugins !== null && !failed && visible.length === 0 && (0, react.createElement)("div", { className: List_module_css_default.state }, (0, react.createElement)("div", { className: List_module_css_default.stateTitle }, t("noResult")), (0, react.createElement)("div", { className: List_module_css_default.stateDesc }, t("noResultDesc"))), plugins !== null && !failed && visible.map((p) => (0, react.createElement)(PluginCard, {
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
			}))), plugins !== null && !failed && (0, react.createElement)("div", { className: List_module_css_default.footer }, (0, react.createElement)("a", {
				className: List_module_css_default.footLink,
				href: `https://dsh-plugin.org/${langPath}`,
				target: "_blank",
				rel: "noopener noreferrer"
			}, t("browseAll", { n: total }))));
		}
		//#endregion
		//#region src/client/components/PluginHubSection.tsx
		/**
		* Plugin Hub section: wires the catalog data pipeline, the background task
		* queue and the feedback state together. Data/queue logic lives in hooks/,
		* rendering is delegated to the small presentational components in this
		* folder; only the dialogs/toast and the section-level copy actions remain.
		*/
		function PluginHubSection({ t: _hostT, locale }) {
			/** 界面语言跟随宿主（系统）语言自动切换，不提供手动切换按钮 */
			const lang = locale.getSnapshot().active;
			const langKey = lang === "en" ? "en" : "zh";
			const langPath = langPathOf(lang);
			const dict = langKey === "en" ? en : zh;
			const t = (key, params) => {
				const raw = dict[key] ?? key;
				return params ? raw.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? "")) : raw;
			};
			const catalog = useCatalog(lang);
			/** 全局反馈 Toast：{id} 用于重复触发时重新走入场动画，kind 决定文案与配色 */
			const [toast, setToast] = (0, react.useState)(null);
			/** 复制反馈：记录刚复制安装命令的仓库，按钮短暂切换为「已复制」样式 */
			const [copied, setCopied] = (0, react.useState)(null);
			/** 信任确认弹窗：记录待安装的插件，确认后才执行复制 */
			const [confirmPlugin, setConfirmPlugin] = (0, react.useState)(null);
			/** 卸载确认弹窗：记录待卸载的插件 */
			const [uninstallPlugin, setUninstallPlugin] = (0, react.useState)(null);
			/** 安装/卸载完成后的结果视图：停留弹窗内，点「完成」关闭 */
			const [installDone, setInstallDone] = (0, react.useState)(false);
			const [uninstallDone, setUninstallDone] = (0, react.useState)(false);
			/** 结果视图「立即重启」：请求宿主重启后进入等待，服务回来后整页刷新 */
			const [restarting, setRestarting] = (0, react.useState)(false);
			/** 操作失败完整信息 + 所属插件仓库 + 失败类型（决定弹窗标题「安装失败/卸载失败」） */
			const [errorMsg, setErrorMsg] = (0, react.useState)(null);
			/** 安装/卸载任务通知记录：localStorage 持久化，成败即落盘，即使错过弹窗也能回来查看 */
			const [notifications, setNotifications] = (0, react.useState)(() => loadNotifications());
			const [showNotifications, setShowNotifications] = (0, react.useState)(false);
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
			const queue = useTaskQueue({
				t,
				refreshInstalled: catalog.refreshInstalled,
				onInstallDone: (viaModal, repo) => {
					if (viaModal) setInstallDone(true);
					else setToast({
						id: Date.now(),
						kind: "done"
					});
					setNotifications(addSuccess({
						kind: "install",
						repo: repo ?? ""
					}));
				},
				onUninstallDone: (viaModal, repo) => {
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
				onError: (message, repo, kind) => {
					setErrorMsg({
						message,
						repo,
						kind
					});
					setNotifications(addFailure({
						kind,
						repo: repo ?? "",
						message
					}));
				},
				installPlugin: confirmPlugin,
				uninstallPlugin,
				installedName: catalog.installedName,
				resolvePending: (repo) => {
					const p = catalog.plugins?.find((x) => x.source?.repo === repo);
					return p ? {
						desc: p.description,
						version: p.version
					} : null;
				}
			});
			(0, react.useEffect)(() => {
				if (!confirmPlugin && !uninstallPlugin && !showNotifications) return;
				const onKey = (e) => {
					if (e.key === "Escape") {
						setConfirmPlugin(null);
						setUninstallPlugin(null);
						setUninstallDone(false);
						setShowNotifications(false);
					}
				};
				window.addEventListener("keydown", onKey);
				return () => window.removeEventListener("keydown", onKey);
			}, [
				confirmPlugin,
				uninstallPlugin,
				showNotifications
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
			/** 弹窗动作一：复制安装命令到剪贴板，引导去终端粘贴执行。 */
			const copyCommand = async (p) => {
				const repo = p.source?.repo ?? "";
				if (await doCopy(`dsh plugin add github:${repo}`)) {
					setCopied(repo);
					setToast({
						id: Date.now(),
						kind: "copied"
					});
					window.setTimeout(() => setCopied((cur) => cur === repo ? null : cur), 1600);
				}
				setConfirmPlugin(null);
			};
			/** 卸载弹窗动作：复制卸载命令，万一直接卸载失败可去终端手动执行。 */
			const copyUninstallCommand = async () => {
				const name = uninstallPlugin ? catalog.installedName(uninstallPlugin) : null;
				if (!name) return;
				if (await doCopy(`dsh plugin remove ${name}`)) setToast({
					id: Date.now(),
					kind: "copied"
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
			return (0, react.createElement)("div", { className: Header_module_css_default.root }, (0, react.createElement)(CatalogHeader, {
				t,
				langPath,
				statsTotal,
				statsVerified
			}), (0, react.createElement)(CategoryTabs, {
				category: catalog.category,
				setCategory: catalog.setCategory,
				allLabel: t("all"),
				totalCount: catalog.total,
				langKey
			}), (0, react.createElement)(CatalogControls, {
				query: catalog.query,
				setQuery: catalog.setQuery,
				sort: catalog.sort,
				setSort: catalog.setSort,
				installedFilter: catalog.installedFilter,
				setInstalledFilter: catalog.setInstalledFilter,
				installedCount: catalog.installedCountInCategory,
				notInstalledCount: catalog.notInstalledCountInCategory,
				t,
				resultText: catalog.plugins === null || catalog.failed ? null : catalog.category === "all" && count === total ? t("pluginsTotal", { n: count }) : t("filterResults", { n: count }),
				noticeCount: notifications.length + queue.queue.length + queue.pendingRestarts.length,
				onOpenNotifications: () => setShowNotifications(true)
			}), (0, react.createElement)(CatalogList, {
				plugins: catalog.plugins,
				failed: catalog.failed,
				visible: catalog.visible,
				total,
				t,
				langPath,
				reload: catalog.reload,
				category: catalog.category,
				installedFilter: catalog.installedFilter,
				copied,
				installedName,
				installedVersion,
				hasUpdate,
				langKey,
				onInstall: (p) => {
					setInstallDone(false);
					queue.clearModalTask();
					setConfirmPlugin(p);
				},
				onUninstall: (p) => {
					setUninstallDone(false);
					queue.clearModalTask();
					setUninstallPlugin(p);
				}
			}), confirmPlugin && (0, react.createElement)(InstallModal, {
				plugin: confirmPlugin,
				done: installDone,
				task: queue.installModalTask,
				t,
				langPath,
				restarting,
				submitting: queue.submitting,
				onClose: () => setConfirmPlugin(null),
				onCopy: () => copyCommand(confirmPlugin),
				onInstall: () => queue.installNow(confirmPlugin),
				onRestart: () => {
					requestRestart();
				}
			}), uninstallPlugin && (0, react.createElement)(UninstallModal, {
				plugin: uninstallPlugin,
				done: uninstallDone,
				task: queue.uninstallModalTask,
				t,
				langPath,
				restarting,
				submitting: queue.submitting,
				onClose: () => {
					setUninstallDone(false);
					setUninstallPlugin(null);
				},
				onCancel: () => setUninstallPlugin(null),
				onCopyCommand: copyUninstallCommand,
				onConfirm: () => queue.uninstallNow(uninstallPlugin),
				onRestart: () => {
					requestRestart();
				}
			}), toast && (0, react.createElement)(Toast, {
				toast,
				t
			}), errorMsg && (0, react.createElement)(ErrorModal, {
				message: errorMsg.message,
				repo: errorMsg.repo,
				kind: errorMsg.kind,
				t,
				env,
				onCopy: (text) => {
					doCopy(text);
					setToast({
						id: Date.now(),
						kind: "errCopied"
					});
				},
				onClose: () => setErrorMsg(null)
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
				cancelTask: queue.cancelTask,
				restarting,
				onRestart: () => {
					requestRestart();
				}
			}));
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/tokens.module.css.mjs
		const css = ":root,body[data-ds-dark-theme]{--hub-text-primary:var(--dsw-alias-label-primary,#1f2328);--hub-text-secondary:var(--dsw-alias-label-secondary,#6b7280);--hub-text-tertiary:var(--dsw-alias-label-tertiary,#8b93a1);--hub-text-disabled:var(--dsw-alias-label-disabled,#aab1bd);--hub-text-on-fill:var(--dsw-alias-label-primary-foreground,#fff);--hub-bg-1:var(--dsw-alias-bg-layer-1,#fff);--hub-bg-2:var(--dsw-alias-bg-layer-2,#80808014);--hub-bg-3:#8080801a;--hub-bg-btn:#8080801f;--hub-bg-hover:var(--dsw-alias-interactive-bg-hover,#80808029);--hub-bg-on-fill:#80808038;--hub-border-1:var(--dsw-alias-border-l1,#eceef1);--hub-border-2:var(--dsw-alias-border-l2,#e5e7eb);--hub-border-ghost:var(--dsw-alias-button-ghost-active-border,#4f6ef740);--hub-border-input:var(--dsw-alias-input-border,#6b728040);--hub-brand:var(--dsw-alias-state-business-primary,#4f6ef7);--hub-brand-hover:#3b5bdb;--hub-brand-tint:#4f6ef70f;--hub-brand-tint-strong:#4f6ef71f;--hub-brand-border:#4f6ef759;--hub-brand-border-soft:#4f6ef738;--hub-purple-1:#4f46e5;--hub-purple-2:#7c3aed;--hub-purple-border:#8b5cf68c;--hub-purple-tint:#4f46e514;--hub-purple-shadow:#4f46e547;--hub-purple-shadow-strong:#7c3aed6b;--hub-btn-fill:var(--dsw-alias-button-primary-fill,#1f2328);--hub-btn-hover:var(--dsw-alias-button-primary-hover,#43454a);--hub-success:var(--dsw-alias-state-success-primary,#1a7f37);--hub-success-tint:#22c55e24;--hub-success-border:var(--dsw-alias-state-success-secondary,#1a7f374d);--hub-warn:var(--dsw-alias-state-warn-primary,#b8860b);--hub-warn-tint:#b8860b14;--hub-warn-border:#b8860b59;--hub-warn-strong:#b8860bd9;--hub-warning:var(--dsw-alias-state-warning-primary,#b45309);--hub-warning-tint:#b4530914;--hub-warning-border:#b453094d;--hub-danger:var(--dsw-alias-state-danger-primary,#d1242f);--hub-danger-hover:var(--dsw-alias-state-danger-hover,#b91c1c);--hub-danger-strong:#b0202a;--hub-danger-text:#e5484d;--hub-danger-tint:#e5484d14;--hub-danger-tint-weak:#e5484d0d;--hub-danger-border:#e5484d59;--hub-danger-border-soft:#e5484d47;--hub-danger-soft:#d1242f14}body[data-ds-dark-theme]{--hub-bg-btn:#ffffff1f}";
		const tagId = "dsh-plugin/tokens.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region src/client/index.tsx
		/**
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