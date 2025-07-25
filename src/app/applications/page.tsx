"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageCircle, Clock, Shield, Skull, Crown } from "lucide-react";

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
        return <Clock className="w-5 h-5" />;
      case "shortlisted":
        return <Crown className="w-5 h-5" />;
      case "rejected":
        return <Skull className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getStatusStyling = (status: string) => {
    switch (status) {
      case "pending":
        return {
          badge: "bg-amber-900/30 text-amber-400 border-amber-700/50 shadow-amber-900/20",
          glow: "shadow-amber-500/20"
        };
      case "shortlisted":
        return {
          badge: "bg-emerald-900/30 text-emerald-400 border-emerald-700/50 shadow-emerald-900/20",
          glow: "shadow-emerald-500/20"
        };
      case "rejected":
        return {
          badge: "bg-red-900/30 text-red-400 border-red-700/50 shadow-red-900/20",
          glow: "shadow-red-500/20"
        };
      default:
        return {
          badge: "bg-gray-900/30 text-gray-400 border-gray-700/50 shadow-gray-900/20",
          glow: "shadow-gray-500/20"
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center"
           style={{ fontFamily: "'Cinzel', 'Times New Roman', serif" }}>
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-green-500" />
          <div className="text-3xl font-bold text-gray-200 mb-4 tracking-wider">
            AUTHENTICATION REQUIRED
          </div>
          <p className="text-gray-400 text-lg">
            Only the worthy may access the sanctum of applications.
          </p>
        </div>
      </div>
    );
  }

  if (apps === undefined || jobDetails === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center"
           style={{ fontFamily: "'Cinzel', 'Times New Roman', serif" }}>
        <div className="flex items-center space-x-4 text-2xl">
          <Loader2 className="animate-spin w-8 h-8 text-green-500" />
          <span className="font-bold text-gray-200 tracking-wider">RETRIEVING ARCHIVES...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white relative overflow-hidden"
         style={{ fontFamily: "'Cinzel', 'Times New Roman', serif" }}>
      
      {/* Doom Castle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-b from-green-800/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-t from-emerald-800/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-green-900/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Metallic Grid Pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{
             backgroundImage: `
               linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
               linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
             `,
             backgroundSize: '60px 60px'
           }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        
        {/* Doom Header */}
        <div className="mb-20 text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-xl"></div>
            <div className="relative">
              <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 mb-6 tracking-widest drop-shadow-2xl">
                DOOM'S ARCHIVES
              </h1>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-green-500 to-transparent w-32"></div>
                <Shield className="w-8 h-8 text-green-500" />
                <div className="h-px bg-gradient-to-r from-transparent via-green-500 to-transparent w-32"></div>
              </div>
              <p className="text-xl text-gray-300 font-semibold tracking-wide">
                Witness the progression of your conquest, mortal.
              </p>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        {apps.length === 0 ? (
          <div className="text-center py-40">
            <div className="relative inline-block">
              <div className="absolute -inset-8 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-3xl blur-2xl"></div>
              <div className="relative">
                <Skull className="w-24 h-24 mx-auto mb-8 text-gray-500" />
                <p className="text-4xl text-gray-400 font-bold mb-6 tracking-wider">
                  NO SUBMISSIONS RECORDED
                </p>
                <p className="text-gray-500 text-lg font-medium">
                  The path to dominion requires first steps, insignificant one.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {apps.map((app, index) => {
              const styling = getStatusStyling(app.status);
              return (
                <div
                  key={app._id}
                  className="transform transition-all duration-700 hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative group">
                    <div className={`absolute -inset-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 ${styling.glow}`}></div>
                    
                    <Card className="relative bg-gradient-to-br from-zinc-900/95 to-black/95 border-2 border-zinc-700/50 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-500 hover:border-green-600/50 shadow-2xl">
                      
                      {/* Doom Accent Line */}
                      <div className="h-2 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600"></div>
                      
                      <CardContent className="p-8 space-y-6">
                        
                        {/* Job Title & Company */}
                        <div className="space-y-2">
                          <h2 className="text-2xl font-bold text-white tracking-wide flex items-start gap-3">
                            <Crown className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                            <span className="leading-tight">{getJobTitle(app.jobId)}</span>
                          </h2>
                        </div>

                        {/* Submission Date */}
                        <div className="flex items-center gap-3 text-gray-400 bg-zinc-800/50 rounded-lg p-3">
                          <Clock className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-300">SUBMITTED</p>
                            <p className="text-lg font-bold">
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
                          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-lg border-2 shadow-lg ${styling.badge}`}>
                            {getStatusIcon(app.status)}
                            {app.status.toUpperCase()}
                          </div>
                        </div>

                        {/* Interviewer Info & Chat Button */}
                        {app.status === "shortlisted" && app.interviewerId && (
                          <div className="pt-6 border-t-2 border-green-900/30 space-y-4">
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-400 mb-1">YOUR EXAMINER</p>
                              <p className="text-xl font-bold text-green-400 tracking-wide">
                                {getInterviewerName(app.interviewerId)}
                              </p>
                            </div>
                            <button
                              onClick={() => router.push(`/chat/${app.interviewerId}`)}
                              className="relative group w-full bg-gradient-to-r from-green-800/80 to-emerald-800/80 border-2 border-green-600/60 text-green-200 px-6 py-4 rounded-xl hover:from-green-700/90 hover:to-emerald-700/90 hover:border-green-500 transition-all duration-300 hover:scale-105 active:scale-95 font-bold text-lg tracking-wide shadow-xl hover:shadow-green-500/25 overflow-hidden"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-3">
                                <MessageCircle className="w-6 h-6" />
                                INITIATE COMMUNION
                              </span>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            </button>
                          </div>
                        )}

                        {/* Status Messages */}
                        {app.status === "pending" && (
                          <div className="pt-6 border-t-2 border-amber-900/30 text-center">
                            <p className="text-amber-400 font-bold text-lg tracking-wide">
                              AWAITING DOOM'S JUDGMENT
                            </p>
                            <p className="text-gray-500 mt-2">Your fate hangs in the balance.</p>
                          </div>
                        )}

                        {app.status === "rejected" && (
                          <div className="pt-6 border-t-2 border-red-900/30 text-center">
                            <p className="text-red-400 font-bold text-lg tracking-wide">
                              DEEMED UNWORTHY
                            </p>
                            <p className="text-gray-500 mt-2">Even Doom has standards, peasant.</p>
                          </div>
                        )}

                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}