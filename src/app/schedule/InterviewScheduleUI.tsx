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
import { Loader2Icon, XIcon } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-black text-white" 
         style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-20">
          <div>
            <h1 className="text-6xl font-thin text-white mb-4 tracking-tight">
              Authority
            </h1>
            <p className="text-xl text-gray-400 font-light">
              Command your interviews with precision.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-medium 
                               hover:bg-gray-100 transition-all duration-200 active:scale-95">
                New Interview
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px] bg-zinc-900 border-zinc-800 shadow-2xl">
              <DialogHeader className="pb-6">
                <DialogTitle className="text-white text-2xl font-light">
                  Schedule Interview
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 text-white">
                
                {/* Title */}
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-2">Title</label>
                  <Input className="bg-zinc-800 border-zinc-700 text-white h-12 text-base
                                 focus:border-white focus:ring-0 rounded-lg" 
                         value={formData.title} 
                         onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-2">Description</label>
                  <Textarea className="bg-zinc-800 border-zinc-700 text-white text-base min-h-[100px]
                                    focus:border-white focus:ring-0 rounded-lg resize-none" 
                            value={formData.description} 
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>

                {/* Position */}
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-2">Position</label>
                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-12 text-base
                                          focus:border-white focus:ring-0 rounded-lg">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {jobs.map((job) => (
                        <SelectItem key={job._id} value={job._id} 
                                  className="text-white focus:bg-zinc-700">
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Candidate */}
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-2">Candidate</label>
                  <Select value={formData.candidateId} onValueChange={(val) => setFormData({ ...formData, candidateId: val })}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-12 text-base
                                          focus:border-white focus:ring-0 rounded-lg">
                      <SelectValue placeholder="Select candidate" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {shortlistedCandidates.map((user) => (
                        <SelectItem key={user.clerkId!} value={user.clerkId!}
                                  className="text-white focus:bg-zinc-700">
                          <div className="flex items-center gap-3">
                            <img src={user?.image} alt={user?.name} 
                                 className="w-6 h-6 rounded-full" />
                            <span>{user?.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 font-medium block mb-2">Date</label>
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData({ ...formData, date })}
                      disabled={(date) => date < new Date()}
                      className="bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm
                               [&_.rdp-day_selected]:bg-white [&_.rdp-day_selected]:text-black
                               [&_.rdp-button]:text-white [&_.rdp-button:hover]:bg-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 font-medium block mb-2">Time</label>
                    <Select value={formData.time} onValueChange={(time) => setFormData({ ...formData, time })}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-12 text-base
                                            focus:border-white focus:ring-0 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 max-h-[200px]">
                        {TIME_SLOTS.map((time) => (
                          <SelectItem
                            key={time}
                            value={time}
                            disabled={isTimeDisabled(time)}
                            className={`text-white focus:bg-zinc-700 
                                      ${isTimeDisabled(time) ? "opacity-40" : ""}`}
                          >
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Interviewers */}
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-2">Panel</label>
                  
                  {selectedInterviewers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedInterviewers.map((i) => (
                        <div key={i.clerkId} className="flex items-center gap-2 bg-zinc-800 
                                                      px-3 py-2 rounded-full text-sm">
                          <UserInfo user={i} />
                          {i.clerkId !== user?.id && (
                            <button onClick={() => removeInterviewer(i.clerkId)}
                                  className="hover:bg-zinc-700 p-1 rounded-full">
                              <XIcon className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <Select onValueChange={addInterviewer}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-12 text-base
                                          focus:border-white focus:ring-0 rounded-lg">
                      <SelectValue placeholder="Add interviewer" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {availableInterviewers.map((i) => (
                        <SelectItem key={i.clerkId} value={i.clerkId}
                                  className="text-white focus:bg-zinc-700">
                          <UserInfo user={i} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-zinc-800">
                  <button
                    onClick={scheduleMeeting}
                    disabled={isCreating}
                    className="bg-white text-black px-8 py-3 rounded-full text-sm font-medium 
                             hover:bg-gray-100 transition-all duration-200 active:scale-95
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? (
                      <span className="flex items-center gap-2">
                        <Loader2Icon className="w-4 h-4 animate-spin" /> 
                        Scheduling
                      </span>
                    ) : (
                      "Schedule"
                    )}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Interview Cards */}
        {interviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <MeetingCard key={interview._id} interview={interview} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-2xl text-gray-500 font-light">
              No interviews scheduled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewScheduleUI;