import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, paperId, userId, role } = body;

    if (!content || !paperId || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const chat = await prisma.chatMessage.create({
      data: {
        content,
        role,
        paperId,
        userId
      },
    });

    return NextResponse.json({ message: "Chat saved", chat }, { status: 200 });

  } catch (err) {
    console.error("Error saving chat:", err);
    return NextResponse.json(
      { message: "Error saving chat" },
      { status: 500 }
    );
  }
}
