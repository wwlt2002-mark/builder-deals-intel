import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function requireAdminPage() {
  const adminSecret = process.env.ADMIN_SECRET;
  const session = (await cookies()).get("admin_session")?.value;

  if (adminSecret && session !== adminSecret) {
    redirect("/admin/login");
  }
}

export function isAdminRequest(request: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    return true;
  }

  return request.cookies.get("admin_session")?.value === adminSecret;
}
