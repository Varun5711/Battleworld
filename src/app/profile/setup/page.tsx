"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (currentUser && currentUser.preferredRole) {
      router.push("/jobs");
    }
  }, [currentUser, router]);

  if (currentUser === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-red-500/30 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-4 h-4 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-zinc-400 text-sm font-medium mt-6 text-center tracking-wide">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  if (currentUser?.preferredRole) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black relative">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#5c000012_1px,transparent_1px),linear-gradient(to_bottom,#5c000012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Ambient effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 px-6 py-16 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-12 h-12 mx-auto mb-8 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-xl rotate-45 group-hover:rotate-[50deg] transition-transform duration-700 ease-out"></div>
            <div className="absolute inset-1 bg-zinc-950 rounded-xl rotate-45"></div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/20 to-transparent animate-pulse-glow"></div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-light text-white mb-4 tracking-tight animate-slide-up">
            Enter Your
            <span className="block font-semibold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">
              Villainous Identity
            </span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed animate-slide-up-delayed">
            Reveal your power. Forge your legacy. Doom accepts no mediocrity.
          </p>

          <div className="flex items-center justify-center mt-12 animate-fade-in-late">
            <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent w-32"></div>
            <div className="mx-6 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent w-32"></div>
          </div>
        </div>

        {/* Form */}
        <div className="relative animate-slide-up-form">
          <div className="absolute -inset-px bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 rounded-2xl blur-sm"></div>

          <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="relative p-8 lg:p-12">
              <CandidateForm />
            </div>

            <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-red-500/50 to-transparent w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
          </div>

          <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500/10 rounded-full animate-float"></div>
          <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-zinc-500/10 rounded-full animate-float-delayed"></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in-footer">
          <p className="text-zinc-500 text-sm font-medium tracking-wide">
            Powered by Doom’s Code. Forged in Fire.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }

        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-up { animation: slide-up 1s ease-out; }
        .animate-slide-up-delayed { animation: slide-up 1s ease-out 0.2s both; }
        .animate-fade-in-late { animation: fade-in 1s ease-out 0.4s both; }
        .animate-slide-up-form { animation: slide-up 1s ease-out 0.6s both; }
        .animate-fade-in-footer { animation: fade-in 1s ease-out 0.8s both; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out infinite 3s; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
} 