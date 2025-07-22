"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import LoaderUI from "@/components/shared/LoaderUI";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useEffect } from "react";
import JobApplyForm from "@/components/jobs/JobApplyForm";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.jobId as Id<"jobs"> | undefined;

  const job = useQuery(api.jobs.getJobById, jobId ? { jobId } : "skip");

  useEffect(() => {
    if (job === null) {
      toast.error("Job not found.");
      router.push("/jobs");
    }
  }, [job, router]);

  if (!jobId) {
    toast.error("Invalid job link.");
    router.push("/jobs");
    return null;
  }

  if (job === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-2">
        <LoaderUI />
        <p className="text-sm text-muted-foreground">Fetching job details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{job?.title}</h1>
        <p className="text-muted-foreground">{job?.description}</p>
      </div>

      <JobApplyForm
        jobId={job?._id ?? "" as Id<"jobs">}
        onSuccess={() => {
          toast.success("Application submitted!");
          router.push("/applications");
        }}
      />
    </div>
  );
}