type NpmSearchPackage = {
    name?: unknown;
    keywords?: unknown;
    links?: {
        repository?: unknown;
    };
    repository?: unknown;
    dsh?: unknown;
};
/** registry 路径：指定版本时取该版本的 manifest，否则取 latest。 */
export declare function npmMetadataPath(packageName: string, version?: string): string;
export declare function isDshPackageMetadataForRepo(pkg: NpmSearchPackage, repo: string): boolean;
/**
 * 校验包名对应的 npm 包确实属于该仓库且声明为 DSH 插件：取 registry 上指定版本（缺省 `latest`）
 * 的元数据比对 repository 与插件标记。网络异常、超时、非 200 一律返回 false，不阻塞调用方。
 */
export declare function isDshNpmPackageForRepo(packageName: string, repo: string, registry?: string, proxy?: string, version?: string): Promise<boolean>;
export {};
