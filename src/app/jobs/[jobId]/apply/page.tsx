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
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-2">
        <LoaderUI />
        <p className="text-sm text-muted-foreground">Fetching job details...</p>
      </div>
    );
  }

  const alreadyApplied = existingApplication && existingApplication.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{job?.title}</h1>
        <p className="text-muted-foreground">{job?.description}</p>
      </div>

      <JobApplyForm
        jobId={jobId as Id<"jobs">}
        onSuccess={() => {
          setIsApplying(true); // ✅ prevent redirect during revalidation
          toast.success("Application submitted!");
          router.push("/applications");
        }}
        disabled={alreadyApplied}
      />
    </div>
  );
}
