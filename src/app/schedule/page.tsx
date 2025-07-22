"use client";

import LoaderUI from "@/components/shared/LoaderUI";
import { useUserRole } from "@/hooks/useUserRole";
import { useIsShortlisted } from "@/hooks/useIsShortlisted";
import { useRouter } from "next/navigation";
import InterviewScheduleUI from "./InterviewScheduleUI";

function SchedulePage() {
  const router = useRouter();

  const { isInterviewer, isCandidate, isLoading: roleLoading } = useUserRole();
  const { isShortlisted, isLoading: shortlistLoading } = useIsShortlisted();

  const isLoading = roleLoading || shortlistLoading;

  if (isLoading) return <LoaderUI />;

  if (!isInterviewer && (!isCandidate || !isShortlisted)) {
    router.push("/");
    return null;
  }

  return <InterviewScheduleUI />;
}
export default SchedulePage;