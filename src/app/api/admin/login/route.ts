import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const secret = String(form.get("secret") ?? "");
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: "Invalid admin secret." }, { status: 401 });
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set("admin_session", adminSecret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
