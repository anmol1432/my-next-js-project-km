"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useState } from "react";

type ConvexClientProviderProps = {
  children: React.ReactNode;
};

export function ConvexClientProvider({
  children,
}: ConvexClientProviderProps) {
  const [client] = useState(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

    if (!convexUrl) {
      throw new Error(
        "NEXT_PUBLIC_CONVEX_URL is missing. Run `npm run convex:dev` to generate it.",
      );
    }

    return new ConvexReactClient(convexUrl);
  });

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
