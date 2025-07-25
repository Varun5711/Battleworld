import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createJob = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    roleType: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const job = await ctx.db.insert("jobs", {
      ...args,
      createdAt: Date.now(),
      interviewerId: identity.subject,
    });

    return job;
  },
});

export const getAllJobs = query({
  handler: async (ctx) => {
    const jobs = await ctx.db.query("jobs").collect();
    return jobs;
  },
});

export const getJobById = query({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    return job;
  },
});

export const updateJob = mutation({
  args: {
    jobId: v.id("jobs"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    roleType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    if (job.interviewerId !== identity.subject) throw new Error("Unauthorized");

    const updatedJob = await ctx.db.patch(args.jobId, {
      ...args,
    });

    return updatedJob;
  },
});

export const deleteJob = mutation({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    if (job.interviewerId !== identity.subject) throw new Error("Unauthorized");

    await ctx.db.delete(args.jobId);

    return { success: true };
  },
});

export const getJobsByInterviewer = query({
  args: {
    interviewerId: v.string(),
  },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_interviewer", (q) =>
        q.eq("interviewerId", args.interviewerId)
      )
      .collect();
    return jobs;
  },
});