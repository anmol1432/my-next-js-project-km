import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listRecent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_createdAt")
      .order("desc")
      .take(10);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existingUser) {
      return {
        status: "exists" as const,
        userId: existingUser._id,
      };
    }

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email,
      createdAt: Date.now(),
    });

    return {
      status: "created" as const,
      userId,
    };
  },
});

export const usersLists = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
}); 