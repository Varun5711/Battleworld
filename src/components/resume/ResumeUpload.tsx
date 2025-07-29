"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Id } from "../../../convex/_generated/dataModel";
import { Upload, FileText, X, Eye } from "lucide-react";

interface Props {
  applicationId?: Id<"applications">;
  onUpload?: (fileId: string) => void;
}

export default function ResumeUpload({ applicationId, onUpload }: Props) {
  const generateUploadUrl = useMutation(api.resume.generateUploadUrl);
  const saveResume = useMutation(api.resume.updateApplicationResume);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setFile(selectedFile);
    
    // Create preview URL
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    // Auto-upload the file immediately
    setUploading(true);

    try {
      const uploadUrl = await generateUploadUrl();

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!res.ok) {
        throw new Error("Failed to upload file.");
      }

      const data = await res.json();
      const fileId = data.storageId;
      
      setUploadedFileId(fileId);

      // If applicationId is provided, save it immediately
      if (applicationId) {
        await saveResume({ applicationId, fileId });
      }

      toast.success("Resume uploaded successfully!");
      onUpload?.(fileId);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
      // Reset file state on error
      setFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setUploading(false);
    }
  }, [generateUploadUrl, saveResume, applicationId, onUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const removeFile = () => {
    setFile(null);
    setUploadedFileId(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-none p-20 min-h-[400px] transition-all duration-500 ${
          isDragOver
            ? 'border-green-500 bg-green-950/10'
            : uploading
            ? 'border-green-600/50 bg-green-950/5'
            : 'border-gray-700 hover:border-gray-600 bg-gray-950/20'
        } ${uploading ? 'animate-pulse' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

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
          ) : file && uploadedFileId ? (
            <div className="space-y-6">
              <div className="w-20 h-2 bg-gradient-to-r from-green-500 to-gray-500 mx-auto"></div>
              <p className="text-green-300 font-medium tracking-wide text-2xl">
                DOCUMENT SECURED
              </p>
              <p className="text-gray-300 font-mono text-lg bg-gray-900/50 px-6 py-4 inline-block">
                {file.name}
              </p>
              <p className="text-gray-500 text-base">
                Document uploaded and secured • {formatFileSize(file.size)}
              </p>
              
              {/* Action Buttons for when file is uploaded */}
              <div className="flex gap-4 justify-center mt-8">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="bg-gradient-to-r from-gray-900/40 to-gray-900/20 hover:from-gray-900/60 hover:to-gray-900/40 border border-gray-700/60 hover:border-gray-600/80 px-8 py-4 transition-all duration-300 text-gray-200 hover:text-gray-100 font-medium tracking-wide"
                >
                  <Eye className="inline h-4 w-4 mr-2" />
                  {showPreview ? "HIDE PREVIEW" : "PREVIEW"}
                </button>
                
                <button
                  type="button"
                  onClick={removeFile}
                  className="bg-gradient-to-r from-red-900/20 to-gray-900/20 hover:from-red-900/30 hover:to-gray-900/30 border border-red-800/40 hover:border-red-600/60 px-6 py-4 transition-all duration-300 text-red-200 hover:text-red-100 font-medium tracking-wide"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
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
                    onChange={handleFileChange}
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
            uploadedFileId ? 'bg-green-500' : uploading ? 'bg-yellow-500 animate-pulse' : 'bg-gray-600'
          }`}></div>
          <span className="tracking-wide">
            {uploadedFileId ? 'DOCUMENT SECURED' : uploading ? 'PROCESSING...' : 'AWAITING SUBMISSION'}
          </span>
        </div>
        
        <div className="text-right">
          <p className="font-mono">DOOM PROTOCOLS ACTIVE</p>
        </div>
      </div>

      {/* PDF Preview */}
      {showPreview && previewUrl && (
        <div className="border border-gray-700 rounded-none overflow-hidden bg-gray-950/40">
          <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex items-center justify-between">
            <h3 className="font-medium text-gray-200 tracking-wide">
              RESUME PREVIEW
            </h3>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="h-8 w-8 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-6">
            <iframe
              src={previewUrl}
              className="w-full h-96 border border-gray-700 bg-gray-900"
              title="Resume Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}