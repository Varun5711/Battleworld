// lib/stream.ts
import { StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export async function upsertStreamUser({
  id,
  name,
  image,
}: {
  id: string;
  name?: string;
  image?: string;
}) {
  try {
    await serverClient.upsertUser({
      id,
      name,
      image,
      role: "user", // ✅ Optional: gives server-side elevated permissions
    });

    console.log(`✅ Stream user created: ${id}`);
  } catch (error: any) {
    console.error("❌ Failed to upsert Stream user:", error.response?.data || error.message || error);
    throw error;
  }
}

export function generateStreamToken(userId: string) {
  return serverClient.createToken(userId);
}