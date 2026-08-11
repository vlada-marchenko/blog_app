import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getComments, createComment } from "@/lib/firestore/comments";
import { adminAuth } from "@/lib/firebase/admin";
import { commentSchema } from "@/schemas/comment.schema";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const comments = await getComments(id);
  return NextResponse.json(comments);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = await adminAuth.verifySessionCookie(cookie);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const validation = commentSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const commentId = await createComment(id, {
    ...validation.data,
    authorId: decoded.uid,
    authorName: decoded.name,
    createdAt: new Date().toISOString(),
    postId: id,
  });
  return NextResponse.json({ id: commentId }, { status: 201 });
}
