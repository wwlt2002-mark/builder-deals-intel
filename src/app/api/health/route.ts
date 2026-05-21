import { NextResponse } from "next/server";
import { getPool, hasDatabase } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json({
      ok: true,
      storage: "json",
      database: "not_configured"
    });
  }

  try {
    await getPool().query("select 1");
    return NextResponse.json({
      ok: true,
      storage: "postgres",
      database: "connected"
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        storage: "postgres",
        database: "error",
        message: error instanceof Error ? error.message : "Unknown database error"
      },
      { status: 500 }
    );
  }
}
