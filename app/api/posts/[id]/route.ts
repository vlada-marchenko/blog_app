import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { postSchema } from "@/schemas/post.schema";
import { getPost, updatePost, deletePost } from "@/lib/firestore/posts";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const post = await getPost(id);
  return NextResponse.json(post);
}

export async function PATCH(
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

  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "Not found " }, { status: 404 });
  if (post.authorId !== decoded.uid)
    return NextResponse.json({ error: "Unathorized" }, { status: 403 });

  const body = await req.json();

  const validation = postSchema.partial().safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  await updatePost(id, {
    ...validation.data,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
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

  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "Not found " }, { status: 404 });
  if (post.authorId !== decoded.uid)
    return NextResponse.json({ error: "Unathorized" }, { status: 403 });

  await deletePost(id);
  return NextResponse.json({ ok: true });
}
