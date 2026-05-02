"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ConvexHome() {
  const users = useQuery(api.users.listRecent);

  return (
    <section className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Convex Ready
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Your Next.js app is connected to Convex.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            New Better Auth accounts created from the signup screen sync into
            this live Convex query automatically.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Deployment URL</p>
            <p className="mt-3 break-all text-sm font-medium">
              {process.env.NEXT_PUBLIC_CONVEX_URL}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Recent profiles</p>
            <p className="mt-3 text-3xl font-semibold text-primary">
              {users === undefined ? "..." : users.length}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Live user feed</h2>
            <p className="text-sm text-muted-foreground">Updates reactively from Convex</p>
          </div>

          <div className="mt-6 space-y-3">
            {users === undefined ? (
              <p className="text-sm text-muted-foreground">Connecting to Convex...</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No profiles yet. Create one from the signup page.</p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col gap-1 rounded-xl border border-border bg-muted/40 px-4 py-3 hover:bg-muted/70 transition-colors"
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground/60">
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
