window.__ModuleLoader__.load({ id: "dsh-plugin", factory: (require) => {


		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		//#region \0dsh-css:src/client/Section.module.css.mjs
		const css = ".XlLbKa_root{min-width:0;height:100%;color:var(--dsw-alias-label-primary,#1f2328);flex-direction:column;gap:8px;display:flex}.XlLbKa_header{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding:2px 2px 0;display:flex}.XlLbKa_brand{align-items:center;gap:10px;min-width:0;display:flex}.XlLbKa_brandText{flex-direction:column;gap:1px;min-width:0;display:flex}.XlLbKa_title{margin:0;font-size:14px;font-weight:600;line-height:20px}.XlLbKa_tagline{color:var(--dsw-alias-label-tertiary,#8b93a1);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0;font-size:12px;line-height:18px;display:-webkit-box;overflow:hidden}.XlLbKa_controls{flex-shrink:0;align-items:center;gap:8px;display:flex}.XlLbKa_adBanner{color:#fff;cursor:pointer;-webkit-user-select:none;user-select:none;background:linear-gradient(90deg,#4f46e5 0%,#7c3aed 100%);border:1px solid #8b5cf68c;border-radius:8px;align-items:center;gap:8px;padding:7px 12px;text-decoration:none;transition:filter .15s,box-shadow .15s;display:flex;box-shadow:0 2px 10px #4f46e547}.XlLbKa_adBanner:hover{filter:brightness(1.1);box-shadow:0 4px 16px #7c3aed6b}.XlLbKa_adBadge{letter-spacing:.04em;color:#fff;white-space:nowrap;background:#ffffff29;border:1px solid #ffffff8c;border-radius:4px;flex-shrink:0;padding:3px 6px;font-size:10px;font-weight:700;line-height:1}.XlLbKa_adText{text-overflow:ellipsis;white-space:nowrap;color:#fff;min-width:0;font-size:12px;line-height:18px;overflow:hidden}.XlLbKa_adArrow{color:#fff;flex-shrink:0;margin-left:auto;font-size:13px}.XlLbKa_search{width:190px;color:inherit;border:1px solid var(--dsw-alias-border-l2,#e5e7eb);background:0 0;border-radius:6px;outline:none;padding:4px 9px;font-size:12px;line-height:18px;transition:border-color .12s}.XlLbKa_search::placeholder{color:var(--dsw-alias-label-tertiary,#8b93a1)}.XlLbKa_search:focus{border-color:var(--dsw-alias-brand-primary,#4f6ef7)}.XlLbKa_sort{color:var(--dsw-alias-label-secondary,#6b7280);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;outline:none;padding:4px 8px;font-size:12px;line-height:18px}.XlLbKa_sort:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#80808014);border-color:var(--dsw-alias-button-ghost-active-border,#d0d4da)}.XlLbKa_langBtn{color:var(--dsw-alias-label-secondary,#6b7280);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;flex-shrink:0;padding:4px 9px;font-size:12px;line-height:18px;transition:color .12s,border-color .12s}.XlLbKa_langBtn:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#80808014);border-color:var(--dsw-alias-button-ghost-active-border,#d0d4da)}.XlLbKa_openBtn{color:var(--dsw-alias-label-secondary,#6b7280);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;white-space:nowrap;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;flex-shrink:0;align-items:center;gap:4px;padding:3px 9px;font-size:12px;font-weight:500;line-height:20px;text-decoration:none;transition:color .12s,border-color .12s;display:inline-flex}.XlLbKa_openBtn:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#80808014);border-color:var(--dsw-alias-button-ghost-active-border,#d0d4da)}.XlLbKa_openArrow{font-size:12px;line-height:1}.XlLbKa_tabs{border-bottom:1px solid var(--dsw-alias-border-l1,#eceef1);flex-wrap:wrap;align-items:center;gap:6px;padding:2px 2px 8px;display:flex}.XlLbKa_tab,.XlLbKa_tabActive{cursor:pointer;-webkit-user-select:none;user-select:none;border:1px solid #0000;border-radius:999px;flex-shrink:0;align-items:center;gap:6px;padding:3px 10px;font-size:12px;line-height:18px;transition:color .12s,background .12s,border-color .12s;display:inline-flex}.XlLbKa_tab{color:var(--dsw-alias-label-secondary,#6b7280);border-color:var(--dsw-alias-border-l2,#e5e7eb);background:0 0}.XlLbKa_tab:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#80808014);border-color:var(--dsw-alias-border-l1,#eceef1)}.XlLbKa_tabActive{color:var(--dsw-alias-label-primary-foreground,#fff);background:var(--dsw-alias-button-primary-fill,#1f2328);border-color:var(--dsw-alias-button-primary-fill,#1f2328)}.XlLbKa_tabCount,.XlLbKa_tabCountActive{text-align:center;border-radius:999px;min-width:16px;padding:0 5px;font-size:10px;line-height:14px}.XlLbKa_tabCount{color:var(--dsw-alias-label-tertiary,#8b93a1);background:var(--dsw-alias-bg-layer-2,#8080801a)}.XlLbKa_tabActive .XlLbKa_tabCountActive{color:var(--dsw-alias-label-primary-foreground,#fff);background:#80808038}.XlLbKa_body{flex-direction:column;flex:1;min-height:0;display:flex}.XlLbKa_list{flex-direction:column;flex:1;gap:6px;min-height:0;padding:2px 4px 4px 2px;display:flex;overflow-y:auto}.XlLbKa_card{border:1px solid var(--dsw-alias-border-l2,#e5e7eb);background:var(--dsw-alias-bg-layer-1,#8080800f);border-radius:8px;justify-content:space-between;align-items:stretch;gap:12px;padding:9px 12px;transition:border-color .12s,background .12s;display:flex}.XlLbKa_card:hover{border-color:var(--dsw-alias-brand-primary,#4f6ef7);background:var(--dsw-alias-bg-layer-2,#8080801a)}.XlLbKa_cardMain{flex-direction:column;gap:4px;min-width:0;display:flex}.XlLbKa_cardHead{align-items:center;gap:6px;min-width:0;display:flex}.XlLbKa_cardTitle{white-space:nowrap;text-overflow:ellipsis;font-size:13px;font-weight:600;line-height:18px;overflow:hidden}.XlLbKa_categoryBadge,.XlLbKa_verified{border:1px solid #0000;border-radius:4px;flex-shrink:0;padding:0 6px;font-size:10px;line-height:16px}.XlLbKa_categoryBadge{color:var(--dsw-alias-brand-primary,#4f6ef7);border-color:var(--dsw-alias-button-ghost-active-border,#4f6ef740)}.XlLbKa_verified{color:var(--dsw-alias-state-success-primary,#1a7f37);border-color:var(--dsw-alias-state-success-secondary,#1a7f374d)}.XlLbKa_desc{color:var(--dsw-alias-label-secondary,#6b7280);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0;font-size:12px;line-height:18px;display:-webkit-box;overflow:hidden}.XlLbKa_topics{flex-wrap:wrap;align-items:center;gap:4px;min-width:0;display:flex}.XlLbKa_topic{color:var(--dsw-alias-label-tertiary,#8b93a1);background:var(--dsw-alias-bg-layer-2,#8080801a);white-space:nowrap;border-radius:4px;flex-shrink:0;padding:0 6px;font-size:10px;line-height:16px}.XlLbKa_cardSide{flex-direction:column;flex-shrink:0;justify-content:space-between;align-items:flex-end;gap:6px;display:flex}.XlLbKa_stats{flex-direction:column;align-items:flex-end;gap:1px;display:flex}.XlLbKa_star{color:var(--dsw-alias-state-warn-primary,#b8860b);white-space:nowrap;font-size:11px;line-height:16px}.XlLbKa_fork{color:var(--dsw-alias-label-tertiary,#8b93a1);white-space:nowrap;font-size:11px;line-height:16px}.XlLbKa_date{color:var(--dsw-alias-label-tertiary,#8b93a1);white-space:nowrap;font-size:10px;line-height:14px}.XlLbKa_installBtn,.XlLbKa_installBtnCopied,.XlLbKa_detailBtn{cursor:pointer;border-radius:6px;padding:2px 10px;font-size:11px;line-height:18px;transition:color .12s,border-color .12s,background .12s}.XlLbKa_installBtn{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-bg-layer-2,#8080800f);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);-webkit-user-select:none;user-select:none}.XlLbKa_installBtn:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#8080801f);border-color:var(--dsw-alias-button-ghost-active-border,#d0d4da)}.XlLbKa_detailBtn{color:var(--dsw-alias-label-primary-foreground,#fff);background:var(--dsw-alias-button-primary-fill,#1f2328);-webkit-user-select:none;user-select:none;border:1px solid #0000;align-items:center;font-weight:500;text-decoration:none;display:inline-flex}.XlLbKa_detailBtn:hover{background:var(--dsw-alias-button-primary-hover,#43454a)}.XlLbKa_actions{align-items:center;gap:6px;display:flex}.XlLbKa_installBtnCopied{color:var(--dsw-alias-state-success-primary,#1a7f37);border:1px solid var(--dsw-alias-state-success-secondary,#1a7f3766);-webkit-user-select:none;user-select:none;background:#22c55e24}.XlLbKa_toast{z-index:1000;background:var(--dsw-alias-button-primary-fill,#1f2328);color:var(--dsw-alias-label-primary-foreground,#fff);pointer-events:none;white-space:nowrap;border:1px solid #0000;border-radius:8px;padding:10px 16px;font-size:12px;font-weight:500;line-height:18px;animation:.22s ease-out XlLbKa_toastIn;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 6px 24px #00000047}@keyframes XlLbKa_toastIn{0%{opacity:0;transform:translate(-50%,-44%)}to{opacity:1;transform:translate(-50%,-50%)}}.XlLbKa_toastFail{color:#fff;background:#d1242f;border-color:#ffffff3d}.XlLbKa_overlay{z-index:998;-webkit-user-select:none;user-select:none;background:#00000061;justify-content:center;align-items:center;animation:.16s ease-out XlLbKa_overlayIn;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.XlLbKa_modal{background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);border-radius:10px;flex-direction:column;gap:10px;width:420px;max-width:calc(100vw - 32px);padding:14px 16px;animation:.18s ease-out XlLbKa_modalIn;display:flex;box-shadow:0 12px 40px #0000003d}.XlLbKa_modalHead{justify-content:space-between;align-items:center;gap:8px;display:flex}.XlLbKa_modalTitle{color:var(--dsw-alias-label-primary,#1f2328);font-size:14px;font-weight:600;line-height:20px}.XlLbKa_modalClose{width:24px;height:24px;color:var(--dsw-alias-label-tertiary,#8b93a1);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border:none;border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;font-size:16px;line-height:1;display:inline-flex}.XlLbKa_modalClose:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#8080801a)}.XlLbKa_modalDesc{color:var(--dsw-alias-label-secondary,#6b7280);font-size:12px;line-height:18px}.XlLbKa_modalRow{align-items:baseline;gap:8px;min-width:0;font-size:12px;line-height:18px;display:flex}.XlLbKa_modalLabel{min-width:64px;color:var(--dsw-alias-label-tertiary,#8b93a1);flex-shrink:0}.XlLbKa_modalValue{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-primary,#1f2328);font-weight:500;overflow:hidden}.XlLbKa_modalCmd{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-bg-layer-2,#80808014);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);text-overflow:ellipsis;white-space:nowrap;border-radius:6px;padding:6px 10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:18px;overflow:hidden}.XlLbKa_modalActions{justify-content:flex-end;align-items:center;gap:8px;margin-top:2px;display:flex}.XlLbKa_modalCancel,.XlLbKa_modalCopy{color:var(--dsw-alias-label-secondary,#6b7280);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;padding:5px 14px;font-size:12px;line-height:18px;transition:color .12s,border-color .12s,background .12s}.XlLbKa_modalCancel:hover,.XlLbKa_modalCopy:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#80808014)}.XlLbKa_modalConfirm,.XlLbKa_modalInstall{color:var(--dsw-alias-label-primary-foreground,#fff);background:var(--dsw-alias-button-primary-fill,#1f2328);cursor:pointer;-webkit-user-select:none;user-select:none;border:1px solid #0000;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;line-height:18px;transition:background .12s}.XlLbKa_modalConfirm:hover,.XlLbKa_modalInstall:hover{background:var(--dsw-alias-button-primary-hover,#43454a)}.XlLbKa_modalCopy:disabled,.XlLbKa_modalInstall:disabled{opacity:.55;cursor:not-allowed;pointer-events:none}@keyframes XlLbKa_overlayIn{0%{opacity:0}to{opacity:1}}@keyframes XlLbKa_modalIn{0%{opacity:0;transform:translateY(6px)scale(.98)}to{opacity:1;transform:translateY(0)scale(1)}}.XlLbKa_state{text-align:center;min-height:160px;color:var(--dsw-alias-label-tertiary,#8b93a1);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:8px;padding:24px;font-size:12px;line-height:18px;display:flex}.XlLbKa_stateTitle{color:var(--dsw-alias-label-primary,#1f2328);font-size:13px;font-weight:600}.XlLbKa_stateDesc{max-width:420px}.XlLbKa_retryBtn{color:var(--dsw-alias-label-secondary,#6b7280);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);cursor:pointer;-webkit-user-select:none;user-select:none;background:0 0;border-radius:6px;margin-top:4px;padding:4px 12px;font-size:12px;line-height:18px}.XlLbKa_retryBtn:hover{color:var(--dsw-alias-label-primary,#1f2328);background:var(--dsw-alias-interactive-bg-hover,#80808014);border-color:var(--dsw-alias-button-ghost-active-border,#d0d4da)}.XlLbKa_footer{border-top:1px solid var(--dsw-alias-border-l1,#eceef1);flex-shrink:0;justify-content:space-between;align-items:center;gap:8px;padding:6px 4px 0;display:flex}.XlLbKa_footText{color:var(--dsw-alias-label-tertiary,#8b93a1);font-size:11px;line-height:16px}.XlLbKa_footLink{color:var(--dsw-alias-brand-primary,#4f6ef7);white-space:nowrap;-webkit-user-select:none;user-select:none;font-size:11px;line-height:16px;text-decoration:none}.XlLbKa_footLink:hover{text-decoration:underline}";
		const tagId = "dsh-plugin/Section.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var Section_module_css_default = {
			"brand": "XlLbKa_brand",
			"modalRow": "XlLbKa_modalRow",
			"modalDesc": "XlLbKa_modalDesc",
			"toast": "XlLbKa_toast",
			"topics": "XlLbKa_topics",
			"list": "XlLbKa_list",
			"tabActive": "XlLbKa_tabActive",
			"langBtn": "XlLbKa_langBtn",
			"installBtnCopied": "XlLbKa_installBtnCopied",
			"topic": "XlLbKa_topic",
			"header": "XlLbKa_header",
			"detailBtn": "XlLbKa_detailBtn",
			"body": "XlLbKa_body",
			"root": "XlLbKa_root",
			"installBtn": "XlLbKa_installBtn",
			"actions": "XlLbKa_actions",
			"cardTitle": "XlLbKa_cardTitle",
			"modalLabel": "XlLbKa_modalLabel",
			"stateTitle": "XlLbKa_stateTitle",
			"adBanner": "XlLbKa_adBanner",
			"modalCancel": "XlLbKa_modalCancel",
			"retryBtn": "XlLbKa_retryBtn",
			"stats": "XlLbKa_stats",
			"stateDesc": "XlLbKa_stateDesc",
			"openBtn": "XlLbKa_openBtn",
			"tabs": "XlLbKa_tabs",
			"overlayIn": "XlLbKa_overlayIn",
			"openArrow": "XlLbKa_openArrow",
			"modalCopy": "XlLbKa_modalCopy",
			"star": "XlLbKa_star",
			"desc": "XlLbKa_desc",
			"modalTitle": "XlLbKa_modalTitle",
			"modalConfirm": "XlLbKa_modalConfirm",
			"cardSide": "XlLbKa_cardSide",
			"tagline": "XlLbKa_tagline",
			"adBadge": "XlLbKa_adBadge",
			"cardHead": "XlLbKa_cardHead",
			"toastIn": "XlLbKa_toastIn",
			"modalClose": "XlLbKa_modalClose",
			"overlay": "XlLbKa_overlay",
			"modalActions": "XlLbKa_modalActions",
			"brandText": "XlLbKa_brandText",
			"categoryBadge": "XlLbKa_categoryBadge",
			"cardMain": "XlLbKa_cardMain",
			"tabCount": "XlLbKa_tabCount",
			"modalHead": "XlLbKa_modalHead",
			"footText": "XlLbKa_footText",
			"search": "XlLbKa_search",
			"date": "XlLbKa_date",
			"modalIn": "XlLbKa_modalIn",
			"modalCmd": "XlLbKa_modalCmd",
			"modalInstall": "XlLbKa_modalInstall",
			"title": "XlLbKa_title",
			"modalValue": "XlLbKa_modalValue",
			"adText": "XlLbKa_adText",
			"sort": "XlLbKa_sort",
			"adArrow": "XlLbKa_adArrow",
			"tab": "XlLbKa_tab",
			"footer": "XlLbKa_footer",
			"modal": "XlLbKa_modal",
			"verified": "XlLbKa_verified",
			"card": "XlLbKa_card",
			"fork": "XlLbKa_fork",
			"toastFail": "XlLbKa_toastFail",
			"tabCountActive": "XlLbKa_tabCountActive",
			"state": "XlLbKa_state",
			"footLink": "XlLbKa_footLink",
			"controls": "XlLbKa_controls"
		};
		//#endregion
		//#region src/client/locales.ts
		/** zh/en dictionaries for the DSH-Plugin Hub settings section. */
		const zh = {
			nav: "插件中心",
			title: "DSH-Plugin Hub for DeepSeek Harness",
			tagline: "DSH plugin 插件中心：收录 {total} 个 DeepSeek Harness 插件，人工精选验证 {verified}，每日更新 · 免费安装",
			adBadge: "推荐",
			ad: "DSH-Plugin 插件中心：收录 {total} 个 DeepSeek Harness 插件，其中 {verified} 人工精选验证，每日更新，免费按分类浏览、搜索、下载与安装，人工验证、来源可溯",
			search: "搜索插件名称、描述、标签…",
			all: "全部",
			sortStars: "Star 最多",
			sortUpdated: "最近更新",
			sortNewest: "最新收录",
			open: "在浏览器中打开",
			openHint: "打开 dsh-plugin.org",
			openBtn: "DSH-Plugin 官网",
			toEn: "Switch to English",
			fork: "Fork",
			loading: "正在加载插件数据…",
			failed: "插件数据加载失败",
			failedDesc: "请稍后重试，或点击右上角按钮在浏览器中打开插件中心。",
			retry: "重试",
			copy: "复制安装命令",
			toastCopied: "安装命令已复制，去 dsh 终端粘贴即可安装",
			confirmTitle: "确认安装",
			confirmDesc: "这是社区第三方代码，安装前请确认信任来源。",
			confirmPlugin: "插件",
			confirmSource: "来源",
			confirmCommand: "安装命令",
			copyCommand: "复制命令",
			installNow: "直接安装",
			installing: "安装中…",
			installDone: "安装完成，重启 dsh 后生效",
			installFail: "安装失败，可复制命令手动安装",
			confirmCancel: "取消",
			detail: "打开详情",
			noResult: "没有找到匹配的插件",
			noResultDesc: "换个关键词试试，或前往网站浏览全部插件。",
			today: "今天更新",
			daysAgo: "更新于 {days} 天前",
			monthsAgo: "更新于 {months} 个月前",
			yearsAgo: "更新于 {years} 年前",
			pluginsTotal: "共 {n} 个插件",
			filteredCount: "匹配 {n} 个",
			more: "还有 {n} 个插件，去网站查看全部",
			browseAll: "浏览全部 {n} 个插件",
			verified: "已验证",
			empty: "该分类暂无插件",
			dataFrom: "数据源 dsh-plugin.org · 每日人工更新"
		};
		const en = {
			nav: "Plugin Hub",
			title: "DSH-Plugin Hub for DeepSeek Harness",
			tagline: "DSH plugin marketplace · {total} DeepSeek Harness plugins indexed · {verified} human-verified · updated daily · free to install",
			adBadge: "Featured",
			ad: "DSH-Plugin Hub: {total} DeepSeek Harness plugins indexed, {verified} of which are human-verified. Updated daily — browse, search & install for free.",
			search: "Search plugins by name, description, tags…",
			all: "All",
			sortStars: "Most stars",
			sortUpdated: "Recently updated",
			sortNewest: "Newest added",
			open: "Open in browser",
			openHint: "Open dsh-plugin.org",
			openBtn: "dsh-plugin.org",
			toZh: "Switch to Chinese",
			fork: "Fork",
			loading: "Loading plugin data…",
			failed: "Failed to load plugin data",
			failedDesc: "Please retry, or open the hub in your browser with the button above.",
			retry: "Retry",
			copy: "Copy install command",
			toastCopied: "Install command copied — paste it in your dsh terminal",
			confirmTitle: "Confirm install",
			confirmDesc: "This is community third-party code. Make sure you trust the source before installing.",
			confirmPlugin: "Plugin",
			confirmSource: "Source",
			confirmCommand: "Command",
			copyCommand: "Copy command",
			installNow: "Install",
			installing: "Installing…",
			installDone: "Installed — restart dsh to apply",
			installFail: "Install failed — copy the command instead",
			confirmCancel: "Cancel",
			detail: "Open details",
			noResult: "No plugins match your search",
			noResultDesc: "Try another keyword, or browse all plugins on the website.",
			today: "updated today",
			daysAgo: "updated {days}d ago",
			monthsAgo: "updated {months}mo ago",
			yearsAgo: "updated {years}y ago",
			pluginsTotal: "{n} plugins",
			filteredCount: "{n} matched",
			more: "{n} more on the website",
			browseAll: "Browse all {n} plugins",
			verified: "Verified",
			empty: "No plugins in this category yet",
			dataFrom: "Data from dsh-plugin.org · curated daily"
		};
		//#endregion
		//#region src/client/index.tsx
		/**
		* dsh-plugin client: a native "Plugin Hub" settings section that renders
		* the community marketplace (dsh-plugin.org) as a first-class catalog —
		* category tabs (11 categories + All), search, sorting and one-click
		* install-command copy. Plugin data is fetched live from dsh-plugin.org,
		* so the browser bundle stays small and always in sync with the site.
		*
		* Built by tsdown into the __ModuleLoader__ factory bundle at client/client.js.
		*/
		const NS = "dsh-plugin";
		const SITE_URL = "https://dsh-plugin.org/";
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
			"sortUpdated",
			"sortNewest"
		];
		function fmtStars(count) {
			if (!count || count <= 0) return "0";
			if (count < 1e3) return String(count);
			const k = count / 1e3;
			return `${k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
		}
		function relTime(iso, t) {
			if (!iso) return "";
			const days = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
			if (days <= 0) return t("today");
			if (days < 30) return t("daysAgo", { days });
			if (days < 365) return t("monthsAgo", { months: Math.floor(days / 30) });
			return t("yearsAgo", { years: Math.floor(days / 365) });
		}
		function PluginHubSection({ t: _hostT, locale }) {
			const [lang, setLang] = (0, react.useState)(locale.getSnapshot().active);
			const [plugins, setPlugins] = (0, react.useState)(null);
			/** 收录/精选统计（官网 /api/stats.json 实时拉取） */
			const [stats, setStats] = (0, react.useState)(null);
			const [failed, setFailed] = (0, react.useState)(false);
			const [reloadKey, setReloadKey] = (0, react.useState)(0);
			const [category, setCategory] = (0, react.useState)("all");
			const [query, setQuery] = (0, react.useState)("");
			const [sort, setSort] = (0, react.useState)("sortStars");
			const [copied, setCopied] = (0, react.useState)(null);
			/** 全局反馈 Toast：{id} 用于重复触发时重新走入场动画，kind 决定文案与配色 */
			const [toast, setToast] = (0, react.useState)(null);
			/** 信任确认弹窗：记录待安装的插件，确认后才执行复制 */
			const [confirmPlugin, setConfirmPlugin] = (0, react.useState)(null);
			/** 直接安装进行中（服务端 spawn 官方 CLI），期间禁用弹窗操作 */
			const [installing, setInstalling] = (0, react.useState)(false);
			/** 列表滚动容器：分类/搜索切换后列表内容替换但 scrollTop 保留，会让用户误以为列表没更新，需重置回顶部 */
			const listRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				listRef.current?.scrollTo({ top: 0 });
			}, [category]);
			(0, react.useEffect)(() => locale.subscribe(() => setLang(locale.getSnapshot().active)), [locale]);
			(0, react.useEffect)(() => {
				if (!confirmPlugin) return;
				const onKey = (e) => {
					if (e.key === "Escape") setConfirmPlugin(null);
				};
				window.addEventListener("keydown", onKey);
				return () => window.removeEventListener("keydown", onKey);
			}, [confirmPlugin]);
			(0, react.useEffect)(() => {
				if (!toast) return;
				const timer = window.setTimeout(() => setToast(null), 2400);
				return () => window.clearTimeout(timer);
			}, [toast]);
			(0, react.useEffect)(() => {
				let cancelled = false;
				setPlugins(null);
				setStats(null);
				setFailed(false);
				const apply = (data) => {
					if (cancelled) return;
					const list = (Array.isArray(data) ? data : []).map((item) => normalize(item));
					setPlugins(list.filter((p) => p.compatibility?.status === "verified"));
				};
				const fail = () => {
					if (!cancelled) setFailed(true);
				};
				const fetchData = (url) => fetch(url).then((res) => {
					if (!res.ok) throw new Error(String(res.status));
					return res.json();
				});
				fetchData(`https://dsh-plugin.org/api/plugins.${lang}.json`).then(apply).catch(fail);
				const applyStats = (s) => {
					if (!cancelled && s && typeof s.total === "number" && typeof s.verified === "number") setStats(s);
				};
				fetchData("https://dsh-plugin.org/api/stats.json").then((s) => applyStats(s)).catch(() => {});
				return () => {
					cancelled = true;
				};
			}, [lang, reloadKey]);
			const visible = (0, react.useMemo)(() => {
				if (!plugins) return [];
				const q = query.trim().toLowerCase();
				return [...plugins.filter((p) => {
					if (category !== "all" && p.category !== category) return false;
					if (!q) return true;
					return (p.displayName ?? "").toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q) || (p.topics ?? []).some((topic) => topic.toLowerCase().includes(q));
				})].sort((a, b) => {
					if (sort === "sortStars") return (b.stats?.stargazers_count ?? 0) - (a.stats?.stargazers_count ?? 0);
					if (sort === "sortNewest") return (b.dates?.addedAt ?? "").localeCompare(a.dates?.addedAt ?? "");
					return (b.dates?.repoUpdatedAt ?? "").localeCompare(a.dates?.repoUpdatedAt ?? "");
				});
			}, [
				plugins,
				category,
				query,
				sort
			]);
			const langKey = lang === "en" ? "en" : "zh";
			const langPath = lang === "zh" ? "zh/" : "";
			const dict = langKey === "en" ? en : zh;
			const t = (key, params) => {
				const raw = dict[key] ?? key;
				return params ? raw.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? "")) : raw;
			};
			const catLabel = (map, key) => map[key]?.[langKey] ?? key;
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
			/** 弹窗动作二：直接安装。请求宿主本地路由，由服务端 spawn 官方 CLI 真实安装。 */
			const installNow = async (p) => {
				const repo = p.source?.repo ?? "";
				if (!repo || installing) return;
				setInstalling(true);
				try {
					const res = await fetch("/dsh-plugin-hub/install", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ repo })
					});
					let ok = false;
					try {
						const data = await res.json();
						ok = Boolean(data.ok);
					} catch {
						ok = false;
					}
					setToast({
						id: Date.now(),
						kind: ok ? "done" : "fail"
					});
				} catch {
					setToast({
						id: Date.now(),
						kind: "fail"
					});
				} finally {
					setInstalling(false);
					setConfirmPlugin(null);
				}
			};
			const total = plugins?.length ?? 0;
			const count = visible.length;
			const statsTotal = stats?.total ?? total;
			const statsVerified = stats?.verified ?? 0;
			const categoryCounts = (0, react.useMemo)(() => {
				const counts = { all: total };
				for (const p of plugins ?? []) if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1;
				return counts;
			}, [plugins, total]);
			return (0, react.createElement)("div", { className: Section_module_css_default.root }, (0, react.createElement)("div", { className: Section_module_css_default.header }, (0, react.createElement)("div", { className: Section_module_css_default.brand }, (0, react.createElement)("div", { className: Section_module_css_default.brandText }, (0, react.createElement)("h1", { className: Section_module_css_default.title }, t("title")), (0, react.createElement)("div", { className: Section_module_css_default.tagline }, t("tagline", {
				total: statsTotal,
				verified: statsVerified
			})))), (0, react.createElement)("div", { className: Section_module_css_default.controls }, (0, react.createElement)("input", {
				className: Section_module_css_default.search,
				type: "search",
				placeholder: t("search"),
				value: query,
				spellCheck: false,
				onInput: (e) => setQuery(e.target.value)
			}), (0, react.createElement)("select", {
				className: Section_module_css_default.sort,
				value: sort,
				onChange: (e) => setSort(e.target.value)
			}, SORTS.map((key) => (0, react.createElement)("option", {
				key,
				value: key
			}, t(key)))), (0, react.createElement)("button", {
				className: Section_module_css_default.langBtn,
				title: lang === "zh" ? t("toEn") : t("toZh"),
				onClick: () => setLang(lang === "zh" ? "en" : "zh")
			}, lang === "zh" ? "EN" : "中文"), (0, react.createElement)("a", {
				className: Section_module_css_default.openBtn,
				href: `${SITE_URL}${langPath}`,
				target: "_blank",
				rel: "noopener noreferrer",
				title: t("openHint")
			}, t("openBtn"), (0, react.createElement)("span", { className: Section_module_css_default.openArrow }, "↗")))), (0, react.createElement)("a", {
				className: Section_module_css_default.adBanner,
				href: `${SITE_URL}${langPath}`,
				target: "_blank",
				rel: "noopener noreferrer"
			}, (0, react.createElement)("span", { className: Section_module_css_default.adBadge }, t("adBadge")), (0, react.createElement)("span", { className: Section_module_css_default.adText }, t("ad", {
				total: statsTotal,
				verified: statsVerified
			})), (0, react.createElement)("span", { className: Section_module_css_default.adArrow }, "↗")), (0, react.createElement)("div", { className: Section_module_css_default.tabs }, (0, react.createElement)("button", {
				key: "all",
				className: category === "all" ? Section_module_css_default.tabActive : Section_module_css_default.tab,
				onClick: () => setCategory("all")
			}, t("all"), (0, react.createElement)("span", { className: category === "all" ? Section_module_css_default.tabCountActive : Section_module_css_default.tabCount }, total)), CATEGORY_ORDER.map((id) => (0, react.createElement)("button", {
				key: id,
				className: category === id ? Section_module_css_default.tabActive : Section_module_css_default.tab,
				onClick: () => setCategory(id)
			}, catLabel(CATEGORY_SHORT_LABELS, id), (0, react.createElement)("span", { className: category === id ? Section_module_css_default.tabCountActive : Section_module_css_default.tabCount }, categoryCounts[id] ?? 0)))), (0, react.createElement)("div", { className: Section_module_css_default.body }, (0, react.createElement)("div", {
				ref: listRef,
				className: Section_module_css_default.list
			}, plugins === null && !failed && (0, react.createElement)("div", { className: Section_module_css_default.state }, t("loading")), failed && (0, react.createElement)("div", { className: Section_module_css_default.state }, (0, react.createElement)("div", { className: Section_module_css_default.stateTitle }, t("failed")), (0, react.createElement)("div", { className: Section_module_css_default.stateDesc }, t("failedDesc")), (0, react.createElement)("button", {
				className: Section_module_css_default.retryBtn,
				onClick: () => setReloadKey((k) => k + 1)
			}, t("retry"))), plugins !== null && !failed && count === 0 && (0, react.createElement)("div", { className: Section_module_css_default.state }, (0, react.createElement)("div", { className: Section_module_css_default.stateTitle }, t("noResult")), (0, react.createElement)("div", { className: Section_module_css_default.stateDesc }, t("noResultDesc"))), plugins !== null && !failed && visible.map((p) => {
				const repo = p.source?.repo ?? "";
				const isCopied = copied === repo;
				return (0, react.createElement)("div", {
					key: p.ownerSlug ? `${p.ownerSlug}/${p.slug}` : p.slug,
					className: Section_module_css_default.card
				}, (0, react.createElement)("div", { className: Section_module_css_default.cardMain }, (0, react.createElement)("div", { className: Section_module_css_default.cardHead }, (0, react.createElement)("div", {
					className: Section_module_css_default.cardTitle,
					title: p.description ?? ""
				}, p.displayName ?? p.slug), p.category ? (0, react.createElement)("span", { className: Section_module_css_default.categoryBadge }, catLabel(CATEGORY_LABELS, p.category)) : null, p.compatibility?.status === "verified" ? (0, react.createElement)("span", { className: Section_module_css_default.verified }, t("verified")) : null), p.description && (langKey === "zh" || !/[\u4e00-\u9fff]/.test(p.description)) ? (0, react.createElement)("p", { className: Section_module_css_default.desc }, p.description) : null, (p.topics?.length ?? 0) > 0 ? (0, react.createElement)("div", { className: Section_module_css_default.topics }, p.topics.slice(0, 3).map((topic) => (0, react.createElement)("span", {
					key: topic,
					className: Section_module_css_default.topic
				}, topic))) : null), (0, react.createElement)("div", { className: Section_module_css_default.cardSide }, (0, react.createElement)("div", { className: Section_module_css_default.stats }, (0, react.createElement)("span", { className: Section_module_css_default.star }, "★ ", fmtStars(p.stats?.stargazers_count)), (0, react.createElement)("span", { className: Section_module_css_default.fork }, t("fork"), " ", fmtStars(p.stats?.forks_count)), (0, react.createElement)("span", { className: Section_module_css_default.date }, relTime(p.dates?.repoUpdatedAt, t))), repo ? (0, react.createElement)("div", { className: Section_module_css_default.actions }, (0, react.createElement)("a", {
					className: Section_module_css_default.detailBtn,
					href: `${SITE_URL}${langPath}plugins/${p.ownerSlug ?? repo.split("/")[0]?.toLowerCase() ?? ""}/${p.slug}`,
					target: "_blank",
					rel: "noopener noreferrer",
					title: p.slug
				}, t("detail")), (0, react.createElement)("button", {
					className: isCopied ? Section_module_css_default.installBtnCopied : Section_module_css_default.installBtn,
					onClick: () => setConfirmPlugin(p)
				}, t("copy"))) : null));
			})), plugins !== null && !failed && (0, react.createElement)("div", { className: Section_module_css_default.footer }, (0, react.createElement)("span", { className: Section_module_css_default.footText }, count === total ? t("pluginsTotal", { n: total }) : t("filteredCount", { n: count })), (0, react.createElement)("a", {
				className: Section_module_css_default.footLink,
				href: `${SITE_URL}${langPath}`,
				target: "_blank",
				rel: "noopener noreferrer"
			}, t("browseAll", { n: total })))), confirmPlugin && (0, react.createElement)("div", {
				className: Section_module_css_default.overlay,
				onClick: (e) => {
					if (e.target === e.currentTarget) setConfirmPlugin(null);
				}
			}, (0, react.createElement)("div", {
				className: Section_module_css_default.modal,
				role: "dialog",
				"aria-modal": "true"
			}, (0, react.createElement)("div", { className: Section_module_css_default.modalHead }, (0, react.createElement)("div", { className: Section_module_css_default.modalTitle }, t("confirmTitle")), (0, react.createElement)("button", {
				className: Section_module_css_default.modalClose,
				"aria-label": t("confirmCancel"),
				onClick: () => setConfirmPlugin(null)
			}, "×")), (0, react.createElement)("div", { className: Section_module_css_default.modalDesc }, t("confirmDesc")), (0, react.createElement)("div", { className: Section_module_css_default.modalRow }, (0, react.createElement)("span", { className: Section_module_css_default.modalLabel }, t("confirmPlugin")), (0, react.createElement)("span", {
				className: Section_module_css_default.modalValue,
				title: confirmPlugin.displayName ?? confirmPlugin.slug
			}, confirmPlugin.displayName ?? confirmPlugin.slug)), confirmPlugin.source?.repo ? (0, react.createElement)("div", { className: Section_module_css_default.modalRow }, (0, react.createElement)("span", { className: Section_module_css_default.modalLabel }, t("confirmSource")), (0, react.createElement)("span", {
				className: Section_module_css_default.modalValue,
				title: confirmPlugin.source.repo
			}, confirmPlugin.source.repo)) : null, (0, react.createElement)("div", { className: Section_module_css_default.modalCmd }, `dsh plugin add ${confirmPlugin.source?.repo ?? ""}`), (0, react.createElement)("div", { className: Section_module_css_default.modalActions }, (0, react.createElement)("button", {
				className: Section_module_css_default.modalCopy,
				disabled: installing,
				onClick: () => copyCommand(confirmPlugin)
			}, t("copyCommand")), (0, react.createElement)("button", {
				className: Section_module_css_default.modalInstall,
				disabled: installing,
				onClick: () => installNow(confirmPlugin)
			}, installing ? t("installing") : t("installNow"))))), toast && (0, react.createElement)("div", {
				key: toast.id,
				className: toast.kind === "fail" ? `${Section_module_css_default.toast} ${Section_module_css_default.toastFail}` : Section_module_css_default.toast
			}, toast.kind === "copied" ? t("toastCopied") : toast.kind === "done" ? t("installDone") : t("installFail")));
		}
		const name = NS;
		const inject = ["slots", "locale"];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-plugin: dictionaries");
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