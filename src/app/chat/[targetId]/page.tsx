// app/chat/[targetId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import toast from "react-hot-toast";
import ChatLoader from "@/components/chat/ChatLoader";
import CallButton from "@/components/chat/CallButton";
import { createHash } from "crypto";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

function hashId(id1: string, id2: string) {
  const sorted = [id1, id2].sort().join("-");
  return createHash("sha256").update(sorted).digest("hex").slice(0, 64);
}

export default function ChatPage() {
  const { user, isLoaded } = useUser();
  const { targetId } = useParams();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user || !targetId) return;

    (async () => {
      try {
        const res = await fetch("/api/stream-chat-token");
        if (!res.ok) throw new Error("Token fetch failed");
        const { token } = await res.json();

        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          { id: user.id, name: user.fullName ?? user.username!, image: user.imageUrl! },
          token
        );

        const cid = hashId(user.id, targetId as string);
        const ch = client.channel("messaging", cid, {
          members: [user.id, targetId as string],
        });
        await ch.watch();

        setChatClient(client);
        setChannel(ch);
      } catch (err) {
        console.error("Chat init failed", err);
        toast.error("Could not connect to chat.");
      } finally {
        setLoading(false);
      }
    })();

    return () => { chatClient?.disconnectUser(); };
  }, [isLoaded, user, targetId]);

  if (loading || !channel) return <ChatLoader />;

  return (
    <div className="h-screen">
      <Chat client={chatClient!}>
        <Channel channel={channel}>
          <CallButton handleVideoCall={() => {
            const msg = channel.sendMessage({
              text: `📞 Video call: ${window.location.origin}/meeting/${channel.id}`,
            });
            toast.success("Video link sent!");
          }} />
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput focus />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}