import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new job application
export const createApplication = mutation({
  args: {
    jobId: v.id("jobs"),
    resume: v.optional(v.id("_storage")),
    status: v.union(
      v.literal("pending"),
      v.literal("shortlisted"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("applications", {
      ...args,
      candidateId: identity.subject,
      createdAt: Date.now(),
    });
  },
});

// Get logged-in candidate's applications
// convex/applications.ts
export const getMyApplications = query({
  args: { candidateId: v.string() },
  handler: async (ctx, args) => {
    const apps = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    const jobs = await ctx.db.query("jobs").collect();
    const jobsMap = Object.fromEntries(jobs.map((job) => [job._id, job]));

    return apps.map((app) => ({
      ...app,
      interviewerId: jobsMap[app.jobId]?.interviewerId ?? null,
    }));
  },
});

// Get applications by job (for Doom)
export const getApplicationsByJob = query({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("applications")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .collect();
  },
});

// Get single application (used for detail view)
export const getApplicationById = query({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.get(args.applicationId);
  },
});

// Update application status (Doom only)
export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("pending"),
      v.literal("shortlisted"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.patch(args.applicationId, {
      status: args.status,
    });
  },
});

// Delete an application
export const deleteApplication = mutation({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.delete(args.applicationId);
  },
});

// convex/applications.ts
export const getAllApplications = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.query("applications").collect();
  },
});

export const getShortlistedCandidates = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_interviewer", (q) => q.eq("interviewerId", args.clerkId))
      .collect();
    const jobIds = jobs.map((j) => j._id);

    const apps = await ctx.db.query("applications").collect();
    return apps
      .filter((app) => jobIds.includes(app.jobId) && app.status === "shortlisted")
      .map((app) => ({
        ...app,
        jobTitle: jobs.find((j) => j._id === app.jobId)?.title,
        candidateName: app.candidateId,
      }));
  },
});