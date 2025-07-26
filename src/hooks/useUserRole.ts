import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

export function useUserRole() {
  const { user } = useUser();
  const users = useQuery(api.users.getAllUsers);

  const currentUser = users?.find((u) => u.clerkId === user?.id) || null;

  const isLoading = !users || !user;

  const role = currentUser?.role ?? null;

  return {
    isLoading,
    role, // "interviewer", "candidate", or null
    isInterviewer: role === "interviewer",
    isCandidate: role === "candidate",
    currentUser,
  };
}