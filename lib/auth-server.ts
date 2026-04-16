import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

if (!convexUrl) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is missing. Run `npm run convex:dev` to generate it.",
  );
}

if (!convexSiteUrl) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_SITE_URL is missing. Add it to `.env.local` and your Convex environment.",
  );
}

export const auth = convexBetterAuthNextJs({
  convexSiteUrl,
  convexUrl,
});

export const {
  fetchAuthAction,
  fetchAuthMutation,
  fetchAuthQuery,
  getToken,
  handler,
  isAuthenticated,
  preloadAuthQuery,
} = auth;
