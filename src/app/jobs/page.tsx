"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import LoaderUI from "@/components/shared/LoaderUI";
import toast from "react-hot-toast";
import JobCard from "@/components/jobs/JobCard";

export default function JobsPage() {
  const { user } = useUser();
  const router = useRouter();

  const jobs = useQuery(api.jobs.getAllJobs);
  const applications = useQuery(api.applications.getMyApplications, { candidateId: user?.id ?? "" });

  if (!user) {
    toast.error("Access denied. Authentication required.");
    return null;
  }

  if (jobs === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 flex items-center justify-center px-4 overflow-x-hidden">
        <div className="text-center space-y-4">
          <LoaderUI />
          <p className="text-blue-200 text-base sm:text-lg font-mono tracking-wide">
            Loading available positions...
          </p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 flex items-center justify-center px-4 overflow-x-hidden">
        <div className="text-center space-y-6 max-w-sm sm:max-w-2xl mx-auto px-2 sm:px-4">
          <h1 className="text-2xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text font-mono tracking-tight break-words">
            No Active Positions
          </h1>
          <p className="text-blue-300 text-sm sm:text-xl font-light leading-relaxed">
            All positions are currently filled. Check back for new opportunities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-slate-900/10"></div>
        <div className="relative max-w-4xl sm:max-w-7xl mx-auto px-2 sm:px-6 py-8 sm:py-20">
          <div className="text-center space-y-4 sm:space-y-8">
            <h1 className="text-2xl sm:text-6xl md:text-7xl font-black text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-600 bg-clip-text font-mono tracking-tight leading-tight sm:leading-none break-words">
              Career
              <span className="block text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text font-light">
                Opportunities
              </span>
            </h1>
            <p className="text-sm sm:text-xl md:text-2xl text-blue-200 font-light max-w-xs sm:max-w-3xl mx-auto leading-relaxed px-1">
              Join our team and contribute to innovative projects that shape the future.
              Excellence drives everything we do.
            </p>
            <div className="h-0.5 sm:h-1 w-16 sm:w-32 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-4xl sm:max-w-6xl mx-auto px-2 sm:px-6 pb-8 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {jobs.map((job) => {
            const hasApplied = applications?.some(app => app.jobId === job._id);
            return (
              <JobCard key={job._id} job={job} hasApplied={hasApplied} />
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-800/50">
        <div className="max-w-4xl sm:max-w-6xl mx-auto px-2 sm:px-6 py-6 sm:py-16">
          <div className="text-center space-y-1.5 sm:space-y-4">
            <p className="text-blue-300/70 font-light text-sm sm:text-lg font-mono tracking-wide">
              Building the future through exceptional talent
            </p>
            <div className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}