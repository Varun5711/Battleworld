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
import { EditIcon, UserIcon, BrainIcon, ShieldIcon, SwordIcon, TargetIcon, CheckIcon, XIcon } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-xl text-gray-300 font-light tracking-wide">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-gray-900 to-black">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-blue-900/10"></div>
        <div className="relative max-w-6xl mx-auto px-8 pt-20 pb-16">
          <div className="flex items-center justify-between">
            <div className="space-y-6">
              <h1 className="text-7xl font-thin tracking-tight bg-gradient-to-br from-blue-400 via-blue-300 to-white bg-clip-text text-transparent drop-shadow-2xl" 
                  style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
                PROFILE
              </h1>
              <p className="text-2xl font-light text-gray-300 tracking-wide max-w-2xl leading-relaxed">
                Your professional identity and technical mastery. Shape your narrative for success.
              </p>
            </div>
            
            <div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 text-white 
                           px-12 py-4 rounded-full text-lg font-medium tracking-wide flex items-center gap-3
                           hover:bg-white/10 hover:border-white/20 transition-all duration-500
                           hover:scale-105 active:scale-95 shadow-2xl hover:shadow-blue-900/20"
                >
                  <EditIcon className="w-5 h-5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-4">
                  <button 
                    onClick={handleCancel}
                    className="bg-gray-600/20 backdrop-blur-xl border border-gray-500/30 text-gray-300 
                             px-8 py-4 rounded-full text-lg font-medium tracking-wide flex items-center gap-3
                             hover:bg-gray-600/30 hover:border-gray-400/40 transition-all duration-500"
                  >
                    <XIcon className="w-5 h-5" />
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="bg-blue-600/80 backdrop-blur-xl border border-blue-500/60 text-white 
                             px-8 py-4 rounded-full text-lg font-medium tracking-wide flex items-center gap-3
                             hover:bg-blue-600/90 hover:border-blue-400/70 transition-all duration-500
                             hover:scale-105 active:scale-95 shadow-2xl hover:shadow-blue-900/20"
                  >
                    <CheckIcon className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[1400px] mx-auto px-8 pb-20">
        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Basic Information Card */}
          <div className="relative bg-gradient-to-br from-gray-900/80 via-zinc-900/90 to-black/95 
                        backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 
                        hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-900/20 
                        transition-all duration-500 overflow-hidden group">
            
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-blue-700/5 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-400/60 to-blue-500/0 
                          rounded-t-2xl group-hover:via-blue-300/80 transition-all duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-3xl font-thin tracking-wide bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent"
                    style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
                  Basic Information
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="text-sm font-medium text-blue-300 tracking-wide block mb-3">Full Name</label>
                  {isEditing ? (
                    <Input
                      className="bg-blue-950/30 border-blue-800/40 text-blue-100 
                               focus:border-blue-600/60 focus:ring-blue-600/20
                               placeholder:text-blue-400/50 text-lg py-4"
                      placeholder="Your Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  ) : (
                    <div className="text-2xl font-light text-gray-100 tracking-wide">{name || "Not provided"}</div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-blue-300 tracking-wide block mb-3">Preferred Role</label>
                  {isEditing ? (
                    <select
                      className="w-full bg-blue-950/30 border border-blue-800/40 text-blue-100 
                               focus:border-blue-600/60 focus:ring-blue-600/20 rounded-lg px-4 py-4 text-lg"
                      value={preferredRole}
                      onChange={(e) => setPreferredRole(e.target.value)}
                      required
                    >
                      <option value="">Select Preferred Role</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Engineer">Backend Engineer</option>
                      <option value="Fullstack Developer">Fullstack Developer</option>
                      <option value="DevOps Specialist">DevOps Specialist</option>
                      <option value="AI/ML Engineer">AI/ML Engineer</option>
                      <option value="Mobile App Developer">Mobile App Developer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Data Engineer">Data Engineer</option>
                      <option value="Product Engineer">Product Engineer</option>
                    </select>
                  ) : (
                    <div className="text-2xl font-light text-gray-100 tracking-wide">{preferredRole || "Not specified"}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-500/0 via-blue-400/40 to-blue-500/0 
                          rounded-r-full group-hover:via-blue-300/60 transition-all duration-500"></div>
          </div>

          {/* Professional Journey Card */}
          <div className="relative bg-gradient-to-br from-gray-900/80 via-zinc-900/90 to-black/95 
                        backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 
                        hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-900/20 
                        transition-all duration-500 overflow-hidden group">
            
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-blue-700/5 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-400/60 to-blue-500/0 
                          rounded-t-2xl group-hover:via-blue-300/80 transition-all duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <BrainIcon className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-3xl font-thin tracking-wide bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent"
                    style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
                  Professional Journey
                </h2>
              </div>
              
              <div>
                <label className="text-sm font-medium text-blue-300 tracking-wide block mb-3">Your Story</label>
                {isEditing ? (
                  <Textarea
                    className="bg-blue-950/30 border-blue-800/40 text-blue-100 
                             focus:border-blue-600/60 focus:ring-blue-600/20
                             placeholder:text-blue-400/50 min-h-[120px] text-lg"
                    placeholder="Tell us about your professional journey, background, and interests..."
                    value={backstory}
                    onChange={(e) => setBackstory(e.target.value)}
                    rows={6}
                    required
                  />
                ) : (
                  <div className="text-lg font-light text-gray-100 leading-relaxed tracking-wide">
                    {backstory || "No story provided yet."}
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-500/0 via-blue-400/40 to-blue-500/0 
                          rounded-r-full group-hover:via-blue-300/60 transition-all duration-500"></div>
          </div>

          {/* Technical Skills Card */}
          <div className="relative bg-gradient-to-br from-gray-900/80 via-zinc-900/90 to-black/95 
                        backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 
                        hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-900/20 
                        transition-all duration-500 overflow-hidden group">
            
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-blue-700/5 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-400/60 to-blue-500/0 
                          rounded-t-2xl group-hover:via-blue-300/80 transition-all duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <ShieldIcon className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-3xl font-thin tracking-wide bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent"
                    style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
                  Technical Arsenal
                </h2>
              </div>
              
              <div>
                <label className="text-sm font-medium text-blue-300 tracking-wide block mb-4">Your Skills & Technologies</label>
                <div className="flex flex-wrap gap-3">
                  {skillsList.map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      onClick={isEditing ? () => togglePower(skill) : undefined}
                      disabled={!isEditing}
                      className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide border transition-all duration-300 ${
                        powers.includes(skill)
                          ? "bg-blue-600/80 text-white border-blue-500/60 shadow-lg shadow-blue-900/30"
                          : isEditing
                          ? "bg-gray-700/50 text-gray-300 border-gray-600/50 hover:bg-gray-600/60 hover:border-gray-500/60"
                          : "bg-gray-800/30 text-gray-400 border-gray-700/30"
                      } ${isEditing ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {powers.length === 0 && (
                  <p className="text-gray-400 font-light mt-4">No skills selected yet.</p>
                )}
              </div>
            </div>
            
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-500/0 via-blue-400/40 to-blue-500/0 
                          rounded-r-full group-hover:via-blue-300/60 transition-all duration-500"></div>
          </div>

          {/* Growth Areas & Achievements Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Growth Areas Card */}
            <div className="relative bg-gradient-to-br from-gray-900/80 via-zinc-900/90 to-black/95 
                          backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 
                          hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-900/20 
                          transition-all duration-500 overflow-hidden group">
              
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-blue-700/5 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-400/60 to-blue-500/0 
                            rounded-t-2xl group-hover:via-blue-300/80 transition-all duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <TargetIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-thin tracking-wide bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent"
                      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
                    Growth Areas
                  </h3>
                </div>
                
                {isEditing ? (
                  <Input
                    className="bg-blue-950/30 border-blue-800/40 text-blue-100 
                             focus:border-blue-600/60 focus:ring-blue-600/20
                             placeholder:text-blue-400/50"
                    placeholder="Areas you'd like to improve (comma-separated)"
                    value={weaknesses.join(", ")}
                    onChange={(e) =>
                      setWeaknesses(e.target.value.split(",").map((s) => s.trim()).filter(s => s))
                    }
                  />
                ) : (
                  <div className="space-y-2">
                    {weaknesses.length > 0 ? (
                      weaknesses.map((weakness, index) => (
                        <div key={index} className="text-gray-100 font-light tracking-wide">
                          • {weakness}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 font-light">No growth areas specified.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-500/0 via-blue-400/40 to-blue-500/0 
                            rounded-r-full group-hover:via-blue-300/60 transition-all duration-500"></div>
            </div>

            {/* Key Achievements Card */}
            <div className="relative bg-gradient-to-br from-gray-900/80 via-zinc-900/90 to-black/95 
                          backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 
                          hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-900/20 
                          transition-all duration-500 overflow-hidden group">
              
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-blue-700/5 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-400/60 to-blue-500/0 
                            rounded-t-2xl group-hover:via-blue-300/80 transition-all duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <SwordIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-thin tracking-wide bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent"
                      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
                    Key Achievements
                  </h3>
                </div>
                
                {isEditing ? (
                  <Input
                    className="bg-blue-950/30 border-blue-800/40 text-blue-100 
                             focus:border-blue-600/60 focus:ring-blue-600/20
                             placeholder:text-blue-400/50"
                    placeholder="Notable projects or challenges (comma-separated)"
                    value={keyBattles.join(", ")}
                    onChange={(e) =>
                      setKeyBattles(e.target.value.split(",").map((s) => s.trim()).filter(s => s))
                    }
                  />
                ) : (
                  <div className="space-y-2">
                    {keyBattles.length > 0 ? (
                      keyBattles.map((battle, index) => (
                        <div key={index} className="text-gray-100 font-light tracking-wide">
                          • {battle}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 font-light">No achievements listed yet.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-500/0 via-blue-400/40 to-blue-500/0 
                            rounded-r-full group-hover:via-blue-300/60 transition-all duration-500"></div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}