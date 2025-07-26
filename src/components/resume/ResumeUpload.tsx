"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { Id } from "../../../convex/_generated/dataModel";

interface Props {
  applicationId?: Id<"applications">;
  onUpload?: (fileId: string) => void;
}

export default function ResumeUpload({ applicationId, onUpload }: Props) {
  const generateUploadUrl = useMutation(api.resume.generateUploadUrl);
  const saveResume = useMutation(api.resume.updateApplicationResume);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Select a file first.");
    if (!file.type.includes("pdf"))
      return toast.error("Only PDF files allowed");

    setUploading(true);

    try {
      const uploadUrl = await generateUploadUrl();

      const formData = new FormData();
      formData.append("file", file);

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
      toast.success("Document archived in Doom's vault");
    } catch (err) {
      toast.error("Upload protocol failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (selectedFile: File | null) => {
    setFile(selectedFile);
    // Auto-upload when file is selected
    if (selectedFile) {
      await handleUpload();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      await handleFileChange(droppedFile);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-l-4 border-green-500 pl-6 mb-8">
        <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-gray-300 bg-clip-text text-transparent tracking-wide">
          RESUME SUBMISSION
        </h3>
        <p className="text-gray-400 text-sm font-light mt-2 tracking-wide">
          Submit your credentials for Doom's evaluation
        </p>
      </div>

      {/* Job Application Section */}
      <div className="bg-gray-950/40 border border-gray-800/50 p-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-gray-500"></div>
            <h2 className="text-2xl font-bold text-green-300 tracking-wide">
              APPLYING FOR: [SPECIFY JOB NAME HERE]
            </h2>
          </div>
          
          <div className="border-l-2 border-gray-700 pl-6">
            <h4 className="text-lg font-medium text-gray-300 mb-3 tracking-wide">
              POSITION DESCRIPTION
            </h4>
            <div className="text-gray-400 leading-relaxed space-y-3">
              <p>[Job description content will appear here as specified below]</p>
              <p className="text-sm text-gray-500 italic">
                "Doom seeks only the most capable candidates for his domain"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-none p-20 min-h-[400px] transition-all duration-500 ${
          dragActive
            ? 'border-green-500 bg-green-950/10'
            : uploading
            ? 'border-green-600/50 bg-green-950/5'
            : 'border-gray-700 hover:border-gray-600 bg-gray-950/20'
        } ${uploading ? 'animate-pulse' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Upload State Indicator */}
        <div className="text-center space-y-8 flex flex-col justify-center min-h-[300px]">
          {uploading ? (
            <div className="space-y-6">
              <div className="w-24 h-2 bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0 mx-auto animate-pulse"></div>
              <p className="text-green-300 font-medium tracking-wide text-2xl">
                PROCESSING DOCUMENT
              </p>
              <p className="text-gray-400 text-lg">
                Doom's systems are analyzing your submission...
              </p>
            </div>
          ) : file ? (
            <div className="space-y-6">
              <div className="w-20 h-2 bg-gradient-to-r from-green-500 to-gray-500 mx-auto"></div>
              <p className="text-green-300 font-medium tracking-wide text-2xl">
                DOCUMENT READY
              </p>
              <p className="text-gray-300 font-mono text-lg bg-gray-900/50 px-6 py-4 inline-block">
                {file.name}
              </p>
              <p className="text-gray-500 text-base">
                Document uploaded and secured
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="w-16 h-2 bg-gradient-to-r from-gray-600 to-gray-400 mx-auto"></div>
              <div>
                <p className="text-gray-300 font-medium tracking-wide mb-4 text-3xl">
                  DROP DOCUMENT HERE
                </p>
                <p className="text-gray-500 text-lg mb-10">
                  or select from your device
                </p>
                
                {/* Custom File Input */}
                <label className="group cursor-pointer">
                  <div className="bg-gradient-to-r from-green-900/20 to-gray-900/20 hover:from-green-900/30 hover:to-gray-900/30 border border-green-800/40 hover:border-green-600/60 px-12 py-6 transition-all duration-300">
                    <span className="text-green-100 group-hover:text-green-50 font-medium tracking-wide text-xl">
                      SELECT RESUME
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="text-sm text-gray-500 space-y-2">
                <p>PDF FORMAT REQUIRED</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Doom Quote */}
        {!uploading && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-sm text-gray-600 italic font-light">
              "Your resume shall be judged by Doom's standards alone"
            </p>
          </div>
        )}
      </div>

      {/* Status Info */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${
            file ? 'bg-green-500 animate-pulse' : 'bg-gray-600'
          }`}></div>
          <span className="tracking-wide">
            {file ? 'DOCUMENT SECURED' : 'AWAITING SUBMISSION'}
          </span>
        </div>
        
        <div className="text-right">
          <p className="font-mono">DOOM PROTOCOLS ACTIVE</p>
        </div>
      </div>
    </div>
  );
}