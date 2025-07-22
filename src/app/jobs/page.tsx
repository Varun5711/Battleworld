"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoaderUI from "@/components/shared/LoaderUI";
import toast from "react-hot-toast";

export default function JobsPage() {
  const { user } = useUser();
  const router = useRouter();

  const jobs = useQuery(api.jobs.getAllJobs);

  if (!user) {
    toast.error("You must be logged in to view jobs.");
    return null;
  }

  if (jobs === undefined) {
    return (
      <div className="text-center mt-10">
        <LoaderUI />
        <p>Loading job openings...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-400">
        No job openings right now. Come back later!
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">💼 Available Multiverse Missions</h1>

      <div className="grid sm:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <Card key={job._id} className="shadow-lg border border-muted">
            <CardContent className="p-5 space-y-3">
              <h2 className="text-xl font-bold">{job.title}</h2>
              <p className="text-muted-foreground text-sm">{job.description}</p>
              <Button
                onClick={() => router.push(`/jobs/${job._id}/apply`)}
                className="w-full"
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}