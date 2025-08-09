/* eslint-disable */
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { UserButton } from "@clerk/nextjs";
import Dock from './Dock'; // Your existing Dock component
import { 
  Home, 
  Plus, 
  Calendar, 
  Archive, 
  Search, 
  Gamepad2, 
  User, 
  FileText,
  Menu,
  X
} from "lucide-react";

export default function DoomNavbar() {
  const { isInterviewer, isLoading } = useUserRole();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Convert nav items to dock format - Role-based theming
  const doomNavItems = [
    { 
      icon: <Home size={20} className={activeTab === "dashboard" ? "text-green-400" : "text-gray-400"} />, 
      label: 'Command Center', 
      onClick: () => {
        router.push('/dashboard');
        setIsMobileMenuOpen(false);
      }
    },
    { 
      icon: <Plus size={20} className={activeTab === "create-job" ? "text-green-400" : "text-gray-400"} />, 
      label: 'Forge Trials', 
      onClick: () => {
        router.push('/dashboard/create-job');
        setIsMobileMenuOpen(false);
      }
    },
    { 
      icon: <Calendar size={20} className={activeTab === "schedule" ? "text-green-400" : "text-gray-400"} />, 
      label: 'Time Dominion', 
      onClick: () => {
        router.push('/schedule');
        setIsMobileMenuOpen(false);
      }
    },
    { 
      icon: <Archive size={20} className={activeTab === "recordings" ? "text-green-400" : "text-gray-400"} />, 
      label: 'Archives', 
      onClick: () => {
        router.push('/recordings');
        setIsMobileMenuOpen(false);
      }
    },
  ];

  const heroNavItems = [
    { 
      icon: <Search size={20} className={activeTab === "jobs" ? "text-blue-400" : "text-gray-400"} />, 
      label: 'Available Quests', 
      onClick: () => {
        router.push('/jobs');
        setIsMobileMenuOpen(false);
      }
    },
    { 
      icon: <Gamepad2 size={20} className={activeTab === "arena" ? "text-blue-400" : "text-gray-400"} />, 
      label: 'Interview Arena', 
      onClick: () => {
        router.push('/arena');
        setIsMobileMenuOpen(false);
      }
    },
    { 
      icon: <User size={20} className={activeTab === "profile" ? "text-blue-400" : "text-gray-400"} />, 
      label: 'Hero Profile', 
      onClick: () => {
        router.push('/profile');
        setIsMobileMenuOpen(false);
      }
    },
    { 
      icon: <FileText size={20} className={activeTab === "applications" ? "text-blue-400" : "text-gray-400"} />, 
      label: 'Your Applications', 
      onClick: () => {
        router.push('/applications');
        setIsMobileMenuOpen(false);
      }
    }
  ];

  const items = isInterviewer ? doomNavItems : heroNavItems;

  if (isLoading) return null;

  return (
    <>
      <nav className={`relative bg-gradient-to-r from-black via-gray-950 to-black border-b backdrop-blur-xl ${
        isInterviewer ? 'border-green-800/20' : 'border-blue-800/20'
      }`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r via-transparent animate-pulse ${
            isInterviewer ? 'from-green-500/3 to-green-500/3' : 'from-blue-500/3 to-blue-500/3'
          }`} />
          <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent to-transparent animate-pulse ${
            isInterviewer ? 'via-green-500/30' : 'via-blue-500/30'
          }`} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Mobile Layout */}
          <div className="lg:hidden py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Title */}
              <div
                className={`flex items-center gap-3 transition-all duration-1000 ${
                  isLoaded ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
              >
                <div className={`w-1 h-8 bg-gradient-to-b to-gray-500 ${
                  isInterviewer ? 'from-green-500' : 'from-blue-500'
                }`} />
                <h1 className={`text-sm sm:text-2xl font-black font-mono bg-gradient-to-r to-gray-300 bg-clip-text text-transparent tracking-tight condensed ${
                  isInterviewer ? 'from-green-400' : 'from-blue-400'
                }`}>
                  {isInterviewer ? "DOOM DOMAIN" : "HERO PORTAL"}
                </h1>
                <div className={`w-1.5 h-1.5 rounded-full animate-ping ${
                  isInterviewer ? 'bg-green-500' : 'bg-blue-500'
                }`} />
              </div>

              {/* Mobile Right Side */}
              <div className="flex items-center gap-2">
                {/* Role Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/40 border border-gray-700/30 backdrop-blur-sm">
                  <div
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      isInterviewer ? "bg-green-500" : "bg-cyan-500"
                    }`}
                  />
                  <span className="text-xs font-black font-mono text-gray-300 tracking-wider condensed">
                    {isInterviewer ? "INTERVIEWER" : "CANDIDATE"}
                  </span>
                </div>
                
                {/* User Button */}
                <div className="relative">
                  <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
                  <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-ping opacity-30 ${
                    isInterviewer ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`p-2 rounded-lg bg-gray-900/40 border backdrop-blur-sm transition-colors ${
                    isInterviewer ? 'border-green-500/20 hover:border-green-500/40' : 'border-blue-500/20 hover:border-blue-500/40'
                  }`}
                >
                  {isMobileMenuOpen ? (
                    <X size={20} className="text-gray-400" />
                  ) : (
                    <Menu size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block py-8">
            <div className="flex items-center justify-between gap-8">
              {/* Desktop Title */}
              <div
                className={`flex items-center gap-8 transition-all duration-1000 ${
                  isLoaded ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-1 h-10 bg-gradient-to-b to-gray-500 ${
                    isInterviewer ? 'from-green-500' : 'from-blue-500'
                  }`} />
                  <h1 className={`text-3xl font-black font-mono bg-gradient-to-r to-gray-300 bg-clip-text text-transparent tracking-tight condensed ${
                    isInterviewer ? 'from-green-400' : 'from-blue-400'
                  }`}>
                    {isInterviewer ? "DOOM DOMAIN" : "HERO PORTAL"}
                  </h1>
                  <div className={`w-2 h-2 rounded-full animate-ping ${
                    isInterviewer ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                </div>
              </div>

              {/* Desktop Dock Navigation */}
              <div
                className={`relative transition-all duration-1000 delay-300 ${
                  isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
                }`}
              >
                <div className="relative h-24 w-[500px]">
                  <Dock 
                    items={items}
                    panelHeight={72}
                    baseItemSize={55}
                    magnification={80}
                    distance={220}
                    spring={{ mass: 0.1, stiffness: 150, damping: 12 }}
                    className={`bg-gray-900/40 backdrop-blur-md gap-6 ${
                      isInterviewer ? 'border-green-500/20' : 'border-blue-500/20'
                    }`}
                  />
                </div>
              </div>

              {/* Desktop Role + User */}
              <div
                className={`flex items-center gap-8 transition-all duration-1000 delay-500 ${
                  isLoaded ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                }`}
              >
                <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-gray-900/40 border border-gray-700/30 backdrop-blur-sm">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      isInterviewer ? "bg-green-500" : "bg-cyan-500"
                    }`}
                  />
                  <span className="text-sm font-black font-mono text-gray-300 tracking-wider condensed">
                    {isInterviewer ? "INTERVIEWER" : "CANDIDATE"}
                  </span>
                </div>
                <div className="w-px h-8 bg-gray-700" />
                <div className="relative">
                  <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping opacity-30 ${
                    isInterviewer ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Bottom Glow */}
        <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent to-transparent blur-sm animate-pulse ${
          isInterviewer ? 'via-green-500/20' : 'via-blue-500/20'
        }`} />
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsMobileMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`absolute top-0 right-0 h-full w-80 bg-gradient-to-b from-gray-950 via-gray-950 to-black border-l backdrop-blur-xl ${
                isInterviewer ? 'border-green-800/20' : 'border-blue-800/20'
              }`}
              onClick={(e) => e.stopPropagation()}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* Mobile Menu Header */}
              <div className="p-6 border-b border-gray-800/30">
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-black font-mono bg-gradient-to-r to-gray-300 bg-clip-text text-transparent tracking-tight ${
                    isInterviewer ? 'from-green-400' : 'from-blue-400'
                  }`}>
                    NAVIGATION
                  </h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-gray-900/40 border border-gray-700/30 hover:border-gray-600/40 transition-colors"
                  >
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className="p-6 space-y-4">
                {items.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl bg-gray-900/40 border backdrop-blur-sm transition-all hover:scale-105 ${
                      isInterviewer ? 'border-green-500/20 hover:border-green-500/40 hover:bg-green-500/5' : 'border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-gray-300 font-medium text-left">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Mobile Menu Footer */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className={`w-full h-px bg-gradient-to-r from-transparent to-transparent ${
                  isInterviewer ? 'via-green-500/20' : 'via-blue-500/20'
                }`} />
                <div className="mt-4 text-center">
                  <span className="text-xs font-mono text-gray-500 tracking-wider">
                    {isInterviewer ? "DOOM DOMAIN" : "HERO PORTAL"}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}