import { readFileSync } from "fs";
import { resolve } from "path";

type Dictionary<T = unknown> = Record<string, T>;

export function readJson<T = Dictionary>(relativePath: string): T {
  const fullPath = resolve(process.cwd(), relativePath);
  const raw = readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

export function uniqueEmail(prefix = "test"): string {
  const timestamp = Date.now();
  return `${prefix}.${timestamp}@example.com`;
}

export function randomString(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}


