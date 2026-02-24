/**
 * resolve-github-releases.js
 *
 * Build-time script that fetches the latest release data from GitHub for each
 * app that declares a `githubReleases` array in os.json, resolves the asset
 * download URLs, and writes the enriched data to src/assets/os-resolved.json.
 *
 * Run automatically before every build via the `prebuild` hook.
 * Accepts an optional GITHUB_TOKEN env var to raise the API rate limit.
 *
 * Usage:
 *   node scripts/resolve-github-releases.js
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import process from "node:process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_JSON = path.resolve(__dirname, "../src/assets/os.json");
const OUT_JSON = path.resolve(__dirname, "../src/assets/os-resolved.json");

const headers = {
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function fetchRelease(repo) {
  const url = `https://api.github.com/repos/${repo}/releases/latest`;
  console.log(`  → Fetching ${url}`);
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${repo}`);
  return res.json();
}

function findAssetUrl(release, pattern) {
  const regex = new RegExp(pattern);
  const asset = release?.assets?.find((a) => regex.test(a.name));
  return asset?.browser_download_url ?? null;
}

async function main() {
  const osData = JSON.parse(readFileSync(SRC_JSON, "utf-8"));

  // Collect unique repos to minimise API calls
  const repos = new Set();
  for (const os of osData.operatingSystems) {
    for (const app of os.apps) {
      if (app.githubReleases?.length) {
        app.githubReleases.forEach((r) => repos.add(r.repo));
      }
    }
  }

  if (!repos.size) {
    console.log("No githubReleases entries found – writing os.json as-is.");
    writeFileSync(OUT_JSON, JSON.stringify(osData, null, 2), "utf-8");
    return;
  }

  // Fetch all releases in parallel
  console.log(`Resolving releases for: ${[...repos].join(", ")}`);
  const releaseMap = {};
  await Promise.all(
    [...repos].map(async (repo) => {
      try {
        releaseMap[repo] = await fetchRelease(repo);
        console.log(`  ✓ ${repo}  (${releaseMap[repo].tag_name})`);
      } catch (err) {
        console.warn(`  ✗ ${repo}: ${err.message}`);
        releaseMap[repo] = null;
      }
    })
  );

  // Build resolved os data
  const resolved = {
    ...osData,
    operatingSystems: osData.operatingSystems.map((os) => ({
      ...os,
      apps: os.apps.map((app) => {
        if (!app.githubReleases?.length) return app;

        const { githubReleases, ...rest } = app;

        const resolvedDownloadLinks = githubReleases.map((entry) => {
          const release = releaseMap[entry.repo];
          return {
            url: release ? findAssetUrl(release, entry.assetPattern) : null,
            label: entry.label ?? null,
            version: release?.tag_name ?? null,
          };
        });

        return { ...rest, resolvedDownloadLinks };
      }),
    })),
  };

  writeFileSync(OUT_JSON, JSON.stringify(resolved, null, 2), "utf-8");
  console.log(`\nWrote ${OUT_JSON}`);
}

main().catch((err) => {
  console.error("resolve-github-releases failed:", err);
  process.exit(1);
});
