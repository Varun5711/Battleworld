"use client";

import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import LoaderUI from "@/components/shared/LoaderUI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import toast from "react-hot-toast";

export default function CreateJob() {
  const router = useRouter();
  const { isInterviewer, isLoading } = useUserRole();
  const createJob = useMutation(api.jobs.createJob);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.location) {
      toast.error("Doom requires complete information for all positions.");
      return;
    }

    try {
      await createJob(formData);
      toast.success("Position successfully added to Doom's empire!");
      router.push("/dashboard/jobs");
    } catch (err) {
      console.error(err);
      toast.error("Position creation failed. Doom demands perfection.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoaderUI />
          <p className="text-zinc-400 text-lg font-light tracking-wide">
            Accessing administrative privileges...
          </p>
        </div>
      </div>
    );
  }

  if (!isInterviewer) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 relative">
      {/* Ambient effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #059669 1px, transparent 1px),
            linear-gradient(to bottom, #059669 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="relative z-10 px-6 py-16 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-8 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl rotate-45 group-hover:rotate-[50deg] transition-transform duration-700 ease-out shadow-2xl shadow-emerald-500/25"></div>
            <div className="absolute inset-1 bg-zinc-950 rounded-2xl rotate-45"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-transparent animate-pulse"></div>
          </div>

          {/* Title */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-thin text-white tracking-tight leading-none">
              Expand Doom's
              <span className="block font-light bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent mt-2">
                Legion
              </span>
            </h1>

            <p className="text-zinc-300 text-xl max-w-3xl mx-auto leading-relaxed font-light">
              Doom requires superior minds to execute his grand designs. Only the worthy shall serve.
            </p>
          </div>

          {/* Decorative separator */}
          <div className="flex items-center justify-center mt-12">
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent w-24"></div>
            <div className="mx-8 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent w-24"></div>
          </div>
        </div>

        {/* Form Container */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 rounded-3xl blur-lg"></div>

          <div className="relative bg-zinc-800/40 backdrop-blur-xl border border-zinc-700/50 rounded-3xl overflow-hidden group hover:border-zinc-600/50 transition-all duration-500">
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Form content */}
            <div className="relative p-10 lg:p-16">
              <div className="mb-8">
                <h2 className="text-2xl font-light text-white tracking-wide mb-3">
                  Define Doom's Requirements
                </h2>
                <p className="text-zinc-400 font-light">
                  Specify the qualifications Doom demands from his future subordinates
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-zinc-300 font-light tracking-wide">
                    Role Within Doom's Hierarchy
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Chief Technology Enforcer, Strategic Domination Analyst, Senior Code Architect"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 h-12"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-zinc-300 font-light tracking-wide">
                    Duties in Service of Doom
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Detail the expectations for this role in Doom's organization: What tasks will this subordinate execute for Doom's vision • Technical mastery required to serve Doom effectively • Years of experience needed to meet Doom's standards • Educational credentials Doom deems acceptable • Specific technologies that advance Doom's agenda • Performance metrics by which Doom will judge success • Chain of command within Doom's hierarchy • Opportunities for advancement in Doom's empire"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={8}
                    className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 resize-none"
                    required
                  />
                  <p className="text-zinc-500 text-sm font-light">
                    Doom accepts only detailed specifications. Mediocrity will not be tolerated.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="location" className="text-zinc-300 font-light tracking-wide">
                    Domain of Operations
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Mumbai Stronghold • Remote Service to Doom • Hybrid Domination (Delhi/Remote) • Doom's Bangalore Fortress"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, location: e.target.value }))
                    }
                    className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 h-12"
                    required
                  />
                </div>

                <div className="pt-6">
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border-0 h-14 text-lg font-light tracking-wide transition-all duration-500 shadow-2xl shadow-emerald-500/25"
                  >
                    Add to Doom's Command Structure
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-emerald-500/50 via-emerald-400/50 to-transparent w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
          </div>

          {/* Floating decorative elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-emerald-500/10 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -bottom-8 -left-8 w-8 h-8 bg-zinc-500/10 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        </div>

        {/* Guidelines Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 p-6 rounded-2xl bg-zinc-800/20 backdrop-blur-sm border border-zinc-700/30 hover:border-zinc-600/40 transition-colors duration-300">
            <div className="w-12 h-12 mx-auto bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-emerald-400 rounded-md"></div>
            </div>
            <h3 className="text-white font-light text-lg">Doom's Standards</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Specify exact qualifications worthy of serving in Doom's hierarchy
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-2xl bg-zinc-800/20 backdrop-blur-sm border border-zinc-700/30 hover:border-zinc-600/40 transition-colors duration-300">
            <div className="w-12 h-12 mx-auto bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-emerald-400 rounded-md transform rotate-45"></div>
            </div>
            <h3 className="text-white font-light text-lg">Total Domination</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Detail every aspect of service required to advance Doom's agenda
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-2xl bg-zinc-800/20 backdrop-blur-sm border border-zinc-700/30 hover:border-zinc-600/40 transition-colors duration-300">
            <div className="w-12 h-12 mx-auto bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-emerald-400 rounded-full"></div>
            </div>
            <h3 className="text-white font-light text-lg">Supreme Vision</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Emphasize how this role contributes to Doom's ultimate conquest
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 space-y-4">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent max-w-md mx-auto"></div>
          <p className="text-zinc-500 text-sm font-light tracking-widest uppercase">
            Recruitment Division • Doom Industries
          </p>
        </div>
      </div>
    </div>
  );
}