"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FadeContent from "../ui/FadeContent";

export default function DoomModal({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState("");
  const becomeDoom = useMutation(api.users.becomeInterviewer);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== process.env.NEXT_PUBLIC_DOOM_PASSWORD) {
      toast.error("Incorrect password");
      return;
    }

    try {
      await becomeDoom();
      toast.success("You are now Doom (Interviewer)!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <FadeContent>
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        {/* Doom Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 via-gray-500/10 to-green-500/20 rounded-lg blur-xl"></div>
        
        <form
          onSubmit={handleSubmit}
          className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-black border border-green-700/50 p-12 rounded-lg shadow-2xl w-[90%] max-w-md"
        >
          {/* Doom Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-gray-400 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-gray-300 bg-clip-text text-transparent mb-2">
              DOOM'S AUTHORIZATION
            </h2>
            <p className="text-gray-400 text-sm font-light tracking-wide">
              Only the worthy may enter Doom's domain
            </p>
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label className="block text-green-400 text-sm font-medium mb-3 tracking-wide">
              MASTER'S CIPHER
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full bg-black/60 border border-gray-700 focus:border-green-500 text-green-100 placeholder-gray-500 px-4 py-4 rounded-none outline-none transition-all duration-300 font-mono tracking-wider"
                placeholder="Enter the forbidden sequence..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-green-800 to-gray-800 hover:from-green-700 hover:to-gray-700 text-green-100 px-6 py-4 font-medium tracking-wide transition-all duration-300 border border-green-700/50 hover:border-green-500/70"
            >
              <span className="flex items-center justify-center gap-2">
                ASCEND TO POWER
                <div className="w-1 h-1 bg-green-400 animate-pulse"></div>
              </span>
            </button>
            
            <button
              type="button"
              className="px-6 py-4 text-gray-400 hover:text-gray-300 font-medium tracking-wide transition-colors duration-300 border border-gray-700/50 hover:border-gray-600/70 bg-black/20 hover:bg-black/40"
              onClick={onClose}
            >
              RETREAT
            </button>
          </div>

          {/* Doom Quote */}
          <div className="mt-8 pt-6 border-t border-gray-800/50">
            <p className="text-center text-gray-500 text-xs italic font-light leading-relaxed">
              "Doom tolerates no pretenders to his throne.<br />
              Prove your worth, or face annihilation."
            </p>
          </div>
        </form>
      </div>
    </div>
    </FadeContent>
  );
}