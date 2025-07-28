import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new interview
 */
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

    return await ctx.db.insert("interviews", { ...args });
  },
});

/**
 * Get all interviews for a candidate by ID
 */
export const getInterviewsByCandidate = query({
  args: {
    candidateId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) => q.eq("candidateId", args.candidateId))
      .collect();
  },
});

/**
 * Get all interviews where the logged-in user is a candidate
 */
export const getMyInterviews = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("interviews")
      .filter((q) => q.eq(q.field("candidateId"), identity.subject))
      .collect();
  },
});

/**
 * Duplicate of getMyInterviews - could be removed or renamed
 */
export const getMyInterview = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) => q.eq("candidateId", identity.subject))
      .collect();
  },
});

/**
 * Get interview by Stream call ID
 */
export const getInterviewByStreamCallId = query({
  args: {
    streamCallId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviews")
      .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
      .first();
  },
});

/**
 * Update an interview’s status or meeting link
 */
export const updateInterview = mutation({
  args: {
    interviewId: v.id("interviews"),
    status: v.string(),
    meetingLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.patch(args.interviewId, {
      status: args.status,
      meetingLink: args.meetingLink,
      ...(args.status === "completed" && { endTime: Date.now() }),
    });
  },
});

/**
 * Get all interviews related to a user (as candidate or interviewer)
 */
export const getAllInterviews = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("interviews").collect();

    return all.filter(
      (i) =>
        i.candidateId === args.clerkId ||
        i.interviewerIds.includes(args.clerkId)
    );
  },
});

export const getInterviewerStats = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const { clerkId } = args;

    // Total jobs posted
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_interviewer", (q) => q.eq("interviewerId", clerkId))
      .collect();

    // Create a map from jobId to job object
    const allJobs = await ctx.db.query("jobs").collect();
    const jobMap = Object.fromEntries(allJobs.map(j => [j._id, j]));

    // Total applications this week (7 days)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const applications = await ctx.db.query("applications").collect();
    const appsThisWeek = applications.filter(
      (a) => jobMap[a.jobId]?.interviewerId === clerkId && a._creationTime > weekAgo
    );

    // Total interviews scheduled
    const interviews = await ctx.db.query("interviews").collect();
    const myInterviews = interviews.filter((i) =>
      i.interviewerIds.includes(clerkId)
    );

    // Total shortlisted/saved candidates
    const shortlisted = applications.filter(
      (a) => jobMap[a.jobId]?.interviewerId === clerkId && a.status === "shortlisted"
    );

    return {
      totalJobs: jobs.length,
      totalApplicationsThisWeek: appsThisWeek.length,
      totalInterviews: myInterviews.length,
      totalShortlisted: shortlisted.length,
    };
  },
});


export const sendInterviewReminderEmails = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneHourLater = now + 60 * 60 * 1000;

    const interviews = await ctx.db
      .query("interviews")
      .filter((q) =>
        q.and(
          q.gte(q.field("startTime"), now),
          q.lte(q.field("startTime"), oneHourLater)
        )
      )
      .collect();

      for (const interview of interviews) {
        const candidate = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", interview.candidateId))
          .first();
        if (!candidate) continue;
      
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: candidate.email,
            subject: "⏰ Reminder: Upcoming Interview",
            htmlBody: `<h2>Hi!</h2><p>This is a reminder for your interview at ${new Date(
              interview.startTime
            ).toLocaleTimeString()}.</p>`,
          }),
        });
      }
  },
});