import { query } from "./_generated/server";
import { v } from "convex/values";

export const getInterviewerStats = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_interviewer", (q) => q.eq("interviewerId", args.clerkId))
      .collect();

    const jobIds = jobs.map((job) => job._id);

    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const applications = await ctx.db.query("applications").collect();
    const recentApplications = applications.filter(
      (app) => jobIds.includes(app.jobId) && app._creationTime >= oneWeekAgo
    );

    const interviews = await ctx.db.query("interviews").collect();
    const myInterviews = interviews.filter((i) =>
      i.interviewerIds.includes(args.clerkId)
    );

    const shortlisted = applications.filter(
      (app) => jobIds.includes(app.jobId) && app.status === "shortlisted"
    );

    return {
      totalJobs: jobs.length,
      totalApplicationsThisWeek: recentApplications.length,
      totalInterviews: myInterviews.length,
      totalShortlisted: shortlisted.length,
    };
  },
});