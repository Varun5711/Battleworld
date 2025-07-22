"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DoomModal from "@/components/auth/DoomModal";
import Lightning from "@/components/home/Lightning";

export default function HomePage() {
  const router = useRouter();
  const [showDoomModal, setShowDoomModal] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e:any) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-black text-white">
      
      {/* Lightning Background Effects */}
      <div className="absolute inset-0 z-0">
        <Lightning hue={120} xOffset={0} speed={0.8} intensity={0.4} size={1.2} />
        <Lightning hue={280} xOffset={100} speed={0.5} intensity={0.3} size={0.8} />
      </div>

      {/* Dynamic Mouse Glow - Doom Colors */}
      <div 
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(34, 197, 94, 0.08) 0%, rgba(156, 163, 175, 0.04) 50%, transparent 100%)`
        }}
      />

      {/* Atmospheric Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 z-10" />

      {/* Main Content Container */}
      <div className="relative z-20 min-h-screen px-12 py-24 max-w-7xl mx-auto">
        
        {/* Header Section - Left Aligned */}
        <div className={`mb-32 transform transition-all duration-1500 ${
          isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
        }`}>
          <div className="flex items-center mb-8">
            <div className="w-2 h-16 bg-gradient-to-b from-green-500 to-gray-500 mr-8"></div>
            <h1 className="text-7xl font-black bg-gradient-to-r from-green-400 via-gray-300 to-green-500 bg-clip-text text-transparent leading-tight tracking-tight">
              BATTLEWORLD
            </h1>
          </div>
          <p className="text-2xl font-light text-gray-300 max-w-2xl leading-relaxed ml-10">
            Welcome to the ultimate arena where legends are forged
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          
          {/* Left Column - Epic Quote */}
          <div className={`transform transition-all duration-1500 delay-300 ${
            isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
          }`}>
            <div className="border-l-4 border-green-500 pl-8">
              <blockquote className="text-2xl font-light text-gray-300 italic mb-8 leading-relaxed">
                "Heroes seek glory. Villains demand legacy.<br />
                In this multiversal realm, Doom decides who's worthy."
              </blockquote>
              <div className="w-24 h-px bg-gradient-to-r from-green-500 to-transparent"></div>
            </div>
          </div>

          {/* Right Column - Action Buttons */}
          <div className={`flex flex-col gap-8 transform transition-all duration-1500 delay-500 ${
            isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            
            {/* Hero Button - Ultra Premium */}
            <button
              onClick={() => router.push("/signup")}
              className="group relative bg-black/50 backdrop-blur-sm border border-gray-800/60 hover:border-gray-600/80 text-white px-8 py-4 font-medium tracking-wide transition-all duration-500 hover:bg-black/70"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-100 group-hover:text-white transition-colors">Hero Registration</span>
                <div className="w-2 h-2 border border-gray-600 rotate-45 group-hover:border-gray-400 group-hover:translate-x-1 transition-all duration-300"></div>
              </div>
            </button>

            {/* Doom Button - Ultra Premium */}
            <button
              onClick={() => setShowDoomModal(true)}
              className="group relative bg-gradient-to-r from-green-950/20 to-gray-950/20 backdrop-blur-sm border border-green-800/40 hover:border-green-600/60 text-white px-8 py-4 font-medium tracking-wide transition-all duration-500 hover:from-green-950/30 hover:to-gray-950/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-green-100 group-hover:text-green-50 transition-colors">Doom's Tribunal</span>
                <div className="w-2 h-2 border border-green-700 rotate-45 group-hover:border-green-500 group-hover:translate-x-1 transition-all duration-300"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Quote Section - Right Aligned */}
        <div className={`flex justify-end mb-24 transform transition-all duration-1500 delay-700 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-700/50 p-12 max-w-4xl border-r-4 border-r-green-500">
            <blockquote className="text-2xl font-light text-gray-300 italic mb-8 text-right">
              "In a world torn by chaos, Doom interviews not to hire... but to judge."
            </blockquote>
            <div className="w-32 h-px bg-gradient-to-l from-green-500 to-transparent ml-auto mb-8" />
            <p className="text-lg font-light text-gray-400 leading-relaxed text-right">
              Your resume is your weapon. Your courage, your shield.<br />
              Welcome to the final interview of your life.
            </p>
          </div>
        </div>

        {/* Tech Stack - Left Aligned */}
        <div className={`transform transition-all duration-1500 delay-900 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center gap-8 text-gray-500 text-sm font-light">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 border border-green-500/50 bg-green-500/20"></div>
              <span className="text-gray-400 uppercase tracking-wider">Powered by</span>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-blue-400 animate-pulse"></div>
                <span className="text-blue-300 font-medium tracking-wide">Clerk</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-green-400 animate-pulse"></div>
                <span className="text-green-300 font-medium tracking-wide">ConvexDB</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-purple-400 animate-pulse"></div>
                <span className="text-purple-300 font-medium tracking-wide">Stream.io</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doom-themed Floating Elements */}
      <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${
              i % 2 === 0 ? 'bg-green-400/30' : 'bg-gray-400/20'
            } animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      {/* Modal */}
      {showDoomModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
          <DoomModal onClose={() => setShowDoomModal(false)} />
        </div>
      )}
    </div>
  );
}