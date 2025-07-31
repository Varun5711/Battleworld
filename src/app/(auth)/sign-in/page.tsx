"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="p-6 rounded-2xl shadow-xl bg-zinc-900">
        <SignIn appearance={{
          elements: {
            card: "bg-transparent shadow-none",
            headerTitle: "text-white text-2xl mb-2",
            headerSubtitle: "text-gray-400",
          }
        }} />
      </div>
    </div>
  );
}