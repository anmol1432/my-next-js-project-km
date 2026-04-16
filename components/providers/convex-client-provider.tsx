"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type ConvexClientProviderProps = {
  children: React.ReactNode;
  initialToken?: string | null;
};

export function ConvexClientProvider({
  children,
  initialToken,
}: ConvexClientProviderProps) {
  const [client] = useState(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

    if (!convexUrl) {
      throw new Error(
        "NEXT_PUBLIC_CONVEX_URL is missing. Run `npm run convex:dev` to generate it.",
      );
    }

    return new ConvexReactClient(convexUrl, {
      expectAuth: true,
    });
  });

  return (
    <ConvexProvider client={client}>
      <ConvexBetterAuthProvider
        authClient={authClient}
        client={client}
        initialToken={initialToken}
      >
        {children}
      </ConvexBetterAuthProvider>
    </ConvexProvider>
  );
}
