// lib/getStreamChatToken.ts    
export async function getStreamChatToken(): Promise<string> {
  const res = await fetch("/api/stream-chat-token");

  if (!res.ok) {
    throw new Error("Failed to fetch Stream Chat token");
  }

  const data = await res.json();
  return data.token;
}