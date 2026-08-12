import type { Timestamp } from "firebase-admin/firestore";

export function toISOString(
  value: Timestamp | string | undefined,
): string | undefined {
  if (!value) return value;
  return typeof value === "string" ? value : value.toDate().toISOString();
}
