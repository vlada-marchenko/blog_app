import { describe, it, expect, vi, beforeEach } from "vitest";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { createPost } from "@/lib/firestore/posts";
import { POST } from "./route";

// Every one of these modules would either hit a real cookie store or a real
// Firebase project if left alone. vi.mock() swaps the whole module out for a
// fake version we control, so the route runs in total isolation.
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/firebase/admin", () => ({
  adminAuth: { verifySessionCookie: vi.fn() },
  adminDb: {},
}));

vi.mock("@/lib/firestore/posts", () => ({
  getPosts: vi.fn(),
  createPost: vi.fn(),
}));

const validBody = {
  title: "A valid title",
  excerpt: "This excerpt is long enough to pass validation.",
  content: "This content is definitely long enough to pass validation too.",
  tags: ["nextjs"],
};

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/posts", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/posts", () => {
  it("returns 401 when there is no session cookie", async () => {
    vi.mocked(cookies).mockResolvedValue({ get: () => undefined } as never);

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(401);
    expect(createPost).not.toHaveBeenCalled();
  });

  it("returns 401 when the session cookie fails verification", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: () => ({ name: "session", value: "bad-cookie" }),
    } as never);
    vi.mocked(adminAuth.verifySessionCookie).mockRejectedValue(
      new Error("invalid"),
    );

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(401);
    expect(createPost).not.toHaveBeenCalled();
  });

  it("returns 400 when the body fails schema validation", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: () => ({ name: "session", value: "good-cookie" }),
    } as never);
    vi.mocked(adminAuth.verifySessionCookie).mockResolvedValue({
      uid: "user-1",
      name: "Irina",
    } as never);

    const res = await POST(makeRequest({ ...validBody, title: "A" }));

    expect(res.status).toBe(400);
    expect(createPost).not.toHaveBeenCalled();
  });

  it("creates the post with the verified user stamped as the author", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: () => ({ name: "session", value: "good-cookie" }),
    } as never);
    vi.mocked(adminAuth.verifySessionCookie).mockResolvedValue({
      uid: "user-1",
      name: "Irina",
    } as never);
    vi.mocked(createPost).mockResolvedValue("new-post-id");

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toEqual({ id: "new-post-id" });
    // The key regression to guard: authorId must come from the verified
    // token, never from whatever the client sent in the body.
    expect(createPost).toHaveBeenCalledWith(
      expect.objectContaining({
        authorId: "user-1",
        authorName: "Irina",
        title: validBody.title,
      }),
    );
  });
});
