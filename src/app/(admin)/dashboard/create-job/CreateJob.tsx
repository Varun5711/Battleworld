"use client";

import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import LoaderUI from "@/components/shared/LoaderUI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
      toast.error("All fields are required.");
      return;
    }

    try {
      await createJob(formData);
      toast.success("Job created successfully!");
      router.push("/dashboard/jobs");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create job.");
    }
  };

  if (isLoading) return <LoaderUI />;
  if (!isInterviewer) {
    router.push("/");
    return null;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Create a New Job</h1>

      <div className="space-y-4">
        <Input
          placeholder="Job title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />

        <Textarea
          placeholder="Job description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={4}
        />

        <Input
          placeholder="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
        />

        <Button onClick={handleSubmit}>Create Job</Button>
      </div>
    </div>
  );
}