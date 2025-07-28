"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useCandidate } from "@/hooks/useCandidate";
import { Edit2, Check, X } from "lucide-react";

const skillsList = [
  "React.js",
  "Next.js", 
  "MongoDB",
  "Node.js",
  "TypeScript",
  "Docker",
  "PostgreSQL",
  "Express.js",
  "Tailwind CSS",
  "GraphQL",
  "Firebase",
  "Redis",
  "Kubernetes",
  "CI/CD",
  "Jest",
  "Prisma",
  "AWS",
];

export default function CandidateProfilePage() {
  const router = useRouter();
  const { candidate, clerkId } = useCandidate();
  const updateUser = useMutation(api.users.updateUserProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [backstory, setBackstory] = useState("");
  const [powers, setPowers] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [keyBattles, setKeyBattles] = useState<string[]>([]);
  const [preferredRole, setPreferredRole] = useState("");

  useEffect(() => {
    if (candidate) {
      setName(candidate.name ?? "");
      setBackstory(candidate.backstory ?? "");
      setPowers(candidate.powers ?? []);
      setWeaknesses(candidate.weaknesses ?? []);
      setKeyBattles(candidate.keyBattles ?? []);
      setPreferredRole(candidate.preferredRole ?? "");
    }
  }, [candidate]);

  const togglePower = (skill: string) => {
    setPowers((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !backstory || powers.length === 0 || !preferredRole) {
      toast.error("Please complete all required fields.");
      return;
    }

    try {
      await updateUser({
        name,
        backstory,
        powers,
        weaknesses,
        keyBattles,
        preferredRole,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  const handleCancel = () => {
    if (candidate) {
      setName(candidate.name ?? "");
      setBackstory(candidate.backstory ?? "");
      setPowers(candidate.powers ?? []);
      setWeaknesses(candidate.weaknesses ?? []);
      setKeyBattles(candidate.keyBattles ?? []);
      setPreferredRole(candidate.preferredRole ?? "");
    }
    setIsEditing(false);
  };

  if (!clerkId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-blue-200 font-medium">LOADING_PROFILE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 text-white font-mono">
      
      {/* Subtle background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/2 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="w-full px-8 pt-16 pb-12">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-600 bg-clip-text font-mono tracking-tight leading-none uppercase">
                PROFILE
              </h1>
              <p className="text-xl text-blue-200 font-light max-w-2xl leading-tight font-mono">
                SHAPE_YOUR_PROFESSIONAL_IDENTITY // SHOWCASE_EXPERTISE
              </p>
            </div>
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-black font-mono flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25 uppercase tracking-wide"
              >
                <Edit2 className="w-5 h-5" />
                EDIT_PROFILE
              </button>
            ) : (
              <div className="flex gap-4">
                <button 
                  onClick={handleCancel}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-6 py-4 rounded-xl font-black font-mono flex items-center gap-3 transition-all duration-300 border border-gray-700 hover:border-gray-600 uppercase tracking-wide"
                >
                  <X className="w-5 h-5" />
                  CANCEL
                </button>
                <button 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-4 rounded-xl font-black font-mono flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25 uppercase tracking-wide"
                >
                  <Check className="w-5 h-5" />
                  SAVE_CHANGES
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="w-full px-8 pb-16">
          <div className="space-y-10">
            
            {/* Basic Information */}
            <div className="group relative w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                              <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-600 bg-clip-text font-mono mb-2 tracking-tight leading-none uppercase">
                    BASIC_INFORMATION
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black font-mono text-blue-300/70 uppercase tracking-wider">
                      FULL_NAME *
                    </label>
                    {isEditing ? (
                      <Input
                        className="bg-slate-950/50 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20 text-lg py-6 rounded-xl transition-all duration-300 font-mono"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    ) : (
                      <div className="text-xl text-white py-4 font-mono font-black uppercase tracking-wide">
                        {name || "NOT_PROVIDED"}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-black font-mono text-blue-300/70 uppercase tracking-wider">
                      PREFERRED_ROLE *
                    </label>
                    {isEditing ? (
                      <select
                        className="w-full bg-slate-950/50 border border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20 rounded-xl px-4 py-6 text-lg transition-all duration-300 font-mono"
                        value={preferredRole}
                        onChange={(e) => setPreferredRole(e.target.value)}
                        required
                      >
                        <option value="">Select a role</option>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Data Engineer">Data Engineer</option>
                        <option value="Mobile Developer">Mobile Developer</option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                        <option value="Product Manager">Product Manager</option>
                      </select>
                    ) : (
                      <div className="text-xl text-white py-4 font-mono font-black uppercase tracking-wide">
                        {preferredRole || "NOT_SPECIFIED"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="group relative w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-600 bg-clip-text font-mono mb-2 tracking-tight leading-none uppercase">
                    ABOUT
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-black font-mono text-blue-300/70 uppercase tracking-wider">
                    PROFESSIONAL_SUMMARY *
                  </label>
                  {isEditing ? (
                    <Textarea
                      className="bg-black/50 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20 min-h-[140px] text-lg rounded-xl transition-all duration-300 resize-none font-mono"
                      placeholder="Tell us about your background, experience, and what drives you professionally..."
                      value={backstory}
                      onChange={(e) => setBackstory(e.target.value)}
                      rows={6}
                      required
                    />
                  ) : (
                    <div className="text-lg text-blue-100 leading-relaxed py-4 font-mono">
                      {backstory || "NO_SUMMARY_PROVIDED"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="group relative w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-600 bg-clip-text font-mono mb-2 tracking-tight leading-none uppercase">
                    TECHNICAL_SKILLS
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                </div>
                
                <div className="space-y-6">
                  <label className="text-sm font-black font-mono text-blue-300/70 uppercase tracking-wider">
                    SELECT_YOUR_SKILLS *
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {skillsList.map((skill) => (
                      <button
                        type="button"
                        key={skill}
                        onClick={isEditing ? () => togglePower(skill) : undefined}
                        disabled={!isEditing}
                        className={`px-6 py-3 rounded-xl text-sm font-black font-mono border-2 transition-all duration-300 uppercase tracking-wide ${
                          powers.includes(skill)
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500 shadow-lg shadow-blue-500/25"
                            : isEditing
                            ? "bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 hover:scale-105"
                            : "bg-slate-800/30 text-slate-400 border-slate-700"
                        } ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  {powers.length === 0 && (
                    <p className="text-blue-400/70 text-center py-4 font-mono font-black uppercase tracking-wide">NO_SKILLS_SELECTED</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid lg:grid-cols-2 gap-8 w-full">
              
              {/* Areas for Growth */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300 h-full">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-600 bg-clip-text font-mono mb-2 tracking-tight leading-none uppercase">
                      AREAS_FOR_GROWTH
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  </div>
                  
                  <div className="space-y-3">
                    {isEditing ? (
                      <Input
                        className="bg-slate-950/50 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20 text-base py-4 rounded-xl transition-all duration-300 font-mono"
                        placeholder="e.g., Machine Learning, System Design"
                        value={weaknesses.join(", ")}
                        onChange={(e) =>
                          setWeaknesses(e.target.value.split(",").map((s) => s.trim()).filter(s => s))
                        }
                      />
                    ) : (
                      <div className="space-y-3">
                        {weaknesses.length > 0 ? (
                          weaknesses.map((weakness, index) => (
                            <div key={index} className="text-blue-100 flex items-center gap-3 font-mono">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              {weakness}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-center py-4 font-mono font-black uppercase tracking-wide">NOT_SPECIFIED</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Projects */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 hover:border-gray-600/50 transition-all duration-300 h-full">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black font-mono bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2 tracking-tighter uppercase">
                      KEY_PROJECTS
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  </div>
                  
                  <div className="space-y-3">
                    {isEditing ? (
                      <Input
                        className="bg-black/50 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20 text-base py-4 rounded-xl transition-all duration-300 font-mono"
                        placeholder="e.g., E-commerce Platform, Mobile App"
                        value={keyBattles.join(", ")}
                        onChange={(e) =>
                          setKeyBattles(e.target.value.split(",").map((s) => s.trim()).filter(s => s))
                        }
                      />
                    ) : (
                      <div className="space-y-3">
                        {keyBattles.length > 0 ? (
                          keyBattles.map((battle, index) => (
                            <div key={index} className="text-gray-100 flex items-center gap-3 font-mono">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              {battle}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-center py-4 font-mono font-black uppercase tracking-wide">NO_PROJECTS_LISTED</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}