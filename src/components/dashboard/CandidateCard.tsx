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

  if (candidate === undefined || job === undefined) return <div>Loading...</div>;
  if (candidate === null) return <div>Candidate not found.</div>;

  return (
    <Card className="w-full shadow-xl border border-muted bg-background/60 backdrop-blur-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">{candidate.name}</h2>

          {job && (
            <p className="text-muted-foreground text-sm">
              Applying for: <span className="font-semibold">{job.title}</span>
            </p>
          )}

          <p className="text-muted-foreground italic text-sm">
            Preferred Role: {candidate.preferredRole || "N/A"}
          </p>

          <Separator className="my-2" />

          <p className="text-sm">
            <span className="font-semibold">Backstory:</span>{" "}
            {candidate.backstory || "No backstory provided."}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {candidate.powers?.map((power, i) => (
              <Badge variant="secondary" key={i}>
                {power}
              </Badge>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {candidate.weaknesses?.map((weakness, i) => (
              <Badge variant="destructive" key={i}>
                {weakness}
              </Badge>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <h3 className="font-semibold">Key Battles</h3>
            <ul className="list-disc ml-5 text-sm">
              {candidate.keyBattles?.length && candidate.keyBattles.length > 0 ? (
                candidate.keyBattles.map((battle, i) => (
                  <li key={i}>{battle}</li>
                ))
              ) : (
                <li>No battles listed</li>
              )}
            </ul>
          </div>

          {application.resume && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Resume:</h3>
              <ResumeViewer fileId={application.resume as Id<"_storage">} />
            </div>
          )}

          <div className="mt-6">
            <SwipeControls
              applicationId={application._id}
              candidateId={candidate.clerkId}
              candidateEmail={candidate.email}
              candidateName={candidate.name}
              jobId={application.jobId}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}