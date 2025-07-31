import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { upsertStreamUser, generateStreamToken } from "@/lib/stream";

interface SessionClaims {
  name?: string;
  username?: string;
  email?: string;
  email_address?: string;
  email_addresses?: { email_address: string }[];
  picture?: string;
  avatar_url?: string;
  image_url?: string;
  [key: string]: any; // fallback for unknown keys
}

export async function GET() {
  const authResult = await auth();
  const userId = authResult?.userId;
  const sessionClaims = authResult?.sessionClaims as SessionClaims | undefined;

  if (!userId || !sessionClaims) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const name =
    sessionClaims.name ||
    sessionClaims.username ||
    sessionClaims.email ||
    sessionClaims.email_address ||
    sessionClaims.email_addresses?.[0]?.email_address ||
    "User";

  const image =
    sessionClaims.picture ||
    sessionClaims.avatar_url ||
    sessionClaims.image_url ||
    undefined;

  try {
    await upsertStreamUser({ id: userId, name, image });
    const token = generateStreamToken(userId);
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Stream token generation failed:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}