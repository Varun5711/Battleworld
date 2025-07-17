import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new job application
export const createApplication = mutation({
  args: {
    jobId: v.id("jobs"),
    resume: v.optional(v.string()),
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
export const getMyApplications = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", identity.subject))
      .collect();
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