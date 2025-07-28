"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import MeetingCard from "@/components/meeting/MeetingCard";
import { useEffect, ReactNode, FC } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { Calendar, Clock, Users, MapPin } from "lucide-react";

// Type definitions based on your Convex schema
interface Interview {
  _id: Id<"interviews">;
  _creationTime: number;
  description?: string;
  endTime?: number;
  meetingLink?: string;
  title: string;
  status: string;
  candidateId: string;
  startTime: number;
  streamCallId: string;
  interviewerIds: string[];
}

interface InterviewCardProps {
  children: ReactNode;
  interview: Interview;
  index: number;
  isInterviewer: boolean;
}

interface CardSlotProps {
  children: ReactNode;
}

interface StatusIndicatorProps {
  status: string;
  isInterviewer: boolean;
}

interface StatusStyles {
  dot: string;
  text: string;
  bg: string;
}

// Interview Card Slot Component
const InterviewCard: FC<InterviewCardProps> = ({ children, interview, index, isInterviewer }) => {
  const themeColors = isInterviewer ? {
    gradient: "from-slate-800/60 via-green-900/40 to-emerald-900/60",
    border: "border-green-400/20 hover:border-green-400/40",
    shadow: "hover:shadow-green-900/25",
    accent: "from-green-500/8 via-transparent to-emerald-500/8",
    topAccent: "via-green-400/60 group-hover:via-green-300/80",
    sideAccent: "via-green-400/30 group-hover:via-green-300/50"
  } : {
    gradient: "from-slate-800/60 via-blue-900/40 to-indigo-900/60",
    border: "border-blue-400/20 hover:border-blue-400/40",
    shadow: "hover:shadow-blue-900/25",
    accent: "from-blue-500/8 via-transparent to-indigo-500/8",
    topAccent: "via-blue-400/60 group-hover:via-blue-300/80",
    sideAccent: "via-blue-400/30 group-hover:via-blue-300/50"
  };

  return (
    <div className="group animate-fade-in-up"
         style={{ animationDelay: `${index * 100}ms` }}>
      <div className={`relative bg-gradient-to-br ${themeColors.gradient}
                    backdrop-blur-xl ${themeColors.border} rounded-2xl p-8 h-full min-h-[420px]
                    hover:shadow-2xl ${themeColors.shadow}
                    transition-all duration-500 hover:scale-[1.02] group overflow-hidden
                    shadow-xl shadow-slate-900/50 border-2`}>
        
        {/* Animated background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${themeColors.accent}
                      opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`}></div>
        
        {/* Top accent line */}
        <div className={`absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent ${themeColors.topAccent} to-transparent 
                      transition-all duration-500 rounded-b-full`}></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 h-full flex flex-col">
          {children}
        </div>
        
        {/* Side accent */}
        <div className={`absolute left-0 top-12 bottom-12 w-1 bg-gradient-to-b from-transparent ${themeColors.sideAccent} to-transparent 
                      rounded-r-full transition-all duration-500`}></div>
        
        {/* Corner decoration */}
        <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${themeColors.accent} rounded-xl 
                      border ${themeColors.border} flex items-center justify-center
                      opacity-30 group-hover:opacity-60 transition-all duration-500`}>
          <div className="w-6 h-6 bg-current opacity-20 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

// Card Content Slot
const CardContent: FC<CardSlotProps> = ({ children }) => (
  <div className="flex-1 mb-8">
    {children}
  </div>
);

// Card Footer Slot
const CardFooter: FC<CardSlotProps> = ({ children }) => (
  <div className="pt-6 border-t border-gray-700/30">
    {children}
  </div>
);

// Enhanced Status Indicator Component
const StatusIndicator: FC<StatusIndicatorProps> = ({ status, isInterviewer }) => {
  const getStatusStyles = (status: string, isInterviewer: boolean): StatusStyles => {
    const baseColor = isInterviewer ? 'green' : 'blue';
    
    switch (status.toLowerCase()) {
      case 'upcoming':
        return { 
          dot: `bg-${baseColor}-400 shadow-${baseColor}-400/50`, 
          text: `text-${baseColor}-200`, 
          bg: `bg-${baseColor}-900/20 border-${baseColor}-500/30`
        };
      case 'completed':
        return { 
          dot: 'bg-emerald-400 shadow-emerald-400/50', 
          text: 'text-emerald-200',
          bg: 'bg-emerald-900/20 border-emerald-500/30'
        };
      case 'cancelled':
        return { 
          dot: 'bg-red-400 shadow-red-400/50', 
          text: 'text-red-200',
          bg: 'bg-red-900/20 border-red-500/30'
        };
      case 'in-progress':
      case 'ongoing':
        return { 
          dot: 'bg-amber-400 shadow-amber-400/50', 
          text: 'text-amber-200',
          bg: 'bg-amber-900/20 border-amber-500/30'
        };
      default:
        return { 
          dot: 'bg-slate-400 shadow-slate-400/50', 
          text: 'text-slate-200',
          bg: 'bg-slate-900/20 border-slate-500/30'
        };
    }
  };

  const styles: StatusStyles = getStatusStyles(status, isInterviewer);

  return (
    <div className="flex items-center justify-between">
      <div className={`flex items-center gap-4 px-4 py-2 rounded-full ${styles.bg} border backdrop-blur-sm`}>
        <div className={`w-3 h-3 rounded-full shadow-sm ${styles.dot} animate-pulse`}></div>
        <span className={`text-sm font-black font-mono tracking-wider ${styles.text} condensed uppercase`}>
          {status || 'PENDING'}
        </span>
      </div>
      
      {/* Enhanced metadata icons */}
      <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-1 text-gray-400">
          <Calendar size={14} />
          <span className="text-xs font-mono">SCHED</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Users size={14} />
          <span className="text-xs font-mono">LIVE</span>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function CandidateInterviewUI() {
  const { user } = useUser();
  const { isInterviewer, isLoading: roleLoading } = useUserRole();
  const candidateId: string | undefined = user?.id;

  const interviews: Interview[] | undefined = useQuery(
    api.interviews.getInterviewsByCandidate,
    candidateId ? { candidateId } : "skip"
  );

  useEffect(() => {
    console.log("USER ID:", candidateId);
    console.log("INTERVIEWS:", interviews);
    console.log("IS INTERVIEWER:", isInterviewer);
  }, [candidateId, interviews, isInterviewer]);

  if (!candidateId || interviews === undefined || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className={`w-20 h-20 border-4 border-t-current rounded-full animate-spin mx-auto ${
            isInterviewer ? 'border-green-400/30 text-green-400' : 'border-blue-400/30 text-blue-400'
          }`}></div>
          <div className="space-y-4">
            <h2 className={`text-2xl font-black font-mono tracking-tight condensed bg-gradient-to-r bg-clip-text text-transparent ${
              isInterviewer ? 'from-green-400 to-gray-300' : 'from-blue-400 to-gray-300'
            }`}>
              {isInterviewer ? 'DOOM LOADING...' : 'HERO LOADING...'}
            </h2>
            <p className="text-lg text-gray-300 font-mono tracking-wide">
              ACCESSING INTERVIEW DATA
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (interviews && interviews.length === 0) {
    const themeColors = isInterviewer ? {
      gradient: 'from-green-200 via-green-300 to-emerald-200',
      accent: 'from-green-500/5 via-transparent to-green-500/5',
      cardGradient: 'from-green-500/20 to-emerald-600/30',
      border: 'border-green-400/20',
      innerCard: 'from-green-400/30 to-emerald-500/30',
      innerBorder: 'border-green-300/20',
      textGradient: 'from-green-300 to-emerald-300',
      lineGradient: 'from-green-500/60 via-emerald-400/80 to-green-500/60',
      dotColors: ['bg-green-400/20', 'bg-emerald-400/20']
    } : {
      gradient: 'from-blue-200 via-blue-300 to-indigo-200',
      accent: 'from-blue-500/5 via-transparent to-blue-500/5',
      cardGradient: 'from-blue-500/20 to-indigo-600/30',
      border: 'border-blue-400/20',
      innerCard: 'from-blue-400/30 to-indigo-500/30',
      innerBorder: 'border-blue-300/20',
      textGradient: 'from-blue-300 to-indigo-300',
      lineGradient: 'from-blue-500/60 via-indigo-400/80 to-blue-500/60',
      dotColors: ['bg-blue-400/20', 'bg-indigo-400/20']
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${themeColors.accent}`}></div>
          <div className="relative max-w-7xl mx-auto px-12 pt-32 pb-24">
            <div className="text-center space-y-10">
              <h1 className={`text-7xl font-black font-mono tracking-tight condensed bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}>
                {isInterviewer ? 'DOOM COMMAND CENTER' : 'HERO MISSION CONTROL'}
              </h1>
              <p className="text-xl text-gray-300 font-mono tracking-wide max-w-4xl mx-auto leading-relaxed condensed">
                {isInterviewer 
                  ? 'MONITOR AND CONTROL ALL INTERVIEW OPERATIONS FROM THIS CENTRAL COMMAND HUB'
                  : 'YOUR HEROIC JOURNEY AWAITS - TRACK AND PREPARE FOR UPCOMING CHALLENGES'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-6xl mx-auto px-12 pb-24">
          <div className="text-center py-32">
            <div className="space-y-16">
              <div className="relative">
                <div className={`w-40 h-40 bg-gradient-to-br ${themeColors.cardGradient} rounded-3xl 
                              flex items-center justify-center mx-auto border-2 ${themeColors.border} backdrop-blur-sm
                              shadow-2xl shadow-black/40`}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${themeColors.innerCard} rounded-2xl
                                border-2 ${themeColors.innerBorder}`}></div>
                </div>
                <div className={`absolute -top-3 -right-3 w-8 h-8 ${themeColors.dotColors[0]} rounded-full animate-pulse`}></div>
                <div className={`absolute -bottom-3 -left-3 w-6 h-6 ${themeColors.dotColors[1]} rounded-full animate-pulse delay-700`}></div>
              </div>
              
              <div className="space-y-8">
                <h2 className={`text-5xl font-black font-mono tracking-tight condensed bg-gradient-to-r ${themeColors.textGradient} bg-clip-text text-transparent`}>
                  {isInterviewer ? 'NO ACTIVE MISSIONS' : 'NO QUESTS AVAILABLE'}
                </h2>
                <p className="text-xl text-gray-400 font-mono tracking-wide max-w-2xl mx-auto leading-relaxed condensed">
                  {isInterviewer 
                    ? 'THE COMMAND CENTER IS QUIET. NEW INTERVIEW OPERATIONS WILL APPEAR HERE.'
                    : 'YOUR QUEST LOG IS EMPTY. NEW HEROIC CHALLENGES WILL BE ASSIGNED SOON.'
                  }
                </p>
              </div>
              
              <div className="pt-12">
                <div className={`w-32 h-1 bg-gradient-to-r ${themeColors.lineGradient} mx-auto rounded-full`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const themeColors = isInterviewer ? {
    gradient: 'from-green-200 via-green-300 to-emerald-200',
    accent: 'from-green-500/5 via-transparent to-green-500/5',
    textColor: 'text-green-100',
    lineGradient: 'from-green-500/40 to-transparent',
    badgeBg: 'bg-green-900/30',
    badgeBorder: 'border-green-500/20',
    badgeText: 'text-green-300/80'
  } : {
    gradient: 'from-blue-200 via-blue-300 to-indigo-200',
    accent: 'from-blue-500/5 via-transparent to-blue-500/5',
    textColor: 'text-blue-100',
    lineGradient: 'from-blue-500/40 to-transparent',
    badgeBg: 'bg-blue-900/30',
    badgeBorder: 'border-blue-500/20',
    badgeText: 'text-blue-300/80'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${themeColors.accent}`}></div>
        <div className="relative max-w-7xl mx-auto px-12 pt-32 pb-24">
          <div className="space-y-10">
            <h1 className={`text-7xl font-black font-mono tracking-tight condensed bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}>
              {isInterviewer ? 'DOOM COMMAND CENTER' : 'HERO MISSION CONTROL'}
            </h1>
            <p className="text-xl text-gray-300 font-mono tracking-wide max-w-4xl leading-relaxed condensed">
              {isInterviewer 
                ? 'MONITOR AND EXECUTE ALL INTERVIEW OPERATIONS. MAINTAIN CONTROL OF THE BATTLEFIELD.'
                : 'YOUR HEROIC JOURNEY CONTINUES. PREPARE FOR UPCOMING CHALLENGES AND PROVE YOUR WORTH.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-12 pb-32">
        <div className="space-y-16">
          <div className="flex items-center gap-8 mb-20">
            <h2 className={`text-4xl font-black font-mono tracking-tight condensed ${themeColors.textColor}`}>
              {isInterviewer ? 'ACTIVE OPERATIONS' : 'SCHEDULED MISSIONS'}
            </h2>
            <div className={`flex-1 h-1 bg-gradient-to-r ${themeColors.lineGradient} rounded-full`}></div>
            <span className={`text-sm font-black font-mono tracking-wider condensed ${themeColors.badgeText} ${themeColors.badgeBg} px-6 py-3 rounded-full border-2 ${themeColors.badgeBorder}`}>
              {interviews?.length || 0} {isInterviewer ? 'ACTIVE' : 'QUEUED'}
            </span>
          </div>
          
          {/* Enhanced Grid Layout */}
          <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-2">
            {interviews?.map((interview: Interview, index: number) => {
              console.log(interview.status);
              
              return (
                <InterviewCard key={interview._id} interview={interview} index={index} isInterviewer={isInterviewer}>
                  <CardContent>
                    <MeetingCard 
                      interview={interview}
                      isCandidate={!isInterviewer}
                    />
                  </CardContent>
                  
                  <CardFooter>
                    <StatusIndicator status={interview.status} isInterviewer={isInterviewer} />
                  </CardFooter>
                </InterviewCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}