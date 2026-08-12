import type { Comment } from "../../types/comment";
import { adminDb } from "../firebase/admin";
import { toISOString } from "./utils";

export async function getComments(postId: string): Promise<Comment[]> {
  const data = await adminDb
    .collection("posts")
    .doc(postId)
    .collection("comments")
    .get();

  return data.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: toISOString(doc.data().createdAt),
      }) as Comment,
  );
}

export async function createComment(postId: string, data: Omit<Comment, "id">) {
  const comment = await adminDb
    .collection("posts")
    .doc(postId)
    .collection("comments")
    .add(data);

  await adminDb
    .collection("posts")
    .doc(postId)
    .update({
      commentCount: (await getComments(postId)).length + 1,
    });

  return comment.id;
}
