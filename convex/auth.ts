import type { AuthFunctions, GenericCtx } from "@convex-dev/better-auth";
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";
import authSchema from "./betterAuth/schema";

const authFunctions: AuthFunctions = {
  onCreate: internal?.auth?.onCreate,
  onUpdate: internal?.auth?.onUpdate,
  onDelete: internal?.auth?.onDelete,
};

const resolveBaseUrl = (strict: boolean) => {
  const value =
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.BETTER_AUTH_URL;

  if (value) {
    return value;
  }

  if (strict) {
    throw new Error(
      "SITE_URL is missing. Set it in Convex env and expose NEXT_PUBLIC_SITE_URL in Next.js.",
    );
  }

  return "http://localhost:3000";
};

const resolveAuthSecret = (strict: boolean) => {
  const value = process.env.BETTER_AUTH_SECRET;

  if (value) {
    return value;
  }

  if (strict) {
    throw new Error("BETTER_AUTH_SECRET is missing.");
  }

  return "dev-secret-change-me";
};

// Better Auth Component
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: { schema: authSchema },
    authFunctions,
    triggers: {
      user: {
        onCreate: async (ctx, user) => {
          const email = user.email.trim().toLowerCase();
          const existingByAuthId = await ctx.db
            .query("users")
            .withIndex("by_auth_user_id", (q) => q.eq("authUserId", user._id))
            .unique();

          if (existingByAuthId) {
            return;
          }

          const existingByEmail = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", email))
            .unique();

          if (existingByEmail) {
            await ctx.db.patch(existingByEmail._id, {
              authUserId: user._id,
              email,
              name: user.name,
            });
            return;
          }

          await ctx.db.insert("users", {
            authUserId: user._id,
            createdAt: user.createdAt,
            email,
            name: user.name,
          });
        },
        onUpdate: async (ctx, newUser, oldUser) => {
          const email = newUser.email.trim().toLowerCase();
          const existingUser =
            (await ctx.db
              .query("users")
              .withIndex("by_auth_user_id", (q) =>
                q.eq("authUserId", newUser._id),
              )
              .unique()) ??
            (await ctx.db
              .query("users")
              .withIndex("by_email", (q) =>
                q.eq("email", oldUser.email.trim().toLowerCase()),
              )
              .unique());

          if (!existingUser) {
            return;
          }

          await ctx.db.patch(existingUser._id, {
            authUserId: newUser._id,
            email,
            name: newUser.name,
          });
        },
        onDelete: async (ctx, user) => {
          const existingUser = await ctx.db
            .query("users")
            .withIndex("by_auth_user_id", (q) => q.eq("authUserId", user._id))
            .unique();

          if (!existingUser) {
            return;
          }

          await ctx.db.delete(existingUser._id);
        },
      },
    },
    verbose: false,
  },
);

const buildAuthOptions = (
  ctx: GenericCtx<DataModel>,
  strict: boolean,
) => {
  return {
    appName: "My App",
    basePath: "/api/auth",
    baseURL: resolveBaseUrl(strict),
    secret: resolveAuthSecret(strict),
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [convex({ authConfig })],
  } satisfies BetterAuthOptions;
};

// Better Auth Options
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return buildAuthOptions(ctx, false);
};

// For `auth` CLI
export const options = buildAuthOptions({} as GenericCtx<DataModel>, false);

// Better Auth Instance
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};

export const { getAuthUser } = authComponent.clientApi();
export const { onCreate, onDelete, onUpdate } = authComponent.triggersApi();
