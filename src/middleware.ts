import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const interviewerRoutes = ["/dashboard", "/recordings", "/schedule"];

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = req.nextUrl;
  const path = url.pathname;

  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

  if (interviewerRoutes.some(route => path.startsWith(route))) {
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    if (role !== "interviewer") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|_static|.*\\.(?:png|jpg|jpeg|svg|webp|ico|ttf|woff2?|css|js|json)).*)",
    "/(api|trpc)(.*)",
  ],
};