import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

//Registers a new user (candidate or Doom) after Clerk signup

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) return;

    return await ctx.db.insert("users", {
      ...args,
      role: "candidate",
    });
  },
});

//Get all users

export const getAllUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const users = await ctx.db.query("users").collect();

    return users;
  },
});

//Get a user by clerkId

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const getUserByClerkId = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return getUserByClerkId;
  },
});

//Update a user's profile

export const updateUserProfile = mutation({
    args:{
        backstory: v.optional(v.string()),
        powers: v.optional(v.array(v.string())),
        weaknesses: v.optional(v.array(v.string())),
        keyBattles: v.optional(v.array(v.string())),
        preferredRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
  },
});

//Delete a user

export const deleteUser = mutation({
    args: {
      clerkId: v.string(),
      role: v.union(v.literal("candidate"), v.literal("interviewer")),
    },
    handler: async (ctx, args) => {
      if (!args.clerkId) throw new Error("Clerk ID is required");
  
      const userToDelete = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .first();
  
      if (!userToDelete) throw new Error("User not found");
  
      await ctx.db.delete(userToDelete._id);
  
      return { success: true, message: `${args.role} deleted successfully.` };
    },
  });

//Get all interviewers

export const getAllInterviewer = query({
    handler: async(ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) throw new Error("Unauthorized");

        const interviewers = await ctx.db.query("users").filter((q) => q.eq(q.field("role"), "interviewer")).collect();
        return interviewers;
    }
})