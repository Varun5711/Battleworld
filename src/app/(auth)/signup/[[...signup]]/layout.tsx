// app/(auth)/signup/[[...signUp]]/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | BattleWorld",
  description: "Join the Multiverse as a Hero or Doom",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {children}
    </div>
  );
}