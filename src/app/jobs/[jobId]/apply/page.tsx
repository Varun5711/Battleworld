"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import LoaderUI from "@/components/shared/LoaderUI";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useEffect, useState } from "react";
import JobApplyForm from "@/components/jobs/JobApplyForm";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const [isApplying, setIsApplying] = useState(false);

  const jobId = params?.jobId as Id<"jobs"> | undefined;

  const job = useQuery(api.jobs.getJobById, jobId ? { jobId } : "skip");

  const existingApplication = useQuery(
    api.applications.getCandidateApplicationForJob,
    jobId && user?.id ? { jobId, candidateClerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (job === null) {
      toast.error("Job not found.");
      router.push("/jobs");
    }
  }, [job, router]);

  useEffect(() => {
    if (!isApplying && existingApplication && existingApplication.length > 0) {
      toast.error("You've already applied to this job.");
      router.push("/applications");
    }
  }, [existingApplication, isApplying, router]);

  if (!jobId) {
    toast.error("Invalid job link.");
    router.push("/jobs");
    return null;
  }

  if (job === undefined || existingApplication === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <LoaderUI />
          <p className="text-sm text-blue-200 font-mono tracking-wide">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  const alreadyApplied = existingApplication && existingApplication.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-10">
          <div className="bg-slate-800/40 backdrop-blur-sm border border-blue-800/30 rounded-lg p-8 shadow-2xl">
            <h1 className="text-4xl font-black text-blue-100 mb-4 font-mono tracking-tight leading-tight">
              {job?.title}
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-blue-600 mb-6"></div>
            <p className="text-blue-200/80 text-lg leading-relaxed font-light">
              {job?.description}
            </p>
          </div>
        </div>

        {/* Application Form Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-700/30 rounded-lg p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-100 mb-2 font-mono tracking-wide">
              Submit Application
            </h2>
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-500/50 to-transparent"></div>
          </div>

          <JobApplyForm
            jobId={jobId as Id<"jobs">}
            onSuccess={() => {
              setIsApplying(true);
              toast.success("Application submitted successfully!");
              router.push("/applications");
            }}
            disabled={alreadyApplied}
          />
        </div>

        {/* Status Message */}
        {alreadyApplied && (
          <div className="mt-6 bg-blue-800/30 border border-blue-600/50 rounded-lg p-4">
            <p className="text-blue-200 text-center font-mono text-sm tracking-wide">
              Application already submitted for this position
            </p>
          </div>
        )}
      </div>
    </div>
  );
}