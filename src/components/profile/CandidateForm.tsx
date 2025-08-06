"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "Vue.js",
  "Angular",
  "React Native",
  "Flutter",
  "Django",
  "Laravel",
  "Spring Boot",
];

const roleOptions = [
  "Frontend Developer",
  "Backend Engineer",
  "Fullstack Developer",
  "DevOps Specialist",
  "AI/ML Engineer",
  "Mobile App Developer",
  "UI/UX Designer",
  "Data Engineer",
  "Product Engineer",
  "Software Architect",
  "Technical Lead",
  "QA Engineer",
];

interface FormErrors {
  name?: string;
  backstory?: string;
  powers?: string;
  preferredRole?: string;
}

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
  const [customWeakness, setCustomWeakness] = useState("");
  const [customKeyBattle, setCustomKeyBattle] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!backstory.trim()) {
      newErrors.backstory = "Professional background is required";
    } else if (backstory.trim().length < 20) {
      newErrors.backstory = "Please provide at least 20 characters for your background";
    } else if (backstory.trim().length > 1000) {
      newErrors.backstory = "Background should be no more than 1000 characters";
    }

    if (powers.length === 0) {
      newErrors.powers = "Please select at least one technical skill";
    } else if (powers.length > 10) {
      newErrors.powers = "Please select no more than 10 skills to keep your profile focused";
    }

    if (!preferredRole) {
      newErrors.preferredRole = "Please select your preferred role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePower = (skill: string) => {
    setPowers((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      } else if (prev.length < 10) {
        return [...prev, skill];
      } else {
        toast.error("Maximum 10 skills allowed");
        return prev;
      }
    });
  };

  const addWeakness = () => {
    if (customWeakness.trim() && !weaknesses.includes(customWeakness.trim())) {
      if (weaknesses.length < 5) {
        setWeaknesses((prev) => [...prev, customWeakness.trim()]);
        setCustomWeakness("");
      } else {
        toast.error("Maximum 5 improvement areas allowed");
      }
    }
  };

  const removeWeakness = (weakness: string) => {
    setWeaknesses((prev) => prev.filter((w) => w !== weakness));
  };

  const addKeyBattle = () => {
    if (customKeyBattle.trim() && !keyBattles.includes(customKeyBattle.trim())) {
      if (keyBattles.length < 5) {
        setKeyBattles((prev) => [...prev, customKeyBattle.trim()]);
        setCustomKeyBattle("");
      } else {
        toast.error("Maximum 5 key projects allowed");
      }
    }
  };

  const removeKeyBattle = (battle: string) => {
    setKeyBattles((prev) => prev.filter((b) => b !== battle));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUser({
        name: name.trim(),
        backstory: backstory.trim(),
        powers,
        weaknesses: weaknesses.filter(w => w.trim()),
        keyBattles: keyBattles.filter(b => b.trim()),
        preferredRole,
      });
      toast.success("Profile updated successfully!");
      router.push("/jobs");
    } catch (err: any) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!clerkId) {
    return <div className="text-center py-10 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Professional Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({...prev, name: undefined}));
                }}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Backstory Field */}
            <div className="space-y-2">
              <Label htmlFor="backstory">Professional Background *</Label>
              <Textarea
                id="backstory"
                placeholder="Tell us about your professional journey, experience, interests, and what drives you in tech..."
                value={backstory}
                onChange={(e) => {
                  setBackstory(e.target.value);
                  if (errors.backstory) setErrors(prev => ({...prev, backstory: undefined}));
                }}
                rows={4}
                className={errors.backstory ? "border-red-500" : ""}
              />
              <div className="text-sm text-muted-foreground">
                {backstory.length}/1000 characters
              </div>
              {errors.backstory && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.backstory}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Technical Skills */}
            <div className="space-y-3">
              <Label>Technical Skills * (Select up to 10)</Label>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => togglePower(skill)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      powers.includes(skill)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary hover:bg-secondary/80 border-border"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {powers.length}/10 skills selected
              </div>
              {errors.powers && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.powers}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Preferred Role */}
            <div className="space-y-2">
              <Label>Preferred Role *</Label>
              <Select value={preferredRole} onValueChange={(value) => {
                setPreferredRole(value);
                if (errors.preferredRole) setErrors(prev => ({...prev, preferredRole: undefined}));
              }}>
                <SelectTrigger className={errors.preferredRole ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your preferred role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.preferredRole && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.preferredRole}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Areas for Improvement */}
            <div className="space-y-3">
              <Label>Areas for Improvement (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Testing, System Design, Leadership"
                  value={customWeakness}
                  onChange={(e) => setCustomWeakness(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addWeakness();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addWeakness}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((weakness, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {weakness}
                    <button
                      type="button"
                      onClick={() => removeWeakness(weakness)}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              {weaknesses.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {weaknesses.length}/5 areas added
                </div>
              )}
            </div>

            {/* Key Projects/Achievements */}
            <div className="space-y-3">
              <Label>Key Projects & Achievements (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Built e-commerce platform, Scaled backend to handle 1M users"
                  value={customKeyBattle}
                  onChange={(e) => setCustomKeyBattle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addKeyBattle();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addKeyBattle}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {keyBattles.map((battle, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {battle}
                    <button
                      type="button"
                      onClick={() => removeKeyBattle(battle)}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              {keyBattles.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {keyBattles.length}/5 projects added
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Saving..." : "Save Profile"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/jobs")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}