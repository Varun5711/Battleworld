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
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Optimize font loading with preload and display swap
const geistSans = localFont({
  src: "./fonts/GeistVFfont.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: 'swap', // Improves font loading performance
  preload: true,
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: 'swap',
  preload: true,
});

// Lazy load heavy components that aren't immediately needed
const DynamicClickSpark = dynamic(() => import("@/components/shared/ClickSpark"), {
  ssr: false, // Click effects don't need SSR
  loading: () => null,
});

const DynamicStreamVideoProvider = dynamic(() => import("@/providers/StreamClientProvider"), {
  loading: () => <div className="animate-pulse">Loading video features...</div>,
});

// Optimize metadata for better SEO and performance
export const metadata: Metadata = {
  title: {
    template: "%s | BattleWorld",
    default: "BattleWorld – Doom's Multiversal Recruiter"
  },
  description: "Recruit elite warriors for BattleWorld. Powered by Convex, Clerk, and Stream.io",
  keywords: ["recruitment", "jobs", "developers", "battleworld"],
  authors: [{ name: "BattleWorld Team" }],
  creator: "BattleWorld",
  publisher: "BattleWorld",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Add performance hints
  other: {
    'X-UA-Compatible': 'IE=edge',
  },
  // Open Graph optimization
  openGraph: {
    title: "BattleWorld – Doom's Multiversal Recruiter",
    description: "Recruit elite warriors for BattleWorld",
    type: "website",
    locale: "en_US",
  },
  // Twitter Card optimization
  twitter: {
    card: "summary_large_image",
    title: "BattleWorld – Doom's Multiversal Recruiter",
    description: "Recruit elite warriors for BattleWorld",
  },
  // Robots optimization
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Verification (add your actual verification codes)
  // verification: {
  //   google: 'your-google-verification-code',
  // },
};

// Add viewport configuration for better mobile performance
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f23' },
  ],
};

// Optimize loading component
function OptimizedLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-slate-300 text-sm">Initializing BattleWorld...</p>
      </div>
    </div>
  );
}

// Optimize signed out component
function OptimizedSignIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Suspense fallback={<OptimizedLoader />}>
          <SignIn 
            routing="hash"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-slate-800/50 backdrop-blur border-slate-700",
              }
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <ConvexClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Preload critical resources */}
          <link
            rel="preload"
            href="/fonts/GeistVFfont.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/GeistMonoVF.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          
          {/* DNS prefetch for external domains */}
          <link rel="dns-prefetch" href="//stream.io" />
          <link rel="preconnect" href="https://api.clerk.dev" />
          
          {/* Optimize resource hints */}
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="dark" 
            enableSystem={false}
            disableTransitionOnChange
            storageKey="battleworld-theme"
          >
            <DynamicClickSpark
              sparkColor="#a855f7"
              sparkSize={8}
              sparkRadius={12}
              sparkCount={6}
              duration={300}
            >
              <ClerkLoading>
                <OptimizedLoader />
              </ClerkLoading>

              <ClerkLoaded>
                <SignedIn>
                  <Suspense fallback={<OptimizedLoader />}>
                    <SyncClerkUser />
                    <DynamicStreamVideoProvider>
                      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                        <Suspense fallback={
                          <div className="h-16 bg-slate-800/50 animate-pulse" />
                        }>
                          <NavbarWrapper />
                        </Suspense>
                        <main className="flex-1">
                          <Suspense fallback={
                            <div className="min-h-[60vh] flex items-center justify-center">
                              <OptimizedLoader />
                            </div>
                          }>
                            <PageTransitionWrapper>{children}</PageTransitionWrapper>
                          </Suspense>
                        </main>
                      </div>
                    </DynamicStreamVideoProvider>
                  </Suspense>
                </SignedIn>

                <SignedOut>
                  <OptimizedSignIn />
                </SignedOut>
              </ClerkLoaded>
            </DynamicClickSpark>
          </ThemeProvider>

          <ToasterClient />
        </body>
      </html>
    </ConvexClerkProvider>
  )
}