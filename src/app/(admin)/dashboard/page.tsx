"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import JobsPostedDetails from "@/components/dashboard/JobsPostedDetails";
import ApplicationsDetails from "@/components/dashboard/ApplicationsDetails";
import ShortlistedCandidatesDetails from "@/components/dashboard/ShortlistedCandidatesDetails";

export default function InterviewerDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const stats = useQuery(
    api.dashboard.getInterviewerStats,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const jobs = useQuery(
    api.jobs.getJobsByInterviewer,
    user?.id ? { interviewerId: user.id } : "skip"
  );

  const applications = useQuery(
    api.applications.getApplicationsByJob,
    jobs && jobs.length > 0 ? { jobId: jobs[0]._id as Id<"jobs"> } : "skip"
  );

  const shortlisted = useQuery(
    api.applications.getShortlistedCandidates,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!isLoaded || !stats || !jobs) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">📊 Interviewer Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Jobs Posted"
          value={stats.totalJobs}
          onClick={() => setSelectedCard("jobs")}
        />
        <StatCard
          title="Applications (This Week)"
          value={stats.totalApplicationsThisWeek}
          onClick={() => setSelectedCard("applications")}
        />
        <StatCard
          title="Interviews Scheduled"
          value={stats.totalInterviews}
          onClick={() => router.push("/schedule")}
        />
        <StatCard
          title="Shortlisted Candidates"
          value={stats.totalShortlisted}
          onClick={() => setSelectedCard("shortlisted")}
        />
      </div>

      {/* Render detailed components */}
      {selectedCard === "jobs" && jobs && <JobsPostedDetails jobs={jobs} />}
      {selectedCard === "applications" && applications && (
        <ApplicationsDetails
          applications={applications.map(app => ({
            ...app,
            candidateClerkId: app.candidateId,
            resume: app.resume as Id<"_storage"> | undefined,
            jobTitle: jobs.find(job => job._id === app.jobId)?.title ?? "",
          }))}
        />
      )}
      {selectedCard === "shortlisted" && shortlisted && (
        <ShortlistedCandidatesDetails
          applications={shortlisted.map(app => ({
            ...app,
            candidateClerkId: app.candidateId,
            resume: app.resume as Id<"_storage"> | undefined,
            jobTitle: app.jobTitle ?? "",
          }))}
        />
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  onClick,
}: {
  title: string;
  value: number;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-muted rounded-xl shadow p-6 text-center space-y-2 border cursor-pointer hover:shadow-md"
    >
      <p className="text-muted-foreground text-sm">{title}</p>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
}
