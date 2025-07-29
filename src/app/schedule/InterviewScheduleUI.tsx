"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import toast from "react-hot-toast";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/profile/UserInfo";
import {
  Loader2Icon,
  XIcon,
  VideoIcon,
  ClockIcon,
  CheckIcon,
  XCircleIcon,
  MailIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/meeting/MeetingCard";

function InterviewScheduleUI() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [processingInterviews, setProcessingInterviews] = useState<
    Record<string, "pass" | "fail" | null>
  >({});

  const jobs =
    useQuery(
      api.jobs.getJobsByInterviewer,
      user?.id ? { interviewerId: user.id } : "skip"
    ) || [];

  const shortlisted =
    useQuery(
      api.applications.getApplicationsByJobIds,
      selectedJobId ? { jobIds: [selectedJobId as Id<"jobs">] } : "skip"
    ) || [];

  const users = useQuery(api.users.getAllUsers) || [];

  const interviews =
    useQuery(
      api.interviews.getAllInterviews,
      user?.id ? { clerkId: user.id } : "skip"
    ) || [];

  const createInterview = useMutation(api.interviews.createInterview);
  const updateInterviewStatus = useMutation(api.interviews.updateInterview);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    candidateId: "",
    interviewerIds: user?.id ? [user.id] : [],
  });

  // Debug state changes
  useEffect(() => {
    console.log(
      "🔍 Processing interviews state changed:",
      processingInterviews
    );
  }, [processingInterviews]);

  // Test email API on component mount
  useEffect(() => {
    const testEmailAPI = async () => {
      try {
        const response = await fetch("/api/send-email", {
          method: "OPTIONS",
        });
        console.log("📧 Email API endpoint status:", response.status);
      } catch (error) {
        console.error("❌ Email API endpoint not reachable:", error);
      }
    };
    testEmailAPI();
  }, []);

  const isTodaySelected =
    formData.date.toDateString() === new Date().toDateString();
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const isTimeDisabled = (slot: any) => {
    if (!isTodaySelected) return false;
    const [slotHour, slotMinute] = slot.split(":").map(Number);
    return (
      slotHour < currentHour ||
      (slotHour === currentHour && slotMinute <= currentMinute)
    );
  };

  const scheduleMeeting = async () => {
    if (!client || !user) return;
    const { title, description, date, time, candidateId, interviewerIds } =
      formData;

    if (!candidateId || !selectedJobId || interviewerIds.length === 0) {
      toast.error("Please fill all fields including job and candidate");
      return;
    }

    setIsCreating(true);
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const meetingDate = new Date(date);
      meetingDate.setHours(hours, minutes, 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);
      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: { description: title, additionalDetails: description },
        },
      });

      await createInterview({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        candidateId,
        interviewerIds,
      });

      toast.success("Meeting scheduled!");
      setOpen(false);
      setSelectedJobId("");
      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to schedule");
    } finally {
      setIsCreating(false);
    }
  };

  const joinInterview = async (interview: any) => {
    if (!client) {
      toast.error("Video client not initialized");
      return;
    }

    try {
      const call = client.call("default", interview.streamCallId);
      await call.join();
      window.location.href = `/meeting/${interview.streamCallId}`;
    } catch (error) {
      console.error("Failed to join interview:", error);
      toast.error("Failed to join interview");
    }
  };

  const handleInterviewResult = async (
    interview: any,
    result: "pass" | "fail"
  ) => {
    // Set processing state immediately with proper interview ID
    console.log(
      "🔄 Setting processing state for interview:",
      interview._id,
      "Result:",
      result
    );
    setProcessingInterviews((prev) => ({ ...prev, [interview._id]: result }));

    // Find candidate information
    const candidate = users.find((u) => u.clerkId === interview.candidateId);
    if (!candidate) {
      toast.error("Candidate not found in system");
      // Clear processing state on error
      setProcessingInterviews((prev) => ({ ...prev, [interview._id]: null }));
      return;
    }

    try {
      // Show immediate feedback
      toast.loading(
        result === "pass"
          ? `Processing PASS for ${candidate.name} and sending email...`
          : `Processing FAIL for ${candidate.name} and sending email...`,
        { duration: 3000 }
      );

      // Prepare comprehensive email content
      const emailSubject =
        result === "pass"
          ? `Congratulations ${candidate.name} - You've Advanced to the Next Stage!`
          : `Thank You for Your Time - ${candidate.name}`;

      const emailBody =
        result === "pass"
          ? `💀 SUBJECT: You’ve Been Summoned by Doom Industries 💀
      
      Dear ${candidate.name},
      
      🔥 HELL YES! 🔥
      
      You’ve SURVIVED the gauntlet and EMERGED VICTORIOUS in your interview with **DOOM INDUSTRIES**.
      
      Your resilience, technical firepower, and unshakable mindset have blown us away. You’ve proven yourself worthy to join our elite strike force of innovators, problem-solvers, and disruptors.
      
      🧨 THE WAR ROOM AWAITS:
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      ⚙️ Our HR Operatives will make contact within 24-48 hours  
      ⚙️ Expect discussions on paygrade, gear (benefits), and deployment (start date)  
      ⚙️ An OFFICIAL OFFER transmission is incoming  
      ⚙️ Background checks will commence (no demons allowed)  
      ⚙️ Welcome protocols and onboarding will be initiated
      
      📡 MISSION INTEL:
      A Command Officer (HR Rep) will connect via secure line (phone/email) to brief you on:
      • Compensation & perks package  
      • Deployment schedule  
      • Critical documents required  
      • Squad introduction & initiation sequence  
      
      This is more than a job. This is **DOOM INDUSTRIES** — a domain of the fearless, the restless, the relentless.
      
      WELCOME TO THE LEGION. 🔥
      
      — The Doom Industries Recruitment Unit  
      ⚔️ *Born for Chaos. Built for Excellence.*
      
      P.S. Keep your comms open. The call is coming. 👁️`
          : `💀 SUBJECT: Doom Industries Interview Update 💀
      
      Dear ${candidate.name},
      
      Thank you for entering the arena with us at **DOOM INDUSTRIES**.
      
      Though you fought valiantly, after evaluating every contender with precision and intensity, we have chosen to advance with warriors whose experience aligns more closely with the tactical requirements of this specific role.
      
      ⚠️ PLEASE KNOW:
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      • Your potential is respected — this is not a reflection of your overall worth  
      • We encourage re-entry in future operations that better match your profile  
      • Your data remains in our vault for future missions  
      • Your feedback performance was impressive in key areas
      
      We recognize and appreciate the time, energy, and passion you brought to the battlefield. Not everyone dares to step into the fire — but you did.
      
      May your journey ahead be filled with victories. And when the next call from Doom echoes… answer it.
      
      Until then...
      
      — The Doom Industries Recruitment Unit  
      ☠️ *Only the Relentless Rise.*`;

      console.log("🚀 Sending email to:", candidate.email);
      console.log("📧 Email subject:", emailSubject);
      console.log(
        "📝 Email body preview:",
        emailBody.substring(0, 200) + "..."
      );

      // Send email with enhanced payload
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: candidate.email,
          subject: emailSubject,
          body: emailBody,
          interviewId: interview._id,
          candidateName: candidate.name,
          candidateId: candidate.clerkId,
          result: result,
          timestamp: new Date().toISOString(),
          interviewTitle: interview.title || "Interview Session",
        }),
      });

      console.log("📬 Email response status:", emailResponse.status);

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("❌ Email API Error:", errorText);
        throw new Error(
          `Email sending failed: ${emailResponse.status} - ${errorText}`
        );
      }

      const emailResult = await emailResponse.json();
      console.log("✅ Email sent successfully:", emailResult);

      // Update interview status in database
      console.log(
        "🔄 Updating interview status to:",
        result === "pass" ? "passed" : "failed"
      );
      await updateInterviewStatus({
        interviewId: interview._id,
        status: result === "pass" ? "passed" : "failed",
      });

      // Show comprehensive success message
      const successMessage =
        result === "pass"
          ? `🎉 INTERVIEW PASSED! ✅ Congratulations email sent to ${candidate.name} (${candidate.email})`
          : `📧 INTERVIEW FAILED! ❌ Professional notification sent to ${candidate.name} (${candidate.email})`;

      toast.success(successMessage, {
        duration: 5000,
        style: {
          background: result === "pass" ? "#059669" : "#DC2626",
          color: "white",
          fontWeight: "bold",
          fontSize: "14px",
        },
      });

      console.log(
        `✅ Successfully processed ${result.toUpperCase()} for interview ${interview._id}`
      );
    } catch (error: any) {
      console.error(`❌ Failed to process interview ${result}:`, error);

      const errorMessage =
        result === "pass"
          ? `⚠️ Failed to send PASS email to ${candidate?.name || "candidate"}. Error: ${error.message}`
          : `⚠️ Failed to send FAIL email to ${candidate?.name || "candidate"}. Error: ${error.message}`;

      toast.error(errorMessage, {
        duration: 6000,
        style: {
          background: "#DC2626",
          color: "white",
          fontWeight: "bold",
        },
      });
    } finally {
      // Always clear processing state
      console.log("🧹 Clearing processing state for interview:", interview._id);
      setProcessingInterviews((prev) => ({ ...prev, [interview._id]: null }));
    }
  };

  const addInterviewer = (id: any) => {
    if (!formData.interviewerIds.includes(id)) {
      setFormData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, id],
      }));
    }
  };

  const removeInterviewer = (id: any) => {
    if (id === user?.id) return;
    setFormData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((i) => i !== id),
    }));
  };

  const selectedInterviewers = users.filter(
    (u) => u.clerkId && formData.interviewerIds.includes(u.clerkId)
  );
  const availableInterviewers = users.filter(
    (u) =>
      u.role === "interviewer" &&
      u.clerkId &&
      !formData.interviewerIds.includes(u.clerkId)
  );

  const shortlistedCandidates = shortlisted
    .map((c) => users.find((u) => u.clerkId === c.candidateId))
    .filter((u) => Boolean(u));

  const isInterviewJoinable = (interview: any) => {
    const interviewTime = new Date(interview.startTime);
    const now = new Date();
    const timeDiff = interviewTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    return minutesDiff <= 15 && minutesDiff >= -60;
  };

  const activeInterviews = interviews.filter(
    (i) => i.status && !["passed", "failed"].includes(i.status.toLowerCase())
  );

  const completedInterviews = interviews.filter(
    (i) => i.status && ["passed", "failed"].includes(i.status.toLowerCase())
  );

  const renderInterviewCard = (
    interview: any,
    index: any,
    showActions = true
  ) => {
    const candidate = users.find((u) => u.clerkId === interview.candidateId);
    const isProcessingPass = processingInterviews[interview._id] === "pass";
    const isProcessingFail = processingInterviews[interview._id] === "fail";
    const isAnyProcessing =
      processingInterviews[interview._id] !== null &&
      processingInterviews[interview._id] !== undefined;

    return (
      <div
        key={interview._id}
        className="group animate-fade-in-up"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-green-600/30 rounded-lg p-8 h-full min-h-[380px] hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-900/30 transition-all duration-500 hover:scale-[1.02] group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-800/10 via-transparent to-green-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/0 via-green-400/60 to-green-500/0 rounded-t-lg group-hover:via-green-300/80 transition-all duration-500"></div>

          <div className="relative z-10 h-full flex flex-col">
            {candidate && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-green-700/30">
                <img
                  src={candidate.image || "/default-avatar.png"}
                  alt={candidate.name}
                  className="w-12 h-12 rounded-full border-2 border-green-500/50"
                />
                <div>
                  <h4 className="text-green-300 font-black font-mono text-lg tracking-wide uppercase">
                    {candidate.name}
                  </h4>
                  <p className="text-green-400/70 font-mono text-sm">
                    {candidate.email}
                  </p>
                </div>
              </div>
            )}

            <div className="flex-1 mb-6">
              <MeetingCard interview={interview} />
            </div>

            <div
              className={`pt-6 border-t border-green-700/30 ${(interview.status && interview.status.toLowerCase() === "completed") || !showActions ? "" : "space-y-4"}`}
            >
              {showActions &&
                interview.status &&
                interview.status.toLowerCase() === "completed" && (
                  <div className="flex gap-4 justify-center mb-4">
                    {/* PASS BUTTON */}
                    <button
                      onClick={() => handleInterviewResult(interview, "pass")}
                      disabled={isAnyProcessing}
                      className={`
                      group/btn relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-lg font-mono transition-all duration-300 font-black tracking-widest transform hover:scale-110 active:scale-95 shadow-2xl
                      ${
                        isProcessingPass
                          ? "bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-300 text-white cursor-wait scale-105 shadow-green-500/60 processing-animation"
                          : isProcessingFail
                            ? "bg-gradient-to-r from-gray-600/50 to-gray-700/50 border-2 border-gray-500/50 text-gray-400 cursor-not-allowed opacity-60"
                            : "bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 border-2 border-green-400/70 hover:border-green-300 text-white hover:text-green-50 shadow-green-500/50 hover:shadow-green-400/70 cursor-pointer"
                      }
                    `}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="absolute inset-0 bg-green-400/10 animate-pulse"></div>

                      {isProcessingPass ? (
                        <>
                          <Loader2Icon className="w-5 h-5 animate-spin" />
                          <span className="relative z-10">
                            SENDING EMAIL...
                          </span>
                          <MailIcon className="w-4 h-4 animate-bounce" />
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-5 h-5 group-hover/btn:animate-bounce" />
                          <span className="relative z-10">PASS</span>
                          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                        </>
                      )}
                    </button>

                    {/* FAIL BUTTON */}
                    <button
                      onClick={() => handleInterviewResult(interview, "fail")}
                      disabled={isAnyProcessing}
                      className={`
                      group/btn relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-lg font-mono transition-all duration-300 font-black tracking-widest transform hover:scale-110 active:scale-95 shadow-2xl
                      ${
                        isProcessingFail
                          ? "bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-300 text-white cursor-wait scale-105 shadow-red-500/60 processing-animation"
                          : isProcessingPass
                            ? "bg-gradient-to-r from-gray-600/50 to-gray-700/50 border-2 border-gray-500/50 text-gray-400 cursor-not-allowed opacity-60"
                            : "bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500 border-2 border-red-400/70 hover:border-red-300 text-white hover:text-red-50 shadow-red-500/50 hover:shadow-red-400/70 cursor-pointer"
                      }
                    `}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="absolute inset-0 bg-red-400/10 animate-pulse"></div>

                      {isProcessingFail ? (
                        <>
                          <Loader2Icon className="w-5 h-5 animate-spin" />
                          <span className="relative z-10">
                            SENDING EMAIL...
                          </span>
                          <MailIcon className="w-4 h-4 animate-bounce" />
                        </>
                      ) : (
                        <>
                          <AlertCircleIcon className="w-5 h-5 group-hover/btn:animate-bounce" />
                          <span className="relative z-10">FAIL</span>
                          <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
                        </>
                      )}
                    </button>
                  </div>
                )}

              {showActions &&
                interview.status &&
                interview.status.toLowerCase() !== "completed" &&
                interview.status.toLowerCase() !== "passed" &&
                interview.status.toLowerCase() !== "failed" && (
                  <div className="flex justify-center">
                    {isInterviewJoinable(interview) ? (
                      <button
                        onClick={() => joinInterview(interview)}
                        className="flex items-center gap-3 bg-gradient-to-r from-green-600/80 to-green-700/80 border border-green-500/60 text-white px-6 py-3 rounded-lg font-mono hover:from-green-500/90 hover:to-green-600/90 hover:border-green-400/70 transition-all duration-300 shadow-lg hover:shadow-green-900/40 font-black tracking-widest hover:scale-105 active:scale-95"
                      >
                        <VideoIcon className="w-5 h-5" />
                        JOIN INTERVIEW
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 bg-slate-700/40 border border-slate-600/50 text-slate-400 px-6 py-3 rounded-lg font-mono font-black tracking-wider">
                        <ClockIcon className="w-5 h-5" />
                        {new Date(interview.startTime) > new Date()
                          ? "NOT YET AVAILABLE"
                          : "INTERVIEW ENDED"}
                      </div>
                    )}
                  </div>
                )}

              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full shadow-lg ${
                      interview.status &&
                      interview.status.toLowerCase() === "upcoming"
                        ? "bg-green-400 animate-pulse shadow-green-400/50"
                        : interview.status &&
                            interview.status.toLowerCase() === "completed"
                          ? "bg-blue-400 shadow-blue-400/50"
                          : interview.status &&
                              interview.status.toLowerCase() === "passed"
                            ? "bg-green-500 shadow-green-500/50"
                            : interview.status &&
                                interview.status.toLowerCase() === "failed"
                              ? "bg-red-500 shadow-red-500/50"
                              : interview.status &&
                                  interview.status.toLowerCase() === "cancelled"
                                ? "bg-red-400 shadow-red-400/50"
                                : interview.status &&
                                    (interview.status.toLowerCase() ===
                                      "in-progress" ||
                                      interview.status.toLowerCase() ===
                                        "ongoing")
                                  ? "bg-yellow-400 animate-pulse shadow-yellow-400/50"
                                  : "bg-slate-400 shadow-slate-400/50"
                    }`}
                  ></div>
                  <span
                    className={`text-sm font-black font-mono tracking-widest uppercase ${
                      interview.status &&
                      interview.status.toLowerCase() === "upcoming"
                        ? "text-green-300"
                        : interview.status &&
                            interview.status.toLowerCase() === "completed"
                          ? "text-blue-300"
                          : interview.status &&
                              interview.status.toLowerCase() === "passed"
                            ? "text-green-400"
                            : interview.status &&
                                interview.status.toLowerCase() === "failed"
                              ? "text-red-400"
                              : interview.status &&
                                  interview.status.toLowerCase() === "cancelled"
                                ? "text-red-300"
                                : interview.status &&
                                    (interview.status.toLowerCase() ===
                                      "in-progress" ||
                                      interview.status.toLowerCase() ===
                                        "ongoing")
                                  ? "text-yellow-300"
                                  : "text-slate-300"
                    }`}
                  >
                    {interview.status || "PENDING"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-green-500/0 via-green-400/40 to-green-500/0 rounded-r-full group-hover:via-green-300/60 transition-all duration-500"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/40 to-slate-900 font-mono">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-green-900/20"></div>
        <div className="relative max-w-6xl mx-auto px-8 pt-20 pb-16">
          <div className="flex items-center justify-between">
            <div className="space-y-6">
              <h1 className="text-7xl font-black font-mono tracking-wider text-transparent bg-gradient-to-br from-green-400 to-white bg-clip-text drop-shadow-2xl">
                DOMINION
              </h1>
              <p className="text-2xl font-mono font-medium text-green-300 tracking-wide max-w-2xl leading-relaxed">
                COMMAND ABSOLUTE AUTHORITY OVER YOUR RECRUITMENT PROCESS
              </p>
            </div>

            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button className="bg-slate-800/60 backdrop-blur-xl border border-green-700/50 text-green-200 px-12 py-4 rounded-lg text-lg font-black font-mono tracking-widest hover:bg-green-800/30 hover:border-green-600/70 transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-green-900/40">
                    SCHEDULE INTERVIEW
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-slate-900/95 to-green-900/20 border border-green-700/50 backdrop-blur-sm shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-green-300 text-2xl font-black font-mono tracking-wider">
                      NEW INTERVIEW SESSION
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4 text-green-100 font-mono">
                    <div>
                      <label className="text-sm font-black font-mono text-green-400 tracking-widest">
                        TITLE
                      </label>
                      <Input
                        className="bg-slate-800/60 border-green-700/40 text-green-100 font-mono focus:border-green-600/60 focus:ring-green-600/20 mt-2 placeholder:text-green-400/50"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="INTERVIEW SESSION TITLE"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-black font-mono text-green-400 tracking-widest">
                        DESCRIPTION
                      </label>
                      <Textarea
                        className="bg-slate-800/60 border-green-700/40 text-green-100 font-mono focus:border-green-600/60 focus:ring-green-600/20 mt-2 placeholder:text-green-400/50 min-h-[80px]"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="SESSION DETAILS AND OBJECTIVES"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-black font-mono text-green-400 tracking-widest">
                        POSITION
                      </label>
                      <Select
                        value={selectedJobId}
                        onValueChange={setSelectedJobId}
                      >
                        <SelectTrigger className="bg-slate-800/60 border-green-700/40 text-green-100 font-mono mt-2 focus:border-green-600/60 focus:ring-green-600/20">
                          <SelectValue placeholder="SELECT POSITION" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900/95 border-green-700/50 backdrop-blur-sm font-mono">
                          {jobs.map((job) => (
                            <SelectItem
                              key={job._id}
                              value={job._id}
                              className="text-green-100 focus:bg-green-800/40 focus:text-green-50 font-mono"
                            >
                              {job.title.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-black font-mono text-green-400 tracking-widest">
                        CANDIDATE
                      </label>
                      <Select
                        value={formData.candidateId}
                        onValueChange={(val) =>
                          setFormData({ ...formData, candidateId: val })
                        }
                      >
                        <SelectTrigger className="bg-slate-800/60 border-green-700/40 text-green-100 font-mono mt-2 focus:border-green-600/60 focus:ring-green-600/20">
                          <SelectValue placeholder="SELECT CANDIDATE" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900/95 border-green-700/50 backdrop-blur-sm font-mono">
                          {shortlistedCandidates.map((candidate) => (
                            <SelectItem
                              key={candidate?.clerkId}
                              value={candidate?.clerkId!}
                              className="text-green-100 focus:bg-green-800/40 focus:text-green-50 font-mono"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    candidate?.image || "/default-avatar.png"
                                  }
                                  alt={candidate?.name}
                                  className="w-7 h-7 rounded-full border border-green-700/50"
                                />
                                <span className="font-black">
                                  {candidate?.name &&
                                    candidate?.name.toUpperCase()}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-6">
                      <div>
                        <label className="text-sm font-black font-mono text-green-400 tracking-widest">
                          DATE
                        </label>
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) =>
                            date && setFormData({ ...formData, date })
                          }
                          disabled={(date) => date < new Date()}
                          className="bg-slate-800/40 border border-green-700/50 rounded-lg mt-2 font-mono text-green-100"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm font-black font-mono text-green-400 tracking-widest">
                          TIME
                        </label>
                        <Select
                          value={formData.time}
                          onValueChange={(time) =>
                            setFormData({ ...formData, time })
                          }
                        >
                          <SelectTrigger className="bg-slate-800/60 border-green-700/40 text-green-100 font-mono mt-2 focus:border-green-600/60 focus:ring-green-600/20">
                            <SelectValue placeholder="SELECT TIME" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900/95 border-green-700/50 backdrop-blur-sm max-h-[250px] overflow-y-auto font-mono">
                            {TIME_SLOTS &&
                              TIME_SLOTS.map((time) => (
                                <SelectItem
                                  key={time}
                                  value={time}
                                  disabled={isTimeDisabled(time)}
                                  className={`text-green-100 focus:bg-green-800/40 focus:text-green-50 font-mono ${isTimeDisabled(time) ? "opacity-40 cursor-not-allowed" : ""}`}
                                >
                                  {time}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-black font-mono text-green-400 tracking-widest">
                        INTERVIEW PANEL
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3 mt-2">
                        {selectedInterviewers.map((interviewer) => (
                          <div
                            key={interviewer.clerkId}
                            className="flex items-center gap-2 bg-green-800/30 border border-green-700/40 px-3 py-2 rounded-lg"
                          >
                            <UserInfo user={interviewer} />
                            {interviewer.clerkId !== user?.id && (
                              <button
                                onClick={() =>
                                  removeInterviewer(interviewer.clerkId)
                                }
                                className="hover:bg-green-700/30 p-1 rounded transition-colors"
                              >
                                <XIcon className="h-4 w-4 text-green-400 hover:text-green-300" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <Select onValueChange={addInterviewer}>
                        <SelectTrigger className="bg-slate-800/60 border-green-700/40 text-green-100 font-mono focus:border-green-600/60 focus:ring-green-600/20">
                          <SelectValue placeholder="ADD PANEL MEMBER" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900/95 border-green-700/50 backdrop-blur-sm font-mono">
                          {availableInterviewers.map((interviewer) => (
                            <SelectItem
                              key={interviewer.clerkId}
                              value={interviewer.clerkId}
                              className="text-green-100 focus:bg-green-800/40 focus:text-green-50 font-mono"
                            >
                              <UserInfo user={interviewer} />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end border-t border-green-700/30 pt-6">
                      <button
                        onClick={scheduleMeeting}
                        disabled={isCreating}
                        className="relative group overflow-hidden bg-gradient-to-r from-green-700/80 to-green-800/80 border border-green-600/60 text-green-100 px-8 py-3 rounded-lg font-mono hover:from-green-600/90 hover:to-green-700/90 hover:border-green-500/70 transition-all duration-300 shadow-lg hover:shadow-green-900/40 font-black tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCreating ? (
                          <span className="flex items-center gap-2">
                            <Loader2Icon className="w-5 h-5 animate-spin" />
                            PROCESSING...
                          </span>
                        ) : (
                          <>
                            <span className="relative z-10">
                              SCHEDULE INTERVIEW
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 via-green-600/20 to-green-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 pb-20">
        {activeInterviews.length > 0 && (
          <div className="space-y-8 mb-16">
            <h2 className="text-4xl font-black font-mono mb-16 tracking-widest text-transparent bg-gradient-to-r from-green-400 to-white bg-clip-text">
              ACTIVE DOMINION SESSIONS
            </h2>

            <div className="grid gap-8 lg:grid-cols-2">
              {activeInterviews.map((interview, index) =>
                renderInterviewCard(interview, index, true)
              )}
            </div>
          </div>
        )}

        {completedInterviews.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-4xl font-black font-mono mb-16 tracking-widest text-transparent bg-gradient-to-r from-green-400 to-white bg-clip-text">
              COMPLETED DOMINION SESSIONS
            </h2>

            <div className="grid gap-8 lg:grid-cols-2">
              {completedInterviews.map((interview, index) =>
                renderInterviewCard(interview, index, false)
              )}
            </div>
          </div>
        )}

        {activeInterviews.length === 0 && completedInterviews.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-green-600/30 rounded-lg p-12 mx-auto max-w-2xl">
              <div className="space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-full flex items-center justify-center border border-green-600/30">
                  <VideoIcon className="w-12 h-12 text-green-400" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-black font-mono tracking-wider text-green-300">
                    NO INTERVIEWS SCHEDULED
                  </h3>
                  <p className="text-green-400/70 font-mono text-lg leading-relaxed">
                    Begin your dominion over the recruitment process by
                    scheduling your first interview session.
                  </p>
                </div>

                <button
                  onClick={() => setOpen(true)}
                  className="bg-gradient-to-r from-green-700/80 to-green-800/80 border border-green-600/60 text-green-100 px-8 py-4 rounded-lg font-mono hover:from-green-600/90 hover:to-green-700/90 hover:border-green-500/70 transition-all duration-300 shadow-lg hover:shadow-green-900/40 font-black tracking-widest hover:scale-105 active:scale-95"
                >
                  INITIATE FIRST SESSION
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes intense-pulse {
          0%,
          100% {
            box-shadow: 0 0 20px currentColor;
          }
          50% {
            box-shadow:
              0 0 40px currentColor,
              0 0 60px currentColor;
          }
        }

        .intense-glow {
          animation: intense-pulse 2s ease-in-out infinite;
        }

        @keyframes button-processing {
          0% {
            transform: scale(1);
            box-shadow: 0 0 20px currentColor;
          }
          50% {
            transform: scale(1.05);
            box-shadow:
              0 0 40px currentColor,
              0 0 60px currentColor;
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 20px currentColor;
          }
        }

        .processing-animation {
          animation: button-processing 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default InterviewScheduleUI;
