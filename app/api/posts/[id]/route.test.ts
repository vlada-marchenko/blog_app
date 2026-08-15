import { describe, it, expect, vi, beforeEach } from "vitest";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { getPost, updatePost, deletePost } from "@/lib/firestore/posts";
import { PATCH, DELETE } from "./route";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/firebase/admin", () => ({
  adminAuth: { verifySessionCookie: vi.fn() },
  adminDb: {},
}));

vi.mock("@/lib/firestore/posts", () => ({
  getPost: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn(),
}));

const existingPost = {
  id: "post-1",
  authorId: "owner-uid",
  authorName: "Owner",
  title: "Existing title",
  excerpt: "An existing excerpt that is long enough.",
  content: "Existing content that is long enough to pass validation.",
  tags: ["nextjs"],
  commentCount: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  vi.clearAllMocks();
  // Every test in this file has a valid cookie present — what changes
  // between tests is whose uid verifySessionCookie resolves to.
  vi.mocked(cookies).mockResolvedValue({
    get: () => ({ name: "session", value: "good-cookie" }),
  } as never);
});

describe("PATCH /api/posts/[id]", () => {
  it("returns 403 when the logged-in user is not the post's author", async () => {
    vi.mocked(adminAuth.verifySessionCookie).mockResolvedValue({
      uid: "someone-else-uid",
      name: "Not The Owner",
    } as never);
    vi.mocked(getPost).mockResolvedValue(existingPost as never);

    const req = new Request("http://localhost/api/posts/post-1", {
      method: "PATCH",
      body: JSON.stringify({ title: "New title" }),
    });
    const res = await PATCH(req, makeParams("post-1"));

    expect(res.status).toBe(403);
    expect(updatePost).not.toHaveBeenCalled();
  });

  it("allows the update when the logged-in user is the author", async () => {
    vi.mocked(adminAuth.verifySessionCookie).mockResolvedValue({
      uid: "owner-uid",
      name: "Owner",
    } as never);
    vi.mocked(getPost).mockResolvedValue(existingPost as never);

    const req = new Request("http://localhost/api/posts/post-1", {
      method: "PATCH",
      body: JSON.stringify({ title: "New title" }),
    });
    const res = await PATCH(req, makeParams("post-1"));

    expect(res.status).toBe(200);
    expect(updatePost).toHaveBeenCalledWith(
      "post-1",
      expect.objectContaining({ title: "New title" }),
    );
  });
});

describe("DELETE /api/posts/[id]", () => {
  it("returns 403 when the logged-in user is not the post's author", async () => {
    vi.mocked(adminAuth.verifySessionCookie).mockResolvedValue({
      uid: "someone-else-uid",
      name: "Not The Owner",
    } as never);
    vi.mocked(getPost).mockResolvedValue(existingPost as never);

    const req = new Request("http://localhost/api/posts/post-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, makeParams("post-1"));

    expect(res.status).toBe(403);
    expect(deletePost).not.toHaveBeenCalled();
  });

  it("deletes the post when the logged-in user is the author", async () => {
    vi.mocked(adminAuth.verifySessionCookie).mockResolvedValue({
      uid: "owner-uid",
      name: "Owner",
    } as never);
    vi.mocked(getPost).mockResolvedValue(existingPost as never);

    const req = new Request("http://localhost/api/posts/post-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, makeParams("post-1"));

    expect(res.status).toBe(200);
    expect(deletePost).toHaveBeenCalledWith("post-1");
  });
});
