// convex/resume.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate a temporary upload URL (for resume)
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Fetch a public URL to view the resume
export const getResumeUrl = query({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.fileId);
  },
});

// Update an application's resume field
export const updateApplicationResume = mutation({
  args: {
    applicationId: v.id("applications"),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.applicationId, {
      resume: args.fileId,
    });
  },
});