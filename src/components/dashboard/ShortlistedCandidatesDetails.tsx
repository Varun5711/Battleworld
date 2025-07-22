"use client";

import { useRouter } from "next/navigation";

type Props = {
  applications: {
    _id: string;
    candidateClerkId: string;
    jobTitle: string;
    status: string;
    _creationTime: number;
  }[];
};

export default function ShortlistedCandidatesDetails({ applications }: Props) {
  const router = useRouter();

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Shortlisted Candidates</h2>
      {applications.map((app) => (
        <div key={app._id} className="border rounded p-4 space-y-1">
          <p>
            <strong>Candidate:</strong> {app.candidateClerkId}
          </p>
          <p>
            <strong>Job:</strong> {app.jobTitle}
          </p>
          <p>
            <strong>Status:</strong> {app.status}
          </p>
          <p>
            <strong>Shortlisted on:</strong>{" "}
            {new Date(app._creationTime).toLocaleString()}
          </p>

          <button
            onClick={() => router.push(`/chat/${app.candidateClerkId}`)} // 👈 candidateId becomes the dynamic [targetId]
            className="text-blue-600 underline"
          >
            Chat with Candidate
          </button>
        </div>
      ))}
    </div>
  );
}
