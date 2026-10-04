/** Safe prebuilt GitHub release targets for the existing catalog command contract. */
export function githubReleaseTarget(value) {
    const input = value.trim();
    // Catalog commands are display data, never shell code. Accept only one
    // official DSH target, with no trailing flags or additional commands.
    const command = /^dsh[ \t]+plugin[ \t]+--profile(?:[ \t]+|=)[A-Za-z0-9_-]+[ \t]+(?:add|update)[ \t]+(.+)$/i.exec(input);
    const raw = command?.[1] ?? input;
    const target = raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw;
    const match = /^https:\/\/github\.com\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)\/releases\/download\/([A-Za-z0-9._+-]+)\/([A-Za-z0-9._+-]+\.tgz)$/.exec(target);
    if (match === null || match.slice(1).some(part => part === '.' || part === '..'))
        return null;
    return { target, repo: `${match[1]}/${match[2]}` };
}
