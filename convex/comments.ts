import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addComment = mutation({
  args: {
    interviewId: v.id("interviews"),
    content: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const comment = await ctx.db.insert("comments", {
      ...args,
      interviewerId: identity.subject,
    });

    return comment;
  },
});

export const getCommments = query({
  args: {
    interviewId: v.id("interviews"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_interview_id", (q) =>
        q.eq("interviewId", args.interviewId)
      )
      .collect();
    return comments;
  },
});
