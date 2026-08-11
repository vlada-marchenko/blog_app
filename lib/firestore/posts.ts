import type { Post } from "../../types/post";
import { adminDb } from "../firebase/admin";

export async function getPosts(): Promise<Post[]> {
  const data = await adminDb.collection("posts").get();
  return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Post);
}

export async function getPost(id: string): Promise<Post | null> {
  const doc = await adminDb.collection("posts").doc(id).get();
  return doc.exists ? ({ id: doc.id, ...doc.data() } as Post) : null;
}

export async function createPost(data: Post) {
  const post = await adminDb.collection("posts").add(data);
  return post.id;
}
