import type { Metadata } from "next";
import localFont from "next/font/local";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";

import { ThemeProvider } from "@/providers/ThemeProvider";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import StreamVideoProvider from "@/providers/StreamClientProvider";

import PageTransitionWrapper from "@/components/shared/PageWrapper";
import ToasterClient from "@/components/shared/ToasterClient";

import { SignedIn, SignedOut, SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Loader from "@/components/shared/LoaderUI";
import NavbarWrapper from "@/components/shared/NavbarWrapper";
import SyncClerkUser from "@/components/SyncClerkUser";
import ClickSpark from "@/components/shared/ClickSpark";

const geistSans = localFont({
  src: "./fonts/GeistVFfont.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BattleWorld – Doom's Multiversal Recruiter",
  description: "Recruit elite warriors for BattleWorld. Powered by Convex, Clerk, and Stream.io",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <ConvexClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ClickSpark
              sparkColor="#fff"
              sparkSize={10}
              sparkRadius={15}
              sparkCount={8}
              duration={400}
            >
              <ClerkLoading>
                <Loader />
              </ClerkLoading>

              <ClerkLoaded>
                <SignedIn>
                  <SyncClerkUser />
                  <StreamVideoProvider>
                    <div className="min-h-screen flex flex-col">
                      <NavbarWrapper />
                      <main className="flex-1">
                        <PageTransitionWrapper>{children}</PageTransitionWrapper>
                      </main>
                    </div>
                  </StreamVideoProvider>
                </SignedIn>

                <SignedOut>
                  <SignIn routing="hash" />
                </SignedOut>
              </ClerkLoaded>
            </ClickSpark>
          </ThemeProvider>

          <ToasterClient />
        </body>
      </html>
    </ConvexClerkProvider>
  )
}