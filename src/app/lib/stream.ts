// app/lib/stream.ts
import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

if (!apiKey || !apiSecret) {
  throw new Error("Missing Stream credentials");
}

// Server-client for admin actions
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

// Upsert a Stream user (server-side only)
export async function upsertStreamUser({
  id,
  name,
  image,
}: {
  id: string;
  name: string;
  image?: string;
}) {
  await serverClient.upsertUser({ id, name, image });
}

// Generate a user token (for client-side use)
export function generateStreamToken(userId: string): string {
  return serverClient.createToken(userId);
}