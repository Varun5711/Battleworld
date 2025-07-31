import React from 'react';

export default function LoaderUI() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-black flex items-center justify-center z-50">
      
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-grid-pattern bg-[length:40px_40px] animate-pulse"></div>
        </div>
        
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${
              i % 2 === 0 ? 'bg-green-400/30' : 'bg-gray-400/20'
            } animate-pulse`}
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i * 5)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`
            }}
          />
        ))}
      </div>

      <div className="relative text-center">
        
        {/* Main Loader Container */}
        <div className="relative mb-12">
          
          {/* Outer Ring */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-2 border-green-600/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-green-500 rounded-full animate-spin"></div>
            
            {/* Inner Ring */}
            <div className="absolute inset-4 border border-gray-600/30 rounded-full"></div>
            <div className="absolute inset-4 border border-transparent border-r-gray-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
            
            {/* Center Core */}
            <div className="absolute inset-8 bg-gradient-to-br from-green-500/20 to-gray-500/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-10 bg-gradient-radial from-green-400/40 via-transparent to-transparent rounded-full animate-ping"></div>
            
            {/* Doom Symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl font-black text-green-400 animate-pulse">D</div>
            </div>
          </div>
          
          {/* Energy Beams */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-green-500/60 to-transparent animate-pulse"></div>
            <div className="w-px h-48 bg-gradient-to-b from-transparent via-green-500/60 to-transparent animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black bg-gradient-to-r from-green-400 via-gray-300 to-green-500 bg-clip-text text-transparent tracking-wide">
            DOOM PROTOCOLS
          </h2>
          
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-green-500/50"></div>
            <span className="text-sm font-medium tracking-widest animate-pulse">INITIALIZING</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-green-500/50"></div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-green-500/60 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '1.2s'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Loading Messages */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="text-gray-500 text-sm font-light leading-relaxed animate-pulse">
            <p className="mb-4">Accessing Latverian networks...</p>
            <p className="mb-4 text-green-400/80">Doom's systems online</p>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="mt-16 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-green-500/0 via-green-500/60 to-green-500/0 animate-pulse"></div>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-green-500/30"></div>
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-green-500/30"></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-green-500/30"></div>
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-green-500/30"></div>
    </div>
  );
}