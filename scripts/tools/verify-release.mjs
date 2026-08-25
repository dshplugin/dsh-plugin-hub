/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 发布前版本规范校验（挂在 package.json 的 prepublishOnly，publish 前自动执行）。
 * 规范约定：
 *   1. 包名必须保持 "dsh-plugin" —— 客户端按包名记录并展示插件，
 *      改名会改变已安装用户的依赖名与列表显示（dsh-plugin-hub 只作仓库名）。
 *   2. 版本号必须符合语义化版本（semver）。
 *   3. 待发布版本不得等于或低于 npm 上已发布的版本，发布前必须递增。
 *   4. 有网络时才会校验远端版本；离线时仅做本地校验。
 */
import { readFile } from "node:fs/promises";

const pkg = JSON.parse(
  await readFile(new URL("../../package.json", import.meta.url), "utf8"),
);

const errors = [];

function compare(a, b) {
  const pa = String(a).replace(/^v/, "").split(/[-+]/)[0].split(".").map(Number);
  const pb = String(b).replace(/^v/, "").split(/[-+]/)[0].split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (pa[i] > pb[i]) return 1;
    if (pa[i] < pb[i]) return -1;
  }
  return 0;
}

// 1. 包名稳定性
if (pkg.name !== "dsh-plugin") {
  errors.push(
    `包名必须是 "dsh-plugin"（当前为 "${pkg.name}"）。` +
      `客户端按包名展示插件，改名会影响已安装用户，请勿修改。`,
  );
}

// 2. semver 合法性
const semver = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
if (!semver.test(pkg.version)) {
  errors.push(
    `版本号 "${pkg.version}" 不是合法的 semver（示例：1.2.3 或 1.2.3-beta.1）。`,
  );
}

// 3. 不得等于或低于 npm 已发布版本（仅在有网络时执行）
if (errors.length === 0) {
  try {
    const res = await fetch("https://registry.npmjs.org/" + encodeURIComponent(pkg.name));
    if (res.ok) {
      const dist = await res.json();
      const latest = dist["dist-tags"]?.latest;
      if (latest && compare(pkg.version, latest) <= 0) {
        errors.push(
          `版本 ${pkg.version} 已发布（npm 最新为 ${latest}），` +
            `不能重复发布，请先递增版本号（npm version patch / minor / major）。`,
        );
      }
    }
  } catch {
    // 离线时跳过远端校验
  }
}

if (errors.length > 0) {
  console.error("发布校验未通过：");
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}

console.log(`✓ 发布校验通过：${pkg.name}@${pkg.version}`);
