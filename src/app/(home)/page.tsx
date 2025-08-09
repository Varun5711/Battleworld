"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import DoomModal from "@/components/auth/DoomModal";
import Aurora from "../../components/shared/Aurora";

interface Review {
  name: string;
  username: string;
  body: string;
  img: string;
}

const reviews: Review[] = [
  {
    name: "Stark Industries",
    username: "@starkindustries",
    body: "BattleWorld gave our team the edge we needed to innovate faster and smarter. From strategy to execution, it's been a game-changer.",
    img: "https://avatar.vercel.sh/stark",
  },
  {
    name: "Wakanda",
    username: "@wakanda",
    body: "Thanks to BattleWorld, our warriors trained in simulated scenarios that pushed their limits. Vibranium wasn't our only weapon anymore.",
    img: "https://avatar.vercel.sh/wakanda",
  },
  {
    name: "LexCorp",
    username: "@dc",
    body: "BattleWorld was the perfect simulation to test both might and intellect. We don't just survive—we dominate. Credit goes to the battlefield that made us sharper.",
    img: "https://avatar.vercel.sh/lex",
  },
  {
    name: "Wayne Enterprises",
    username: "@wayne",
    body: "BattleWorld exposed our weaknesses before the real enemies could. That kind of insight is priceless.",
    img: "https://avatar.vercel.sh/wayne",
  },
  {
    name: "Hydra",
    username: "@hydra",
    body: "Cut off one head, two more train in BattleWorld. Our resurgence is no accident.",
    img: "https://avatar.vercel.sh/hydra",
  },
  {
    name: "S.H.I.E.L.D.",
    username: "@shield",
    body: "With BattleWorld, our agents faced the unexpected—and won. Preparedness is our superpower.",
    img: "https://avatar.vercel.sh/shield",
  },
];

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="flex-shrink-0 w-72 sm:w-80 mx-2 sm:mx-4 p-4 sm:p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300">
    <div className="flex items-center gap-3 mb-3 sm:mb-4">
      <img
        src={review.img}
        alt={review.name}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20"
      />
      <div>
        <h3 className="font-mono text-xs sm:text-sm font-semibold text-white">
          {review.name}
        </h3>
        <p className="font-mono text-xs text-gray-400">{review.username}</p>
      </div>
    </div>
    <p className="font-mono text-xs sm:text-sm text-gray-300 leading-relaxed">
      "{review.body}"
    </p>
  </div>
);

const MarqueeReviews = () => {
  return (
    <div className="relative overflow-hidden py-8 sm:py-12">
      <div className="flex animate-marquee">
        {/* First set of reviews */}
        {reviews.map((review, index) => (
          <ReviewCard key={`first-${index}`} review={review} />
        ))}
        {/* Duplicate set for seamless loop */}
        {reviews.map((review, index) => (
          <ReviewCard key={`second-${index}`} review={review} />
        ))}
      </div>

      {/* Fade gradients */}
      <div className="absolute top-0 left-0 w-16 sm:w-32 h-full bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute top-0 right-0 w-16 sm:w-32 h-full bg-gradient-to-l from-black to-transparent z-10" />
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const { user } = useUser();

  const [showDoomModal, setShowDoomModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const dbUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (user && dbUser === null) {
      createUser({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName || "Unknown",
        image: user.imageUrl,
      });
    }
  }, [user, dbUser, createUser]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative w-full min-h-screen overflow-hidden bg-black text-white">
        {/* Aurora Background */}
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={["#005F3C", "#00FFAA", "#1B1B1B", "#C0C0C0"]}
            blend={2}
            amplitude={0.45}
            speed={1}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Main Content */}
        <div className="relative z-20 min-h-screen flex flex-col justify-center px-4 sm:px-8 max-w-5xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-12 sm:mb-16 transform transition-all duration-1000 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >

            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black font-mono tracking-tighter mb-4 sm:mb-6 bg-gradient-to-r from-green-400 via-gray-500 to-gray-300 bg-clip-text text-transparent leading-tight">
              BATTLEWORLD
            </h1>
            <p className="text-lg sm:text-xl font-mono text-gray-300 tracking-wide">
              Ultimate Arena
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex flex-col gap-4 sm:gap-6 justify-center items-center mb-16 sm:mb-20 transform transition-all duration-1000 delay-300 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {!dbUser?.role || dbUser.role === "candidate" ? (
              <>
                <button
                  onClick={() => router.push("/profile/setup")}
                  className="group w-full max-w-xs sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 font-mono text-xs sm:text-sm tracking-wider uppercase"
                >
                  <span className="group-hover:text-white transition-colors">
                    Hero Registration
                  </span>
                </button>

                <button
                  onClick={() => setShowDoomModal(true)}
                  className="group w-full max-w-xs sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 hover:from-blue-600/30 hover:to-purple-600/30 hover:border-blue-400/50 transition-all duration-300 font-mono text-xs sm:text-sm tracking-wider uppercase"
                >
                  <span className="group-hover:text-blue-100 transition-colors">
                    Doom's Tribunal
                  </span>
                </button>
              </>
            ) : dbUser.role === "interviewer" ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full max-w-xs sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 hover:bg-emerald-600/30 hover:border-emerald-400/50 transition-all duration-300 font-mono text-xs sm:text-sm tracking-wider uppercase"
              >
                Enter Dashboard
              </button>
            ) : null}
          </div>

          {/* Quote */}
          <div
            className={`text-center max-w-3xl mx-auto mb-16 sm:mb-20 transform transition-all duration-1000 delay-500 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <blockquote className="text-lg sm:text-2xl font-mono font-light text-gray-300 italic mb-4 leading-relaxed px-4">
              "Heroes seek glory. Villains demand legacy."
            </blockquote>
            <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto" />
          </div>

          {/* Reviews Marquee */}
          <div
            className={`mb-16 sm:mb-20 transform transition-all duration-1000 delay-600 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <MarqueeReviews />
          </div>

          {/* Footer Tech */}
          <div
            className={`flex flex-col items-center gap-3 transform transition-all duration-1000 delay-700 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs font-mono text-gray-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                <span>Clerk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                <span>ConvexDB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
                <span>Stream.io</span>
              </div>
            </div>

            <div className="text-xs font-mono text-gray-500 tracking-wide text-center px-4">
              Made with passion by{" "}
              <a
                href="https://github.com/Varun5711"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-white transition-colors"
              >
                Varun
              </a>
            </div>
          </div>
        </div>

        {/* Doom Modal */}
        {showDoomModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
            <DoomModal onClose={() => setShowDoomModal(false)} />
          </div>
        )}
      </div>
    </>
  );
}