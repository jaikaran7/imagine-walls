#!/usr/bin/env node
/**
 * Push local .env.local keys to the linked Vercel project.
 * Usage:
 *   npx vercel login
 *   npx vercel link --yes --project imagine-walls --scope jaikarans-projects-d6e8d93f
 *   node scripts/push-vercel-env.mjs
 */
const { spawnSync } = require("node:child_process");
const { readFileSync, existsSync } = require("node:fs");
const { resolve } = require("node:path");

const ROOT = resolve(__dirname, "..");
const ENV_FILE = resolve(ROOT, ".env.local");
const KEYS = [
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

if (!existsSync(ENV_FILE)) {
  console.error("Missing .env.local");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(ENV_FILE, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^['"]|['"]$/g, "")];
    }),
);

for (const key of KEYS) {
  const value = env[key];
  if (!value) {
    console.error(`Missing ${key} in .env.local`);
    process.exit(1);
  }
  for (const target of ["production", "preview", "development"]) {
    console.log(`Adding ${key} → ${target}`);
    const result = spawnSync(
      "npx",
      ["vercel", "env", "add", key, target, "--force", "--yes"],
      {
        cwd: ROOT,
        input: `${value}\n`,
        encoding: "utf8",
        stdio: ["pipe", "inherit", "inherit"],
      },
    );
    if (result.status !== 0) {
      console.error(`Failed adding ${key} for ${target}`);
      process.exit(result.status || 1);
    }
  }
}

console.log("Done. Redeploy production for the new env vars to apply.");
