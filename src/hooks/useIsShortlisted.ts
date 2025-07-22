import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/../convex/_generated/api";

export function useIsShortlisted() {
  const { user } = useUser();
  const interviews = useQuery(
    api.interviews.getMyInterview,
    user?.id ? undefined : "skip"
  );

  return {
    isShortlisted: interviews && interviews.length > 0,
    isLoading: !interviews,
  };
}