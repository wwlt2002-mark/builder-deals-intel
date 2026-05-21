import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET;

  if (!request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!adminSecret) {
    return NextResponse.next();
  }

  const session = request.cookies.get("admin_session")?.value;

  if (session === adminSecret) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*"]
};
