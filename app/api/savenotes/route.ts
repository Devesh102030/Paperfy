import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const body = await req.json();
    const {content,paperId,userId} = body;
    try{
        const res = await prisma.note.create({
            data:{
                content,
                userId,
                paperId
            }
        })

        return NextResponse.json({
            message: "Notes saved successfully"
        })

    }catch(err){
        console.log(err);
        return NextResponse.json({
            message: "Error Saving Notes"
        })
    }
}