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

    const applications = await ctx.db.query("applications").collect();

    const shortlistedApps = applications.filter(
      (app) => jobIds.includes(app.jobId) && app.status === "shortlisted"
    );

    // fetch all candidateIds (clerkIds)
    const candidateClerkIds = shortlistedApps.map((app) => app.candidateId);

    // fetch all matching users
    const users = await ctx.db.query("users").collect();
    const usersMap = Object.fromEntries(
      users.map((user) => [user.clerkId, user.name])
    );

    return shortlistedApps.map((app) => ({
      ...app,
      jobTitle: jobs.find((j) => j._id === app.jobId)?.title,
      candidateName: usersMap[app.candidateId] ?? "Unknown",
    }));
  },
});

export const getApplicationsByJobIds = query({
  args: {
    jobIds: v.array(v.id("jobs")),
    status: v.optional(v.string()), // <-- add status filter
  },
  handler: async (ctx, args) => {
    const allApplications = [];

    for (const jobId of args.jobIds) {
      let query = ctx.db
        .query("applications")
        .withIndex("by_job", (q) => q.eq("jobId", jobId));

      // 🟢 Only filter by status if provided
      if (args.status) {
        query = query.filter((q) => q.eq(q.field("status"), args.status));
      }

      const apps = await query.collect();
      allApplications.push(...apps);
    }

    return allApplications;
  },
});

export const getCandidateApplicationForJob = query({
  args: {
    jobId: v.id("jobs"),
    candidateClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("applications")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .filter((q) => q.eq(q.field("candidateId"), args.candidateClerkId))
      .collect();
  },
});

// Get all applications for jobs created by the current interviewer
export const getApplicationsForInterviewer = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Step 1: Get all jobs by interviewer
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_interviewer", (q) => q.eq("interviewerId", identity.subject))
      .collect();

    const jobIds = jobs.map((job) => job._id);

    // Step 2: Get all applications for those jobs
    const applications = await ctx.db
      .query("applications")
      .filter((q) =>
        q.or(...jobIds.map((id) => q.eq(q.field("jobId"), id)))
      )
      .collect();

    return applications.map((app) => ({
      ...app,
      candidateClerkId: app.candidateId, // 👈 attach this to match your UI props
    }));
  },
});