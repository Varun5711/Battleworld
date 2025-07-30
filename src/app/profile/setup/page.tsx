"use client";

import { useEffect, useState } from "react";
import CandidateForm from "@/components/profile/CandidateForm";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import Stepper, { Step } from '../../../components/shared/Stepper';

// Define the form data interface
interface FormData {
  name: string;
  role: string;
  skills: string[];
  experience: string;
}

export default function ProfileSetupPage() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    skills: [],
    experience: ''
  });

  const currentUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

  useEffect(() => {
    if (currentUser && currentUser.preferredRole) {
      router.push("/jobs");
    }
  }, [currentUser, router]);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return true; // Welcome step, always allow
      case 2:
        return formData.name.trim() !== '' && formData.role !== '';
      case 3:
        return formData.skills.length > 0 && formData.experience.trim() !== '';
      case 4:
        return true; // Final step
      default:
        return false;
    }
  };

  const handleStepChange = (step: number) => {
    // Only allow step change if current step is valid or going backwards
    if (step > currentStep && !validateStep(currentStep)) {
      return; // Prevent moving forward if current step is invalid
    }
    setCurrentStep(step);
    console.log(`Moved to step: ${step}`);
  };

  const handleFinalStepCompleted = () => {
    console.log("Profile setup completed!");
    // Here you would typically save the profile data
    router.push("/jobs");
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleSkill = (skill: string, checked: boolean) => {
    if (checked) {
      updateFormData({ skills: [...formData.skills, skill] });
    } else {
      updateFormData({ skills: formData.skills.filter(s => s !== skill) });
    }
  };

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

        {/* Stepper Form */}
        <div className="relative animate-slide-up-form">
          <div className="absolute -inset-px bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 rounded-2xl blur-sm"></div>

          <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="relative p-8 lg:p-12">
              <Stepper
                initialStep={1}
                onStepChange={handleStepChange}
                onFinalStepCompleted={handleFinalStepCompleted}
                backButtonText="Previous"
                nextButtonText="Next"
              >
                <Step>
                  <div className="text-center space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">
                      Welcome to Your Transformation
                    </h2>
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    </div>
                    <p className="text-zinc-300 text-lg leading-relaxed max-w-md mx-auto">
                      Begin your journey to ultimate power. We'll guide you through setting up your villainous profile.
                    </p>
                    {!validateStep(2) && currentStep > 1 && (
                      <div className="text-red-400 text-sm mt-4">
                        Please complete your identity details to proceed.
                      </div>
                    )}
                    <div className="text-sm text-zinc-500">
                      Step {currentStep} of 4
                    </div>
                  </div>
                </Step>

                <Step>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                      Reveal Your Identity
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-zinc-300 text-sm font-medium mb-2">
                          Villain Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateFormData({ name: e.target.value })}
                          placeholder="Dr. Doom, Lord Voldemort, etc..."
                          className={`w-full px-4 py-3 bg-zinc-800/50 border rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                            formData.name.trim() === '' ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-700 focus:border-red-500'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 text-sm font-medium mb-2">
                          Preferred Role
                        </label>
                        <select
                          value={formData.role}
                          onChange={(e) => updateFormData({ role: e.target.value })}
                          className={`w-full px-4 py-3 bg-zinc-800/50 border rounded-lg text-white focus:outline-none transition-colors ${
                            formData.role === '' ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-700 focus:border-red-500'
                          }`}
                        >
                          <option value="">Select your domain...</option>
                          <option value="mastermind">Evil Mastermind</option>
                          <option value="scientist">Mad Scientist</option>
                          <option value="sorcerer">Dark Sorcerer</option>
                          <option value="overlord">Galactic Overlord</option>
                          <option value="assassin">Shadow Assassin</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Step>

                <Step>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                      Powers & Abilities
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-zinc-300 text-sm font-medium mb-3">
                          Select Your Dark Arts
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Mind Control', 'Necromancy', 'Technology', 'Magic', 'Strategy', 'Combat'].map((skill) => (
                            <label key={skill} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.skills.includes(skill)}
                                onChange={(e) => toggleSkill(skill, e.target.checked)}
                                className="w-4 h-4 text-red-500 bg-zinc-800 border-zinc-600 rounded focus:ring-red-500"
                              />
                              <span className="text-zinc-300">{skill}</span>
                            </label>
                          ))}
                        </div>
                        {formData.skills.length === 0 && (
                          <div className="text-red-400 text-sm mt-2">
                            Please select at least one skill
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-zinc-300 text-sm font-medium mb-2">
                          Years of Evil Experience
                        </label>
                        <input
                          type="number"
                          value={formData.experience}
                          onChange={(e) => updateFormData({ experience: e.target.value })}
                          placeholder="How long have you been plotting?"
                          className={`w-full px-4 py-3 bg-zinc-800/50 border rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                            formData.experience.trim() === '' ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-700 focus:border-red-500'
                          }`}
                        />
                        {formData.experience.trim() === '' && (
                          <div className="text-red-400 text-sm mt-2">
                            Please enter your years of experience
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Step>

                <Step>
                  <div className="text-center space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">
                      Your Villainous Profile
                    </h2>
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/30 rounded-full"></div>
                    </div>
                    <div className="bg-zinc-800/30 rounded-lg p-6 text-left space-y-3">
                      <div><span className="text-zinc-400">Name:</span> <span className="text-white">{formData.name || 'Not specified'}</span></div>
                      <div><span className="text-zinc-400">Role:</span> <span className="text-white">{formData.role || 'Not specified'}</span></div>
                      <div><span className="text-zinc-400">Skills:</span> <span className="text-white">{formData.skills.join(', ') || 'None selected'}</span></div>
                      <div><span className="text-zinc-400">Experience:</span> <span className="text-white">{formData.experience || 'Not specified'} years</span></div>
                    </div>
                    <p className="text-zinc-300">
                      Ready to unleash your potential upon the world?
                    </p>
                  </div>
                </Step>
              </Stepper>
            </div>

            <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-red-500/50 to-transparent w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
          </div>

          <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500/10 rounded-full animate-float"></div>
          <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-zinc-500/10 rounded-full animate-float-delayed"></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in-footer">
          <p className="text-zinc-500 text-sm font-medium tracking-wide">
            Powered by Doom's Code. Forged in Fire.
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