"use client";

import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2Icon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { isInterviewer, isLoading } = useUserRole();

  const navLinks = isInterviewer
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/dashboard/create-job", label: "Create Job" },
        { href: "/dashboard/jobs", label: "My Jobs" },
        { href: "/schedule", label: "Schedule" },
        { href: "/chat", label: "Chat" },
        { href: "/recordings", label: "Recordings" },
      ]
    : [];

  return (
    <header className="w-full border-b bg-background/60 backdrop-blur-md z-50">
      <nav className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold">
          🌀 CodePair
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            {isLoading ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium hover:underline",
                    pathname.startsWith(link.href)
                      ? "text-blue-600"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))
            )}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm text-blue-600 hover:underline">
                Login
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}