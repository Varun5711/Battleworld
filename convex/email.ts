import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. Send Email
export const sendEmail = mutation({
  args: {
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    interviewId: v.optional(v.id("interviews")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("email", {
      ...args,
      sentAt: Date.now(),
      senderId: identity.subject,
    });
  },
});

// 2. Get Emails By Interview
export const getEmailsByInterview = query({
  args: {
    interviewId: v.id("interviews"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const emails = await ctx.db
      .query("email")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", args.interviewId))
      .collect();
    return emails;
  },
});

// 3. Delete Email
export const deleteEmail = mutation({
  args: {
    emailId: v.id("email"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const email = await ctx.db.get(args.emailId);
    if (!email) throw new Error("Email not found");

    if (email.senderId !== identity.subject) throw new Error("Unauthorized");

    return await ctx.db.delete(args.emailId);
  },
});

// 4. Get Email By ID
export const getEmailById = query({
  args: {
    emailId: v.id("email"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const email = await ctx.db.get(args.emailId);
    if (!email) throw new Error("Email not found");

    return await ctx.db.get(args.emailId);
  },
});