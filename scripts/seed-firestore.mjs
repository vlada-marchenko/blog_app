import { readFile } from "node:fs/promises";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const auth = getAuth();
const db = getFirestore();

const users = JSON.parse(await readFile("./data/seed/users.json", "utf-8"));
const posts = JSON.parse(await readFile("./data/seed/posts.json", "utf-8"));
const comments = JSON.parse(
  await readFile("./data/seed/comments.json", "utf-8"),
);

const uidByKey = {};
for (const u of users) {
  const account = await auth.createUser({
    email: u.email,
    password: u.password,
    displayName: u.displayName,
  });
  uidByKey[u.key] = account.uid;
}

for (const p of posts) {
  await db
    .collection("posts")
    .doc(p.id)
    .set({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      tags: p.tags,
      authorId: uidByKey[p.authorKey],
      createdAt: Timestamp.fromDate(new Date(p.createdAt)),
      updatedAt: Timestamp.fromDate(new Date(p.updatedAt)),
    });
}

for (const c of comments) {
  await db
    .collection("posts")
    .doc(c.postId)
    .collection("comments")
    .doc(c.id)
    .set({
      authorId: uidByKey[c.authorKey],
      content: c.content,
      createdAt: Timestamp.fromDate(new Date(c.createdAt)),
    });
}
