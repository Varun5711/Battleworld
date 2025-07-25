import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/shared/PageWrapper";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [isMicDisabled, setIsMicDisabled] = useState(false);

  const call = useCall();

  if (!call) return null;

  useEffect(() => {
    if (isCameraDisabled) call.camera.disable();
    else call.camera.enable();
  }, [isCameraDisabled, call.camera]);

  useEffect(() => {
    if (isMicDisabled) call.microphone.disable();
    else call.microphone.enable();
  }, [isMicDisabled, call.microphone]);

  const handleJoin = async () => {
    await call.join();
    onSetupComplete();
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,95,70,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(16,185,129,0.02)_50%,transparent_70%)]" />
        
        <div className="w-full max-w-[1400px] mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                PREPARATION
              </span>
              <span className="block text-2xl sm:text-3xl mt-2 text-slate-300 font-light tracking-wider">
                CHAMBER
              </span>
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mb-6" />
            <p className="text-slate-400 text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
              Configure your systems before entering the sanctum
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* VIDEO PREVIEW CONTAINER */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-emerald-950/50 border-slate-700/50 shadow-2xl backdrop-blur-sm hover:shadow-emerald-500/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="p-8 relative z-10">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">VISUAL FEED</h2>
                  <p className="text-emerald-300/80 text-sm font-light tracking-wider uppercase">Status Monitoring</p>
                </div>

                {/* VIDEO PREVIEW */}
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-inner min-h-[320px] sm:min-h-[400px]">
                  <div className="absolute inset-0">
                    <VideoPreview className="h-full w-full object-cover" />
                  </div>
                  {isCameraDisabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-slate-500" />
                          </div>
                        </div>
                        <p className="text-slate-400 font-medium tracking-wide">VISUAL FEED DISABLED</p>
                        <p className="text-slate-500 text-sm mt-1 font-light">Enable to proceed</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Subtle border animation */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Card>

            {/* CONTROLS CARD */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-emerald-950/50 border-slate-700/50 shadow-2xl backdrop-blur-sm hover:shadow-emerald-500/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="p-8 h-full flex flex-col relative z-10">
                {/* MEETING DETAILS */}
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">SESSION PARAMETERS</h2>
                  <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-xl p-6 border border-slate-700/50 shadow-inner">
                    <p className="text-emerald-300/80 text-xs uppercase tracking-[0.2em] font-medium mb-3">Connection Identifier</p>
                    <p className="font-mono text-lg text-white break-all tracking-wider bg-slate-900/50 px-4 py-3 rounded-lg border border-slate-700/30">
                      {call.id}
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* CAMERA CONTROL */}
                    <div className="group/control p-6 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 hover:from-slate-800/80 hover:to-slate-900/80 transition-all duration-300 border border-slate-700/30 hover:border-emerald-600/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white text-lg tracking-wide mb-1">VISUAL SYSTEMS</p>
                          <p className={`text-sm font-medium tracking-wider uppercase ${
                            isCameraDisabled 
                              ? 'text-red-400' 
                              : 'text-emerald-400'
                          }`}>
                            {isCameraDisabled ? "OFFLINE" : "OPERATIONAL"}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full shadow-lg ${
                            isCameraDisabled 
                              ? 'bg-red-500 shadow-red-500/50' 
                              : 'bg-emerald-500 shadow-emerald-500/50 animate-pulse'
                          }`} />
                          <Switch
                            checked={!isCameraDisabled}
                            onCheckedChange={(checked) => setIsCameraDisabled(!checked)}
                            className="data-[state=checked]:bg-emerald-600 scale-110"
                          />
                        </div>
                      </div>
                    </div>

                    {/* MICROPHONE CONTROL */}
                    <div className="group/control p-6 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 hover:from-slate-800/80 hover:to-slate-900/80 transition-all duration-300 border border-slate-700/30 hover:border-emerald-600/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white text-lg tracking-wide mb-1">AUDIO SYSTEMS</p>
                          <p className={`text-sm font-medium tracking-wider uppercase ${
                            isMicDisabled 
                              ? 'text-red-400' 
                              : 'text-emerald-400'
                          }`}>
                            {isMicDisabled ? "MUTED" : "ACTIVE"}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full shadow-lg ${
                            isMicDisabled 
                              ? 'bg-red-500 shadow-red-500/50' 
                              : 'bg-emerald-500 shadow-emerald-500/50 animate-pulse'
                          }`} />
                          <Switch
                            checked={!isMicDisabled}
                            onCheckedChange={(checked) => setIsMicDisabled(!checked)}
                            className="data-[state=checked]:bg-emerald-600 scale-110"
                          />
                        </div>
                      </div>
                    </div>

                    {/* DEVICE SETTINGS */}
                    <div className="group/control p-6 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 hover:from-slate-800/80 hover:to-slate-900/80 transition-all duration-300 border border-slate-700/30 hover:border-emerald-600/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white text-lg tracking-wide mb-1">SYSTEM CONFIG</p>
                          <p className="text-sm text-slate-400 font-light tracking-wide">Advanced Parameters</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-blue-500/50 animate-pulse" />
                          <DeviceSettings />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* JOIN BUTTON */}
                  <div className="space-y-6 mt-10">
                    <Button 
                      className="w-full h-16 text-xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-500 shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border border-emerald-500/50 tracking-wider uppercase" 
                      onClick={handleJoin}
                    >
                      <span className="relative">
                        INITIATE CONNECTION
                        <div className="absolute inset-0 bg-emerald-400/20 blur-sm animate-pulse" />
                      </span>
                    </Button>
                    
                    <div className="text-center p-6 rounded-xl bg-gradient-to-r from-emerald-950/50 to-slate-900/50 border border-emerald-800/30 backdrop-blur-sm">
                      <p className="text-slate-300 leading-relaxed font-light tracking-wide">
                        <span className="text-emerald-300 font-medium">Systems ready.</span> Prepare for engagement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subtle border animation */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default MeetingSetup;