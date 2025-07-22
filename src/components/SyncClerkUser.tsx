"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function SyncClerkUser() {
  const { user } = useUser();
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (!user) return;

    const storedRole =
      (typeof window !== "undefined" &&
        (localStorage.getItem("pendingRole") as "candidate" | "interviewer" | null)) ||
      "candidate";

    console.log("Creating user with role:", storedRole); // ✅ debug check

    createUser({
      clerkId: user.id,
      name: user.fullName || "Unknown",
      email: user.primaryEmailAddress?.emailAddress || "noemail@unknown.com",
      image: user.imageUrl || "",
      role: storedRole,
    });

    localStorage.removeItem("pendingRole");
  }, [user, createUser]);

  return null;
}