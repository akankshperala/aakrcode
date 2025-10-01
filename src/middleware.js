// src/middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  // List of paths to exclude from protection
  const excludedPaths = [
    "/auth/login",
    "/auth/register",
    "/api/auth",
    "/favicon.ico",
    "/_next",
    "/public",
  ];

  // Skip middleware for excluded paths
  if (excludedPaths.some(path => pathname === path || pathname.startsWith(path) || pathname==="/" )) {
    return NextResponse.next();
  }

  // Check if user is logged in (JWT token)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token) {
    return NextResponse.next(); // User logged in → allow
  }

  // User not logged in → redirect to login with message
  const url = req.nextUrl.clone();
  url.pathname = "/api/auth";
  url.searchParams.set("message", "Please register first");
  return NextResponse.redirect(url);
}

// Apply middleware to all routes
export const config = {
  matcher: "/:path*", // Run middleware on all routes, runtime exclusions handle public paths
};
