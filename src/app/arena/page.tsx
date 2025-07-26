"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import MeetingCard from "@/components/meeting/MeetingCard";
import { useEffect } from "react";
import { CalendarIcon } from "lucide-react";

export default function CandidateInterviewUI() {
  const { user } = useUser();
  const candidateId = user?.id;

  const interviews = useQuery(
    api.interviews.getInterviewsByCandidate,
    candidateId ? { candidateId } : "skip"
  );

  useEffect(() => {
    console.log("USER ID:", candidateId);
    console.log("INTERVIEWS:", interviews);
  }, [candidateId, interviews]);



  if (!candidateId || interviews === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-xl text-gray-300 font-light tracking-wide">Loading your interview schedule...</p>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-gray-900 to-black">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-blue-900/10"></div>
          <div className="relative max-w-6xl mx-auto px-8 pt-20 pb-16">
            <div className="text-center space-y-6">
              <h1 className="text-7xl font-thin tracking-tight bg-gradient-to-br from-blue-400 via-blue-300 to-white bg-clip-text text-transparent drop-shadow-2xl" 
                  style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
                CANDIDATE
              </h1>
              <p className="text-2xl font-light text-gray-300 tracking-wide max-w-2xl mx-auto leading-relaxed">
                Your interview journey awaits. Stay prepared and confident for upcoming opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-4xl mx-auto px-8 pb-20">
          <div className="text-center py-32">
            <div className="space-y-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full 
                            flex items-center justify-center mx-auto border border-blue-400/20">
                <CalendarIcon className="w-12 h-12 text-blue-400/60" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-4xl font-thin tracking-wide bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent"
                    style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
                  No Interviews Scheduled
                </h3>
                <p className="text-xl text-gray-400 font-light max-w-md mx-auto leading-relaxed">
                  Check back soon for updates to your interview schedule. Stay ready for new opportunities.
                </p>
              </div>
              
              <div className="pt-8">
                <div className="w-32 h-px bg-gradient-to-r from-blue-800/50 via-blue-600/50 to-transparent mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-gray-900 to-black">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-blue-900/10"></div>
        <div className="relative max-w-6xl mx-auto px-8 pt-20 pb-16">
          <div className="space-y-6">
            <h1 className="text-7xl font-thin tracking-tight bg-gradient-to-br from-blue-400 via-blue-300 to-white bg-clip-text text-transparent drop-shadow-2xl" 
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
              CANDIDATE
            </h1>
            <p className="text-2xl font-light text-gray-300 tracking-wide max-w-2xl leading-relaxed">
              Your scheduled interviews and opportunities. Be prepared, stay confident, and showcase your excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[1400px] mx-auto px-8 pb-20">
        <div className="space-y-8">
          <h2 className="text-4xl font-thin mb-16 tracking-wide bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent"
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
            Your Interview Schedule
          </h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {interviews.map((interview, index) => {
              // Console log for debugging
              console.log(interview.status);
              
              return (
                <div key={interview._id} className="group animate-fade-in-up"
                     style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative bg-gradient-to-br from-gray-900/80 via-zinc-900/90 to-black/95 
                                backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 h-full min-h-[380px]
                                hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-900/20 
                                transition-all duration-500 hover:scale-[1.02] group overflow-hidden">
                    
                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-blue-700/5 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-400/60 to-blue-500/0 
                                  rounded-t-2xl group-hover:via-blue-300/80 transition-all duration-500"></div>
                    
                    {/* Content wrapper */}
                    <div className="relative z-10 h-full flex flex-col">
                      <div className="flex-1 mb-6">
                        <MeetingCard 
                          interview={interview}
                          isCandidate
                        />
                      </div>
                      
                      {/* Actions and Status Section */}
                      <div className="pt-6 border-t border-blue-800/20">
                        {/* Status indicator */}
                        <div className="flex items-center justify-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full shadow-lg ${
                              interview.status?.toLowerCase() === 'upcoming' 
                                ? 'bg-blue-400 animate-pulse shadow-blue-400/50' 
                                : interview.status?.toLowerCase() === 'completed'
                                ? 'bg-green-400 shadow-green-400/50'
                                : interview.status?.toLowerCase() === 'cancelled'
                                ? 'bg-red-400 shadow-red-400/50'
                                : interview.status?.toLowerCase() === 'in-progress' || interview.status?.toLowerCase() === 'ongoing'
                                ? 'bg-yellow-400 animate-pulse shadow-yellow-400/50'
                                : 'bg-gray-400 shadow-gray-400/50'
                            }`}></div>
                            <span className={`text-sm font-medium tracking-wider uppercase ${
                              interview.status?.toLowerCase() === 'upcoming' 
                                ? 'text-blue-300' 
                                : interview.status?.toLowerCase() === 'completed'
                                ? 'text-green-300'
                                : interview.status?.toLowerCase() === 'cancelled'
                                ? 'text-red-300'
                                : interview.status?.toLowerCase() === 'in-progress' || interview.status?.toLowerCase() === 'ongoing'
                                ? 'text-yellow-300'
                                : 'text-gray-300'
                            }`}>
                              {interview.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Side accent */}
                    <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-500/0 via-blue-400/40 to-blue-500/0 
                                  rounded-r-full group-hover:via-blue-300/60 transition-all duration-500"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}