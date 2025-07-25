import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // USERS TABLE
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
    clerkId: v.string(),

    // Candidate profile fields
    backstory: v.optional(v.string()),
    powers: v.optional(v.array(v.string())),
    weaknesses: v.optional(v.array(v.string())),
    keyBattles: v.optional(v.array(v.string())),
    preferredRole: v.optional(v.string()),

    location: v.optional(v.string()),
    // experience: v.optional(v.string()),
    // education: v.optional(v.string()),
    // github: v.optional(v.string()),
    // linkedin: v.optional(v.string()),
    // portfolio: v.optional(v.string()),
    // skills: v.optional(v.string()),
    // about: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  // JOBS TABLE
  jobs: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    roleType: v.optional(v.string()),
    createdAt: v.number(),
    location: v.optional(v.string()),
    interviewerId: v.string(), // Clerk ID of Doom posting the job
  }).index("by_interviewer", ["interviewerId"]),

  // APPLICATIONS TABLE
  applications: defineTable({
    candidateId: v.string(),
    jobId: v.id("jobs"),
    resume: v.optional(v.string()), // Text or URL
    status: v.union(
      v.literal("pending"),
      v.literal("shortlisted"),
      v.literal("rejected")
    ),
    createdAt: v.number(),
  })
    .index("by_candidate", ["candidateId"])
    .index("by_job", ["jobId"]),

  // INTERVIEWS TABLE
  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    meetingLink: v.optional(v.string()),
    interviewerIds: v.array(v.string()),
  })
    .index("by_candidate_id", ["candidateId"])
    .index("by_stream_call_id", ["streamCallId"]),

  // COMMENTS TABLE (post-interview feedback)
  comments: defineTable({
    content: v.string(),
    rating: v.number(),
    interviewerId: v.string(),
    interviewId: v.id("interviews"),
  }).index("by_interview_id", ["interviewId"]),

  // CHAT MESSAGES TABLE
  chatPermissions: defineTable({
    userA: v.string(), // Clerk ID
    userB: v.string(), // Clerk ID
    canChat: v.boolean(),
  }).index("by_users", ["userA", "userB"]),

  // EMAIL LOGS TABLE (for tracking scheduled emails)
  email: defineTable({
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    sentAt: v.number(),
    senderId: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("invite"),
        v.literal("rejection"),
        v.literal("followup")
      )
    ),
    interviewId: v.optional(v.id("interviews")),
  }).index("by_interview_id", ["interviewId"]),
});
