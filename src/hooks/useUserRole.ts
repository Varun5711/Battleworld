import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

export function useUserRole() {
  const { user } = useUser();
  const users = useQuery(api.users.getAllUsers);
  
  const currentUser = users?.find(u => u.clerkId === user?.id);
  const isLoading = !users || !user;

  return {
    isLoading,
    isInterviewer: currentUser?.role === "interviewer",
    isCandidate: currentUser?.role === "candidate",
    currentUser,
  };
}