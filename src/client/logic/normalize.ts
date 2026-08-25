/**
 * DSH-Plugin Hub — the community plugin marketplace for DeepSeek Harness.
 * Website: https://dsh-plugin.org
 * GitHub: https://github.com/dshplugin/dsh-plugin-hub
 *
 * Normalizer: maps the online API's short-key payload (s/o/n/vr/c/t/f/d/r/v/u/a/sg/fk)
 * to HubPlugin so rendering only ever sees one shape.
 */
import type { HubPlugin } from '../types.ts'

export function normalize(raw: Record<string, unknown>): HubPlugin {
  if (typeof raw.s === 'string') {
    return {
      slug: raw.s,
      ownerSlug: typeof raw.o === 'string' ? raw.o : undefined,
      displayName: typeof raw.n === 'string' ? raw.n : undefined,
      version: typeof raw.vr === 'string' ? raw.vr : undefined,
      category: typeof raw.c === 'string' ? raw.c : undefined,
      topics: Array.isArray(raw.t) ? (raw.t as string[]) : undefined,
      features: Array.isArray(raw.f) ? (raw.f as string[]) : undefined,
      description: typeof raw.d === 'string' ? raw.d : undefined,
      // source 双形态：字符串 repo，或 { repo, npmPackage } 对象
      source: typeof raw.r === 'string'
        ? { repo: raw.r }
        : raw.r !== null && typeof raw.r === 'object'
          ? {
            repo: typeof (raw.r as { repo?: unknown }).repo === 'string' ? (raw.r as { repo: string }).repo : undefined,
            npmPackage: typeof (raw.r as { npmPackage?: unknown }).npmPackage === 'string' ? (raw.r as { npmPackage: string }).npmPackage : undefined,
          }
          : undefined,
      // 安装信息：wi 仅在 false 时下发（缺省视为 true 可一键安装）；
      // ic/igc = 目录下发的权威安装命令（npm/git 通道各一条，CLI-only 插件如 dsh-tui 必须用）
      install: raw.wi === false || typeof raw.ic === 'string' || typeof raw.igc === 'string'
        ? {
          webInstallable: raw.wi === false ? false : undefined,
          command: typeof raw.ic === 'string' ? raw.ic : undefined,
          githubCommand: typeof raw.igc === 'string' ? raw.igc : undefined,
        }
        : undefined,
      compatibility: typeof raw.v === 'string' ? { status: raw.v } : undefined,
      dates: {
        repoUpdatedAt: typeof raw.u === 'string' ? raw.u : undefined,
        addedAt: typeof raw.a === 'string' ? raw.a : undefined,
      },
      stats: {
        stargazers_count: typeof raw.sg === 'number' ? raw.sg : undefined,
        forks_count: typeof raw.fk === 'number' ? raw.fk : undefined,
      },
    }
  }
  return raw as unknown as HubPlugin
}
