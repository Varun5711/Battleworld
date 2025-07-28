// convex/cron.ts
import { api } from "./_generated/api";

export default async function sendInterviewEmailsCron(ctx: any) {
  await ctx.runMutation(api.interviews.sendInterviewReminderEmails, {});
}