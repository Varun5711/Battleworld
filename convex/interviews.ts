import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createInterview = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("interviews", {
      ...args,
    });
  },
});

export const getInterviewsByCandidate = query({
  args: {
    candidateId: v.string(),
  },
  handler: async (ctx, args) => {
    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) =>
        q.eq("candidateId", args.candidateId)
      )
      .collect();
    return interviews;
  },
});

export const getMyInterviews = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("interviews")
      .filter((q) => q.eq(q.field("candidateId"), identity.subject))
      .collect();
  },
});

export const getMyInterview = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userInterviews = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) =>
        q.eq("candidateId", identity.subject)
      )
      .collect();
    return userInterviews;
  },
});

export const getInterviewByStreamCallId = query({
  args: {
    streamCallId: v.string(),
  },
  handler: async (ctx, args) => {
    const streamIdInterview = await ctx.db
      .query("interviews")
      .withIndex("by_stream_call_id", (q) =>
        q.eq("streamCallId", args.streamCallId)
      )
      .first();
    return streamIdInterview!;
  },
});

export const updateInterview = mutation({
  args: {
    interviewId: v.id("interviews"),
    status: v.string(),
    meetingLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const updateInterviewStatusQuery = await ctx.db.patch(args.interviewId, {
      status: args.status,
      meetingLink: args.meetingLink,
      ...(args.status === "completed" ? { endTime: Date.now() } : {}),
    });

    return updateInterviewStatusQuery!;
  },
});
