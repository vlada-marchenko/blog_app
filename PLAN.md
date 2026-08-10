# Blog App — Implementation Plan

Test task: single-page blog with SWR + Zustand, TypeScript, SSR (Next.js App Router), Firestore, Zod validation, CSS Modules.

## Current state of the repo

**Already installed / decided:**
- Next.js 16.3.0 (App Router) + React 19.2.8, TypeScript, ESLint — scaffolded via create-next-app, still boilerplate (`app/page.tsx`, `app/layout.tsx` untouched)
- `swr`, `zustand`, `zod`, `react-hook-form` already in `package.json` — SWR+Zustand path chosen over Redux
- `firebase` (client SDK) and `firebase-admin` (server SDK) already installed
- `types/validator.ts` exists but is empty — this is where Zod schemas will live
- Tailwind + PostCSS are installed but styling will use **CSS Modules instead** — remove Tailwind to avoid dead config/conflicting styles

**Explicitly missing:** Firebase project wiring, Firebase Auth, all app routes beyond the default page, all API routes, domain types, Zod schemas, Zustand stores, SWR hooks, CSS Modules, all test tooling, real README, GitHub push + deployment.

**Confirmed architecture decisions:**
- **Auth:** Firebase Auth. Posts/comments store `authorId`; edit/delete restricted to author, enforced both in UI and in Firestore Security Rules + Route Handlers.
- **Data access:** SSR pages read Firestore via `firebase-admin` on the server; client mutations go through Next.js Route Handlers; SWR revalidates the client after mutations.
- **Styling:** CSS Modules only, no Tailwind.
- **Testing:** Vitest + React Testing Library (unit/component), Playwright (E2E).

⚠️ Per `AGENTS.md`, this Next.js version has breaking changes vs. training data (e.g. `params`/`searchParams` are Promises in Server Components, possibly different caching defaults). Before writing any route/data-fetching code, read `node_modules/next/dist/docs/01-app/` (routing, route handlers, data fetching, `use-params`, `dynamicParams`).

---

## Target file structure & responsibilities

### Root config

| File | Purpose |
|---|---|
| `.env.local` | (gitignored) Firebase client config (`NEXT_PUBLIC_FIREBASE_*`) + admin service account (`FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`) |
| `.env.example` | Committed template listing every required env var with placeholder values |
| `firestore.rules` | Security rules: anyone can read posts/comments; only authenticated users can create; only `authorId == request.auth.uid` can update/delete |
| `firestore.indexes.json` | Composite indexes if filtering + sorting combos require them (e.g. `tag` + `createdAt`) |
| `vitest.config.ts` | Vitest setup: jsdom environment, path aliases matching `tsconfig.json` |
| `vitest.setup.ts` | Imports `@testing-library/jest-dom`, mocks `next/navigation` |
| `playwright.config.ts` | Base URL, webServer command (`npm run dev`), single browser project (chromium) is enough for scope |
| `README.md` | Real project docs (see Phase 7) |
| `next.config.ts` | Remove Tailwind-related config if any got added; otherwise unchanged |
| `postcss.config.mjs` | **Delete** (Tailwind-only) |

### `lib/` — infrastructure, no React

| File | Purpose |
|---|---|
| `lib/firebase/client.ts` | `initializeApp` (guarded against re-init) for the browser; exports `app`, `auth`, `db` (client Firestore SDK) — imported only from client components |
| `lib/firebase/admin.ts` | `initializeApp` for `firebase-admin` (singleton guarded for hot reload); exports `adminDb`, `adminAuth` — imported only from Server Components / Route Handlers |
| `lib/firebase/converters.ts` | Firestore `withConverter` helpers: snapshot ⇄ typed `Post`/`Comment`, handles `Timestamp` ⇄ ISO string conversion |
| `lib/auth/session.ts` | Server-side helper: extract bearer token / session cookie from a `Request`, verify via `adminAuth.verifyIdToken`, return the decoded uid or `null` — used by every mutating Route Handler |
| `lib/api/fetcher.ts` | Shared SWR fetcher: `fetch(url).then(r => r.ok ? r.json() : throw ApiError)` |
| `lib/api/client.ts` | Typed client-side functions calling the API: `createPost`, `updatePost`, `deletePost`, `addComment`, `deleteComment` — attach the current user's ID token as `Authorization: Bearer <token>` |

### `types/` — shared domain types & validation

| File | Purpose |
|---|---|
| `types/post.ts` | `Post` interface: `id, title, content, excerpt, tags: string[], authorId, authorName, createdAt, updatedAt, commentCount` |
| `types/comment.ts` | `Comment` interface: `id, postId, authorId, authorName, content, createdAt` |
| `types/user.ts` | `AppUser`: `uid, email, displayName` |
| `types/validator.ts` | **(existing empty file)** Zod schemas: `postSchema` (create), `postUpdateSchema` (`.partial()`), `commentSchema`; export inferred types `PostInput`, `PostUpdateInput`, `CommentInput` via `z.infer` |

### `store/` — Zustand (client UI state only, not server data)

| File | Purpose |
|---|---|
| `store/useFilterStore.ts` | `{ searchQuery, tag, sortBy, sortOrder }` + setters + `reset()` — drives the post list filtering/sorting |
| `store/useAuthStore.ts` | `{ user: AppUser \| null, initializing: boolean }` + setters — mirrors Firebase Auth state for synchronous access outside React (e.g. in `lib/api/client.ts`) |

### `hooks/` — SWR + auth glue

| File | Purpose |
|---|---|
| `hooks/usePosts.ts` | `useSWR` over `GET /api/posts?...` built from `useFilterStore` state; returns `{ posts, isLoading, error, mutate }` |
| `hooks/usePost.ts` | `useSWR` over `GET /api/posts/[id]`, accepts SSR `fallbackData` |
| `hooks/useComments.ts` | `useSWR` over `GET /api/posts/[id]/comments` |
| `hooks/useAuth.ts` | Subscribes to `onAuthStateChanged` once (call from `AuthProvider`), writes into `useAuthStore`, exposes `signIn`, `signUp`, `signOut` |

### `app/` — routes (Server Components by default; mark `"use client"` only where noted)

| Path | Purpose |
|---|---|
| `app/layout.tsx` | Root layout: imports `globals.css`, wraps `children` in `<AuthProvider>` + `<Navbar>` |
| `app/globals.css` | Reset + CSS variables (`--color-*`, `--space-*`, breakpoint values used consistently across modules) — no Tailwind directives |
| `app/page.tsx` | Server Component. SSR-fetches initial posts via `adminDb` (respecting default filters), renders `<FilterBar>` + `<PostList initialPosts={...}>` |
| `app/page.module.css` | Page-level layout (container width, grid/list spacing, responsive columns) |
| `app/posts/[id]/page.tsx` | Server Component. `params` is a Promise — must `await`. SSR-fetches the post + its comments via `adminDb`; `notFound()` if missing. Renders `<PostDetail>` + `<CommentList>` + `<CommentForm>` |
| `app/posts/[id]/page.module.css` | Detail page layout |
| `app/posts/new/page.tsx` | Client Component (`"use client"`). Renders `<PostForm mode="create">`. Redirects to `/login` if `useAuthStore` has no user |
| `app/posts/[id]/edit/page.tsx` | Server Component wrapper: SSR-fetches the post, passes as `defaultValues` to a client `<PostForm mode="edit" postId={...}>`. Server-side also checks `authorId` against the session to avoid flashing the form to non-owners before client redirect |
| `app/posts/[id]/edit/page.module.css` | Shared with/duplicates `new` styles where sensible |
| `app/login/page.tsx` | Client Component. Email/password sign-in + sign-up form using `useAuth()` |
| `app/login/page.module.css` | Form layout |

### `app/api/` — Route Handlers (all return JSON, validate with Zod, enforce auth via `lib/auth/session.ts`)

| Path | Methods | Purpose |
|---|---|---|
| `app/api/posts/route.ts` | `GET`, `POST` | `GET`: list posts, query params `?q=&tag=&sort=&order=`. `POST`: verify token → `postSchema.parse(body)` → write to Firestore with `authorId` from token |
| `app/api/posts/[id]/route.ts` | `GET`, `PATCH`, `DELETE` | `GET`: single post. `PATCH`: verify token + `authorId` match → `postUpdateSchema.parse(body)` → update. `DELETE`: verify token + ownership → delete post doc + its `comments` subcollection |
| `app/api/posts/[id]/comments/route.ts` | `GET`, `POST` | `GET`: list comments for a post. `POST`: verify token → `commentSchema.parse(body)` → create comment with `authorId` from token, increment `commentCount` on the post |
| `app/api/posts/[id]/comments/[commentId]/route.ts` | `DELETE` | Verify token + (comment author OR post author) → delete, decrement `commentCount` |

### `components/` — one folder per component: `Component.tsx` + `Component.module.css` (+ `Component.test.tsx` where noted in Phase 6)

| Component | Responsibility |
|---|---|
| `AuthProvider/AuthProvider.tsx` | Client component, no visual output; runs `useAuth()` once at the root |
| `Navbar/Navbar.tsx` | Site title, "New Post" link, login/logout + current user's name |
| `FilterBar/FilterBar.tsx` | Search input (debounced), tag select, sort dropdown — reads/writes `useFilterStore` |
| `PostList/PostList.tsx` | Client component; `usePosts()` with SWR `fallbackData` from SSR; maps to `PostCard`; empty/loading/error states |
| `PostCard/PostCard.tsx` | Title, excerpt, author, date, tags, comment count, link to detail |
| `PostForm/PostForm.tsx` | `react-hook-form` + `zodResolver(postSchema \| postUpdateSchema)`; fields: title, content, tags; single component used for both create and edit via `mode`/`defaultValues`/`postId` props; calls `lib/api/client`, then `router.push` |
| `PostDetail/PostDetail.tsx` | Full post content, author, date; Edit/Delete buttons shown only when `useAuthStore().user?.uid === post.authorId`; delete confirms then calls API + redirects |
| `CommentList/CommentList.tsx` | `useComments(postId)`, maps to comment items, delete button for owners |
| `CommentForm/CommentForm.tsx` | `react-hook-form` + `zodResolver(commentSchema)`; shows "sign in to comment" instead of the form when logged out |
| `ui/Button`, `ui/Input`, `ui/Textarea`, `ui/Spinner`, `ui/ErrorMessage` | Small shared primitives, each with its own CSS module, reused by the forms above |

### Tests

| File | Purpose |
|---|---|
| `types/validator.test.ts` | Zod schemas: valid payloads pass, invalid ones (empty title, too-short content, bad tag types) fail with expected messages |
| `store/useFilterStore.test.ts` | State transitions for setters and `reset()` |
| `lib/firebase/converters.test.ts` | Firestore `Timestamp` ⇄ `Post`/`Comment` conversion round-trips |
| `components/PostForm/PostForm.test.tsx` | RTL: submitting empty form shows Zod error messages; submitting valid data calls the mocked `lib/api/client` function |
| `components/PostCard/PostCard.test.tsx` | Renders title/author/date/tags correctly for a given `Post` fixture |
| `e2e/blog-flow.spec.ts` | Playwright: login → create post → appears in list → open detail → add comment → edit post → delete post |

---

## Phased build order

1. **Foundation** — remove Tailwind; read Next 16 App Router docs; create Firebase project (Firestore + Auth enabled); `.env.local` + `.env.example`; `lib/firebase/client.ts`, `lib/firebase/admin.ts`
2. **Domain layer** — `types/post.ts`, `types/comment.ts`, `types/user.ts`, `types/validator.ts` (Zod schemas), `firestore.rules`
3. **Auth** — `store/useAuthStore.ts`, `hooks/useAuth.ts`, `components/AuthProvider`, `app/login/page.tsx`, `lib/auth/session.ts`
4. **Data layer** — all `app/api/**/route.ts`, `lib/api/fetcher.ts`, `lib/api/client.ts`, `hooks/usePosts.ts` / `usePost.ts` / `useComments.ts`, `store/useFilterStore.ts`
5. **Pages & components** — list page → detail page → create → edit/delete → comments, each with its CSS module, in that order
6. **Testing** — install Vitest/RTL/Playwright, write the unit tests above, then the E2E flow
7. **Docs & deployment** — rewrite `README.md` (overview, tech stack, file structure, setup, running dev/tests, deployment link), push to GitHub, deploy (e.g. Vercel)

Each phase is a hard dependency for the next: don't start pages before the data layer exists, don't start comments before posts work end-to-end.
