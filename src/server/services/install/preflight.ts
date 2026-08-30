/**
 * DSH Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * 安装前预检：对 GitHub 源的插件，检查其分发（codeload tarball）里是否
 * 真的包含 package.json 声明的入口文件（main / exports["."].default）。
 * git 分发常不提交构建产物（lib/ 等），这类残缺包装完会让宿主重启加载插件树时
 * ERR_MODULE_NOT_FOUND 直接崩溃 —— 预检在动手安装前就把它们拦下，避免白装一次。
 * npm 包信任 registry 的完整性，直接放行；任何无法预检的情况也放行，交给装后
 * 校验（verifyInstalledEntry）兜底，保证预检自身失败不会卡死安装流程。
 */
import { execFile } from 'node:child_process'
import { createWriteStream, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { get } from 'node:https'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { promisify } from 'node:util'
import { githubRepoOf } from '../profile/profile.ts'

const execFileAsync = promisify(execFile)

/** 单次网络操作超时（ms）：git ls-remote / codeload 下载。网络不可达时不能无限挂起，
 *  否则 `/install` 请求永远不返回、任务不入队、前端进度卡 0%。超时后放行（交给装后校验）。 */
const PREFLIGHT_TIMEOUT_MS = 15_000

/** 预检结果：ok=false 表示分发改入口文件缺失，missing 为该文件在包内的相对路径；
 *  name 为 git 分发包 package.json 声明的包名（非 git 目标/无法确定时为 null），
 *  供安装路由做「包名冲突」检测 —— 同名包名已被其他来源占用时，pnpm 装前必然撞车，
 *  需要把晦涩的 CLI 报错转成明确的拦截。 */
export interface PreflightResult {
  ok: boolean
  missing: string | null
  name: string | null
}

export async function preflightTarget(target: string): Promise<PreflightResult> {
  const source = githubRepoOf(target)
  if (source === null) return { ok: true, missing: null, name: null }
  const [owner, repo] = source.split('/')
  let commit = ''
  try {
    const { stdout } = await execFileAsync('git', ['ls-remote', `https://github.com/${owner}/${repo}.git`, 'HEAD'], {
      timeout: PREFLIGHT_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,
    })
    commit = stdout.split(/\s+/)[0] ?? ''
  } catch {
    return { ok: true, missing: null, name: null }
  }
  if (!commit) return { ok: true, missing: null, name: null }
  const dir = mkdtempSync(join(tmpdir(), 'dsh-preflight-'))
  try {
    const tar = join(dir, 'pkg.tar.gz')
    await download(`https://codeload.github.com/${owner}/${repo}/tar.gz/${commit}`, tar)
    const meta = await readTarJson(tar, 'package/package.json')
    if (meta === null) return { ok: true, missing: null, name: null }
    const dot = (meta.exports as Record<string, unknown> | undefined)?.['.']
    const resolved = typeof dot === 'string'
      ? dot
      : dot !== null && typeof dot === 'object'
        ? (dot as Record<string, unknown>).default
        : undefined
    const entry = typeof resolved === 'string' ? resolved : typeof meta.main === 'string' ? meta.main : 'index.js'
    const inTar = await hasTarEntry(tar, `package/${entry}`)
    return { ok: inTar, missing: inTar ? null : entry, name: typeof meta.name === 'string' ? meta.name : null }
  } catch {
    return { ok: true, missing: null, name: null }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = get(url, { timeout: PREFLIGHT_TIMEOUT_MS }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
        res.resume()
        if (res.headers.location) {
          void download(res.headers.location, dest).then(resolve, reject)
          return
        }
        reject(new Error('download failed: redirect without location'))
        return
      }
      if (res.statusCode !== 200) {
        res.resume()
        reject(new Error(`download failed: HTTP ${res.statusCode ?? '?'}`))
        return
      }
      void pipeline(res, createWriteStream(dest)).then(resolve, reject)
    })
    // 网络不可达时 connect/响应可能无限挂起：超时销毁，避免预检卡死（放行交给装后校验）
    req.on('timeout', () => req.destroy(new Error(`download timeout after ${PREFLIGHT_TIMEOUT_MS}ms`)))
    req.on('error', reject)
  })
}

/** 从 tarball 提取并解析一个 JSON 文件；文件不存在或解析失败返回 null。 */
async function readTarJson(tar: string, entry: string): Promise<Record<string, unknown> | null> {
  try {
    const { stdout } = await execFileAsync('tar', ['-xzOf', tar, entry], { maxBuffer: 4 * 1024 * 1024 })
    return JSON.parse(stdout) as Record<string, unknown>
  } catch {
    return null
  }
}

/** 检查 tarball 内是否存在指定 entry。 */
async function hasTarEntry(tar: string, entry: string): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync('tar', ['-tzf', tar, entry], { maxBuffer: 1024 * 1024 })
    return stdout.split(/\r?\n/).some((line) => line === entry)
  } catch {
    return false
  }
}
