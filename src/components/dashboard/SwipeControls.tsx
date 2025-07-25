"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Props = {
  applicationId: Id<"applications">;
  candidateId: string;
  interviewId?: Id<"interviews">;
  jobId: Id<"jobs">;
  candidateEmail: string;
  candidateName: string;
};

export default function SwipeControls({
  applicationId,
  candidateId,
  jobId,
  interviewId,
  candidateEmail,
  candidateName,
}: Props) {
  const router = useRouter();
  const updateStatus = useMutation(api.applications.updateApplicationStatus);
  const createInterview = useMutation(api.interviews.createInterview);
  const sendEmail = useMutation(api.email.sendEmail);

  const [swiped, setSwiped] = useState(false);

  const handleReject = async () => {
    try {
      await updateStatus({ applicationId, status: "rejected" });
      toast.success("Application declined");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleShortlist = async () => {
    try {
      await updateStatus({ applicationId, status: "shortlisted" });

      const interview = await createInterview({
        candidateId,
        title: `Executive Interview: ${candidateName}`,
        startTime: Date.now() + 3600 * 1000,
        status: "scheduled",
        streamCallId: "",
        interviewerIds: [],
      });

      await sendEmail({
        to: candidateEmail,
        subject: "Application Update - Next Steps",
        body: `Dear ${candidateName},\n\nThank you for your application. After careful review, we're pleased to invite you to the next stage of our selection process.\n\nYour interview will be scheduled shortly. We look forward to discussing your qualifications in detail.\n\nBest regards,\nDoom Industries Talent Team`,
        interviewId: interview,
      });

      toast.success("Candidate shortlisted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to shortlist candidate");
    }
  };

  const handleSwipe = async (dir: "left" | "right") => {
    setSwiped(true);
    if (dir === "left") await handleReject();
    else if (dir === "right") await handleShortlist();
  };

  return (
    <div className="w-full flex justify-center mt-8">
      <AnimatePresence>
        {!swiped && (
          <motion.div
            className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border border-slate-700/50 backdrop-blur-sm overflow-hidden"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            whileDrag={{ 
              scale: 1.02,
              rotate: 1,
              boxShadow: "0 25px 50px -12px rgba(6, 78, 59, 0.3)"
            }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) handleSwipe("right");
              else if (info.offset.x < -100) handleSwipe("left");
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ 
              opacity: 0, 
              y: -20,
              scale: 0.95
            }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 30
            }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-slate-600/20" />
            
            {/* Geometric accent lines */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-600/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-600/30 to-transparent" />
            
            {/* Company logo placeholder */}
            <div className="absolute top-6 right-6 w-8 h-8 bg-emerald-600/20 rounded-lg border border-emerald-500/30 flex items-center justify-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
            </div>

            <div className="relative z-10">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 text-white tracking-tight">
                  {candidateName}
                </h2>
                
                <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
                  <p className="text-slate-300 text-sm font-medium">{candidateEmail}</p>
                </div>
              </div>

              <div className="text-slate-400 text-sm bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
                <p className="font-medium text-slate-300 mb-2">Review Decision</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Swipe left to decline
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Swipe right to shortlist
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/30">
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                  Doom Industries
                </p>
              </div>
            </div>

            {/* Subtle animated border */}
            <div className="absolute inset-0 rounded-3xl border border-emerald-500/20 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}