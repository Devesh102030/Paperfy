import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const paperId = searchParams.get("paperId");

    if (!userId || !paperId) {
      return NextResponse.json(
        { message: "Parameters Missing" },
        { status: 400 }
      );
    }

    const chatMessages = await prisma.chatMessage.findMany({
      where: {
        userId,
        paperId,
      },
      orderBy: {
        createdAt: "asc", 
      },
    });

    return NextResponse.json({ chat: chatMessages });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error fetching chat history" },
      { status: 500 }
    );
  }
}
