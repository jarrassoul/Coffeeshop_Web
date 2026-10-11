// Password hashing with Node's built-in scrypt (no extra dependency), so
// plaintext passwords never live in the database. Format:
// "<16-byte salt hex>:<64-byte derived key hex>".

import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Matches a stored scrypt hash; anything else is a legacy plaintext value.
const HASH_PATTERN = /^[0-9a-f]{32}:[0-9a-f]{128}$/;

export function isHashed(stored: string): boolean {
  return HASH_PATTERN.test(stored);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  if (!isHashed(stored)) return false;
  const [saltHex, hashHex] = stored.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  // timingSafeEqual avoids leaking how much of the hash matched.
  return timingSafeEqual(expected, derived);
}
