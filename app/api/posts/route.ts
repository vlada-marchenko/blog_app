import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { getPosts, createPost } from "@/lib/firestore/posts";
import { cookies } from "next/headers";
import { postSchema } from "@/schemas/post.schema";

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
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

  const validation = postSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const postId = await createPost({
    ...validation.data,
    authorId: decoded.uid,
    authorName: decoded.name,
    createdAt: new Date().toISOString(),
    commentCount: 0,
    updatedAt: new Date().toISOString(),
  });
  return NextResponse.json({ id: postId }, { status: 201 });
}
