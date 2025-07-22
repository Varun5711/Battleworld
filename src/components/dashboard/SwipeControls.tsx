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
      toast.success("❌ Candidate rejected");
    } catch {
      toast.error("Error rejecting");
    }
  };

  const handleShortlist = async () => {
    try {
      await updateStatus({ applicationId, status: "shortlisted" });

      const interview = await createInterview({
        candidateId,
        title: `Interview: ${candidateName}`,
        startTime: Date.now() + 3600 * 1000,
        status: "scheduled",
        streamCallId: "",
        interviewerIds: [],
      });

      await sendEmail({
        to: candidateEmail,
        subject: "You've been shortlisted!",
        body: `Hello ${candidateName},\n\nYou've been shortlisted by Doom. An interview will be scheduled soon. 🦾\n\n– Multiverse HQ`,
        interviewId: interview,
      });

      toast.success("✅ Shortlisted & Email Sent");
      router.refresh();
    } catch {
      toast.error("Failed to shortlist");
    }
  };

  const handleSwipe = async (dir: "left" | "right") => {
    setSwiped(true);
    if (dir === "left") await handleReject();
    else if (dir === "right") await handleShortlist();
  };

  return (
    <div className="w-full flex justify-center mt-6">
      <AnimatePresence>
        {!swiped && (
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) handleSwipe("right");
              else if (info.offset.x < -100) handleSwipe("left");
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-2">{candidateName}</h2>
            <p className="text-gray-500 mb-4">{candidateEmail}</p>
            <p className="text-sm text-gray-400">Swipe ➡️ to shortlist or ⬅️ to reject</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}