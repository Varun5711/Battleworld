"use client";

import { Doc } from "@/../convex/_generated/dataModel";
import CandidateCard from "@/components/dashboard/CandidateCard";

type Props = {
  applications: (Doc<"applications"> & {
    candidateClerkId: string;
  })[];
  onUpdate?: () => void;
};

export default function ApplicationsDetails({ applications  , onUpdate}: Props) {
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Recent Applications</h2>
      {applications.length === 0 ? (
        <p className="text-muted-foreground">No applications found.</p>
      ) : (
        applications.map((application) => (
          <CandidateCard
            key={application._id}
            application={application}
            candidateClerkId={application.candidateClerkId}
          />
        ))
      )}
    </div>
  );
}