// app/api/stream-chat-token/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // ✅ correct import
import { upsertStreamUser, generateStreamToken } from "@/lib/stream";

export async function GET() {
  const authResult = await auth();
  const userId = authResult?.userId;
  const sessionClaims = authResult?.sessionClaims;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Ensure name is always a string, image is string or undefined
  const name = sessionClaims && typeof sessionClaims === 'object' && sessionClaims.name ? String(sessionClaims.name) : "Anonymous";
  const image = sessionClaims && typeof sessionClaims === 'object' && sessionClaims.picture ? String(sessionClaims.picture) : undefined;

  try {
    await upsertStreamUser({ id: userId, name, image });
    const token = generateStreamToken(userId);
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Stream token generation failed:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}