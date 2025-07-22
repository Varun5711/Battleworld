"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn
        appearance={{
          elements: {
            card: "shadow-lg border border-muted bg-background/50 backdrop-blur-sm",
          },
        }}
      />
    </div>
  );
}