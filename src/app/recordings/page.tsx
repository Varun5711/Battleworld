"use client";

import LoaderUI from "@/components/shared/LoaderUI";
import RecordingCard from "@/components/interview/RecordingCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetCalls from "@/hooks/useGetCalls";
import { CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

function RecordingsPage() {
  const { calls , isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  useEffect(() => {
    console.log("Fetched calls:", calls);
    fetchRecordings();
  }, [calls]);

  const fetchRecordings = async () => {
    if (!calls || calls.length === 0) {
      console.warn("No calls available.");
      return;
    }

    try {
      const callDataPromises = calls.map(async (call) => {
        try {
          if (typeof call.queryRecordings !== "function") {
            console.warn(`Call ${call.id || "unknown"} missing queryRecordings`);
            return { recordings: [] };
          }

          const result = await call.queryRecordings();
          return result;
        } catch (error) {
          console.error(`Error fetching recordings for call ${call.id || "unknown"}:`, error);
          return { recordings: [] };
        }
      });

      const callData = await Promise.all(callDataPromises);
      const allRecordings = callData.flatMap((call) => call.recordings || []);

      setRecordings(allRecordings);
    } catch (error) {
      console.error("Unexpected error in fetchRecordings:", error);
    }

    if (isLoading) return <LoaderUI />;    
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950/20 to-slate-950 font-mono">
      {/* Subtle background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-600/1 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto p-6">
        {/* HEADER SECTION */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-green-400 via-green-300 to-green-600 bg-clip-text font-mono tracking-tight leading-none uppercase">
            RECORDINGS
          </h1>
          <p className="text-green-200/70 font-mono text-lg tracking-wide">
            {recordings.length} {recordings.length === 1 ? "recording" : "recordings"} available
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
        </div>

        {/* RECORDINGS GRID */}
        <ScrollArea className="h-[calc(100vh-12rem)] mt-3">
          {recordings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
              {recordings.map((r) => (
                <RecordingCard key={r.end_time} recording={r} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
              <div className="text-center space-y-3">
                <h3 className="text-xl font-black font-mono text-slate-400 uppercase tracking-wide">
                  NO_RECORDINGS_AVAILABLE
                </h3>
                <p className="text-lg font-mono text-slate-500">
                  Start an interview to create recordings
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

export default RecordingsPage;