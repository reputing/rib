import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const servers = await db.server.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "asc" },
      include: {
        channels: {
          orderBy: { position: "asc" },
          select: { id: true, name: true, type: true },
        },
        _count: { select: { members: true } },
      },
    });

    return NextResponse.json({ servers });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load servers",
        message: error instanceof Error ? error.message : "unknown error",
      },
      { status: 503 },
    );
  }
}
