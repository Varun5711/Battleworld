"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import JobsPostedDetails from "@/components/dashboard/JobsPostedDetails";
import ApplicationsDetails from "@/components/dashboard/ApplicationsDetails";
import ShortlistedCandidatesDetails from "@/components/dashboard/ShortlistedCandidatesDetails";

export default function InterviewerDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<
    "jobs" | "applications" | "shortlisted" | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0); // ✅

  const stats = useQuery(
    api.dashboard.getInterviewerStats,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const jobs = useQuery(
    api.jobs.getJobsByInterviewer,
    user?.id ? { interviewerId: user.id } : "skip"
  );
  const applications = useQuery(
    api.applications.getApplicationsByJobIds,
    jobs?.length ? { jobIds: jobs.map((job) => job._id) } : "skip"
  );
  const shortlisted = useQuery(
    api.applications.getShortlistedCandidates,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Debug logs
  console.log('JOBS:', jobs);
  console.log('APPLICATIONS:', applications);
  console.log('PENDING APPLICATIONS:', applications?.filter((app) => app.status === "pending"));
  if (applications) {
    console.log('APPLICATION STATUSES:', applications.map(app => app.status));
  }

  if (!isLoaded || !stats || !jobs) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="text-center text-emerald-400 font-mono space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p>Initializing DoomNet...</p>
        </div>
      </div>
    );
  }

  const handleRefresh = () => setRefreshKey((prev) => prev + 1); // ✅ trigger re-render

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-emerald-300 px-6 py-10 font-mono">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 font-cinzel tracking-wider text-emerald-400 drop-shadow-lg">
          DOOM’S DOMINION
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <StatCard
            title="Open Positions"
            value={stats.totalJobs}
            onClick={() => setSelectedCard("jobs")}
          />
          <StatCard
            title="Pending Applicants"
            value={applications?.filter((app) => app.status === "pending").length ?? 0}
            onClick={() => setSelectedCard("applications")}
          />
          <StatCard
            title="Scheduled Interrogations"
            value={stats.totalInterviews}
            onClick={() => router.push("/schedule")}
          />
          <StatCard
            title="Elite Candidates"
            value={stats.totalShortlisted}
            onClick={() => setSelectedCard("shortlisted")}
          />
        </div>

        {/* Details based on selection */}
        {selectedCard === "jobs" && jobs && <JobsPostedDetails jobs={jobs} />}

        {selectedCard === "applications" && applications && (
          <ApplicationsDetails
            key={refreshKey} // ✅ force re-render
            applications={applications
              .filter((app) => app.status === "pending")
              .map((app) => ({
                ...app,
                candidateClerkId: app.candidateId,
                resume: app.resume as Id<"_storage"> | undefined,
                jobTitle:
                  jobs.find((job) => job._id === app.jobId)?.title ?? "Untitled",
              }))}
            onUpdate={handleRefresh} // ✅ pass trigger
          />
        )}

        {selectedCard === "shortlisted" && shortlisted && (
          <ShortlistedCandidatesDetails
            applications={shortlisted.map((app) => ({
              ...app,
              candidateClerkId: app.candidateId,
              resume: app.resume as Id<"_storage"> | undefined,
              jobTitle: app.jobTitle ?? "Unknown Role",
              chatButton: (
                <button
                  onClick={() => router.push(`/chat/${app.candidateId}`)}
                  className="mt-2 inline-block text-sm text-emerald-300 underline hover:text-emerald-200 transition"
                >
                  Initiate Communication
                </button>
              ),
            }))}
          />
        )}
      </div>
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
      className="bg-gray-900 border border-emerald-700 hover:border-emerald-500 rounded-lg p-6 shadow-md hover:shadow-emerald-700/40 transition-all cursor-pointer text-center"
    >
      <p className="text-sm uppercase tracking-widest text-emerald-400 mb-2">
        {title}
      </p>
      <p className="text-4xl font-bold text-amber-300">{value}</p>
    </div>
  );
}