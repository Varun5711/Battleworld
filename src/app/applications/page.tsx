"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageCircle, Clock, CheckCircle, XCircle, Circle } from "lucide-react";

export default function ApplicationsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const apps = useQuery(api.applications.getMyApplications, {
    candidateId: user?.id ?? "",
  });

  // Fetch job details for each application
  const jobDetails = useQuery(
      api.jobs.getJobById,
    apps ? { jobId: apps[0].jobId } : "skip"
  );

  // Fetch interviewer details for shortlisted applications
  const interviewerIds = apps?.filter(app => app.status === "shortlisted" && app.interviewerId)
    .map(app => app.interviewerId) || [];
  
  const allUsers = useQuery(api.users.getAllUsers);
  const interviewerDetails = useQuery(
    api.users.getUserByClerkId,
    interviewerIds.length > 0 ? { clerkId: interviewerIds[0] } : "skip"
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
          card: "border-amber-600/20"
        };
      case "shortlisted":
        return {
          badge: "bg-green-900/30 text-green-300 border-green-600/50",
          card: "border-green-600/20"
        };
      case "rejected":
        return {
          badge: "bg-red-900/30 text-red-300 border-red-600/50",
          card: "border-red-600/20"
        };
      default:
        return {
          badge: "bg-gray-700/30 text-gray-300 border-gray-600/50",
          card: "border-gray-600/20"
        };
    }
  };

  const getJobTitle = (jobId: string) => {
    return jobDetails && jobDetails._id === jobId ? jobDetails.title : "Unknown Position";
  };

  const getInterviewerName = (interviewerId: string) => {
    return interviewerDetails && interviewerDetails._id === interviewerId ? interviewerDetails.name : "Unknown Interviewer";
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" 
           style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif" }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border border-gray-600">
            <Circle className="w-8 h-8 text-gray-300" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">
            Sign In Required
          </h1>
          <p className="text-gray-400 leading-relaxed">
            Please sign in to view your applications.
          </p>
        </div>
      </div>
    );
  }

  if (apps === undefined || jobDetails === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center"
           style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif" }}>
        <div className="flex items-center space-x-3">
          <Loader2 className="animate-spin w-6 h-6 text-gray-300" />
          <span className="text-lg font-medium text-gray-300">Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white"
         style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif" }}>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            My Applications
          </h1>
          <p className="text-xl text-gray-400 font-normal">
            Track the status of your job applications
          </p>
        </div>

        {/* Applications Grid */}
        {apps.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-gray-700">
              <Circle className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              No Applications Yet
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
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
                  className={`bg-gradient-to-br from-gray-900 to-black border-2 ${styling.card} hover:shadow-xl transition-all duration-200 hover:-translate-y-1`}
                >
                  <CardContent className="p-6 space-y-6">
                    
                    {/* Job Title */}
                    <div>
                      <h2 className="text-xl font-semibold text-white leading-tight mb-1">
                        {getJobTitle(app.jobId)}
                      </h2>
                    </div>

                    {/* Submission Date */}
                    <div className="flex items-center gap-3 text-gray-300 bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                          Applied
                        </p>
                        <p className="text-base font-medium text-white">
                          {new Date(app._creationTime).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center">
                      <Badge className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border ${styling.badge}`}>
                        {getStatusIcon(app.status)}
                        {app.status === "shortlisted" ? "Shortlisted" : 
                         app.status === "rejected" ? "Not Selected" : 
                         "Under Review"}
                      </Badge>
                    </div>

                    {/* Interviewer Info & Chat Button */}
                    {app.status === "shortlisted" && app.interviewerId && (
                      <div className="pt-4 border-t border-gray-700/50 space-y-4">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wide">
                            Interviewer
                          </p>
                          <p className="text-lg font-semibold text-white">
                            {getInterviewerName(app.interviewerId)}
                          </p>
                        </div>
                        <button
                          onClick={() => router.push(`/chat/${app.interviewerId}`)}
                          className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 active:scale-98 border border-gray-600/50"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Start Interview Chat
                        </button>
                      </div>
                    )}

                    {/* Status Messages */}
                    {app.status === "pending" && (
                      <div className="pt-4 border-t border-gray-700/50 text-center">
                        <p className="text-amber-300 font-medium">
                          Application Under Review
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          We'll notify you of any updates
                        </p>
                      </div>
                    )}

                    {app.status === "rejected" && (
                      <div className="pt-4 border-t border-gray-700/50 text-center">
                        <p className="text-red-300 font-medium">
                          Application Not Selected
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
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