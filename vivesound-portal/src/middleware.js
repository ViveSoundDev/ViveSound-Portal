import { NextResponse } from "next/server";

export function middleware(req) {
  const auth = req.cookies.get("auth_token")?.value;

  const protectedPaths = ["/dashboard", "/my-account", "/activations"];
  const isProtected = protectedPaths.some((p) =>
    req.nextUrl.pathname.startsWith(p)
  );

  if (isProtected && !auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("next", req.nextUrl.pathname); // optional redirect back
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Run middleware only on these routes
export const config = {
  matcher: ["/dashboard/:path*", "/my-account/:path*", "/activations/:path*"],
};
