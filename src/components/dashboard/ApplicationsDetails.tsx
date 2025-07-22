"use client";

import { Doc, Id } from "@/../convex/_generated/dataModel";
import CandidateCard from "@/components/dashboard/CandidateCard"; // ✅ adjust path as per your structure

type Props = {
  applications: {
    _id: Id<"applications">;
    jobId: Id<"jobs">;
    resume?: Id<"_storage">;
    candidateClerkId: string;
  }[];
};

export default function ApplicationsDetails({ applications }: Props) {
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Recent Applications</h2>

      {applications.map((application) => (
        <CandidateCard
          key={application._id}
          application={application as Doc<"applications"> & { candidateClerkId: string }}
          candidateClerkId={application.candidateClerkId}
        />
      ))}
    </div>
  );
}