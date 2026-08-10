// Firebase ADMIN SDK — server-only (Route Handlers, Server Components).
// Never import this into a "use client" file. Different package
// (firebase-admin, not firebase) and different config: a service-account
// credential, not the public web config. This bypasses Firestore Security
// Rules entirely, so any permission check has to happen in your own code —
// e.g. verifying a token before trusting a request.

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
    });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
