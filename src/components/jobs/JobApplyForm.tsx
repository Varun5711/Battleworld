"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResumeUpload from "@/components/resume/ResumeUpload";
import toast from "react-hot-toast";

interface Props {
  jobId: Id<"jobs">;
  onSuccess: () => void;
  disabled?: boolean;
}

export default function JobApplyForm({ jobId, onSuccess, disabled }: Props) {
  const apply = useMutation(api.applications.createApplication);

  const [resumeText, setResumeText] = useState("");
  const [resumeFileId, setResumeFileId] = useState<Id<"_storage"> | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    try {
      setSubmitting(true);
      await apply({
        jobId,
        resume: resumeFileId ?? undefined,
        status: "pending",
      });
      onSuccess();
    } catch (err) {
      toast.error("Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        placeholder="Paste your resume text or link"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        disabled={disabled}
      />

      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Or upload a PDF resume:
        </p>

        {!disabled ? (
          <ResumeUpload
            onUpload={(id) => setResumeFileId(id as Id<"_storage">)}
          />
        ) : (
          <div className="text-muted-foreground text-sm italic">
            You’ve already applied — upload disabled.
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={submitting || disabled}
        className={
          disabled
            ? "bg-gray-600 cursor-not-allowed text-white w-full"
            : "w-full"
        }
      >
        {disabled
          ? "Already Applied"
          : submitting
          ? "Submitting..."
          : "Submit Application"}
      </Button>
    </form>
  );
}