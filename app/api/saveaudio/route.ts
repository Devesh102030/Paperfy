import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const body = await req.json();
    const {paperId,audio} = body;
    try{
        await prisma.paper.update({
            where:{
                id: paperId
            },
            data:{
                audio
            }
        })

        return NextResponse.json({
            message: "Audio saved successfully"
        })

    }catch(err){
        console.log(err);
        return NextResponse.json({
            message: "Error Saving Audio"
        })
    }
}