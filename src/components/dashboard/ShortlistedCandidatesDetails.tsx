"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  applications: {
    _id: string;
    candidateClerkId: string;
    candidateName: string;
    jobTitle: string;
    status: string;
    _creationTime: number;
    chatButton?: ReactNode;
  }[];
};

export default function ShortlistedCandidatesDetails({ applications }: Props) {
  const router = useRouter();

  return (
    <div className="mt-6 space-y-6">
      <div className="border-b border-emerald-800/50 pb-4">
        <h2 className="text-2xl font-light text-emerald-100 tracking-wide">Selected Candidates</h2>
        <p className="text-emerald-400/80 text-sm font-light mt-1">Elite prospects approved for advancement</p>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-emerald-950/30 backdrop-blur-sm border border-emerald-800/40 rounded-lg p-6 hover:bg-emerald-950/50 hover:border-emerald-700/60 transition-all duration-200"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Candidate</span>
                    <p className="text-emerald-200/90 font-light mt-1">{app.candidateName}</p>
                  </div>

                  <div>
                    <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Assignment</span>
                    <p className="text-emerald-200/90 font-light mt-1">{app.jobTitle}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Status</span>
                    <div className="mt-1">
                      <span className="px-3 py-1 bg-emerald-900/40 border border-emerald-700/50 rounded text-emerald-300 text-sm font-light">
                        {app.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Selected</span>
                    <p className="text-emerald-300/70 font-light text-sm mt-1">
                      {new Date(app._creationTime).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {app.chatButton && (
                <div className="pt-4 border-t border-emerald-800/40">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-500/70 text-xs font-medium uppercase tracking-wider">
                      Candidate ID #{app._id.slice(-6)}
                    </span>
                    <button
                      onClick={() => router.push(`/chat/${app.candidateClerkId}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-sm text-white font-medium rounded-md transition-all duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.722 0-3.325-.435-4.656-1.193L3 20l1.062-3.656C3.387 15.307 3 13.7 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Initiate Communication
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}