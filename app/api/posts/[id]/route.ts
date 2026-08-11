import { NextResponse } from "next/server";
import { getPost } from "@/lib/firestore/posts";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const post = await getPost(id);
  return NextResponse.json(post);
}
