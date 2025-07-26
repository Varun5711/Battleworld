"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { UserButton } from "@clerk/nextjs";

export default function DoomNavbar() {
  const { isInterviewer, isLoading } = useUserRole();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoaded, setIsLoaded] = useState(false);

  const getActiveTab = () => {
    const path = pathname || "";
    if (path.startsWith("/dashboard/create-job")) return "create-job";
    if (path.startsWith("/dashboard")) return "dashboard";
    if (path.startsWith("/schedule")) return "schedule";
    if (path.startsWith("/recordings")) return "recordings";
    if (path.startsWith("/jobs")) return "jobs";
    if (path.startsWith("/profile")) return "profile";
    if (path.startsWith("/arena")) return "arena";
    if (path.startsWith("/applications")) return "applications"
    return "";
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    if (!isLoading) setIsLoaded(true);
  }, [isLoading]);

  const doomNavItems = [
    { id: "dashboard", label: "Command Center", path: "/dashboard" },
    { id: "create-job", label: "Forge Trials", path: "/dashboard/create-job" },
    { id: "schedule", label: "Time Dominion", path: "/schedule" },
    { id: "recordings", label: "Archives", path: "/recordings" },
  ];

  const heroNavItems = [
    { id: "jobs", label: "Available Quests", path: "/jobs" },
    { id: "arena", label: "Interview Arena", path: "/arena" }, // 🆕 NEW for candidates
    { id: "profile", label: "Hero Profile", path: "/profile" },
    { id: "applications" , label: "Your Applications" , path: "/applications"}
  ];

  const navItems = isInterviewer ? doomNavItems : heroNavItems;

  if (isLoading) return null;

  return (
    <nav className="relative bg-gradient-to-r from-black via-gray-950 to-black border-b border-green-800/20 backdrop-blur-xl">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/3 via-transparent to-green-500/3 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div
            className={`flex items-center gap-6 transition-all duration-1000 ${
              isLoaded ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-gray-500" />
              <h1 className="text-2xl font-black bg-gradient-to-r from-green-400 to-gray-300 bg-clip-text text-transparent tracking-wide">
                {isInterviewer ? "DOOM DOMAIN" : "HERO PORTAL"}
              </h1>
            </div>
          </div>

          {/* Nav Buttons */}
          <div
            className={`flex items-center gap-2 transition-all duration-1000 delay-300 ${
              isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            }`}
          >
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`relative px-6 py-3 font-medium text-sm tracking-wide transition-all duration-500 transform ${
                  activeTab === item.id
                    ? "text-green-300 bg-green-950/20 border-b-2 border-green-500"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-900/20"
                }`}
                style={{
                  animationDelay: `${400 + index * 100}ms`,
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                {activeTab === item.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse" />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Role + User */}
          <div
            className={`flex items-center gap-6 transition-all duration-1000 delay-500 ${
              isLoaded ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isInterviewer ? "bg-green-500" : "bg-blue-500"
                }`}
              />
              <span className="text-sm font-medium text-gray-300 tracking-wide">
                {isInterviewer ? "INTERVIEWER" : "CANDIDATE"}
              </span>
            </div>
            <div className="w-px h-6 bg-gray-700" />
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent blur-sm animate-pulse" />
    </nav>
  );
}