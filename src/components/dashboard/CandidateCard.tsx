"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ResumeViewer from "@/components/resume/ResumeViewer";
import SwipeControls from "@/components/dashboard/SwipeControls";
import { Separator } from "@/components/ui/separator";
import { Doc } from "../../../convex/_generated/dataModel";
import { Id } from "../../../convex/_generated/dataModel";

type Props = {
  application: Doc<"applications">;
  candidateClerkId: string;
};

export default function CandidateCard({ application, candidateClerkId }: Props) {
  const candidate = useQuery(
    api.users.getUserByClerkId,
    candidateClerkId ? { clerkId: candidateClerkId } : "skip"
  );

  const job = useQuery(
    api.jobs.getJobById,
    application?.jobId ? { jobId: application.jobId } : "skip"
  );

  if (candidate === undefined || job === undefined) {
    return (
      <div className="w-full bg-emerald-950/30 backdrop-blur-xl border border-emerald-800/40 rounded-lg p-8">
        <div className="text-emerald-300/70 font-light">Loading candidate dossier...</div>
      </div>
    );
  }

  if (candidate === null) {
    return (
      <div className="w-full bg-emerald-950/30 backdrop-blur-xl border border-emerald-800/40 rounded-lg p-8">
        <div className="text-emerald-400/80 font-light">Subject not found in archives.</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-emerald-950/20 backdrop-blur-xl border border-emerald-800/30 rounded-lg shadow-2xl hover:bg-emerald-950/30 hover:border-emerald-700/40 transition-all duration-300">
      <div className="p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <h2 className="text-2xl font-light text-emerald-100 tracking-wide">
              {candidate.name}
            </h2>
            
            {job && (
              <div className="flex items-center space-x-2">
                <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Position Sought:</span>
                <span className="text-emerald-200/90 font-light">{job.title}</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Specialization:</span>
              <span className="text-emerald-300/80 font-light italic">
                {candidate.preferredRole || "Unspecified"}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-emerald-800/40"></div>

          {/* Background */}
          <div className="space-y-2">
            <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Background:</span>
            <p className="text-emerald-200/90 font-light leading-relaxed">
              {candidate.backstory || "No background information provided."}
            </p>
          </div>

          {/* Capabilities */}
          {candidate.powers && candidate.powers.length > 0 && (
            <div className="space-y-3">
              <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Capabilities:</span>
              <div className="flex flex-wrap gap-2">
                {candidate.powers.map((power, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-emerald-900/40 border border-emerald-700/50 rounded text-emerald-300 text-sm font-light"
                  >
                    {power}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Limitations */}
          {candidate.weaknesses && candidate.weaknesses.length > 0 && (
            <div className="space-y-3">
              <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Limitations:</span>
              <div className="flex flex-wrap gap-2">
                {candidate.weaknesses.map((weakness, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-red-950/40 border border-red-800/50 rounded text-red-300 text-sm font-light"
                  >
                    {weakness}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="w-full h-px bg-emerald-800/40"></div>

          {/* Experience */}
          <div className="space-y-3">
            <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Notable Engagements:</span>
            <div className="space-y-2">
              {candidate.keyBattles?.length && candidate.keyBattles.length > 0 ? (
                candidate.keyBattles.map((battle, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-1 h-1 bg-emerald-600/60 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-emerald-200/80 font-light text-sm leading-relaxed">{battle}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-start space-x-3">
                  <div className="w-1 h-1 bg-emerald-600/60 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-emerald-300/60 font-light text-sm italic">No engagements documented</span>
                </div>
              )}
            </div>
          </div>

          {/* Resume */}
          {application.resume && (
            <div className="space-y-3">
              <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Documentation:</span>
              <div className="bg-emerald-950/40 border border-emerald-800/30 rounded p-4">
                <ResumeViewer fileId={application.resume as Id<"_storage">} />
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="pt-4 border-t border-emerald-800/40">
            <SwipeControls
              applicationId={application._id}
              candidateId={candidate.clerkId}
              candidateEmail={candidate.email}
              candidateName={candidate.name}
              jobId={application.jobId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}