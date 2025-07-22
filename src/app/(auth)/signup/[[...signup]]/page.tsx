"use client";
import {
  SignUp,
  SignedOut,
  SignedIn,
  useAuth,
} from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/profile/setup");
    }
  }, [isSignedIn, router]);

  return (
    <>
      <SignedOut>
        <SignUp
          routing="path"
          path="/signup"
        />
      </SignedOut>
      <SignedIn>
        <div>Redirecting...</div>
      </SignedIn>
    </>
  );
}