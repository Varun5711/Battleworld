"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Id } from "../../../convex/_generated/dataModel";

interface Props {
  applicationId?: Id<"applications">;
  onUpload?: (fileId: string) => void;
}

export default function ResumeUpload({ applicationId, onUpload }: Props) {
  const generateUploadUrl = useMutation(api.resume.generateUploadUrl);
  const saveResume = useMutation(api.resume.updateApplicationResume); // optional if used

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Select a file first.");
    if (!file.type.includes("pdf"))
      return toast.error("Only PDF files allowed");

    setUploading(true);

    try {
      const uploadUrl = await generateUploadUrl();

      const formData = new FormData();
      formData.append("file", file); // ✅ this is enough

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      const data = await res.json();
      const fileId = data.storageId;

      onUpload?.(fileId);
      toast.success("Uploaded!");
    } catch (err) {
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
      />
      <Button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? "Uploading..." : "Upload Resume"}
      </Button>
    </div>
  );
}
