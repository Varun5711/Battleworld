"use client";

import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import LoaderUI from "@/components/shared/LoaderUI";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import toast from "react-hot-toast";
import Stepper, { Step } from "../../../../components/shared/Stepper";

export default function CreateJob() {
  const router = useRouter();
  const { isInterviewer, isLoading } = useUserRole();
  const createJob = useMutation(api.jobs.createJob);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });

  const handleFinalSubmit = async () => {
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

  const isStep1Valid = formData.title.trim().length > 0;
  const isStep2Valid = formData.description.trim().length > 50;
  const isStep3Valid = formData.location.trim().length > 0;

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

        {/* Form Container with Stepper */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 rounded-3xl blur-lg"></div>

          <div className="relative bg-zinc-800/40 backdrop-blur-xl border border-zinc-700/50 rounded-3xl overflow-hidden group hover:border-zinc-600/50 transition-all duration-500">
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Stepper content */}
            <div className="relative p-10 lg:p-16">
              <Stepper
                initialStep={1}
                onStepChange={(step) => {
                  console.log(`Moving to step ${step}`);
                }}
                onFinalStepCompleted={handleFinalSubmit}
                backButtonText="Previous Domain"
                nextButtonText="Advance Protocol"
                finalButtonText="Add to Doom's Command Structure"
              >
                <Step isValid={isStep1Valid}>
                  <div className="space-y-6">
                    <div className="mb-8">
                      <h2 className="text-3xl font-light text-white tracking-wide mb-3">
                        Define the Role
                      </h2>
                      <p className="text-zinc-400 font-light text-lg">
                        What position within Doom's hierarchy requires fulfillment?
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="title" className="text-zinc-300 font-light tracking-wide text-lg">
                        Role Within Doom's Hierarchy
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g., Chief Technology Enforcer, Strategic Domination Analyst, Senior Code Architect"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, title: e.target.value }))
                        }
                        className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 h-14 text-lg"
                        required
                      />
                      {!isStep1Valid && formData.title.length === 0 && (
                        <p className="text-amber-400 text-sm font-light">
                          Doom requires a position title to proceed with recruitment.
                        </p>
                      )}
                    </div>

                    <div className="mt-12 grid md:grid-cols-2 gap-6">
                      <div className="text-center space-y-3 p-6 rounded-2xl bg-zinc-800/20 backdrop-blur-sm border border-zinc-700/30">
                        <div className="w-10 h-10 mx-auto bg-emerald-500/20 rounded-xl flex items-center justify-center">
                          <div className="w-5 h-5 bg-emerald-400 rounded-md"></div>
                        </div>
                        <h3 className="text-white font-light">Be Specific</h3>
                        <p className="text-zinc-400 text-sm font-light">
                          Doom values precision in all designations
                        </p>
                      </div>

                      <div className="text-center space-y-3 p-6 rounded-2xl bg-zinc-800/20 backdrop-blur-sm border border-zinc-700/30">
                        <div className="w-10 h-10 mx-auto bg-emerald-500/20 rounded-xl flex items-center justify-center">
                          <div className="w-5 h-5 bg-emerald-400 rounded-md transform rotate-45"></div>
                        </div>
                        <h3 className="text-white font-light">Reflect Authority</h3>
                        <p className="text-zinc-400 text-sm font-light">
                          The title should convey the role's importance
                        </p>
                      </div>
                    </div>
                  </div>
                </Step>

                <Step isValid={isStep2Valid}>
                  <div className="space-y-6">
                    <div className="mb-8">
                      <h2 className="text-3xl font-light text-white tracking-wide mb-3">
                        Duties & Requirements
                      </h2>
                      <p className="text-zinc-400 font-light text-lg">
                        Detail the expectations and qualifications Doom demands.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="description" className="text-zinc-300 font-light tracking-wide text-lg">
                        Duties in Service of Doom
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Detail the expectations for this role in Doom's organization:&#10;&#10;• What tasks will this subordinate execute for Doom's vision&#10;• Technical mastery required to serve Doom effectively&#10;• Years of experience needed to meet Doom's standards&#10;• Educational credentials Doom deems acceptable&#10;• Specific technologies that advance Doom's agenda&#10;• Performance metrics by which Doom will judge success&#10;• Chain of command within Doom's hierarchy&#10;• Opportunities for advancement in Doom's empire"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, description: e.target.value }))
                        }
                        rows={12}
                        className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 resize-none text-base"
                        required
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-zinc-500 text-sm font-light">
                          Doom accepts only detailed specifications. ({formData.description.length} characters)
                        </p>
                        {!isStep2Valid && (
                          <p className="text-amber-400 text-sm font-light">
                            Minimum 50 characters required
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Step>

                <Step isValid={isStep3Valid}>
                  <div className="space-y-6">
                    <div className="mb-8">
                      <h2 className="text-3xl font-light text-white tracking-wide mb-3">
                        Domain of Operations
                      </h2>
                      <p className="text-zinc-400 font-light text-lg">
                        Where will this servant of Doom execute their duties?
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="location" className="text-zinc-300 font-light tracking-wide text-lg">
                        Operational Territory
                      </Label>
                      <Input
                        id="location"
                        placeholder="e.g., Mumbai Stronghold • Remote Service to Doom • Hybrid Domination (Delhi/Remote) • Doom's Bangalore Fortress"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, location: e.target.value }))
                        }
                        className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 h-14 text-lg"
                        required
                      />
                      {!isStep3Valid && formData.location.length === 0 && (
                        <p className="text-amber-400 text-sm font-light">
                          Doom must know the operational domain to complete recruitment.
                        </p>
                      )}
                    </div>

                    {/* Summary Preview */}
                    <div className="mt-12 p-8 rounded-2xl bg-zinc-800/30 border border-zinc-700/40">
                      <h3 className="text-xl font-light text-white mb-6 tracking-wide">
                        Final Review - Doom's Requirements
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-emerald-400 font-light mb-2">Position:</h4>
                          <p className="text-white">{formData.title || "Not specified"}</p>
                        </div>
                        <div>
                          <h4 className="text-emerald-400 font-light mb-2">Location:</h4>
                          <p className="text-white">{formData.location || "Not specified"}</p>
                        </div>
                        <div>
                          <h4 className="text-emerald-400 font-light mb-2">Description:</h4>
                          <p className="text-white text-sm leading-relaxed">
                            {formData.description ? 
                              formData.description.slice(0, 200) + (formData.description.length > 200 ? "..." : "") 
                              : "Not specified"
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Step>
              </Stepper>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-emerald-500/50 via-emerald-400/50 to-transparent w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
          </div>

          {/* Floating decorative elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-emerald-500/10 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -bottom-8 -left-8 w-8 h-8 bg-zinc-500/10 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
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