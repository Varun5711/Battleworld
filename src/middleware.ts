import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const interviewerRoutes = ["/dashboard", "/recordings", "/schedule"];

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = req.nextUrl;
  const path = url.pathname;

  if (!userId && !path.startsWith("/sign-in") && !path.startsWith("/sso-callback")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

  if (interviewerRoutes.some(route => path.startsWith(route)) && role !== "interviewer") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};