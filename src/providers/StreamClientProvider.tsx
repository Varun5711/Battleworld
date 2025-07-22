"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import LoaderUI from "@/components/shared/LoaderUI";
import { streamTokenProvider } from "@/actions/stream.actions";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>();
  const [error, setError] = useState<string>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    console.log("🔍 StreamVideoProvider useEffect triggered");
    console.log("isLoaded:", isLoaded, "user:", user?.id);
    
    if (!isLoaded) {
      console.log("⏳ User not loaded yet");
      return;
    }
    
    if (!user) {
      console.log("❌ No user found");
      return;
    }

    console.log("🔄 Starting Stream client initialization...");

    const initializeClient = async () => {
      try {
        console.log("📡 Testing token provider first...");
        
        // Test the token provider separately
        const testToken = await streamTokenProvider();
        console.log("✅ Token test successful:", testToken ? "Got token" : "No token");

        console.log("🏗️ Creating StreamVideoClient...");
        
        const client = new StreamVideoClient({
          apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
          user: {
            id: user.id,
            name: user.firstName || user.lastName || user.id,
            image: user.imageUrl,
          },
          tokenProvider: streamTokenProvider,
        });

        console.log("✅ StreamVideoClient created, setting state...");
        setStreamVideoClient(client);
        console.log("✅ Stream client state set successfully");
        
      } catch (error) {
        console.error("❌ Stream initialization error:", error);
        setError(error instanceof Error ? error.message : "Stream initialization failed");
      }
    };

    // Add a timeout to prevent infinite hanging
    const timeoutId = setTimeout(() => {
      console.error("⏰ Stream initialization timed out after 10 seconds");
      setError("Stream initialization timed out");
    }, 10000);

    initializeClient().finally(() => {
      clearTimeout(timeoutId);
    });

  }, [user, isLoaded]);

  if (error) {
    return <div className="p-4 text-red-500">Stream Error: {error}</div>;
  }

  if (!streamVideoClient) {
    console.log("⏳ Still waiting for Stream client...");
    return <LoaderUI />;
  }

  console.log("🎉 Rendering StreamVideo component");
  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;