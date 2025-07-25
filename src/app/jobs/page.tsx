"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoaderUI from "@/components/shared/LoaderUI";
import toast from "react-hot-toast";

export default function JobsPage() {
  const { user } = useUser();
  const router = useRouter();

  const jobs = useQuery(api.jobs.getAllJobs);
  const applications = useQuery(api.applications.getMyApplications, { candidateId: user?.id ?? "" });

  if (!user) {
    toast.error("Access denied. Only worthy subjects may view Doom's opportunities.");
    return null;
  }

  if (jobs === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoaderUI />
          <p className="text-slate-300 text-lg font-light tracking-wide">
            Doom's archives are being accessed...
          </p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl mx-auto px-6">
          <h1 className="text-5xl font-thin text-white tracking-tight">
            No Active Positions
          </h1>
          <p className="text-slate-400 text-xl font-light leading-relaxed">
            All positions within Doom's dominion are currently filled. Return when Doom requires your services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-slate-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl font-thin text-white tracking-tight leading-none">
              Serve
              <span className="block text-emerald-400 font-light">Doom's Vision</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
              Join the elite forces that shape the future of Latveria and beyond. 
              Excellence is not optional.
            </p>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {jobs.map((job) => {
            const hasApplied = applications?.some(app => app.jobId === job._id);
            return (
              <Card 
                key={job._id} 
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-light text-white tracking-wide group-hover:text-emerald-400 transition-colors duration-300">
                      {job.title}
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                    <p className="text-slate-300 text-base font-light leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => router.push(`/jobs/${job._id}/apply`)}
                    className="w-full bg-slate-700 hover:bg-emerald-600 text-white border border-slate-600 hover:border-emerald-500 transition-all duration-300 py-4 text-base font-light tracking-wide group-hover:shadow-lg group-hover:shadow-emerald-500/25"
                    disabled={hasApplied}
                  >
                    {hasApplied ? "Applied" : "Submit Application"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center space-y-4">
            <p className="text-slate-400 font-light text-lg">
              Only the most capable will earn a place in Doom's empire
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}