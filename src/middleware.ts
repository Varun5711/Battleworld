import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const interviewerRoutes = ["/dashboard(.*)", "/recordings(.*)" , "/schedule(*)"];

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  const url = req.nextUrl;
  const path = url.pathname;

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

  if (interviewerRoutes.some(route => path.startsWith(route)) && role !== "interviewer") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }


  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};