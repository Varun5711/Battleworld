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
    if (!isLoaded) {
      return;
    }
    
    if (!user) {
      return;
    }


    const initializeClient = async () => {
      try {        
        const client = new StreamVideoClient({
          apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
          user: {
            id: user.id,
            name: user.firstName || user.lastName || user.id,
            image: user.imageUrl,
          },
          tokenProvider: streamTokenProvider,
        });

        setStreamVideoClient(client);
;
  
      } catch (error) {
        setError(error instanceof Error ? error.message : "Stream initialization failed");
      }
    };

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
    return <LoaderUI />;
  }

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;