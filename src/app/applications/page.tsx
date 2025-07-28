"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  Circle,
} from "lucide-react";

export default function ApplicationsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const apps = useQuery(api.applications.getMyApplications, {
    candidateId: user?.id ?? "",
  });

  // Fetch job details for each application
  const jobIds = apps?.map((app) => app.jobId) ?? [];
  const jobDetails = useQuery(
    api.jobs.getJobsByIds,
    jobIds.length > 0 ? { jobIds } : "skip"
  );

  const interviewerIds =
    apps
      ?.filter((app) => app.status === "shortlisted" && app.interviewerId)
      .map((app) => app.interviewerId!) ?? [];

  const interviewerDetails = useQuery(
    api.users.getUsersByClerkIds,
    interviewerIds.length > 0 ? { clerkIds: interviewerIds } : "skip"
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "shortlisted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getStatusStyling = (status: string) => {
    switch (status) {
      case "pending":
        return {
          badge: "bg-amber-900/30 text-amber-300 border-amber-600/50",
          card: "border-amber-600/20",
        };
      case "shortlisted":
        return {
          badge: "bg-green-900/30 text-green-300 border-green-600/50",
          card: "border-green-600/20",
        };
      case "rejected":
        return {
          badge: "bg-red-900/30 text-red-300 border-red-600/50",
          card: "border-red-600/20",
        };
      default:
        return {
          badge: "bg-slate-700/30 text-slate-300 border-slate-600/50",
          card: "border-slate-600/20",
        };
    }
  };

  const getJobTitle = (jobId: string) => {
    const job = jobDetails?.find((j) => j?._id === jobId);
    return job?.title ?? "Unknown Position";
  };

  const getInterviewerName = (interviewerId: string) => {
    const interviewer = interviewerDetails?.find(
      (u) => u?.clerkId === interviewerId
    );
    return interviewer?.name ?? "Unknown Interviewer";
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black flex items-center justify-center font-mono">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-800 to-slate-800 rounded-full flex items-center justify-center border border-blue-700">
            <Circle className="w-8 h-8 text-blue-300" />
          </div>
          <h1 className="text-2xl font-black font-mono text-transparent bg-gradient-to-r from-blue-400 to-white bg-clip-text mb-3 tracking-wide">
            SIGN IN REQUIRED
          </h1>
          <p className="text-blue-300 leading-relaxed font-mono">
            Please sign in to view your applications.
          </p>
        </div>
      </div>
    );
  }

  if (apps === undefined || jobDetails === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black flex items-center justify-center font-mono">
        <div className="flex items-center space-x-3">
          <Loader2 className="animate-spin w-6 h-6 text-blue-300" />
          <span className="text-lg font-black font-mono text-blue-300 tracking-wide">
            LOADING APPLICATIONS...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white font-mono">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black font-mono text-transparent bg-gradient-to-r from-blue-400 to-white bg-clip-text mb-2 tracking-wider">
            MY APPLICATIONS
          </h1>
          <p className="text-xl text-blue-300 font-mono font-medium tracking-wide">
            TRACK THE STATUS OF YOUR JOB APPLICATIONS
          </p>
        </div>

        {/* Applications Grid */}
        {apps.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-800 to-slate-800 rounded-full flex items-center justify-center border border-blue-700">
              <Circle className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-3xl font-black font-mono text-transparent bg-gradient-to-r from-blue-400 to-white bg-clip-text mb-3 tracking-wide">
              NO APPLICATIONS YET
            </h2>
            <p className="text-blue-300 text-lg max-w-md mx-auto leading-relaxed font-mono">
              When you apply to jobs, they'll appear here so you can track their progress.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {apps.map((app, index) => {
              const styling = getStatusStyling(app.status);
              return (
                <Card
                  key={app._id}
                  className={`bg-gradient-to-br from-slate-900/40 to-black/60 border-2 ${styling.card} hover:shadow-xl transition-all duration-200 hover:-translate-y-1 backdrop-blur-sm`}
                >
                  <CardContent className="p-6 space-y-6">
                    {/* Job Title */}
                    <div>
                      <h2 className="text-xl font-black font-mono text-transparent bg-gradient-to-r from-blue-300 to-white bg-clip-text leading-tight mb-1 tracking-wide">
                        {getJobTitle(app.jobId).toUpperCase()}
                      </h2>
                    </div>

                    {/* Submission Date */}
                    <div className="flex items-center gap-3 text-blue-200 bg-blue-900/30 rounded-lg p-3 border border-blue-800/30">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-sm font-black font-mono text-blue-400 uppercase tracking-widest">
                          APPLIED
                        </p>
                        <p className="text-base font-mono font-semibold text-white">
                          {new Date(app._creationTime).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center">
                      <Badge
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-black font-mono border ${styling.badge} tracking-wide`}
                      >
                        {getStatusIcon(app.status)}
                        {(app.status === "shortlisted"
                          ? "SHORTLISTED"
                          : app.status === "rejected"
                            ? "NOT SELECTED"
                            : "UNDER REVIEW")}
                      </Badge>
                    </div>

                    {/* Interviewer Info & Chat Button */}
                    {app.status === "shortlisted" && app.interviewerId && (
                      <div className="pt-4 border-t border-blue-800/50 space-y-4">
                        <div className="text-center">
                          <p className="text-sm font-black font-mono text-blue-400 mb-1 uppercase tracking-widest">
                            INTERVIEWER
                          </p>
                          <p className="text-lg font-black font-mono text-transparent bg-gradient-to-r from-blue-300 to-white bg-clip-text tracking-wide">
                            {getInterviewerName(app.interviewerId).toUpperCase()}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            router.push(`/chat/${app.interviewerId}`)
                          }
                          className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-black font-mono transition-colors duration-200 flex items-center justify-center gap-2 active:scale-98 border border-blue-600/50 tracking-wide"
                        >
                          <MessageCircle className="w-4 h-4" />
                          START INTERVIEW CHAT
                        </button>
                      </div>
                    )}

                    {/* Status Messages */}
                    {app.status === "pending" && (
                      <div className="pt-4 border-t border-blue-800/50 text-center">
                        <p className="text-amber-300 font-black font-mono tracking-wide">
                          APPLICATION UNDER REVIEW
                        </p>
                        <p className="text-blue-400 text-sm mt-1 font-mono">
                          We'll notify you of any updates
                        </p>
                      </div>
                    )}

                    {app.status === "rejected" && (
                      <div className="pt-4 border-t border-blue-800/50 text-center">
                        <p className="text-red-300 font-black font-mono tracking-wide">
                          APPLICATION NOT SELECTED
                        </p>
                        <p className="text-blue-400 text-sm mt-1 font-mono">
                          Thank you for your interest
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}