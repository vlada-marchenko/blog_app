import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { getPosts, createPost } from "@/lib/firestore/posts";
import { cookies } from "next/headers";

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

  // validation coming soon

  const postId = await createPost({ ...body, authorId: decoded.uid });
  return NextResponse.json({ id: postId }, { status: 201 });
}
