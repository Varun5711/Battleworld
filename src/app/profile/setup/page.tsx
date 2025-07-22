// app/profile/setup/page.tsx
"use client";

import CandidateForm from "@/components/profile/CandidateForm";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";

export default function ProfileSetupPage() {
  const { user } = useUser();
  const router = useRouter();

  const currentUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

  // Show loading while query is in progress
  if (currentUser === undefined) {
    return <div className="p-6 max-w-3xl mx-auto">Loading...</div>;
  }

  // 🔐 If already has profile, go to /jobs
  if (currentUser && currentUser?.preferredRole) {
    router.push("/jobs");
    return null;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Complete Your Hero Profile</h1>
      <CandidateForm />
    </div>
  );
}