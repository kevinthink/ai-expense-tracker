import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify<
  string,
  Buffer,
  number,
  { N: number; r: number; p: number; maxmem: number },
  Buffer
>(scrypt);

const KEY_LENGTH = 32;
const SCRYPT_OPTIONS = { N: 2 ** 17, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };

// Verified against when an email is unknown, so that a login attempt takes the
// same time whether or not the account exists.
export const UNKNOWN_USER_HASH = `${"0".repeat(32)}:${"0".repeat(64)}`;

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  const key = await scryptAsync(
    password,
    Buffer.from(salt, "hex"),
    KEY_LENGTH,
    SCRYPT_OPTIONS,
  );
  return timingSafeEqual(key, Buffer.from(expected, "hex"));
}
