"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ConvexHome() {
  const users = useQuery(api.users.listRecent);

  return (
    <section className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
            Convex Ready
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Your Next.js app is connected to Convex.
          </h1>
          <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
            New profiles created from the signup screen will appear here
            automatically through a live Convex query.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Deployment URL
            </p>
            <p className="mt-3 break-all text-sm font-medium">
              {process.env.NEXT_PUBLIC_CONVEX_URL}
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Recent profiles
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {users === undefined ? "..." : users.length}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Live user feed</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Updates reactively from Convex
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {users === undefined ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Connecting to Convex...
              </p>
            ) : users.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No profiles yet. Create one from the signup page.
              </p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col gap-1 rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
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
