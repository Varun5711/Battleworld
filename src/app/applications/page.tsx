"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function ApplicationsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const apps = useQuery(api.applications.getMyApplications, {
    candidateId: user?.id ?? "",
  });

  if (!isLoaded || !user) {
    return (
      <div className="text-center mt-20 text-lg">
        Please sign in to view your applications.
      </div>
    );
  }

  if (apps === undefined) {
    return (
      <div className="flex items-center justify-center mt-20 space-x-2 text-lg">
        <Loader2 className="animate-spin w-5 h-5" />
        <span>Loading your applications...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Your Applications</h1>

      {apps.length === 0 && (
        <p className="text-muted-foreground text-center">
          You haven’t applied to any jobs yet.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => (
          <Card key={app._id} className="border shadow-sm">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">🧠 Job ID: {app.jobId}</h2>
              <p className="text-sm text-muted-foreground">
                Submitted: {new Date(app._creationTime).toLocaleDateString()}
              </p>
              <Badge
                variant={
                  app.status === "pending"
                    ? "secondary"
                    : app.status === "shortlisted"
                    ? "default"
                    : "destructive"
                }
              >
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </Badge>

              {/* Only show chat if status is shortlisted AND interviewerId exists */}
              {app.status === "shortlisted" && app.interviewerId && (
                <button
                  onClick={() => router.push(`/chat/${app.interviewerId}`)}
                  className="mt-2 text-sm font-medium text-primary underline"
                >
                  Chat with Interviewer 💬
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}