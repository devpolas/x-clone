import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PATH = ["/signin", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const isLoggedIn = Boolean(sessionCookie);

  if (!isLoggedIn && !AUTH_PATH.includes(pathname)) {
    const callbackURL = pathname + search;

    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("callbackURL", callbackURL);

    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && AUTH_PATH.includes(pathname)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/tweet/:path*", "/signin", "/signup"],
};
