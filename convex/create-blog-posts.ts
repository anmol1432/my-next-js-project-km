import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { authComponent } from "./auth";

export const create = mutation({
    args: {title:v.string(), content:v.string()},
    handler: async (ctx, args)=>{
        const user = await authComponent.safeGetAuthUser(ctx);
        const blogArticle = await ctx.db.insert("blogs", {
            authorId: ctx.auth.userId!,
            title: args.title,
            content: args.content,
            createdAt: Date.now(),
        })
        return blogArticle;
    }
}) 