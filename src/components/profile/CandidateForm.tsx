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

export default function CandidateForm() {
  const router = useRouter();
  const { candidate, clerkId } = useCandidate();
  const updateUser = useMutation(api.users.updateUserProfile);

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
      router.push("/jobs");
    } catch (err: any) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  if (!clerkId) {
    return <div className="text-center py-10 text-muted-foreground">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto px-4 py-6">
      <Input
        placeholder="Your Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Textarea
        placeholder="Tell us a bit about your professional journey, background or interests..."
        value={backstory}
        onChange={(e) => setBackstory(e.target.value)}
        rows={4}
        required
      />

      <div>
        <p className="font-semibold mb-2">Select Your Technical Skills:</p>
        <div className="flex flex-wrap gap-2">
          {skillsList.map((skill) => (
            <button
              type="button"
              key={skill}
              onClick={() => togglePower(skill)}
              className={`px-3 py-1 rounded-full text-sm border ${
                powers.includes(skill)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <Input
        placeholder="Mention areas you'd like to improve (e.g., testing, design patterns)"
        value={weaknesses.join(", ")}
        onChange={(e) =>
          setWeaknesses(e.target.value.split(",").map((s) => s.trim()))
        }
      />

      <Input
        placeholder="Mention past projects or challenges (e.g., built e-commerce app, scaled backend)"
        value={keyBattles.join(", ")}
        onChange={(e) =>
          setKeyBattles(e.target.value.split(",").map((s) => s.trim()))
        }
      />

      <select
        className="w-full border rounded px-3 py-2"
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

      <Button type="submit">Save Profile</Button>
    </form>
  );
}