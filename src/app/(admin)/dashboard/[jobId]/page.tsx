"use client"
import { useParams } from "next/navigation";
import SwipeControls from "@/components/dashboard/SwipeControls";
import { Id } from "@/../convex/_generated/dataModel"; // adjust path if needed
import withRoleProtection from "../../../../lib/withRoleProtection"

function ReviewPage() {
  const { jobId } = useParams();
  return (
    <SwipeControls
      jobId={jobId as Id<"jobs">}
      applicationId={"yourApplicationId" as Id<"applications">}
      candidateId={"yourCandidateId"}
      candidateEmail="candidate@example.com"
      candidateName="Candidate Name"
      // interviewId={...} // optional
    />
  );
}

export default withRoleProtection(ReviewPage , ["interviewer"]);