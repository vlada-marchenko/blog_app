import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getPrivateKey(): string | undefined {
  // Preferred: base64-encoded key, immune to quote/newline mangling in
  // dashboard env var UIs (e.g. Vercel).
  const base64Key = process.env.FIREBASE_ADMIN_PRIVATE_KEY_B64;
  if (base64Key) {
    return Buffer.from(base64Key, "base64").toString("utf8");
  }
  // Fallback: raw PEM with escaped \n (works for local .env.local).
  return process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: getPrivateKey(),
    }),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
