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
  const [refreshKey, setRefreshKey] = useState(0);

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

  if (!isLoaded || !stats || !jobs) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
          <p className="text-gray-400 font-mono text-sm tracking-wider">LOADING SYSTEM</p>
        </div>
      </div>
    );
  }

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-black text-gray-100 font-mono">
      <div className="max-w-7xl mx-auto px-8 py-16">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-7xl md:text-8xl font-black font-mono tracking-tighter bg-gradient-to-br from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent mb-6">
            DOOM
          </h1>
          <h2 className="text-2xl font-black font-mono tracking-wider text-green-400 uppercase mb-4">
            COMMAND INTERFACE
          </h2>
          <div className="w-24 h-px bg-green-500 mx-auto"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <StatCard
            title="POSITIONS"
            value={stats.totalJobs}
            onClick={() => setSelectedCard("jobs")}
          />
          <StatCard
            title="PENDING"
            value={applications?.filter((app) => app.status === "pending").length ?? 0}
            onClick={() => setSelectedCard("applications")}
          />
          <StatCard
            title="INTERVIEWS"
            value={stats.totalInterviews}
            onClick={() => router.push("/schedule")}
          />
          <StatCard
            title="SHORTLISTED"
            value={stats.totalShortlisted}
            onClick={() => setSelectedCard("shortlisted")}
          />
        </div>

        {/* Selection Header */}
        {selectedCard && (
          <div className="mb-12 pb-6 border-b border-green-900/30">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black font-mono tracking-wider text-green-400 uppercase">
                {selectedCard === "jobs" && "ACTIVE POSITIONS"}
                {selectedCard === "applications" && "PENDING APPLICATIONS"}
                {selectedCard === "shortlisted" && "SHORTLISTED CANDIDATES"}
              </h3>
              <button
                onClick={() => setSelectedCard(null)}
                className="px-6 py-2 bg-gray-900 border border-green-800 text-green-400 font-mono font-bold tracking-wide hover:bg-green-950 hover:border-green-700 transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}

        {/* Details Sections */}
        {selectedCard === "jobs" && jobs && (
          <JobsPostedDetails jobs={jobs} />
        )}

        {selectedCard === "applications" && applications && (
          <ApplicationsDetails
            key={refreshKey}
            applications={applications
              .filter((app) => app.status === "pending")
              .map((app) => ({
                ...app,
                candidateClerkId: app.candidateId,
                resume: app.resume as Id<"_storage"> | undefined,
                jobTitle:
                  jobs.find((job) => job._id === app.jobId)?.title ?? "Untitled",
              }))}
            onUpdate={handleRefresh}
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
                  className="mt-3 px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 font-mono font-bold tracking-wide hover:bg-gray-800 hover:border-gray-600 transition-all"
                >
                  MESSAGE
                </button>
              ),
            }))}
          />
        )}

        {/* Empty State */}
        {!selectedCard && (
          <div className="text-center mt-20">
            <p className="text-gray-500 font-mono tracking-wide">
              Select a category above to view details
            </p>
          </div>
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
      className="bg-gray-950 border border-gray-800 p-8 cursor-pointer hover:border-gray-700 hover:bg-gray-900 transition-all"
    >
      <div className="text-center space-y-4">
        <p className="text-sm font-black font-mono tracking-widest text-gray-400 uppercase">
          {title}
        </p>
        <p className="text-5xl font-black font-mono text-white">
          {value.toString().padStart(2, '0')}
        </p>
      </div>
    </div>
  );
}