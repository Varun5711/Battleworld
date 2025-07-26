import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "@/../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Interview = Doc<"interviews">;

interface MeetingCardProps {
  interview: Interview;
  isCandidate?: boolean;
}

function MeetingCard({ interview, isCandidate = false }: MeetingCardProps) {
  const { joinMeeting } = useMeetingActions();
  const status = getMeetingStatus(interview);
  const formattedDate = format(new Date(interview.startTime), "EEEE, MMMM d · h:mm a");

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 border-slate-700 shadow-2xl group hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(16,185,129,0.05)_50%,transparent_70%)] animate-pulse" />

      <CardHeader className="space-y-3 relative z-10 pb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-emerald-300/80 tracking-wide uppercase">
            {formattedDate}
          </div>
          <Badge 
            className={`
              font-semibold tracking-wider uppercase text-xs px-3 py-1 shadow-lg
              ${status === "live" 
                ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/50 animate-pulse" 
                : status === "upcoming" 
                ? "bg-amber-600 text-white border-amber-500 shadow-amber-500/30" 
                : "bg-slate-600 text-slate-200 border-slate-500"
              }
            `}
          >
            {status === "live" ? "◉ ACTIVE" : status === "upcoming" ? "⧖ SCHEDULED" : "✓ ARCHIVED"}
          </Badge>
        </div>

        <CardTitle className="text-xl font-bold text-white group-hover:text-emerald-100 transition-colors duration-200 leading-tight">
          {interview.title}
        </CardTitle>

        {interview.description && (
          <CardDescription className="text-slate-300 line-clamp-2 text-sm leading-relaxed">
            {interview.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="relative z-10 pt-2">
        {status === "live" && isCandidate && (
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 shadow-lg shadow-emerald-600/30 border border-emerald-500 hover:shadow-emerald-500/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => joinMeeting(interview.streamCallId)}
          >
            <span className="relative">
              ENTER SESSION
              <div className="absolute inset-0 bg-emerald-400/20 blur-sm animate-pulse" />
            </span>
          </Button>
        )}

        {status === "upcoming" && isCandidate && (
          <Button 
            variant="outline" 
            className="w-full border-slate-600 text-slate-400 font-medium py-3 bg-slate-800/50 hover:bg-slate-700/50 transition-colors duration-200 cursor-not-allowed"
            disabled
          >
            AWAITING COMMENCEMENT
          </Button>
        )}
      </CardContent>

      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
}

export default MeetingCard;