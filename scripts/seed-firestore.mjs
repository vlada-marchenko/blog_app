// Seeds Firebase Auth users + Firestore posts/comments from data/seed/*.json.
//
// Usage:
//   node --env-file=.env.local scripts/seed-firestore.mjs
//
// Requires these vars in .env.local (see .env.example):
//   FIREBASE_ADMIN_PROJECT_ID
//   FIREBASE_ADMIN_CLIENT_EMAIL
//   FIREBASE_ADMIN_PRIVATE_KEY
//
// Safe to re-run: users are upserted by email, posts/comments are upserted by id.

import { readFile } from "node:fs/promises";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing env var ${name}. Run with: node --env-file=.env.local scripts/seed-firestore.mjs`
    );
  }
  return value;
}

const projectId = requireEnv("FIREBASE_ADMIN_PROJECT_ID");
const clientEmail = requireEnv("FIREBASE_ADMIN_CLIENT_EMAIL");
const privateKey = requireEnv("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n");

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const auth = getAuth();
const db = getFirestore();

async function loadJson(relativePath) {
  const raw = await readFile(new URL(relativePath, import.meta.url), "utf-8");
  return JSON.parse(raw);
}

async function upsertUser({ email, password, displayName }) {
  try {
    const existing = await auth.getUserByEmail(email);
    await auth.updateUser(existing.uid, { password, displayName });
    console.log(`  updated auth user ${email} (${existing.uid})`);
    return existing.uid;
  } catch (err) {
    if (err.code !== "auth/user-not-found") throw err;
    const created = await auth.createUser({ email, password, displayName });
    console.log(`  created auth user ${email} (${created.uid})`);
    return created.uid;
  }
}

async function main() {
  const users = await loadJson("../data/seed/users.json");
  const posts = await loadJson("../data/seed/posts.json");
  const comments = await loadJson("../data/seed/comments.json");

  console.log(`Seeding ${users.length} auth users...`);
  const keyToUid = {};
  const keyToName = {};
  for (const u of users) {
    keyToUid[u.key] = await upsertUser(u);
    keyToName[u.key] = u.displayName;
  }

  const commentCountByPost = comments.reduce((acc, c) => {
    acc[c.postId] = (acc[c.postId] || 0) + 1;
    return acc;
  }, {});

  console.log(`Seeding ${posts.length} posts...`);
  const postBatch = db.batch();
  for (const p of posts) {
    const ref = db.collection("posts").doc(p.id);
    postBatch.set(ref, {
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      tags: p.tags,
      authorId: keyToUid[p.authorKey],
      authorName: keyToName[p.authorKey],
      createdAt: Timestamp.fromDate(new Date(p.createdAt)),
      updatedAt: Timestamp.fromDate(new Date(p.updatedAt)),
      commentCount: commentCountByPost[p.id] || 0,
    });
  }
  await postBatch.commit();

  console.log(`Seeding ${comments.length} comments...`);
  const commentBatch = db.batch();
  for (const c of comments) {
    const ref = db.collection("posts").doc(c.postId).collection("comments").doc(c.id);
    commentBatch.set(ref, {
      postId: c.postId,
      authorId: keyToUid[c.authorKey],
      authorName: keyToName[c.authorKey],
      content: c.content,
      createdAt: Timestamp.fromDate(new Date(c.createdAt)),
    });
  }
  await commentBatch.commit();

  console.log("Done. Seeded:", {
    users: users.length,
    posts: posts.length,
    comments: comments.length,
  });
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
