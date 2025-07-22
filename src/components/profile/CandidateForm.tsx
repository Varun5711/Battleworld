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

const powersList = [
  "Flight",
  "Telekinesis",
  "Invisibility",
  "Laser Vision",
  "Web-slinging",
  "Speed",
  "Strength",
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

  const togglePower = (power: string) => {
    setPowers((prev) =>
      prev.includes(power)
        ? prev.filter((p) => p !== power)
        : [...prev, power]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !backstory || powers.length === 0 || !preferredRole) {
      toast.error("Please fill all required fields.");
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
        placeholder="Hero Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Textarea
        placeholder="Your Origin Story"
        value={backstory}
        onChange={(e) => setBackstory(e.target.value)}
        rows={4}
        required
      />

      <div>
        <p className="font-semibold mb-2">Select Powers:</p>
        <div className="flex flex-wrap gap-2">
          {powersList.map((power) => (
            <button
              type="button"
              key={power}
              onClick={() => togglePower(power)}
              className={`px-3 py-1 rounded-full text-sm border ${
                powers.includes(power)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {power}
            </button>
          ))}
        </div>
      </div>

      <Input
        placeholder="Weaknesses (comma-separated)"
        value={weaknesses.join(", ")}
        onChange={(e) =>
          setWeaknesses(e.target.value.split(",").map((s) => s.trim()))
        }
      />

      <Input
        placeholder="Key Battles (comma-separated)"
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
        <option value="Frontend Avenger">Frontend Avenger</option>
        <option value="Backend Mutant">Backend Mutant</option>
        <option value="Fullstack Sorcerer">Fullstack Sorcerer</option>
      </select>

      <Button type="submit">Save Profile</Button>
    </form>
  );
}