import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Creates a new chat permission between two users.
 * Typically triggered when Doom shortlists a candidate.
 */
export const allowChat = mutation({
  args: {
    userA: v.string(), // e.g., Doom (Interviewer Clerk ID)
    userB: v.string(), // e.g., Candidate Clerk ID
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("chatPermissions")
      .filter((q) => q.eq("userA", args.userA))
      .filter((q) => q.eq("userB", args.userB))
      .first();

    if (!existing) {
      return await ctx.db.insert("chatPermissions", {
        ...args,
        canChat: true,
      });
    }

    return await ctx.db.patch(existing._id, { canChat: true });
  },
});

/**
 * Revokes chat access between two users.
 * Could be triggered on rejection or admin action.
 */
export const revokeChat = mutation({
  args: {
    userA: v.string(),
    userB: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("chatPermissions")
      .filter((q) => q.eq("userA", args.userA))
      .filter((q) => q.eq("userB", args.userB))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, { canChat: false });
    }
  },
});

/**
 * Checks if two users are allowed to chat.
 * You can call this before rendering a Stream Chat UI.
 */
export const canChat = query({
  args: {
    userA: v.string(),
    userB: v.string(),
  },
  handler: async (ctx, args) => {
    const permission = await ctx.db
      .query("chatPermissions")
      .filter((q) => q.eq("userA", args.userA))
      .filter((q) => q.eq("userB", args.userB))
      .first();

    return permission?.canChat ?? false;
  },
});
