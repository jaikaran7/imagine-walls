const ADMIN_SESSION_COOKIE = "iw_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export { ADMIN_SESSION_COOKIE };

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.DATABASE_URL ||
    "imagine-walls-admin-dev-secret"
  );
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "Admin",
    password: process.env.ADMIN_PASSWORD || "Admin@123",
  };
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function signPayload(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toBase64Url(sig);
}

export async function createAdminSessionToken(username: string, now = Date.now()): Promise<string> {
  const exp = String(now + SESSION_TTL_MS);
  const payload = toBase64Url(new TextEncoder().encode(`${username}|${exp}`));
  const sig = await signPayload(payload);
  return `${payload}.${sig}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null,
): Promise<{ username: string } | null> {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = await signPayload(payload);
  if (!safeEqual(sig, expected)) return null;

  try {
    const utf8 = new TextDecoder().decode(fromBase64Url(payload));
    const [username, expRaw] = utf8.split("|");
    const exp = Number(expRaw);
    if (!username || !Number.isFinite(exp) || Date.now() > exp) return null;
    return { username };
  } catch {
    return null;
  }
}

export function credentialsMatch(id: string, password: string): boolean {
  const expected = getAdminCredentials();
  return safeEqual(id, expected.username) && safeEqual(password, expected.password);
}
