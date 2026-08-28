export type LogCategory = 'install' | 'uninstall' | 'update' | 'diagnostics' | 'settings' | 'system';
export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error';
export interface LogEntry {
    /** 毫秒时间戳 */
    at: number;
    level: LogLevel;
    category: LogCategory;
    /** 机器可读事件码，如 install.start / settings.update */
    event: string;
    /** 人类可读描述 */
    message: string;
}
/** 日志保留上限：超过后在读取时裁剪为最近 MAX_LOG_LINES 条 */
export declare const MAX_LOG_LINES = 2000;
export interface ReadLogOptions {
    /** 分页偏移（过滤后倒序） */
    offset?: number;
    limit?: number;
    category?: LogCategory | 'all';
    level?: LogLevel | 'all';
    /** 关键词：大小写不敏感，匹配事件码或描述 */
    query?: string;
}
export interface ReadLogResult {
    /** 倒序（最新在前） */
    entries: LogEntry[];
    /** 过滤后的总条数（分页前） */
    total: number;
}
/**
 * 把用户填写的日志位置覆盖解析成实际文件路径：
 * 以 .log 结尾视为文件本身，否则视为目录并在其中写 hub.log；相对路径按当前目录归一化。
 */
export declare function customLogFile(override: string): string;
/**
 * 真正默认的日志文件路径：`~/.dsh/profiles/<profile>/hub.log`（不受设置覆盖影响）。
 * 弹窗「恢复默认」、目录选择器起点等需要「未自定义时的位置」都从这里取 ——
 * 不同机器/平台（用户主目录不同）这个值都不同，必须动态计算而非写死。
 */
export declare function defaultLogFilePath(profile: string): string;
/**
 * 当前生效的日志文件路径：设置里填了 logPath 用自定义位置（目录或文件），
 * 否则默认 `~/.dsh/profiles/<profile>/hub.log`。默认位置永远合法可用，无需用户干预。
 */
export declare function logFilePath(profile: string): string;
/** 追加一条系统日志（JSONL 一行一条）。 */
export declare function appendLog(profile: string, entry: LogEntry): void;
/** 清空系统日志：把当前日志文件截断为空。失败返回 false（不阻断调用方）。 */
export declare function clearLog(profile: string): boolean;
/** 读取系统日志（按时间正序，最新在末尾），超上限就地裁剪；支持过滤与分页。 */
export declare function readLog(profile: string, opts?: ReadLogOptions): ReadLogResult;
