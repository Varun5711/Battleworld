"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

interface ResumeViewerProps {
  fileId: Id<"_storage"> | null;
}

function isValidStorageId(id: string | null | undefined): id is Id<"_storage"> {
  // Convex storage IDs are typically 32+ chars, but you may want to check for a specific pattern
  return typeof id === "string" && id.length >= 16;
}

export default function ResumeViewer({ fileId }: ResumeViewerProps) {
  console.log("ResumeViewer fileId:", fileId);

  if (!fileId) {
    return <p className="text-muted-foreground">No resume uploaded.</p>;
  }

  if (!isValidStorageId(fileId)) {
    return <p className="text-red-500">⚠️ Invalid resume file ID.</p>;
  }

  const resumeUrl = useQuery(
    api.resume.getResumeUrl,
    { fileId }
  );

  if (resumeUrl === undefined) {
    return <p>Loading resume...</p>;
  }

  if (!resumeUrl) {
    return <p className="text-red-500">Resume file not found.</p>;
  }

  const isPDF = typeof resumeUrl === "string" && resumeUrl.toLowerCase().endsWith(".pdf");

  return (
    <div className="w-full max-w-4xl mx-auto mt-4">
      {isPDF ? (
        <iframe
          src={resumeUrl}
          title="Resume PDF"
          className="w-full h-[600px] border rounded"
        />
      ) : (
        <div className="p-4 bg-gray-100 rounded">
          <p>
            Resume uploaded:{" "}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View File
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This format cannot be previewed directly.
          </p>
        </div>
      )}
    </div>
  );
}