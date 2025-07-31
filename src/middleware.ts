export const config = {
  matcher: [
    /*
      Matches:
      - All pages
      - All API routes
      - Excludes Next.js internals & static files
    */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(js|css|png|jpg|jpeg|svg|woff2?|ttf|webp)).*)",
  ],
};