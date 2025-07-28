// convex/crons.ts
import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Send Interview Emails Every 5 Minutes",
  { minutes: 5 },
  api.interviews.sendInterviewReminderEmails
);

export default crons;