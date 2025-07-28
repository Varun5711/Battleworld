"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    description?: string;
  };
  hasApplied?: boolean;
}

export default function JobCard({ job, hasApplied }: JobCardProps) {
  const router = useRouter();

  return (
    <Card 
      className="group bg-slate-900/60 backdrop-blur-sm border border-blue-800/40 hover:border-blue-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20"
    >
      <CardContent className="p-8 space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text font-mono tracking-wide group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
            {job.title}
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-600/50 to-transparent"></div>
          <p className="text-blue-200/80 text-base font-light leading-relaxed">
            {job.description}
          </p>
        </div>

        <Button
          onClick={() => router.push(`/jobs/${job._id}/apply`)}
          className="w-full bg-slate-800 hover:bg-blue-700 text-blue-100 border border-blue-700/50 hover:border-blue-500 transition-all duration-300 py-4 text-base font-mono tracking-wide group-hover:shadow-lg group-hover:shadow-blue-500/30"
          disabled={hasApplied}
        >
          {hasApplied ? "Application Submitted" : "Apply Now"}
        </Button>

        {hasApplied && (
          <div className="text-center">
            <span className="inline-block px-3 py-1 text-xs font-mono tracking-wide text-blue-300 bg-blue-900/30 border border-blue-700/40 rounded-full">
              Already Applied
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}