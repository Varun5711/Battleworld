"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { FileText, AlertTriangle, ExternalLink, Eye, Shield } from "lucide-react";

interface ResumeViewerProps {
  fileId: Id<"_storage"> | null;
}

function isValidStorageId(id: string | null | undefined): id is Id<"_storage"> {
  return typeof id === "string" && id.length >= 16;
}

export default function ResumeViewer({ fileId }: ResumeViewerProps) {

  if (!fileId) {
    return (
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6 text-center">
        <FileText className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-400 font-medium">No resume uploaded</p>
        <p className="text-slate-500 text-sm mt-1">Candidate has not provided a resume file</p>
      </div>
    );
  }

  if (!isValidStorageId(fileId)) {
    return (
      <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p className="text-red-300 font-medium">⚠️ Invalid resume file ID</p>
        <p className="text-red-400 text-sm mt-1">The resume file reference appears to be corrupted</p>
      </div>
    );
  }

  const resumeUrl = useQuery(
    api.resume.getResumeUrl,
    { fileId }
  );

  if (resumeUrl === undefined) {
    return (
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-emerald-400 animate-pulse" />
          <div>
            <p className="text-slate-300 font-medium">Loading resume...</p>
            <p className="text-slate-500 text-sm">Retrieving document from secure storage</p>
          </div>
        </div>
      </div>
    );
  }

  if (!resumeUrl) {
    return (
      <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p className="text-red-300 font-medium">Resume file not found</p>
        <p className="text-red-400 text-sm mt-1">The file may have been deleted or is no longer accessible</p>
      </div>
    );
  }

  const isPDF = typeof resumeUrl === "string" && resumeUrl.toLowerCase().endsWith(".pdf");

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-emerald-400" />
          <span className="text-slate-200 font-medium">Document Preview</span>
        </div>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg text-emerald-300 hover:text-emerald-200 transition-all duration-200 text-sm font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open Full View</span>
        </a>
      </div>

      {isPDF ? (
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg overflow-hidden">
          <iframe
            src={resumeUrl}
            title="Resume PDF"
            className="w-full h-[600px] bg-white rounded-lg"
          />
        </div>
      ) : (
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6">
          <div className="text-center space-y-4">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <div>
              <p className="text-slate-300 font-medium mb-2">
                Resume uploaded successfully
              </p>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 hover:border-emerald-500/60 rounded-lg text-emerald-300 hover:text-emerald-200 transition-all duration-200 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Document</span>
              </a>
            </div>
            <p className="text-slate-500 text-sm">
              This file format cannot be previewed inline. Click above to view in a new tab.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}