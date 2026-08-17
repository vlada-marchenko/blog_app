# Blog

A full-stack blog app: Next.js (App Router) as both frontend and backend, Firebase for auth, Firestore for data.

## Features

- Email/password registration and login, with an `httpOnly` session cookie for server-side auth checks
- Create, view, edit, and delete posts — edit/delete restricted to the post's own author, enforced server-side
- Comment on posts
- Search and tag-based filtering, with debounced search input
- "Load More" pagination over the post list
- Toast notifications for success/error feedback

## Tech stack

- **Next.js 16** (App Router) — frontend and backend in one project
- **Firebase** — client SDK for auth in the browser, Admin SDK for verifying sessions and all Firestore reads/writes
- **Firestore** — a `posts` collection, each post with a `comments` subcollection
- **Zustand** — client-only UI state
- **SWR** — server data fetching, caching, and revalidation
- **Zod** — request body validation on every API route
- **react-hook-form** — all forms
- **CSS Modules** — scoped component styles

## Project structure

```text
app/            Pages (app/page.tsx) and API routes (app/api/**/route.ts)
components/     React components, each with its own *.module.css
hooks/          SWR hooks (usePosts, usePost, useComments)
lib/            Firebase client/admin setup, Firestore read/write functions, utilities
schemas/        Zod validation schemas for API request bodies
store/          Zustand store (client-only UI state)
types/          Shared TypeScript types (Post, Comment)
```

## Main components

- **`AuthProvider`** — wraps the app, listens for Firebase auth state changes, keeps the logged-in user in the Zustand store
- **`Header`** — login/register/logout, "+New Post", and the app logo (which resets filters and returns to the list)
- **`BlogPage`** — switches between `PostList` and `PostCard` based on the selected post id in the store
- **`PostList`** / **`PostFilters`** — fetches and renders posts, with search/tag filtering and "Load More" pagination
- **`PostCard`** — single post view, with comments (`CommentList`, `CommentForm`) and owner-only Edit/Delete
- **`PostModal`** / **`EditModal`** — create/edit post forms, rendered as portal modals
- **`AuthModal`** (`LoginForm` / `RegisterForm`) — login/register, also a portal modal

Full details on how these connect — the request flow for every action, and why the architecture is shaped this way — are in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Running it

```bash
npm install
```

Create `.env.local` with your Firebase config (client `NEXT_PUBLIC_FIREBASE_*` keys, plus `FIREBASE_ADMIN_PROJECT_ID` / `FIREBASE_ADMIN_CLIENT_EMAIL` / `FIREBASE_ADMIN_PRIVATE_KEY` from a service account key).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
