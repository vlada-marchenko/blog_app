import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getComments, createComment } from "@/lib/firestore/comments";
import { adminAuth } from "@/lib/firebase/admin";

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

  //valiation coming soon

  const commentId = createComment(id, { ...body, authorId: decoded.uid });
  return NextResponse.json({ id: commentId }, { status: 201 });
}
