import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authUserId: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  })
    .index("by_auth_user_id", ["authUserId"])
    .index("by_email", ["email"])
    .index("by_createdAt", ["createdAt"]),

  blogs: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_authorId", ["authorId"]),
});

