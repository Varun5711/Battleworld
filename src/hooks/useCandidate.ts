"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useCandidate() {
  const { user } = useUser();
  const clerkId = user?.id;

  const candidate = useQuery(
    api.users.getUserByClerkId,
    clerkId && clerkId !== "" ? { clerkId } : "skip"
  );

  return { candidate, clerkId };
}