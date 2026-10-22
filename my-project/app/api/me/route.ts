import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      name?: string;
    };
    let name = payload.name ?? "";

    if (!name) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { name: true },
        });
        name = user?.name ?? "";
      } catch {
        // Older session tokens may not carry the user's name; keep the
        // account profile available with its email and ID if the DB is offline.
      }
    }

    return NextResponse.json({
      userId: payload.userId,
      email: payload.email,
      name,
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
