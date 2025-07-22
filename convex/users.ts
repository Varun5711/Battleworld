import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ✅ Registers a new user (candidate or Doom) after Clerk signup
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    role: v.optional(v.union(v.literal("candidate"), v.literal("interviewer"))),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      image: args.image,
      role: args.role ?? "candidate", // fallback to candidate if undefined
    });
  },
});

// ✅ Get all users
export const getAllUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.query("users").collect();
  },
});

// ✅ Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// ✅ Update user's profile
export const updateUserProfile = mutation({
  args: {
    name: v.string(),
    backstory: v.optional(v.string()),
    powers: v.optional(v.array(v.string())),
    weaknesses: v.optional(v.array(v.string())),
    keyBattles: v.optional(v.array(v.string())),
    preferredRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    return await ctx.db.patch(user._id, {
      name: args.name,
      backstory: args.backstory,
      powers: args.powers,
      weaknesses: args.weaknesses,
      keyBattles: args.keyBattles,
      preferredRole: args.preferredRole,
    });
  },
});

// ✅ Delete user
export const deleteUser = mutation({
  args: {
    clerkId: v.string(),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
  },
  handler: async (ctx, args) => {
    const userToDelete = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!userToDelete) throw new Error("User not found");

    await ctx.db.delete(userToDelete._id);

    return { success: true, message: `${args.role} deleted successfully.` };
  },
});

// ✅ Get all interviewers
export const getAllInterviewer = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "interviewer"))
      .collect();
  },
});

// convex/users.ts
export const becomeInterviewer = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    return await ctx.db.patch(user._id, {
      role: "interviewer",
    });
  },
});