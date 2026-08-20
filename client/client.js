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
			filterInstalledHint: "点击「已安装」筛选已装插件，再点一次恢复全部",
			filterNotInstalledHint: "点击「未安装」筛选未装插件，再点一次恢复全部",
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
			installFail: "安装失败，可复制命令手动安装",
			confirmCancel: "取消",
			runningTask: "插件操作进行中…",
			runningInstall: "插件安装进行中…",
			runningUninstall: "插件卸载进行中…",
			progressShow: "查看进度",
			progressHide: "收起",
			queuedTitle: "等待安装…",
			queuedHint: "已加入队列，前序任务完成后自动开始，可关闭本窗口继续浏览。",
			queueMore: "另有 {n} 项排队",
			queueWaiting: "队列中有 {n} 项任务等待执行",
			cancelTask: "取消任务",
			errorTitle: "操作失败",
			errorTitleInstall: "安装失败",
			errorTitleUninstall: "卸载失败",
			errorPlugin: "插件",
			errorClose: "知道了",
			errorCopy: "复制错误信息",
			errCopied: "错误信息已复制，可去终端排查",
			failures: "安装失败",
			failuresHint: "查看安装/卸载失败记录",
			failuresDesc: "失败会自动记录在这里，即使错过错误弹窗也能随时回来查看。",
			failuresEmpty: "暂无失败记录",
			failuresClear: "清空记录",
			failCopy: "复制错误日志",
			failIssueHint: "带着错误日志去作者仓库一键提交 Issue（正文含官网收录链接）",
			failIssueBig: "一键提交 BUG 到 GitHub Issue 为开源作贡献",
			errorHint: "该错误来自插件作者提供的安装程序，与插件中心无关。可复制错误信息，或一键前往插件仓库提交 Issue。",
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
			fork: "Fork",
			loading: "Loading plugin data…",
			failed: "Failed to load plugin data",
			failedDesc: "Please retry, or open the hub in your browser with the button above.",
			retry: "Retry",
			install: "Install",
			toastCopied: "Install command copied — paste it in your dsh terminal",
			installed: "Installed",
			notInstalled: "Not installed",
			filterInstalledHint: "Click \"Installed\" to filter to installed plugins, click again to show all",
			filterNotInstalledHint: "Click \"Not installed\" to filter to uninstalled plugins, click again to show all",
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
			runningTask: "Plugin operation in progress…",
			runningInstall: "Plugin install in progress…",
			runningUninstall: "Plugin removal in progress…",
			progressShow: "View progress",
			progressHide: "Hide",
			queuedTitle: "Queued…",
			queuedHint: "Queued — starts automatically after earlier tasks finish. You may close this window.",
			queueMore: "{n} more queued",
			queueWaiting: "{n} tasks waiting in queue",
			cancelTask: "Cancel task",
			errorTitle: "Operation failed",
			errorTitleInstall: "Install failed",
			errorTitleUninstall: "Removal failed",
			errorPlugin: "Plugin",
			errorClose: "Got it",
			errorCopy: "Copy error",
			errCopied: "Error copied — check it in your terminal",
			failures: "Install failures",
			failuresHint: "View install/remove failure records",
			failuresDesc: "Failures are logged here automatically, even if you missed the error dialog.",
			failuresEmpty: "No failure records yet",
			failuresClear: "Clear records",
			failCopy: "Copy error log",
			failIssueHint: "Open a pre-filled issue on the author repo with this error log (includes catalog links)",
			failIssueBig: "Report this bug to GitHub — contribute to open source",
			errorHint: "This error comes from the plugin author's installer, not the Plugin Hub. Copy it or report it to the plugin repository.",
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
			empty: "No plugins in this category yet",
			dataFrom: "Data from dsh-plugin.org · curated daily"
		};
		//#endregion
		//#region \0dsh-css:src/client/styles/Section.module.css.mjs
		const css$1 = ".p2YUJW_root{--dsw-alias-brand-primary:var(--dsw-alias-state-business-primary,#4f6ef7);min-width:0;height:100%;color:var(--dsw-alias-label-primary,#1f2328);flex-direction:column;gap:8px;display:flex}.p2YUJW_header{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding:2px 2px 0;display:flex}.p2YUJW_brand{min-width:0;color:inherit;cursor:pointer;align-items:center;gap:10px;text-decoration:none;display:flex}.p2YUJW_brandText{flex-direction:column;gap:1px;min-width:0;display:flex}.p2YUJW_titleRow{align-items:center;gap:8px;min-width:0;display:flex}.p2YUJW_title{margin:0;font-size:14px;font-weight:600;line-height:20px}.p2YUJW_version{color:var(--dsw-alias-label-secondary,#6b7280)}.p2YUJW_logoIcon{flex-shrink:0;display:block}.p2YUJW_copyIcon{flex-shrink:0}.p2YUJW_tagline{color:var(--dsw-alias-label-tertiary,#8b93a1);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0;font-size:12px;line-height:18px;display:-webkit-box;overflow:hidden}.p2YUJW_controls{flex-shrink:0;align-items:center;gap:8px;display:flex}.p2YUJW_filterResults{color:var(--dsw-alias-label-tertiary,#8b93a1);white-space:nowrap;flex-shrink:0;align-items:baseline;font-size:12px;line-height:18px;display:inline-flex}.p2YUJW_resultCount{font-variant-numeric:tabular-nums;text-align:center;min-width:5ch}.p2YUJW_adBanner{color:#fff;cursor:pointer;-webkit-user-select:none;user-select:none;background:linear-gradient(90deg,#4f46e5 0%,#7c3aed 100%);border:1px solid #8b5cf68c;border-radius:8px;align-items:center;gap:8px;padding:7px 12px;text-decoration:none;transition:filter .15s,box-shadow .15s;display:flex;box-shadow:0 2px 10px #4f46e547}.p2YUJW_adBanner:hover{filter:brightness(1.1);box-shadow:0 4px 16px #7c3aed6b}.p2YUJW_adBadge{letter-spacing:.04em;color:#fff;white-space:nowrap;background:#ffffff29;border:1px solid #ffffff8c;border-radius:4px;flex-shrink:0;padding:3px 6px;font-size:10px;font-weight:700;line-height:1}.p2YUJW_adText{text-overflow:ellipsis;white-space:nowrap;color:#fff;min-width:0;font-size:12px;line-height:18px;overflow:hidden}.p2YUJW_adArrow{color:#fff;flex-shrink:0;margin-left:auto;font-size:13px}.p2YUJW_searchRow{padding:0 2px;display:flex}.p2YUJW_search{width:100%;color:inherit;border:1px solid var(--dsw-alias-border-l2,#e5e7eb);background:0 0;border-radius:6px;outline:none;padding:4px 9px;font-size:12px;line-height:18px;transition:border-color .12s}.p2YUJW_search::placeholder{color:var(--dsw-alias-label-tertiary,#8b93a1)}.p2YUJW_search:focus{border-color:var(--dsw-alias-brand-primary,#4f6ef7)}.p2YUJW_installedBtn,.p2YUJW_installedBtnActive,.p2YUJW_installedBtnDisabled{border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;flex-shrink:0;align-items:center;gap:5px;height:24px;padding:0 10px;font-size:12px;line-height:22px;transition:color .12s,background .12s,border-color .12s;display:inline-flex}.p2YUJW_installedBtn{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-bg-layer-2,#80808014)}.p2YUJW_installedBtn:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#8080802e)}.p2YUJW_installedBtnDisabled,.p2YUJW_installedBtnDisabled:hover{color:var(--dsw-alias-label-disabled,#aab1bd);background:var(--dsw-alias-bg-layer-1,#80808008);border-color:var(--dsw-alias-border-l1,#eceef1);cursor:not-allowed}.p2YUJW_installedBtnDisabled .p2YUJW_segCount{color:var(--dsw-alias-label-disabled,#aab1bd);background:#8080800f}.p2YUJW_installedBtnActive{color:var(--dsw-alias-label-primary-foreground,#fff);background:var(--dsw-alias-button-primary-fill,#1f2328);border-color:var(--dsw-alias-button-primary-fill,#1f2328)}.p2YUJW_segCount,.p2YUJW_segCountActive{text-align:center;border-radius:999px;min-width:16px;padding:0 5px;font-size:10px;line-height:14px}.p2YUJW_segCount{color:var(--dsw-alias-label-tertiary,#8b93a1);background:var(--dsw-alias-bg-layer-2,#8080801a)}.p2YUJW_installedBtnActive .p2YUJW_segCountActive{color:var(--dsw-alias-label-primary-foreground,#fff);background:#80808038}.p2YUJW_tabs{border-bottom:1px solid var(--dsw-alias-border-l1,#eceef1);flex-wrap:wrap;align-items:center;gap:6px;padding:2px 2px 8px;display:flex}.p2YUJW_tab,.p2YUJW_tabActive{cursor:pointer;-webkit-user-select:none;user-select:none;border:1px solid #0000;border-radius:999px;flex-shrink:0;align-items:center;gap:6px;padding:3px 10px;font-size:12px;line-height:18px;transition:color .12s,background .12s,border-color .12s;display:inline-flex}.p2YUJW_tab{color:var(--dsw-alias-label-secondary,#6b7280);border-color:var(--dsw-alias-border-l2,#e5e7eb);background:0 0}.p2YUJW_tab:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#80808014);border-color:var(--dsw-alias-border-l1,#eceef1)}.p2YUJW_tabActive{color:var(--dsw-alias-label-primary-foreground,#fff);background:var(--dsw-alias-button-primary-fill,#1f2328);border-color:var(--dsw-alias-button-primary-fill,#1f2328)}.p2YUJW_tabCount{text-align:center;min-width:16px;color:var(--dsw-alias-label-tertiary,#8b93a1);background:var(--dsw-alias-bg-layer-2,#8080801a);border-radius:999px;padding:0 5px;font-size:10px;line-height:14px}.p2YUJW_tabActive .p2YUJW_tabCount{color:var(--dsw-alias-label-primary-foreground,#fff);background:#80808038}.p2YUJW_body{flex-direction:column;flex:1;min-height:0;display:flex}.p2YUJW_list{flex-direction:column;flex:1;gap:6px;min-height:0;padding:2px 4px 4px 2px;display:flex;overflow-y:auto}.p2YUJW_card{border:1px solid var(--dsw-alias-border-l2,#e5e7eb);background:var(--dsw-alias-bg-layer-1,#8080800f);border-radius:8px;justify-content:space-between;align-items:stretch;gap:12px;padding:9px 12px;transition:border-color .12s,background .12s;display:flex}.p2YUJW_card:hover{border-color:var(--dsw-alias-brand-primary,#4f6ef7);background:var(--dsw-alias-bg-layer-2,#8080801a)}.p2YUJW_cardMain{flex-direction:column;gap:4px;min-width:0;display:flex}.p2YUJW_cardHead{align-items:center;gap:6px;min-width:0;display:flex}.p2YUJW_cardTitle{white-space:nowrap;text-overflow:ellipsis;font-size:13px;font-weight:600;line-height:18px;overflow:hidden}.p2YUJW_categoryBadge,.p2YUJW_verified{border:1px solid #0000;border-radius:4px;flex-shrink:0;padding:0 6px;font-size:10px;line-height:16px}.p2YUJW_categoryBadge{color:var(--dsw-alias-brand-primary,#4f6ef7);border-color:var(--dsw-alias-button-ghost-active-border,#4f6ef740)}.p2YUJW_verified{color:var(--dsw-alias-state-success-primary,#1a7f37);border-color:var(--dsw-alias-state-success-secondary,#1a7f374d)}.p2YUJW_desc{color:var(--dsw-alias-label-secondary,#6b7280);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0;font-size:12px;line-height:18px;display:-webkit-box;overflow:hidden}.p2YUJW_topics{flex-wrap:wrap;align-items:center;gap:4px;min-width:0;display:flex}.p2YUJW_topic{color:var(--dsw-alias-label-tertiary,#8b93a1);background:var(--dsw-alias-bg-layer-2,#8080801a);white-space:nowrap;border-radius:4px;flex-shrink:0;padding:0 6px;font-size:10px;line-height:16px}.p2YUJW_cardSide{flex-direction:column;flex-shrink:0;justify-content:space-between;align-items:flex-end;gap:6px;display:flex}.p2YUJW_stats{flex-direction:column;align-items:flex-end;gap:1px;display:flex}.p2YUJW_star{color:var(--dsw-alias-state-warn-primary,#b8860b);white-space:nowrap;font-size:11px;line-height:16px}.p2YUJW_fork{color:var(--dsw-alias-label-tertiary,#8b93a1);white-space:nowrap;font-size:11px;line-height:16px}.p2YUJW_date{color:var(--dsw-alias-label-tertiary,#8b93a1);white-space:nowrap;font-size:10px;line-height:14px}.p2YUJW_installBtn,.p2YUJW_installBtnCopied,.p2YUJW_installBtnInstalled,.p2YUJW_uninstallBtn,.p2YUJW_detailBtn{cursor:pointer;border-radius:6px;padding:2px 10px;font-size:11px;line-height:18px;transition:color .12s,border-color .12s,background .12s}.p2YUJW_installBtnInstalled{color:var(--dsw-alias-state-success-primary,#1a7f37);border:1px solid var(--dsw-alias-state-success-secondary,#1a7f3759);cursor:default;-webkit-user-select:none;user-select:none;background:#22c55e1f}.p2YUJW_uninstallBtn{color:var(--dsw-alias-state-danger-primary,#d1242f);border:1px solid var(--dsw-alias-state-danger-secondary,#d1242f66);-webkit-user-select:none;user-select:none;background:0 0}.p2YUJW_uninstallBtn:hover{border-color:var(--dsw-alias-state-danger-primary,#d1242f);background:#d1242f14}.p2YUJW_installBtn{color:var(--dsw-alias-label-primary-foreground,#fff);background:var(--dsw-alias-button-primary-fill,#1f2328);-webkit-user-select:none;user-select:none;border:1px solid #0000;font-weight:500}.p2YUJW_installBtn:hover{background:var(--dsw-alias-button-primary-hover,#43454a)}.p2YUJW_detailBtn{color:var(--dsw-alias-label-secondary,#6b7280);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);-webkit-user-select:none;user-select:none;background:0 0;align-items:center;text-decoration:none;display:inline-flex}.p2YUJW_detailBtn:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#80808014);border-color:var(--dsw-alias-button-ghost-active-border,#d0d4da)}.p2YUJW_actions{align-items:center;gap:6px;display:flex}.p2YUJW_installBtnCopied{color:var(--dsw-alias-state-success-primary,#1a7f37);border:1px solid var(--dsw-alias-state-success-secondary,#1a7f3766);-webkit-user-select:none;user-select:none;background:#22c55e24}.p2YUJW_toast{z-index:1000;background:var(--dsw-alias-button-primary-fill,#1f2328);color:var(--dsw-alias-label-primary-foreground,#fff);pointer-events:none;white-space:nowrap;border:1px solid #0000;border-radius:8px;padding:10px 16px;font-size:12px;font-weight:500;line-height:18px;animation:.22s ease-out p2YUJW_toastIn;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 6px 24px #00000047}@keyframes p2YUJW_toastIn{0%{opacity:0;transform:translate(-50%,-44%)}to{opacity:1;transform:translate(-50%,-50%)}}.p2YUJW_toastFail{color:#fff;background:#d1242f;border-color:#ffffff3d}.p2YUJW_overlay{z-index:998;-webkit-user-select:none;user-select:none;background:#00000061;justify-content:center;align-items:center;animation:.16s ease-out p2YUJW_overlayIn;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.p2YUJW_modal{background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);border-radius:10px;flex-direction:column;gap:10px;width:420px;max-width:calc(100vw - 32px);padding:14px 16px;animation:.18s ease-out p2YUJW_modalIn;display:flex;box-shadow:0 12px 40px #0000003d}.p2YUJW_modalHead{justify-content:space-between;align-items:center;gap:8px;display:flex}.p2YUJW_modalTitle{color:var(--dsw-alias-label-primary,#1f2328);font-size:14px;font-weight:600;line-height:20px}.p2YUJW_modalClose{width:24px;height:24px;color:var(--dsw-alias-label-tertiary,#8b93a1);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;font-size:16px;line-height:1;display:inline-flex}.p2YUJW_modalClose:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#8080801a)}.p2YUJW_modalCloseIcon{flex-shrink:0;width:14px;height:14px}.p2YUJW_modalDesc{color:var(--dsw-alias-label-secondary,#6b7280);font-size:12px;line-height:18px}.p2YUJW_trustHint{color:var(--dsw-alias-danger,#e5484d);background:#e5484d14;border:1px solid #e5484d47;border-radius:6px;padding:6px 10px;font-size:12px;font-weight:500;line-height:18px}.p2YUJW_modalRow{align-items:baseline;gap:8px;min-width:0;font-size:12px;line-height:18px;display:flex}.p2YUJW_modalLabel{min-width:64px;color:var(--dsw-alias-label-tertiary,#8b93a1);flex-shrink:0}.p2YUJW_modalValue{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-primary,#1f2328);font-weight:500;overflow:hidden}.p2YUJW_modalLink{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-brand-primary,#4f6ef7);cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;gap:4px;font-weight:500;text-decoration:none;transition:color .12s;display:inline-flex;overflow:hidden}.p2YUJW_modalLink:hover{color:#3b5bdb;text-decoration:underline}.p2YUJW_linkIcon{flex-shrink:0}.p2YUJW_modalCmd{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-bg-layer-2,#80808014);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;justify-content:space-between;align-items:center;gap:8px;padding:6px 6px 6px 10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:18px;transition:border-color .12s,background .12s;display:flex}.p2YUJW_modalCmd:hover{border-color:var(--dsw-alias-button-ghost-active-border,#d0d4da);background:#8080801a}.p2YUJW_modalCmdText{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.p2YUJW_modalCmdCopy{color:var(--dsw-alias-brand-primary,#4f6ef7);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:4px;flex-shrink:0;align-items:center;gap:3px;padding:1px 7px;font-family:inherit;font-size:11px;line-height:16px;transition:color .12s,border-color .12s,background .12s;display:inline-flex}.p2YUJW_modalCmdCopy:hover{color:#3b5bdb;border-color:var(--dsw-alias-button-ghost-active-border,#d0d4da);background:#8080800f}.p2YUJW_modalActions{justify-content:flex-end;align-items:center;gap:8px;margin-top:2px;display:flex}.p2YUJW_modalBody{flex-direction:column;gap:10px;display:flex}.p2YUJW_progressStrip{background:#4f6ef70f;border:1px solid #4f6ef759;border-radius:6px;flex-direction:column;align-items:stretch;display:flex;overflow:hidden}.p2YUJW_progressStripMain{min-width:0;color:var(--dsw-alias-brand-primary,#4f6ef7);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;flex:1;align-items:center;gap:8px;padding:6px 10px;font-size:12px;font-weight:500;line-height:18px;transition:background .12s,color .12s;display:flex}.p2YUJW_progressStripMain:hover{color:#3b5bdb;background:#4f6ef714}.p2YUJW_progressStripDot{background:var(--dsw-alias-brand-primary,#4f6ef7);border-radius:50%;flex-shrink:0;width:8px;height:8px;animation:1.1s ease-in-out infinite p2YUJW_progressPulse}@keyframes p2YUJW_progressPulse{0%,to{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}.p2YUJW_progressStripText{text-overflow:ellipsis;white-space:nowrap;text-align:left;flex:1;min-width:0;overflow:hidden}.p2YUJW_progressStripToggle{color:var(--dsw-alias-brand-primary,#4f6ef7);flex-shrink:0}.p2YUJW_queueList{border-top:1px solid #4f6ef72e;padding:2px 0}.p2YUJW_queueRow{border-bottom:1px solid #4f6ef71f;flex-direction:column;gap:5px;padding:6px 10px 7px;font-size:12px;line-height:18px;transition:background .12s;display:flex}.p2YUJW_queueRow:last-child{border-bottom:none}.p2YUJW_queueRow:hover{background:#4f6ef70d}.p2YUJW_queueRowHead{align-items:center;gap:10px;display:flex}.p2YUJW_queueRowTarget{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-primary,#1f2328);flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow:hidden}.p2YUJW_queueRowBody{align-items:center;gap:8px;display:flex}.p2YUJW_queueRowStatus{color:var(--dsw-alias-brand-primary,#4f6ef7);flex-shrink:0;font-weight:500}.p2YUJW_queueRowTrack{flex:1;min-width:0}.p2YUJW_queueRowPct{color:var(--dsw-alias-label-tertiary,#8b93a1);font-variant-numeric:tabular-nums;flex-shrink:0}.p2YUJW_stripCancel{color:var(--dsw-alias-label-secondary,#6b7280);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;flex-shrink:0;padding:2px 10px;font-size:12px;line-height:18px;transition:background .12s,border-color .12s,color .12s}.p2YUJW_stripCancel:hover{color:#e5484d;background:#e5484d14;border-color:#e5484d66}.p2YUJW_queuedHint{color:var(--dsw-alias-brand-primary,#4f6ef7);background:#4f6ef70f;border:1px solid #4f6ef738;border-radius:6px;padding:5px 10px;font-size:12px;line-height:18px}.p2YUJW_errorTitle{color:#e5484d;font-size:14px;font-weight:600;line-height:20px}.p2YUJW_errorBox{max-height:240px;color:var(--dsw-alias-label-primary,#1f2328);white-space:pre-wrap;word-break:break-word;-webkit-user-select:none;user-select:none;background:#e5484d0d;border:1px solid #e5484d59;border-radius:6px;margin:0;padding:10px 12px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:17px;overflow:auto}.p2YUJW_errorPlugin{color:var(--dsw-alias-label-primary,#1f2328);text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;font-weight:600;line-height:18px;overflow:hidden}.p2YUJW_errorCopySoft{color:var(--dsw-alias-label-tertiary,#8b93a1);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:4px;flex-shrink:0;align-items:center;padding:2px 8px;font-size:11px;line-height:16px;transition:color .12s,background .12s;display:inline-flex}.p2YUJW_errorCopySoft:hover{color:var(--dsw-alias-label-secondary,#6b7280);background:#80808014}.p2YUJW_errorHint{color:var(--dsw-alias-label-tertiary,#8b93a1);font-size:12px;line-height:18px}.p2YUJW_reportBtn{color:var(--dsw-alias-brand-primary,#4f6ef7);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;align-items:center;padding:5px 14px;font-size:12px;line-height:18px;text-decoration:none;transition:background .12s,border-color .12s;display:inline-flex}.p2YUJW_reportBtn:hover{background:var(--dsw-alias-interactive-bg-hover,#80808014);border-color:var(--dsw-alias-button-ghost-active-border,#d0d4da)}.p2YUJW_modalCancel,.p2YUJW_modalCopy{color:var(--dsw-alias-label-secondary,#6b7280);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:color .12s,border-color .12s,background .12s}.p2YUJW_modalCancel:hover,.p2YUJW_modalCopy:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#80808014)}.p2YUJW_modalConfirm,.p2YUJW_modalInstall{color:var(--dsw-alias-label-primary-foreground,#fff);background:var(--dsw-alias-button-primary-fill,#1f2328);cursor:pointer;-webkit-user-select:none;user-select:none;border:1px solid #0000;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.p2YUJW_modalConfirm:hover,.p2YUJW_modalInstall:hover{background:var(--dsw-alias-button-primary-hover,#43454a)}.p2YUJW_modalCopy:disabled,.p2YUJW_modalInstall:disabled,.p2YUJW_modalCancel:disabled,.p2YUJW_modalClose:disabled,.p2YUJW_uninstallConfirm:disabled{opacity:.55;cursor:not-allowed;pointer-events:none}.p2YUJW_uninstallConfirm{color:#fff;background:var(--dsw-alias-state-danger-primary,#d1242f);cursor:pointer;-webkit-user-select:none;user-select:none;border:1px solid #0000;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.p2YUJW_uninstallConfirm:hover{background:var(--dsw-alias-state-danger-hover,#b91c1c)}.p2YUJW_result{text-align:center;flex-direction:column;align-items:center;gap:5px;padding:10px 0 2px;display:flex}.p2YUJW_resultCheck{width:40px;height:40px;color:var(--dsw-alias-state-success-primary,#1a7f37);background:#22c55e24;border-radius:50%;justify-content:center;align-items:center;margin-bottom:3px;display:inline-flex}.p2YUJW_resultCheckIcon{flex-shrink:0;width:20px;height:20px}.p2YUJW_resultTitle{color:var(--dsw-alias-label-primary,#1f2328);font-size:13px;font-weight:600;line-height:20px}.p2YUJW_resultDesc{color:var(--dsw-alias-label-secondary,#6b7280);font-size:12px;line-height:18px}.p2YUJW_resultRestarting{color:var(--dsw-alias-label-tertiary,#8b93a1);padding:12px 0 6px;font-size:12px;line-height:18px}.p2YUJW_restartLater{color:var(--dsw-alias-label-secondary,#6b7280);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:color .12s,border-color .12s,background .12s}.p2YUJW_restartLater:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#80808014)}.p2YUJW_restartNow{color:var(--dsw-alias-label-primary-foreground,#fff);background:var(--dsw-alias-button-primary-fill,#1f2328);cursor:pointer;-webkit-user-select:none;user-select:none;border:1px solid #0000;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.p2YUJW_restartNow:hover{background:var(--dsw-alias-button-primary-hover,#43454a)}.p2YUJW_restartNow:disabled{opacity:.55;cursor:not-allowed;pointer-events:none}.p2YUJW_progress{margin:10px 0 2px}.p2YUJW_progressHead{justify-content:flex-end;align-items:center;margin-bottom:3px;display:flex}.p2YUJW_progressText{color:var(--dsw-alias-label-secondary,#6b7280);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:14px}.p2YUJW_progressTrack{background:var(--dsw-alias-border-l2,#e5e7eb);border-radius:2px;height:4px;overflow:hidden}.p2YUJW_progressFill{background:var(--dsw-alias-brand-primary,#4f6ef7);border-radius:2px;height:100%;transition:width .32s}.p2YUJW_progressFillFail{background:var(--dsw-alias-state-danger-primary,#d1242f)}.p2YUJW_progressLog{background:#0d1117;border:1px solid #7f8ba34d;border-radius:8px;margin:8px 0 0;overflow:hidden;box-shadow:inset 0 1px #ffffff0d}.p2YUJW_progressLogBar{background:#ffffff0d;border-bottom:1px solid #7f8ba333;align-items:center;padding:6px 10px;display:flex}.p2YUJW_progressLogTitle{letter-spacing:.5px;color:#8b949e;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px}.p2YUJW_progressLogLines{white-space:pre-wrap;word-break:break-word;-webkit-user-select:text;user-select:text;max-height:112px;margin:0;padding:8px 10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:1.6;overflow:auto}.p2YUJW_logLine{display:block}.p2YUJW_logLinePlain{color:#9da7b3}.p2YUJW_logLineOk{color:#3fb950}.p2YUJW_logLineErr{color:#f85149}.p2YUJW_logLineWarn{color:#d29922}.p2YUJW_logLineInfo{color:#58a6ff}@keyframes p2YUJW_overlayIn{0%{opacity:0}to{opacity:1}}@keyframes p2YUJW_modalIn{0%{opacity:0;transform:translateY(6px)scale(.98)}to{opacity:1;transform:translateY(0)scale(1)}}.p2YUJW_failBtn{color:#fff;background:var(--dsw-alias-state-danger-primary,#d1242f);border:1px solid var(--dsw-alias-state-danger-primary,#d1242f);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:6px;flex-shrink:0;align-items:center;gap:5px;height:24px;padding:0 10px;font-size:12px;line-height:22px;transition:background .12s,border-color .12s;display:inline-flex}.p2YUJW_failBtn:hover{background:#b0202a;border-color:#b0202a}.p2YUJW_failBadge{text-align:center;min-width:16px;height:16px;color:var(--dsw-alias-state-danger-primary,#d1242f);background:#fff;border-radius:999px;flex-shrink:0;padding:0 5px;font-size:10px;line-height:16px}.p2YUJW_failList{flex-direction:column;gap:8px;max-height:300px;padding-right:2px;display:flex;overflow-y:auto}.p2YUJW_failRow{border:1px solid var(--dsw-alias-border-l2,#e5e7eb);background:var(--dsw-alias-bg-layer-2,#8080800d);border-radius:8px;flex-direction:column;gap:6px;padding:8px 10px;display:flex}.p2YUJW_failHead{align-items:center;gap:8px;min-width:0;display:flex}.p2YUJW_failKind{border:1px solid #0000;border-radius:4px;flex-shrink:0;padding:0 6px;font-size:10px;font-weight:500;line-height:16px}.p2YUJW_failKindInstall{color:#e5484d;background:#e5484d14;border-color:#e5484d59}.p2YUJW_failKindUninstall{color:#b8860b;background:#b8860b14;border-color:#b8860b59}.p2YUJW_failRepo{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-brand-primary,#4f6ef7);cursor:pointer;-webkit-user-select:none;user-select:none;flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:18px;text-decoration:none;overflow:hidden}.p2YUJW_failRepo:hover{text-decoration:underline}.p2YUJW_failTime{color:var(--dsw-alias-label-tertiary,#8b93a1);font-variant-numeric:tabular-nums;flex-shrink:0;font-size:11px;line-height:16px}.p2YUJW_failCopy{color:var(--dsw-alias-label-tertiary,#8b93a1);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:4px;flex-shrink:0;align-items:center;padding:2px 8px;font-size:11px;line-height:16px;transition:color .12s,background .12s;display:inline-flex}.p2YUJW_failCopy:hover{color:var(--dsw-alias-label-secondary,#6b7280);background:#80808014}.p2YUJW_failEmpty{text-align:center;color:var(--dsw-alias-label-tertiary,#8b93a1);padding:24px 0;font-size:12px;line-height:18px}.p2YUJW_failClear{color:var(--dsw-alias-state-danger-primary,#d1242f);border:1px solid var(--dsw-alias-state-danger-secondary,#d1242f66);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:background .12s,border-color .12s}.p2YUJW_failClear:hover{border-color:var(--dsw-alias-state-danger-primary,#d1242f);background:#d1242f14}.p2YUJW_failBigIssue{box-sizing:border-box;text-align:center;color:#fff;cursor:pointer;-webkit-user-select:none;user-select:none;background:#e5484d;border:1px solid #e5484d;border-radius:8px;width:100%;margin-top:4px;padding:3px 16px;font-size:13px;font-weight:600;line-height:18px;text-decoration:none;transition:background .12s,border-color .12s,box-shadow .12s;display:block}.p2YUJW_failBigIssue:hover{background:var(--dsw-alias-state-danger-primary,#d1242f);border-color:var(--dsw-alias-state-danger-primary,#d1242f);box-shadow:0 3px 10px #d1242f59}.p2YUJW_state{text-align:center;min-height:160px;color:var(--dsw-alias-label-tertiary,#8b93a1);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:8px;padding:24px;font-size:12px;line-height:18px;display:flex}.p2YUJW_stateTitle{color:var(--dsw-alias-label-primary,#1f2328);font-size:13px;font-weight:600}.p2YUJW_stateDesc{max-width:420px}.p2YUJW_retryBtn{color:var(--dsw-alias-label-secondary,#6b7280);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;margin-top:4px;padding:4px 12px;font-size:12px;line-height:18px}.p2YUJW_retryBtn:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#80808014);border-color:var(--dsw-alias-button-ghost-active-border,#d0d4da)}.p2YUJW_footer{border-top:1px solid var(--dsw-alias-border-l1,#eceef1);flex-shrink:0;justify-content:flex-end;align-items:center;gap:8px;padding:6px 4px 0;display:flex}.p2YUJW_footLink{color:var(--dsw-alias-brand-primary,#4f6ef7);white-space:nowrap;-webkit-user-select:none;user-select:none;font-size:11px;line-height:16px;text-decoration:none}.p2YUJW_footLink:hover{text-decoration:underline}";
		const tagId$1 = "dsh-plugin/Section.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var Section_module_css_default = {
			"adText": "p2YUJW_adText",
			"resultCount": "p2YUJW_resultCount",
			"modalLabel": "p2YUJW_modalLabel",
			"toastFail": "p2YUJW_toastFail",
			"overlay": "p2YUJW_overlay",
			"uninstallBtn": "p2YUJW_uninstallBtn",
			"topics": "p2YUJW_topics",
			"fork": "p2YUJW_fork",
			"version": "p2YUJW_version",
			"installBtnInstalled": "p2YUJW_installBtnInstalled",
			"logLineWarn": "p2YUJW_logLineWarn",
			"installBtnCopied": "p2YUJW_installBtnCopied",
			"progressStrip": "p2YUJW_progressStrip",
			"filterResults": "p2YUJW_filterResults",
			"verified": "p2YUJW_verified",
			"copyIcon": "p2YUJW_copyIcon",
			"controls": "p2YUJW_controls",
			"modalHead": "p2YUJW_modalHead",
			"modalDesc": "p2YUJW_modalDesc",
			"result": "p2YUJW_result",
			"progressStripMain": "p2YUJW_progressStripMain",
			"modalLink": "p2YUJW_modalLink",
			"progressStripDot": "p2YUJW_progressStripDot",
			"failBadge": "p2YUJW_failBadge",
			"adBanner": "p2YUJW_adBanner",
			"modalClose": "p2YUJW_modalClose",
			"installedBtnDisabled": "p2YUJW_installedBtnDisabled",
			"modalTitle": "p2YUJW_modalTitle",
			"progress": "p2YUJW_progress",
			"retryBtn": "p2YUJW_retryBtn",
			"date": "p2YUJW_date",
			"tagline": "p2YUJW_tagline",
			"stats": "p2YUJW_stats",
			"progressLogBar": "p2YUJW_progressLogBar",
			"header": "p2YUJW_header",
			"installedBtnActive": "p2YUJW_installedBtnActive",
			"topic": "p2YUJW_topic",
			"card": "p2YUJW_card",
			"tab": "p2YUJW_tab",
			"queueRow": "p2YUJW_queueRow",
			"queueRowStatus": "p2YUJW_queueRowStatus",
			"titleRow": "p2YUJW_titleRow",
			"cardSide": "p2YUJW_cardSide",
			"queueRowBody": "p2YUJW_queueRowBody",
			"logLineErr": "p2YUJW_logLineErr",
			"modalBody": "p2YUJW_modalBody",
			"failKind": "p2YUJW_failKind",
			"errorTitle": "p2YUJW_errorTitle",
			"errorHint": "p2YUJW_errorHint",
			"search": "p2YUJW_search",
			"modalCmdCopy": "p2YUJW_modalCmdCopy",
			"progressStripToggle": "p2YUJW_progressStripToggle",
			"resultDesc": "p2YUJW_resultDesc",
			"progressHead": "p2YUJW_progressHead",
			"modalIn": "p2YUJW_modalIn",
			"modalRow": "p2YUJW_modalRow",
			"failClear": "p2YUJW_failClear",
			"queueList": "p2YUJW_queueList",
			"cardMain": "p2YUJW_cardMain",
			"logLineInfo": "p2YUJW_logLineInfo",
			"modalConfirm": "p2YUJW_modalConfirm",
			"footLink": "p2YUJW_footLink",
			"progressStripText": "p2YUJW_progressStripText",
			"adBadge": "p2YUJW_adBadge",
			"modalCloseIcon": "p2YUJW_modalCloseIcon",
			"modalActions": "p2YUJW_modalActions",
			"stripCancel": "p2YUJW_stripCancel",
			"failCopy": "p2YUJW_failCopy",
			"uninstallConfirm": "p2YUJW_uninstallConfirm",
			"tabActive": "p2YUJW_tabActive",
			"categoryBadge": "p2YUJW_categoryBadge",
			"queueRowTrack": "p2YUJW_queueRowTrack",
			"modalCancel": "p2YUJW_modalCancel",
			"progressText": "p2YUJW_progressText",
			"failRow": "p2YUJW_failRow",
			"installedBtn": "p2YUJW_installedBtn",
			"failKindInstall": "p2YUJW_failKindInstall",
			"root": "p2YUJW_root",
			"logLine": "p2YUJW_logLine",
			"modalCmdText": "p2YUJW_modalCmdText",
			"queueRowHead": "p2YUJW_queueRowHead",
			"overlayIn": "p2YUJW_overlayIn",
			"reportBtn": "p2YUJW_reportBtn",
			"segCountActive": "p2YUJW_segCountActive",
			"queueRowTarget": "p2YUJW_queueRowTarget",
			"failHead": "p2YUJW_failHead",
			"body": "p2YUJW_body",
			"resultCheck": "p2YUJW_resultCheck",
			"title": "p2YUJW_title",
			"detailBtn": "p2YUJW_detailBtn",
			"searchRow": "p2YUJW_searchRow",
			"resultRestarting": "p2YUJW_resultRestarting",
			"progressTrack": "p2YUJW_progressTrack",
			"modalCopy": "p2YUJW_modalCopy",
			"modalCmd": "p2YUJW_modalCmd",
			"progressPulse": "p2YUJW_progressPulse",
			"progressFillFail": "p2YUJW_progressFillFail",
			"trustHint": "p2YUJW_trustHint",
			"segCount": "p2YUJW_segCount",
			"list": "p2YUJW_list",
			"tabCount": "p2YUJW_tabCount",
			"state": "p2YUJW_state",
			"toastIn": "p2YUJW_toastIn",
			"logoIcon": "p2YUJW_logoIcon",
			"queueRowPct": "p2YUJW_queueRowPct",
			"modalInstall": "p2YUJW_modalInstall",
			"resultTitle": "p2YUJW_resultTitle",
			"cardTitle": "p2YUJW_cardTitle",
			"errorBox": "p2YUJW_errorBox",
			"toast": "p2YUJW_toast",
			"footer": "p2YUJW_footer",
			"logLineOk": "p2YUJW_logLineOk",
			"restartNow": "p2YUJW_restartNow",
			"progressLogTitle": "p2YUJW_progressLogTitle",
			"cardHead": "p2YUJW_cardHead",
			"desc": "p2YUJW_desc",
			"resultCheckIcon": "p2YUJW_resultCheckIcon",
			"progressFill": "p2YUJW_progressFill",
			"failEmpty": "p2YUJW_failEmpty",
			"restartLater": "p2YUJW_restartLater",
			"failTime": "p2YUJW_failTime",
			"failRepo": "p2YUJW_failRepo",
			"brand": "p2YUJW_brand",
			"logLinePlain": "p2YUJW_logLinePlain",
			"brandText": "p2YUJW_brandText",
			"modalValue": "p2YUJW_modalValue",
			"failList": "p2YUJW_failList",
			"adArrow": "p2YUJW_adArrow",
			"star": "p2YUJW_star",
			"actions": "p2YUJW_actions",
			"linkIcon": "p2YUJW_linkIcon",
			"failBtn": "p2YUJW_failBtn",
			"failKindUninstall": "p2YUJW_failKindUninstall",
			"failBigIssue": "p2YUJW_failBigIssue",
			"stateTitle": "p2YUJW_stateTitle",
			"progressLog": "p2YUJW_progressLog",
			"errorPlugin": "p2YUJW_errorPlugin",
			"queuedHint": "p2YUJW_queuedHint",
			"progressLogLines": "p2YUJW_progressLogLines",
			"tabs": "p2YUJW_tabs",
			"errorCopySoft": "p2YUJW_errorCopySoft",
			"installBtn": "p2YUJW_installBtn",
			"stateDesc": "p2YUJW_stateDesc",
			"modal": "p2YUJW_modal"
		};
		//#endregion
		//#region src/client/lib/catalog.ts
		const SITE_URL = "https://dsh-plugin.org/";
		/** 插件当前版本号，供头部标题展示「DSH-Plugin Hub v0.1.1」。 */
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
		* 一键反馈 GitHub Issue 的预填链接：标题带「来自 dsh-plugin.org」标识，
		* 正文附上收录来源与详情页链接 —— 用户在作者仓库提交的 issue 里就带着
		* 我们网站的外链（错误弹窗、失败记录共用此逻辑）。
		*/
		function pluginIssueUrl(repo, message) {
			const title = `[dsh-plugin.org | dsh-plugin-hub] Install/Remove failed: ${repo}`;
			const body = [
				"## Environment",
				`- Plugin: \`${repo}\``,
				"- Installed from: [dsh-plugin.org](https://dsh-plugin.org/) plugin catalog (in-app install via DSH-Plugin Hub)",
				`- Catalog: [https://dsh-plugin.org/plugins/${repo}](https://dsh-plugin.org/plugins/${repo})`,
				"",
				"## Error",
				"",
				"```",
				message,
				"```",
				"",
				"---",
				"This error was produced by the [dsh-plugin-hub](https://github.com/dshplugin/dsh-plugin-hub) installer bundled with DeepSeek Harness."
			].join("\n");
			return `https://github.com/${repo}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
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
		* （s/o/n/c/t/f/d/r/v/u/a/sg/fk），统一为 HubPlugin，保证渲染逻辑只认一种结构。
		*/
		function normalize(raw) {
			if (typeof raw.s === "string") return {
				slug: raw.s,
				ownerSlug: typeof raw.o === "string" ? raw.o : void 0,
				displayName: typeof raw.n === "string" ? raw.n : void 0,
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
			(0, react.useEffect)(() => {
				let cancelled = false;
				setPlugins(null);
				setStats(null);
				setFailed(false);
				const fetchData = (url) => fetch(url).then((res) => {
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
			const { t, refreshInstalled, onInstallDone, onUninstallDone, onError, installPlugin, uninstallPlugin, installedName } = opts;
			const [queue, setQueue] = (0, react.useState)([]);
			const queueRef = (0, react.useRef)([]);
			/** 当前打开弹窗所对应的任务 id：该任务完成时弹窗切换为结果视图 */
			const modalTaskRef = (0, react.useRef)(null);
			/** 轮询定时器句柄（队列清空/组件卸载时清理） */
			const pollRef = (0, react.useRef)(null);
			/** 当前安装/卸载操作的插件仓库：失败时归档到错误弹窗（操作结束时弹窗已关，需提前捕获） */
			const opRepoRef = (0, react.useRef)(null);
			/** 进行中状态条是否展开（刷新后恢复的任务可点击展开查看实时输出） */
			const [showProgress, setShowProgress] = (0, react.useState)(false);
			/** 停止后台任务轮询（任务结束或组件卸载时清理）。 */
			const stopPoll = () => {
				if (pollRef.current !== null) {
					window.clearInterval(pollRef.current);
					pollRef.current = null;
				}
			};
			(0, react.useEffect)(() => stopPoll, []);
			/** 更新队列（同步镜像到 ref，供轮询/防重复入队读取当前值）。 */
			const applyQueue = (updater) => {
				setQueue((prev) => {
					const next = updater(prev);
					queueRef.current = next;
					return next;
				});
			};
			/** 后台任务结束（active 中消失后查终态确认）：完成 → 刷新安装表 + 结果视图/toast；失败 → 完整错误弹窗 */
			const finishQueueTask = (ok, q, lines) => {
				applyQueue((prev) => prev.filter((x) => x.id !== q.id));
				if (ok) {
					refreshInstalled();
					if (q.kind === "uninstall") onUninstallDone(modalTaskRef.current === q.id);
					else onInstallDone(modalTaskRef.current === q.id);
				} else {
					const detail = lines.length > 0 ? [...lines].reverse().join("\n") : q.kind === "uninstall" ? t("uninstallFail") : t("installFail");
					if (q.kind === "install" && q.target.includes("/")) opRepoRef.current = q.target;
					onError(detail, opRepoRef.current, q.kind);
				}
				if (queueRef.current.length === 0) stopPoll();
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
				else applyQueue((prev) => prev.filter((x) => x.id !== q.id));
			};
			/** 轮询整个队列：合并服务端 /active（running 在前、pending 在后），
			*  消失的任务查终态收尾；队列清空即停止轮询。 */
			const pollQueue = () => {
				stopPoll();
				pollRef.current = window.setInterval(async () => {
					try {
						const res = await fetch("/dsh-plugin-hub/active", { cache: "no-store" });
						if (!res.ok) throw new Error(`active ${res.status}`);
						const active = ((await res.json()).tasks ?? []).filter((a) => typeof a.id === "number");
						const byId = new Map(active.map((a) => [a.id, a]));
						applyQueue((prev) => {
							const next = [];
							for (const a of active) {
								const id = a.id;
								const prevTask = prev.find((q) => q.id === id);
								next.push({
									id,
									kind: a.action === "remove" ? "uninstall" : "install",
									target: typeof a.target === "string" ? a.target.replace(/^github:/, "") : prevTask?.target ?? "",
									status: a.status === "running" ? "running" : "pending",
									progress: typeof a.progress === "number" ? a.progress : prevTask?.progress ?? 0,
									lines: Array.isArray(a.lines) ? a.lines : prevTask?.lines ?? []
								});
							}
							return next;
						});
						const gone = queueRef.current.filter((q) => !byId.has(q.id));
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
						const items = (data.tasks ?? []).filter((a) => typeof a.id === "number").map((a) => ({
							id: a.id,
							kind: a.action === "remove" ? "uninstall" : "install",
							target: typeof a.target === "string" ? a.target.replace(/^github:/, "") : "",
							status: a.status === "running" ? "running" : "pending",
							progress: typeof a.progress === "number" ? a.progress : 0,
							lines: Array.isArray(a.lines) ? a.lines : []
						}));
						if (items.length > 0) {
							applyQueue((prev) => [...prev, ...items.filter((n) => !prev.some((p) => p.id === n.id))]);
							setShowProgress(true);
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
				opRepoRef.current = repo;
				if (queueRef.current.some((q) => q.kind === "install" && q.target === repo)) return;
				try {
					const res = await fetch("/dsh-plugin-hub/install", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ repo })
					});
					const data = await res.json();
					if (!data.ok || typeof data.task !== "number") {
						onError(data.error ?? `HTTP ${res.status}`, opRepoRef.current, "install");
						return;
					}
					const taskId = data.task;
					modalTaskRef.current = taskId;
					applyQueue((prev) => [...prev, {
						id: taskId,
						kind: "install",
						target: repo,
						status: "pending",
						progress: 0,
						lines: []
					}]);
					setShowProgress(true);
					pollQueue();
				} catch {
					onError(t("installFail"), opRepoRef.current, "install");
				}
			};
			/** 弹窗动作：直接卸载。与安装同一队列机制，弹窗内实时显示进度。 */
			const uninstallNow = async (p) => {
				const name = installedName(p);
				if (!name) return;
				opRepoRef.current = p.source?.repo ?? null;
				if (queueRef.current.some((q) => q.kind === "uninstall" && q.target === name)) return;
				try {
					const res = await fetch("/dsh-plugin-hub/uninstall", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ name })
					});
					const data = await res.json();
					if (!data.ok || typeof data.task !== "number") {
						onError(data.error ?? `HTTP ${res.status}`, opRepoRef.current, "uninstall");
						return;
					}
					const taskId = data.task;
					modalTaskRef.current = taskId;
					applyQueue((prev) => [...prev, {
						id: taskId,
						kind: "uninstall",
						target: name,
						status: "pending",
						progress: 0,
						lines: []
					}]);
					setShowProgress(true);
					pollQueue();
				} catch {
					onError(t("uninstallFail"), opRepoRef.current, "uninstall");
				}
			};
			/** 取消任务：排队中立即出队，执行中终止子进程。 */
			const cancelTask = async (id) => {
				if (modalTaskRef.current === id) modalTaskRef.current = null;
				try {
					await fetch("/dsh-plugin-hub/cancel", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ id })
					});
				} catch {}
				applyQueue((prev) => prev.filter((x) => x.id !== id));
			};
			/** 打开新弹窗前清空任务匹配：避免旧任务 id 误匹配到新弹窗。 */
			const clearModalTask = () => {
				modalTaskRef.current = null;
			};
			const installModalTask = installPlugin ? queue.find((q) => q.id === modalTaskRef.current) ?? queue.find((q) => q.kind === "install" && q.target === (installPlugin.source?.repo ?? "")) ?? null : null;
			const uninstallModalTask = uninstallPlugin ? queue.find((q) => q.id === modalTaskRef.current) ?? queue.find((q) => q.kind === "uninstall" && q.target === (installedName(uninstallPlugin) ?? "")) ?? null : null;
			const running = queue.find((q) => q.status === "running");
			const pendingCount = queue.filter((q) => q.status === "pending").length;
			return {
				queue,
				running,
				pendingCount,
				stripSummary: running ? `${running.kind === "install" ? t("runningInstall") : t("runningUninstall")} ${running.progress}%${pendingCount > 0 ? ` · ${t("queueMore", { n: pendingCount })}` : ""}` : t("queueWaiting", { n: queue.length }),
				installModalTask,
				uninstallModalTask,
				showProgress,
				setShowProgress,
				installNow,
				uninstallNow,
				cancelTask,
				clearModalTask
			};
		}
		//#endregion
		//#region src/client/components/icons.tsx
		/**
		* Inline SVG icons used across the client. Icons inherit currentColor so
		* they adapt to themes and disabled states automatically.
		*/
		/** 弹窗右上角关闭按钮图标：内联 SVG 十字（stroke 继承 currentColor），随按钮禁用态一起变淡。 */
		function CloseIcon() {
			return (0, react.createElement)("svg", {
				className: Section_module_css_default.modalCloseIcon,
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
				className: Section_module_css_default.linkIcon,
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
				className: Section_module_css_default.logoIcon,
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
		/** 复制图标：双层矩形（stroke 继承 currentColor），手动命令旁的复制按钮用。 */
		function CopyIcon() {
			return (0, react.createElement)("svg", {
				className: Section_module_css_default.copyIcon,
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
		//#endregion
		//#region src/client/lib/markup.ts
		/**
		* Line-level syntax coloring for the terminal-style output window shown
		* during install/remove. The server already strips source prefixes and ANSI
		* escapes, so lines arrive clean.
		*/
		/** 命令行输出行着色：错误红 / 成功与进度绿 / 移除黄 / 其余浅灰，营造终端窗口高亮感。 */
		function logLineClass(line) {
			const base = Section_module_css_default.logLine;
			if (/^\[(?:err|error)\]|\[error\]|\[timed out\]|failed|ERR_/i.test(line)) return `${base} ${Section_module_css_default.logLineErr}`;
			if (/^\[exit 0\]|^Done in|^Progress:|^dependencies:|^Packages:/i.test(line)) return `${base} ${Section_module_css_default.logLineOk}`;
			if (/^-\s+/.test(line)) return `${base} ${Section_module_css_default.logLineWarn}`;
			return `${base} ${Section_module_css_default.logLinePlain}`;
		}
		//#endregion
		//#region src/client/components/ProgressView.tsx
		/**
		* Inline progress block shared by the install and uninstall dialogs:
		* a real percentage bar (server-estimated, client-polled) plus a
		* terminal-style output window with line-level keyword highlighting.
		*/
		function ProgressView({ task }) {
			return (0, react.createElement)("div", { className: Section_module_css_default.progress }, (0, react.createElement)("div", { className: Section_module_css_default.progressHead }, (0, react.createElement)("span", { className: Section_module_css_default.progressText }, `${Math.round(task.progress)}%`)), (0, react.createElement)("div", { className: Section_module_css_default.progressTrack }, (0, react.createElement)("div", {
				className: task.status === "failed" ? `${Section_module_css_default.progressFill} ${Section_module_css_default.progressFillFail}` : Section_module_css_default.progressFill,
				style: { width: `${task.progress}%` }
			})), task.lines.length > 0 ? (0, react.createElement)("div", { className: Section_module_css_default.progressLog }, (0, react.createElement)("div", { className: Section_module_css_default.progressLogBar }, (0, react.createElement)("span", { className: Section_module_css_default.progressLogTitle }, "dsh")), (0, react.createElement)("div", { className: Section_module_css_default.progressLogLines }, task.lines.slice(0, 6).reverse().map((line, i) => (0, react.createElement)("div", {
				key: i,
				className: logLineClass(line)
			}, line)))) : null);
		}
		//#endregion
		//#region src/client/components/modals.tsx
		/**
		* Dialog layer for the Plugin Hub: the install-confirm dialog, the uninstall
		* dialog and the global toast. Both dialogs lock themselves while a mutation
		* or restart is running, then switch to a result view offering an immediate
		* restart or a "later" deferral.
		*/
		/** 完成结果视图：绿色对勾 + 标题/描述 + 「完成」关闭按钮（安装/卸载本身已生效，无需提示重启） */
		function ResultView({ title, desc, t, onClose }) {
			return (0, react.createElement)("div", { className: Section_module_css_default.result }, (0, react.createElement)("div", { className: Section_module_css_default.resultCheck }, (0, react.createElement)("svg", {
				className: Section_module_css_default.resultCheckIcon,
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
			}))), (0, react.createElement)("div", { className: Section_module_css_default.resultTitle }, title), (0, react.createElement)("div", { className: Section_module_css_default.resultDesc }, desc), (0, react.createElement)("div", { className: Section_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Section_module_css_default.restartNow,
				onClick: onClose
			}, t("doneBtn"))));
		}
		/**
		* 信任确认弹窗：安装进入后台队列后弹窗仍可关闭（任务继续），
		* 只在本任务执行中展示实时进度；完成后切换为结果视图，与卸载一致。
		*/
		function InstallModal(props) {
			const { plugin, done, task, t, langPath, onClose, onCopy, onInstall } = props;
			const busy = task !== null && (task.status === "pending" || task.status === "running");
			const title = busy ? task.status === "pending" ? t("queuedTitle") : t("installing") : done ? t("installResultTitle") : t("confirmTitle");
			return (0, react.createElement)("div", {
				className: Section_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: Section_module_css_default.modal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Section_module_css_default.modalHead }, (0, react.createElement)("div", { className: Section_module_css_default.modalTitle }, title), (0, react.createElement)("button", {
				className: Section_module_css_default.modalClose,
				"aria-label": t("confirmCancel"),
				onClick: () => onClose()
			}, (0, react.createElement)(CloseIcon))), done ? (0, react.createElement)(ResultView, {
				title: t("installResultTitle"),
				desc: t("installResultDesc"),
				t,
				onClose
			}) : (0, react.createElement)("div", { className: Section_module_css_default.modalBody }, (0, react.createElement)("div", { className: Section_module_css_default.trustHint }, t("confirmDesc")), (0, react.createElement)("div", { className: Section_module_css_default.modalRow }, (0, react.createElement)("span", { className: Section_module_css_default.modalLabel }, t("confirmPlugin")), (0, react.createElement)("span", {
				className: Section_module_css_default.modalValue,
				title: plugin.displayName ?? plugin.slug
			}, plugin.displayName ?? plugin.slug)), plugin.source?.repo ? (0, react.createElement)("div", { className: Section_module_css_default.modalRow }, (0, react.createElement)("span", { className: Section_module_css_default.modalLabel }, t("confirmSource")), (0, react.createElement)("a", {
				className: Section_module_css_default.modalLink,
				href: pluginDetailUrl(plugin, langPath),
				target: "_blank",
				rel: "noopener noreferrer",
				title: plugin.source.repo
			}, (0, react.createElement)(LinkIcon), plugin.source.repo)) : null, (0, react.createElement)("div", {
				className: Section_module_css_default.modalCmd,
				onClick: onCopy,
				title: t("copyInstallCommand"),
				role: "button",
				tabIndex: 0
			}, (0, react.createElement)("span", { className: Section_module_css_default.modalCmdText }, `dsh plugin add ${plugin.source?.repo ?? ""}`), (0, react.createElement)("span", { className: Section_module_css_default.modalCmdCopy }, (0, react.createElement)(CopyIcon), t("copyCmdLabel"))), task && task.status === "pending" ? (0, react.createElement)("div", { className: Section_module_css_default.queuedHint }, t("queuedHint")) : null, task ? (0, react.createElement)(ProgressView, { task }) : null, (0, react.createElement)("div", { className: Section_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Section_module_css_default.modalCopy,
				disabled: busy,
				onClick: onCopy
			}, t("copyInstallCommand")), (0, react.createElement)("button", {
				className: Section_module_css_default.modalInstall,
				disabled: busy,
				onClick: onInstall
			}, busy ? task.status === "pending" ? t("queuedTitle") : t("installing") : t("installNow"))))));
		}
		/** 卸载确认弹窗：确认/进行中（后台队列，可关闭）；完成后切换为结果视图（成功即生效，仅「完成」关闭）。 */
		function UninstallModal(props) {
			const { plugin, done, task, t, langPath, onClose, onCancel, onCopyCommand, onConfirm } = props;
			const busy = task !== null && (task.status === "pending" || task.status === "running");
			const title = busy ? task.status === "pending" ? t("queuedTitle") : t("uninstalling") : done ? t("uninstallResultTitle") : t("uninstallTitle");
			return (0, react.createElement)("div", {
				className: Section_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: Section_module_css_default.modal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Section_module_css_default.modalHead }, (0, react.createElement)("div", { className: Section_module_css_default.modalTitle }, title), (0, react.createElement)("button", {
				className: Section_module_css_default.modalClose,
				"aria-label": t("confirmCancel"),
				onClick: () => onClose()
			}, (0, react.createElement)(CloseIcon))), done ? (0, react.createElement)(ResultView, {
				title: t("uninstallResultTitle"),
				desc: t("uninstallResultDesc"),
				t,
				onClose
			}) : (0, react.createElement)("div", { className: Section_module_css_default.modalBody }, (0, react.createElement)("div", { className: Section_module_css_default.modalDesc }, t("uninstallDesc")), (0, react.createElement)("div", { className: Section_module_css_default.modalRow }, (0, react.createElement)("span", { className: Section_module_css_default.modalLabel }, t("confirmPlugin")), (0, react.createElement)("span", {
				className: Section_module_css_default.modalValue,
				title: plugin.displayName ?? plugin.slug
			}, plugin.displayName ?? plugin.slug)), plugin.source?.repo ? (0, react.createElement)("div", { className: Section_module_css_default.modalRow }, (0, react.createElement)("span", { className: Section_module_css_default.modalLabel }, t("confirmSource")), (0, react.createElement)("a", {
				className: Section_module_css_default.modalLink,
				href: pluginDetailUrl(plugin, langPath),
				target: "_blank",
				rel: "noopener noreferrer",
				title: plugin.source.repo
			}, (0, react.createElement)(LinkIcon), plugin.source.repo)) : null, task && task.status === "pending" ? (0, react.createElement)("div", { className: Section_module_css_default.queuedHint }, t("queuedHint")) : null, task ? (0, react.createElement)(ProgressView, { task }) : null, (0, react.createElement)("div", { className: Section_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Section_module_css_default.modalCancel,
				onClick: onCancel
			}, t("confirmCancel")), (0, react.createElement)("button", {
				className: Section_module_css_default.modalCopy,
				disabled: busy,
				onClick: onCopyCommand
			}, t("copyUninstallCommand")), (0, react.createElement)("button", {
				className: Section_module_css_default.uninstallConfirm,
				disabled: busy,
				onClick: onConfirm
			}, busy ? task.status === "pending" ? t("queuedTitle") : t("uninstalling") : t("uninstall"))))));
		}
		/** 预填插件仓库的 GitHub Issue 链接：标题带插件名，正文附完整错误信息，方便用户一键反馈。 */
		/** 安装/卸载失败弹窗：布局与失败记录一致（类型徽标 + 仓库超链接 + 隐蔽复制按钮），报错完整展示，底部一键提交 Issue。 */
		function ErrorModal({ message, repo, kind, t, onCopy, onClose }) {
			return (0, react.createElement)("div", {
				className: Section_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: Section_module_css_default.modal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Section_module_css_default.modalHead }, (0, react.createElement)("div", { className: Section_module_css_default.errorTitle }, kind === "install" ? t("errorTitleInstall") : t("errorTitleUninstall")), (0, react.createElement)("button", {
				className: Section_module_css_default.modalClose,
				"aria-label": t("errorClose"),
				onClick: onClose
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Section_module_css_default.modalBody }, (0, react.createElement)("div", { className: Section_module_css_default.failRow }, (0, react.createElement)("div", { className: Section_module_css_default.failHead }, (0, react.createElement)("span", { className: kind === "install" ? Section_module_css_default.failKindInstall : Section_module_css_default.failKindUninstall }, kind === "install" ? t("install") : t("uninstall")), repo ? (0, react.createElement)("a", {
				className: Section_module_css_default.failRepo,
				href: `https://github.com/${repo}`,
				target: "_blank",
				rel: "noopener noreferrer",
				title: repo
			}, repo) : null, (0, react.createElement)("button", {
				className: Section_module_css_default.errorCopySoft,
				onClick: onCopy
			}, t("errorCopy"))), (0, react.createElement)("pre", { className: Section_module_css_default.errorBox }, message), repo ? (0, react.createElement)("a", {
				className: Section_module_css_default.failBigIssue,
				href: pluginIssueUrl(repo, message),
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("failIssueHint")
			}, t("failIssueBig")) : null), (0, react.createElement)("div", { className: Section_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Section_module_css_default.restartLater,
				onClick: onClose
			}, t("errorClose"))))));
		}
		/** 全局反馈 Toast：复制成功（反色）/ 安装完成（反色）/ 安装失败（红色）/ 卸载结果 */
		function Toast({ toast, t }) {
			const text = toast.kind === "copied" ? t("toastCopied") : toast.kind === "errCopied" ? t("errCopied") : toast.kind === "done" ? t("installDone") : toast.kind === "fail" ? t("installFail") : toast.kind === "removed" ? t("uninstallDone") : t("uninstallFail");
			const fail = toast.kind === "fail" || toast.kind === "removeFail";
			return (0, react.createElement)("div", {
				key: toast.id,
				className: fail ? `${Section_module_css_default.toast} ${Section_module_css_default.toastFail}` : Section_module_css_default.toast
			}, text);
		}
		//#endregion
		//#region src/client/components/FailuresModal.tsx
		/**
		* Failure-record dialog: a persistent log of install/remove failures.
		*
		* Records are written to localStorage at failure time (see lib/failures.ts),
		* so a failed task is never lost even when the error dialog was dismissed or
		* the user was away when the task failed. Opened from the header entry button.
		*/
		/** 记录时间紧凑展示：今年内 MM-DD HH:mm，跨年补年份前缀。 */
		function fmtTime(at) {
			const d = new Date(at);
			const pad = (n) => String(n).padStart(2, "0");
			const mmdd = `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
			return d.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear() ? mmdd : `${d.getFullYear()}-${mmdd}`;
		}
		function FailuresModal({ records, t, onClose, onCopy, onClear }) {
			return (0, react.createElement)("div", {
				className: Section_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) onClose();
				}
			}, (0, react.createElement)("div", {
				className: Section_module_css_default.modal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Section_module_css_default.modalHead }, (0, react.createElement)("div", { className: Section_module_css_default.modalTitle }, t("failures")), (0, react.createElement)("button", {
				className: Section_module_css_default.modalClose,
				"aria-label": t("errorClose"),
				onClick: onClose
			}, (0, react.createElement)(CloseIcon))), (0, react.createElement)("div", { className: Section_module_css_default.modalBody }, (0, react.createElement)("div", { className: Section_module_css_default.errorHint }, t("failuresDesc")), records.length === 0 ? (0, react.createElement)("div", { className: Section_module_css_default.failEmpty }, t("failuresEmpty")) : (0, react.createElement)("div", { className: Section_module_css_default.failList }, records.map((r) => (0, react.createElement)("div", {
				key: r.id,
				className: Section_module_css_default.failRow
			}, (0, react.createElement)("div", { className: Section_module_css_default.failHead }, (0, react.createElement)("span", { className: `${Section_module_css_default.failKind} ${r.kind === "install" ? Section_module_css_default.failKindInstall : Section_module_css_default.failKindUninstall}` }, r.kind === "install" ? t("install") : t("uninstall")), r.repo ? (0, react.createElement)("a", {
				className: Section_module_css_default.failRepo,
				href: `https://github.com/${r.repo}`,
				target: "_blank",
				rel: "noopener noreferrer",
				title: r.repo
			}, r.repo) : null, (0, react.createElement)("span", {
				className: Section_module_css_default.failTime,
				title: new Date(r.at).toLocaleString()
			}, fmtTime(r.at)), (0, react.createElement)("button", {
				className: Section_module_css_default.failCopy,
				onClick: () => onCopy(r.message)
			}, t("failCopy"))), r.repo ? (0, react.createElement)("a", {
				className: Section_module_css_default.failBigIssue,
				href: pluginIssueUrl(r.repo, r.message),
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("failIssueHint")
			}, t("failIssueBig")) : null))), (0, react.createElement)("div", { className: Section_module_css_default.modalActions }, records.length > 0 ? (0, react.createElement)("button", {
				className: Section_module_css_default.failClear,
				onClick: onClear
			}, t("failuresClear")) : null, (0, react.createElement)("button", {
				className: Section_module_css_default.restartNow,
				onClick: onClose
			}, t("errorClose"))))));
		}
		//#endregion
		//#region src/client/lib/failures.ts
		const KEY = "dsh-plugin-hub.failure-records";
		const MAX = 50;
		/** 读取本地失败记录（损坏/不可用时返回空列表，不抛错）。列表最新在前；同一仓库只保留最新一条，空 repo 无法定位插件，全部保留。 */
		function loadFailures() {
			try {
				const raw = window.localStorage.getItem(KEY);
				if (!raw) return [];
				const list = JSON.parse(raw);
				if (!Array.isArray(list)) return [];
				const valid = list.filter((r) => !!r && typeof r === "object" && typeof r.message === "string");
				const seen = /* @__PURE__ */ new Set();
				const deduped = [];
				for (const r of valid) {
					if (r.repo && seen.has(r.repo)) continue;
					if (r.repo) seen.add(r.repo);
					deduped.push(r);
				}
				return deduped;
			} catch {
				return [];
			}
		}
		function save(list) {
			try {
				window.localStorage.setItem(KEY, JSON.stringify(list));
			} catch {}
		}
		/** 追加一条失败记录并持久化，返回更新后的完整列表（最新在前，超上限裁剪）。同一仓库只保留最新一次失败。 */
		function addFailure(record) {
			const prev = loadFailures();
			let id = Date.now();
			while (prev.some((r) => r.id === id)) id += 1;
			const rest = record.repo ? prev.filter((r) => r.repo !== record.repo) : prev;
			const next = [{
				...record,
				id,
				at: id
			}, ...rest].slice(0, MAX);
			save(next);
			return next;
		}
		/** 清空全部失败记录，返回空列表。 */
		function clearFailures() {
			save([]);
			return [];
		}
		//#endregion
		//#region src/client/components/CatalogHeader.tsx
		/**
		* Section header: brand title row (H1 + open-site button) + tagline, followed
		* by the purple ad banner that promotes the catalog stats.
		*/
		function CatalogHeader({ t, langPath, statsTotal, statsVerified }) {
			return (0, react.createElement)(react.Fragment, null, (0, react.createElement)("div", { className: Section_module_css_default.header }, (0, react.createElement)("a", {
				className: Section_module_css_default.brand,
				href: `${SITE_URL}${langPath}`,
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("openHint"),
				"aria-label": t("openHint")
			}, (0, react.createElement)("div", { className: Section_module_css_default.brandText }, (0, react.createElement)("div", { className: Section_module_css_default.titleRow }, (0, react.createElement)(LogoIcon), (0, react.createElement)("h1", { className: Section_module_css_default.title }, t("title"), (0, react.createElement)("span", { className: Section_module_css_default.version }, ` v${PLUGIN_VERSION}`))), (0, react.createElement)("div", { className: Section_module_css_default.tagline }, t("tagline", {
				total: statsTotal,
				verified: statsVerified
			}))))), (0, react.createElement)("a", {
				className: Section_module_css_default.adBanner,
				href: `${SITE_URL}${langPath}`,
				target: "_blank",
				rel: "noopener noreferrer"
			}, (0, react.createElement)("span", { className: Section_module_css_default.adBadge }, t("adBadge")), (0, react.createElement)("span", { className: Section_module_css_default.adText }, t("ad", {
				total: statsTotal,
				verified: statsVerified
			})), (0, react.createElement)("span", { className: Section_module_css_default.adArrow }, "↗")));
		}
		//#endregion
		//#region src/client/components/CategoryTabs.tsx
		/**
		* Category tabs: an "all" chip followed by one chip per catalog category.
		* The "all" chip carries the total plugin count; the per-category chips
		* carry no counts so their widths stay uniform.
		*/
		function CategoryTabs({ category, setCategory, allLabel, totalCount, langKey }) {
			return (0, react.createElement)("div", { className: Section_module_css_default.tabs }, (0, react.createElement)("button", {
				key: "all",
				className: category === "all" ? Section_module_css_default.tabActive : Section_module_css_default.tab,
				onClick: () => setCategory("all")
			}, allLabel, (0, react.createElement)("span", { className: Section_module_css_default.tabCount }, totalCount)), CATEGORY_ORDER.map((id) => (0, react.createElement)("button", {
				key: id,
				className: category === id ? Section_module_css_default.tabActive : Section_module_css_default.tab,
				onClick: () => setCategory(id)
			}, categoryLabel(CATEGORY_SHORT_LABELS, id, langKey))));
		}
		//#endregion
		//#region \0dsh-css:src/client/styles/Dropdown.module.css.mjs
		const css = ".B_Gxsq_dropdown{flex-shrink:0;display:inline-flex;position:relative}.B_Gxsq_dropdownBtn{height:24px;color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-bg-layer-2,#80808014);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;white-space:nowrap;border-radius:6px;align-items:center;gap:6px;padding:0 10px;font-size:12px;line-height:22px;transition:background .12s,border-color .12s;display:inline-flex}.B_Gxsq_dropdownBtn:hover{background:var(--dsw-alias-interactive-bg-hover,#80808029);border-color:var(--dsw-alias-button-ghost-active-border,#d0d4da)}.B_Gxsq_dropdownLabel{text-overflow:ellipsis;min-width:0;overflow:hidden}.B_Gxsq_dropdownArrow,.B_Gxsq_dropdownArrowOpen{color:var(--dsw-alias-label-tertiary,#8b93a1);font-size:10px;line-height:1;transition:transform .12s}.B_Gxsq_dropdownArrowOpen{transform:rotate(180deg)}.B_Gxsq_dropdownPanel{z-index:50;background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);border-radius:8px;flex-direction:column;gap:2px;min-width:100%;padding:4px;display:flex;position:absolute;top:calc(100% + 4px);left:0;box-shadow:0 8px 24px #00000024}.B_Gxsq_dropdownItem,.B_Gxsq_dropdownItemActive{cursor:pointer;-webkit-user-select:none;user-select:none;white-space:nowrap;text-align:left;border:none;border-radius:6px;justify-content:space-between;align-items:center;gap:10px;padding:4px 9px;font-size:12px;line-height:18px;transition:background .12s,color .12s;display:flex}.B_Gxsq_dropdownItem{color:var(--dsw-alias-label-primary,#1f2328);background:0 0}.B_Gxsq_dropdownItem:hover{background:var(--dsw-alias-interactive-bg-hover,#8080802e)}.B_Gxsq_dropdownItemActive{color:var(--dsw-alias-label-primary-foreground,#fff);background:var(--dsw-alias-button-primary-fill,#1f2328)}.B_Gxsq_dropdownItemLabel{text-overflow:ellipsis;min-width:0;overflow:hidden}.B_Gxsq_dropdownCount,.B_Gxsq_dropdownCountActive{text-align:center;border-radius:999px;min-width:16px;padding:0 6px;font-size:10px;line-height:14px}.B_Gxsq_dropdownCount{color:var(--dsw-alias-label-tertiary,#8b93a1);background:var(--dsw-alias-bg-layer-2,#8080801a)}.B_Gxsq_dropdownItemActive .B_Gxsq_dropdownCountActive{color:var(--dsw-alias-label-primary-foreground,#fff);background:#80808038}";
		const tagId = "dsh-plugin/Dropdown.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var Dropdown_module_css_default = {
			"dropdownCountActive": "B_Gxsq_dropdownCountActive",
			"dropdownItem": "B_Gxsq_dropdownItem",
			"dropdownArrowOpen": "B_Gxsq_dropdownArrowOpen",
			"dropdownPanel": "B_Gxsq_dropdownPanel",
			"dropdownItemLabel": "B_Gxsq_dropdownItemLabel",
			"dropdownBtn": "B_Gxsq_dropdownBtn",
			"dropdownCount": "B_Gxsq_dropdownCount",
			"dropdownArrow": "B_Gxsq_dropdownArrow",
			"dropdown": "B_Gxsq_dropdown",
			"dropdownLabel": "B_Gxsq_dropdownLabel",
			"dropdownItemActive": "B_Gxsq_dropdownItemActive"
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
			}, (0, react.createElement)("span", { className: Dropdown_module_css_default.dropdownLabel }, current?.label ?? value), (0, react.createElement)("span", { className: open ? Dropdown_module_css_default.dropdownArrowOpen : Dropdown_module_css_default.dropdownArrow }, "▾")), open && (0, react.createElement)("div", {
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
		* installed filter buttons + the failures entry. All buttons share the
		* same size (24px high, like the failure-record button).
		*/
		function CatalogControls({ query, setQuery, sort, setSort, installedFilter, setInstalledFilter, installedCount, notInstalledCount, t, resultText, failCount, onOpenFailures }) {
			return (0, react.createElement)(react.Fragment, null, (0, react.createElement)("div", { className: Section_module_css_default.searchRow }, (0, react.createElement)("input", {
				className: Section_module_css_default.search,
				type: "search",
				placeholder: t("search"),
				value: query,
				spellCheck: false,
				onInput: (e) => setQuery(e.target.value)
			})), (0, react.createElement)("div", { className: Section_module_css_default.controls }, resultText ? (0, react.createElement)("span", { className: Section_module_css_default.filterResults }, ...resultText.split(/(\d+)/).map((part, i) => /^\d+$/.test(part) ? (0, react.createElement)("span", {
				key: i,
				className: Section_module_css_default.resultCount
			}, part) : part)) : null, Dropdown({
				value: sort,
				options: SORTS.map((key) => ({
					value: key,
					label: t(key)
				})),
				onChange: setSort
			}), (0, react.createElement)("button", {
				className: installedFilter === "installed" ? Section_module_css_default.installedBtnActive : installedCount === 0 ? Section_module_css_default.installedBtnDisabled : Section_module_css_default.installedBtn,
				onClick: () => setInstalledFilter(installedFilter === "installed" ? "all" : "installed"),
				disabled: installedCount === 0,
				title: installedCount === 0 ? t("filterInstalledNone") : t("filterInstalledHint"),
				"aria-pressed": installedFilter === "installed"
			}, t("installed"), (0, react.createElement)("span", { className: installedFilter === "installed" ? Section_module_css_default.segCountActive : Section_module_css_default.segCount }, installedCount)), (0, react.createElement)("button", {
				className: installedFilter === "notInstalled" ? Section_module_css_default.installedBtnActive : notInstalledCount === 0 ? Section_module_css_default.installedBtnDisabled : Section_module_css_default.installedBtn,
				onClick: () => setInstalledFilter(installedFilter === "notInstalled" ? "all" : "notInstalled"),
				disabled: notInstalledCount === 0,
				title: notInstalledCount === 0 ? t("filterNotInstalledNone") : t("filterNotInstalledHint"),
				"aria-pressed": installedFilter === "notInstalled"
			}, t("notInstalled"), (0, react.createElement)("span", { className: installedFilter === "notInstalled" ? Section_module_css_default.segCountActive : Section_module_css_default.segCount }, notInstalledCount)), (0, react.createElement)("button", {
				className: Section_module_css_default.failBtn,
				onClick: onOpenFailures,
				title: t("failuresHint"),
				"aria-label": t("failuresHint")
			}, t("failures"), failCount > 0 ? (0, react.createElement)("span", { className: Section_module_css_default.failBadge }, failCount) : null)));
		}
		//#endregion
		//#region src/client/components/ProgressStrip.tsx
		/**
		* Inline progress panel: a queue-summary strip (click to expand/collapse)
		* showing each queued/running install-remove task with its progress and a
		* cancel button. Only rendered while no dialog is open.
		*/
		function ProgressStrip({ queue, stripSummary, showProgress, setShowProgress, cancelTask, t }) {
			return (0, react.createElement)("div", { className: Section_module_css_default.progressStrip }, (0, react.createElement)("button", {
				className: Section_module_css_default.progressStripMain,
				onClick: () => setShowProgress(!showProgress),
				title: t("runningTask")
			}, (0, react.createElement)("span", { className: Section_module_css_default.progressStripDot }), (0, react.createElement)("span", { className: Section_module_css_default.progressStripText }, stripSummary), (0, react.createElement)("span", { className: Section_module_css_default.progressStripToggle }, showProgress ? t("progressHide") : t("progressShow"))), showProgress ? (0, react.createElement)("div", { className: Section_module_css_default.queueList }, queue.map((q) => (0, react.createElement)("div", {
				key: q.id,
				className: Section_module_css_default.queueRow
			}, (0, react.createElement)("div", { className: Section_module_css_default.queueRowHead }, (0, react.createElement)("span", {
				className: Section_module_css_default.queueRowTarget,
				title: q.target
			}, q.target), (0, react.createElement)("button", {
				className: Section_module_css_default.stripCancel,
				onClick: () => cancelTask(q.id)
			}, t("cancelTask"))), (0, react.createElement)("div", { className: Section_module_css_default.queueRowBody }, (0, react.createElement)("span", { className: Section_module_css_default.queueRowStatus }, q.status === "running" ? q.kind === "install" ? t("installing") : t("uninstalling") : t("queuedTitle")), (0, react.createElement)("div", { className: `${Section_module_css_default.progressTrack} ${Section_module_css_default.queueRowTrack}` }, (0, react.createElement)("div", {
				className: Section_module_css_default.progressFill,
				style: { width: `${q.progress}%` }
			})), (0, react.createElement)("span", { className: Section_module_css_default.queueRowPct }, `${q.progress}%`))))) : null);
		}
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
		function PluginCard({ plugin: p, copied, installedName, t, langKey, langPath, onInstall, onUninstall }) {
			const repo = p.source?.repo ?? "";
			const isCopied = copied === repo;
			const isInstalled = installedName(p) !== null;
			return (0, react.createElement)("div", { className: Section_module_css_default.card }, (0, react.createElement)("div", { className: Section_module_css_default.cardMain }, (0, react.createElement)("div", { className: Section_module_css_default.cardHead }, (0, react.createElement)("div", {
				className: Section_module_css_default.cardTitle,
				title: p.description ?? ""
			}, p.displayName ?? p.slug), p.category ? (0, react.createElement)("span", { className: Section_module_css_default.categoryBadge }, categoryLabel(CATEGORY_LABELS, p.category, langKey)) : null, p.compatibility?.status === "verified" ? (0, react.createElement)("span", { className: Section_module_css_default.verified }, t("verified")) : null), p.description && (langKey === "zh" || !/[\u4e00-\u9fff]/.test(p.description)) ? (0, react.createElement)("p", { className: Section_module_css_default.desc }, p.description) : null, (p.topics?.length ?? 0) > 0 ? (0, react.createElement)("div", { className: Section_module_css_default.topics }, p.topics.slice(0, 3).map((topic) => (0, react.createElement)("span", {
				key: topic,
				className: Section_module_css_default.topic
			}, topic))) : null), (0, react.createElement)("div", { className: Section_module_css_default.cardSide }, (0, react.createElement)("div", { className: Section_module_css_default.stats }, (0, react.createElement)("span", { className: Section_module_css_default.star }, "★ ", fmtStars(p.stats?.stargazers_count)), (0, react.createElement)("span", { className: Section_module_css_default.fork }, t("fork"), " ", fmtStars(p.stats?.forks_count)), (0, react.createElement)("span", { className: Section_module_css_default.date }, relTime(p.dates?.repoUpdatedAt, t))), repo ? (0, react.createElement)("div", { className: Section_module_css_default.actions }, (0, react.createElement)("a", {
				className: Section_module_css_default.detailBtn,
				href: pluginDetailUrl(p, langPath),
				target: "_blank",
				rel: "noopener noreferrer",
				title: p.slug
			}, t("detail")), isInstalled ? (0, react.createElement)("button", {
				className: Section_module_css_default.installBtnInstalled,
				disabled: true,
				title: t("installed")
			}, t("installed")) : (0, react.createElement)("button", {
				className: isCopied ? Section_module_css_default.installBtnCopied : Section_module_css_default.installBtn,
				onClick: () => onInstall(p)
			}, t("install")), isInstalled ? (0, react.createElement)("button", {
				className: Section_module_css_default.uninstallBtn,
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
		function CatalogList({ plugins, failed, visible, total, t, langPath, reload, category, installedFilter, copied, installedName, langKey, onInstall, onUninstall }) {
			/** 列表滚动容器：分类/搜索切换后列表内容替换但 scrollTop 保留，会让用户误以为列表没更新，需重置回顶部 */
			const listRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				listRef.current?.scrollTo({ top: 0 });
			}, [category, installedFilter]);
			return (0, react.createElement)("div", { className: Section_module_css_default.body }, (0, react.createElement)("div", {
				ref: listRef,
				className: Section_module_css_default.list
			}, plugins === null && !failed && (0, react.createElement)("div", { className: Section_module_css_default.state }, t("loading")), failed && (0, react.createElement)("div", { className: Section_module_css_default.state }, (0, react.createElement)("div", { className: Section_module_css_default.stateTitle }, t("failed")), (0, react.createElement)("div", { className: Section_module_css_default.stateDesc }, t("failedDesc")), (0, react.createElement)("button", {
				className: Section_module_css_default.retryBtn,
				onClick: () => reload()
			}, t("retry"))), plugins !== null && !failed && visible.length === 0 && (0, react.createElement)("div", { className: Section_module_css_default.state }, (0, react.createElement)("div", { className: Section_module_css_default.stateTitle }, t("noResult")), (0, react.createElement)("div", { className: Section_module_css_default.stateDesc }, t("noResultDesc"))), plugins !== null && !failed && visible.map((p) => (0, react.createElement)(PluginCard, {
				key: p.ownerSlug ? `${p.ownerSlug}/${p.slug}` : p.slug,
				plugin: p,
				copied,
				installedName,
				t,
				langKey,
				langPath,
				onInstall,
				onUninstall
			}))), plugins !== null && !failed && (0, react.createElement)("div", { className: Section_module_css_default.footer }, (0, react.createElement)("a", {
				className: Section_module_css_default.footLink,
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
			/** 操作失败完整信息 + 所属插件仓库 + 失败类型（决定弹窗标题「安装失败/卸载失败」） */
			const [errorMsg, setErrorMsg] = (0, react.useState)(null);
			/** 安装/卸载失败记录：localStorage 持久化，失败即落盘，即使错过弹窗也能回来查看 */
			const [failures, setFailures] = (0, react.useState)(() => loadFailures());
			const [showFailures, setShowFailures] = (0, react.useState)(false);
			const queue = useTaskQueue({
				t,
				refreshInstalled: catalog.refreshInstalled,
				onInstallDone: (viaModal) => viaModal ? setInstallDone(true) : setToast({
					id: Date.now(),
					kind: "done"
				}),
				onUninstallDone: (viaModal) => viaModal ? setUninstallDone(true) : setToast({
					id: Date.now(),
					kind: "removed"
				}),
				onError: (message, repo, kind) => {
					setErrorMsg({
						message,
						repo,
						kind
					});
					setFailures(addFailure({
						kind,
						repo: repo ?? "",
						message
					}));
				},
				installPlugin: confirmPlugin,
				uninstallPlugin,
				installedName: catalog.installedName
			});
			(0, react.useEffect)(() => {
				if (!confirmPlugin && !uninstallPlugin && !showFailures) return;
				const onKey = (e) => {
					if (e.key === "Escape") {
						setConfirmPlugin(null);
						setUninstallPlugin(null);
						setUninstallDone(false);
						setShowFailures(false);
					}
				};
				window.addEventListener("keydown", onKey);
				return () => window.removeEventListener("keydown", onKey);
			}, [
				confirmPlugin,
				uninstallPlugin,
				showFailures
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
				if (await doCopy(`dsh plugin add ${repo}`)) {
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
			const { total, installedName } = catalog;
			const statsTotal = catalog.stats?.total ?? total;
			const statsVerified = catalog.stats?.verified ?? 0;
			const count = catalog.visible.length;
			return (0, react.createElement)("div", { className: Section_module_css_default.root }, (0, react.createElement)(CatalogHeader, {
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
				failCount: failures.length,
				onOpenFailures: () => setShowFailures(true)
			}), queue.queue.length > 0 && !confirmPlugin && !uninstallPlugin ? (0, react.createElement)(ProgressStrip, {
				queue: queue.queue,
				stripSummary: queue.stripSummary,
				showProgress: queue.showProgress,
				setShowProgress: queue.setShowProgress,
				cancelTask: queue.cancelTask,
				t
			}) : null, (0, react.createElement)(CatalogList, {
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
				langKey,
				onInstall: (p) => {
					setInstallDone(false);
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
				onClose: () => setConfirmPlugin(null),
				onCopy: () => copyCommand(confirmPlugin),
				onInstall: () => queue.installNow(confirmPlugin)
			}), uninstallPlugin && (0, react.createElement)(UninstallModal, {
				plugin: uninstallPlugin,
				done: uninstallDone,
				task: queue.uninstallModalTask,
				t,
				langPath,
				onClose: () => {
					setUninstallDone(false);
					setUninstallPlugin(null);
				},
				onCancel: () => setUninstallPlugin(null),
				onCopyCommand: copyUninstallCommand,
				onConfirm: () => queue.uninstallNow(uninstallPlugin)
			}), toast && (0, react.createElement)(Toast, {
				toast,
				t
			}), errorMsg && (0, react.createElement)(ErrorModal, {
				message: errorMsg.message,
				repo: errorMsg.repo,
				kind: errorMsg.kind,
				t,
				onCopy: () => {
					doCopy(errorMsg.message);
					setToast({
						id: Date.now(),
						kind: "errCopied"
					});
				},
				onClose: () => setErrorMsg(null)
			}), showFailures && (0, react.createElement)(FailuresModal, {
				records: failures,
				t,
				onClose: () => setShowFailures(false),
				onCopy: (text) => {
					doCopy(text);
					setToast({
						id: Date.now(),
						kind: "errCopied"
					});
				},
				onClear: () => setFailures(clearFailures())
			}));
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