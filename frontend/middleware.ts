import { NextRequest, NextResponse } from "next/server";
import { SITE_RESTRICTED_TO_JOBS } from "@/shared/config/site-restriction";

const ALLOWED_PATHS = ["/jobs"];

export function middleware(request: NextRequest) {
  if (!SITE_RESTRICTED_TO_JOBS) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/jobs", request.url));
  }

  const isAllowedPath = ALLOWED_PATHS.some(
    (allowedPath) =>
      request.nextUrl.pathname === allowedPath ||
      request.nextUrl.pathname.startsWith(`${allowedPath}/`),
  );

  if (isAllowedPath) {
    return NextResponse.next();
  }

  const notFoundUrl = new URL("/jobs-site-restriction-not-found", request.url);
  return NextResponse.rewrite(notFoundUrl, { status: 404 });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api|favicon.ico|.*\\.[\\w]+$).*)",
  ],
};
