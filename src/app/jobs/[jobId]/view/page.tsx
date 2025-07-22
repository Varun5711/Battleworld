"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import LoaderUI from "@/components/shared/LoaderUI";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function ViewJobPage() {
  const { jobId } = useParams() as { jobId: string };

  const job = useQuery(
    api.jobs.getJobById,
    jobId ? { jobId: jobId as Id<"jobs"> } : "skip"
  );

  if (job === undefined) {
    return (
      <div className="text-center mt-10">
        <LoaderUI />
        <p>Loading job details...</p>
      </div>
    );
  }

  if (job === null) {
    return <div className="text-center mt-10 text-red-500">Job not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
      <p className="text-muted-foreground text-lg">{job.description}</p>
    </div>
  );
}