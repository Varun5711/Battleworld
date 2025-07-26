"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "@/../convex/_generated/api";
import toast from "react-hot-toast";
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
import { Loader2Icon, XIcon, VideoIcon, ClockIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/meeting/MeetingCard";
import { Id } from "../../../convex/_generated/dataModel";

function InterviewScheduleUI() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");

  const jobs = useQuery(api.jobs.getJobsByInterviewer, { interviewerId: user?.id ?? "" }) ?? [];
  const shortlisted = useQuery(api.applications.getApplicationsByJobIds, selectedJobId ? { jobIds: [selectedJobId] as Id<"jobs">[] } : "skip") ?? [];
  const users = useQuery(api.users.getAllUsers) ?? [];
  const interviews = useQuery(api.interviews.getAllInterviews, { clerkId: user?.id ?? "" }) ?? [];

  const createInterview = useMutation(api.interviews.createInterview);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    candidateId: "",
    interviewerIds: user?.id ? [user.id] : [],
  });

  const isTodaySelected = formData.date.toDateString() === new Date().toDateString();
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const isTimeDisabled = (slot:any) => {
    if (!isTodaySelected) return false;
    const [slotHour, slotMinute] = slot.split(":").map(Number);
    return slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute);
  };

  const scheduleMeeting = async () => {
    if (!client || !user) return;
    const { title, description, date, time, candidateId, interviewerIds } = formData;

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
      setFormData({ title: "", description: "", date: new Date(), time: "09:00", candidateId: "", interviewerIds: user?.id ? [user.id] : [] });
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
      // Redirect to meeting room or handle join logic
      window.location.href = `/meeting/${interview.streamCallId}`;
    } catch (error) {
      console.error("Failed to join interview:", error);
      toast.error("Failed to join interview");
    }
  };

  const addInterviewer = (id:any) => {
    if (!formData.interviewerIds.includes(id)) {
      setFormData((prev) => ({ ...prev, interviewerIds: [...prev.interviewerIds, id] }));
    }
  };

  const removeInterviewer = (id:any) => {
    if (id === user?.id) return;
    setFormData((prev) => ({ ...prev, interviewerIds: prev.interviewerIds.filter((i) => i !== id) }));
  };

  const selectedInterviewers = users.filter((u) => formData.interviewerIds.includes(u.clerkId));
  const availableInterviewers = users.filter((u) => u.role === "interviewer" && !formData.interviewerIds.includes(u.clerkId));

  // Explicitly type as User[] to avoid undefined
  type User = typeof users[number];
  const shortlistedCandidates: User[] = shortlisted
    .map((c) => users.find((u) => u.clerkId === c.candidateId))
    .filter((u): u is User => Boolean(u)); // Type guard

  const isInterviewJoinable = (interview: any) => {
    const interviewTime = new Date(interview.startTime);
    const now = new Date();
    const timeDiff = interviewTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Allow joining 15 minutes before the scheduled time
    return minutesDiff <= 15 && minutesDiff >= -60; // Can join 15 min before and up to 1 hour after
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-gray-900 to-black">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-green-900/10"></div>
        <div className="relative max-w-6xl mx-auto px-8 pt-20 pb-16">
          <div className="flex items-center justify-between">
            <div className="space-y-6">
              <h1 className="text-7xl font-thin tracking-tight bg-gradient-to-br from-green-400 via-green-300 to-white bg-clip-text text-transparent drop-shadow-2xl" 
                  style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
                DOMINION
              </h1>
              <p className="text-2xl font-light text-gray-300 tracking-wide max-w-2xl leading-relaxed">
                Command absolute authority over your recruitment process with precision and unwavering control
              </p>
            </div>
            
            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button className="bg-white/5 backdrop-blur-xl border border-white/10 text-white 
                                   px-12 py-4 rounded-full text-lg font-medium tracking-wide
                                   hover:bg-white/10 hover:border-white/20 transition-all duration-500
                                   hover:scale-105 active:scale-95 shadow-2xl hover:shadow-green-900/20">
                    Schedule Interview
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-black/95 to-zinc-900/95 
                                       border border-emerald-800/50 backdrop-blur-sm shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-emerald-200 text-2xl font-bold tracking-wide">
                      New Interview Session
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4 text-emerald-100" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <div>
                      <label className="text-sm font-medium text-emerald-300 tracking-wide">Title</label>
                      <Input className="bg-emerald-950/30 border-emerald-800/40 text-emerald-100 
                                     focus:border-emerald-600/60 focus:ring-emerald-600/20 mt-2
                                     placeholder:text-emerald-400/50" 
                             value={formData.title} 
                             onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                             placeholder="Interview session title" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-emerald-300 tracking-wide">Description</label>
                      <Textarea className="bg-emerald-950/30 border-emerald-800/40 text-emerald-100 
                                        focus:border-emerald-600/60 focus:ring-emerald-600/20 mt-2
                                        placeholder:text-emerald-400/50 min-h-[80px]" 
                                value={formData.description} 
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                                placeholder="Session details and objectives" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-emerald-300 tracking-wide">Position</label>
                      <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                        <SelectTrigger className="bg-emerald-950/30 border-emerald-800/40 text-emerald-100 mt-2
                                              focus:border-emerald-600/60 focus:ring-emerald-600/20">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900/95 border-emerald-700/50 backdrop-blur-sm">
                          {jobs.map((job) => (
                            <SelectItem key={job._id} value={job._id} 
                                      className="text-emerald-100 focus:bg-emerald-900/40 focus:text-emerald-50">
                              {job.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-emerald-300 tracking-wide">Candidate</label>
                      <Select value={formData.candidateId} onValueChange={(val) => setFormData({ ...formData, candidateId: val })}>
                        <SelectTrigger className="bg-emerald-950/30 border-emerald-800/40 text-emerald-100 mt-2
                                              focus:border-emerald-600/60 focus:ring-emerald-600/20">
                          <SelectValue placeholder="Select candidate" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900/95 border-emerald-700/50 backdrop-blur-sm">
                          {shortlistedCandidates.map((user) => (
                            <SelectItem key={user.clerkId!} value={user.clerkId!}
                                      className="text-emerald-100 focus:bg-emerald-900/40 focus:text-emerald-50">
                              <div className="flex items-center gap-3">
                                <img src={user?.image} alt={user?.name} 
                                     className="w-7 h-7 rounded-full border border-emerald-700/50" />
                                <span className="font-medium">{user?.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-6">
                      <div>
                        <label className="text-sm font-medium text-emerald-300 tracking-wide">Date</label>
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => date && setFormData({ ...formData, date })}
                          disabled={(date) => date < new Date()}
                          className="bg-emerald-950/20 border border-emerald-800/50 rounded-lg mt-2
                                   text-emerald-100 [&_.rdp-day_selected]:bg-emerald-800/60 
                                   [&_.rdp-day_selected]:text-emerald-50"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-emerald-300 tracking-wide">Time</label>
                        <Select value={formData.time} onValueChange={(time) => setFormData({ ...formData, time })}>
                          <SelectTrigger className="bg-emerald-950/30 border-emerald-800/40 text-emerald-100 mt-2
                                                focus:border-emerald-600/60 focus:ring-emerald-600/20">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900/95 border-emerald-700/50 backdrop-blur-sm max-h-[250px] overflow-y-auto">
                            {TIME_SLOTS.map((time) => (
                              <SelectItem
                                key={time}
                                value={time}
                                disabled={isTimeDisabled(time)}
                                className={`text-emerald-100 focus:bg-emerald-900/40 focus:text-emerald-50 
                                          ${isTimeDisabled(time) ? "opacity-40 cursor-not-allowed" : ""}`}
                              >
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-emerald-300 tracking-wide">Interview Panel</label>
                      <div className="flex flex-wrap gap-2 mb-3 mt-2">
                        {selectedInterviewers.map((i) => (
                          <div key={i.clerkId} className="flex items-center gap-2 bg-emerald-800/20 border border-emerald-700/40 
                                                        px-3 py-2 rounded-lg">
                            <UserInfo user={i} />
                            {i.clerkId !== user?.id && (
                              <button onClick={() => removeInterviewer(i.clerkId)}
                                    className="hover:bg-emerald-700/30 p-1 rounded transition-colors">
                                <XIcon className="h-4 w-4 text-emerald-400 hover:text-emerald-300" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <Select onValueChange={addInterviewer}>
                        <SelectTrigger className="bg-emerald-950/30 border-emerald-800/40 text-emerald-100
                                              focus:border-emerald-600/60 focus:ring-emerald-600/20">
                          <SelectValue placeholder="Add panel member" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900/95 border-emerald-700/50 backdrop-blur-sm">
                          {availableInterviewers.map((i) => (
                            <SelectItem key={i.clerkId} value={i.clerkId}
                                      className="text-emerald-100 focus:bg-emerald-900/40 focus:text-emerald-50">
                              <UserInfo user={i} />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end border-t border-emerald-700/30 pt-6">
                      <button
                        onClick={scheduleMeeting}
                        disabled={isCreating}
                        className="relative group overflow-hidden bg-gradient-to-r from-emerald-800/80 to-teal-800/80 
                                 border border-emerald-600/60 text-emerald-100 px-8 py-3 rounded-lg 
                                 hover:from-emerald-700/90 hover:to-teal-700/90 hover:border-emerald-500/70
                                 transition-all duration-300 shadow-lg hover:shadow-emerald-900/40
                                 font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCreating ? (
                          <span className="flex items-center gap-2">
                            <Loader2Icon className="w-5 h-5 animate-spin" /> 
                            Processing...
                          </span>
                        ) : (
                          <>
                            <span className="relative z-10">Schedule Interview</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 via-emerald-600/20 to-emerald-600/0 
                                          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
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

      {/* Content Section */}
      <div className="max-w-[1400px] mx-auto px-8 pb-20">
        {interviews.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-4xl font-thin mb-16 tracking-wide bg-gradient-to-r from-green-400 via-green-300 to-white bg-clip-text text-transparent"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
              Active Dominion Sessions
            </h2>
            
            <div className="grid gap-8 lg:grid-cols-2">
              {interviews.map((interview, index) => {
                // Console log for debugging
                console.log(interview.status);
                
                return (
                  <div key={interview._id} className="group animate-fade-in-up"
                       style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="relative bg-gradient-to-br from-gray-900/80 via-zinc-900/90 to-black/95 
                                  backdrop-blur-xl border border-green-500/20 rounded-2xl p-8 h-full min-h-[380px]
                                  hover:border-green-400/40 hover:shadow-2xl hover:shadow-green-900/20 
                                  transition-all duration-500 hover:scale-[1.02] group overflow-hidden">
                      
                      {/* Animated background glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-green-700/5 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                      
                      {/* Top accent line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/0 via-green-400/60 to-green-500/0 
                                    rounded-t-2xl group-hover:via-green-300/80 transition-all duration-500"></div>
                      
                      {/* Content wrapper */}
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex-1 mb-6">
                          <MeetingCard interview={interview} />
                        </div>
                        
                        {/* Actions and Status Section */}
                        <div className={`pt-6 border-t border-green-800/20 ${interview.status?.toLowerCase() === "completed" ? "" : "space-y-4"}`}>
                          {/* Join Button */}
                          {interview.status?.toLowerCase() !== "completed" && (
                            <div className="flex justify-center">
                              {isInterviewJoinable(interview) ? (
                                <button
                                  onClick={() => joinInterview(interview)}
                                  className="flex items-center gap-3 bg-gradient-to-r from-green-600/80 to-emerald-600/80 
                                           border border-green-500/60 text-white px-6 py-3 rounded-lg 
                                           hover:from-green-500/90 hover:to-emerald-500/90 hover:border-green-400/70
                                           transition-all duration-300 shadow-lg hover:shadow-green-900/40
                                           font-semibold tracking-wide hover:scale-105 active:scale-95"
                                >
                                  <VideoIcon className="w-5 h-5" />
                                  Join Interview
                                </button>
                              ) : (
                                <div className="flex items-center gap-3 bg-gray-600/20 border border-gray-500/30 
                                             text-gray-400 px-6 py-3 rounded-lg font-medium tracking-wide">
                                  <ClockIcon className="w-5 h-5" />
                                  {new Date(interview.startTime) > new Date() ? "Not yet available" : "Interview ended"}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Status indicator */}
                          <div className="flex items-center justify-center">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full shadow-lg ${
                                interview.status?.toLowerCase() === 'upcoming' 
                                  ? 'bg-green-400 animate-pulse shadow-green-400/50' 
                                  : interview.status?.toLowerCase() === 'completed'
                                  ? 'bg-blue-400 shadow-blue-400/50'
                                  : interview.status?.toLowerCase() === 'cancelled'
                                  ? 'bg-red-400 shadow-red-400/50'
                                  : interview.status?.toLowerCase() === 'in-progress' || interview.status?.toLowerCase() === 'ongoing'
                                  ? 'bg-yellow-400 animate-pulse shadow-yellow-400/50'
                                  : 'bg-gray-400 shadow-gray-400/50'
                              }`}></div>
                              <span className={`text-sm font-medium tracking-wider uppercase ${
                                interview.status?.toLowerCase() === 'upcoming' 
                                  ? 'text-green-300' 
                                  : interview.status?.toLowerCase() === 'completed'
                                  ? 'text-blue-300'
                                  : interview.status?.toLowerCase() === 'cancelled'
                                  ? 'text-red-300'
                                  : interview.status?.toLowerCase() === 'in-progress' || interview.status?.toLowerCase() === 'ongoing'
                                  ? 'text-yellow-300'
                                  : 'text-gray-300'
                              }`}>
                                {interview.status || 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Side accent */}
                      <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-green-500/0 via-green-400/40 to-green-500/0 
                                    rounded-r-full group-hover:via-green-300/60 transition-all duration-500"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-32">
            <div className="space-y-6">
              <h3 className="text-4xl font-thin tracking-wide bg-gradient-to-r from-green-400 via-green-300 to-white bg-clip-text text-transparent"
                  style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
                Your Dominion Awaits
              </h3>
              <p className="text-xl text-gray-400 font-light max-w-md leading-relaxed">
                No interviews have been scheduled. Begin asserting your authority over the selection process.
              </p>
              <div className="pt-8">
                <div className="w-32 h-px bg-gradient-to-r from-green-800/50 via-green-600/50 to-transparent"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewScheduleUI;