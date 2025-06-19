import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const {searchParams} = new URL(req.url);
        const paperId = searchParams.get("paperId");

        if(!paperId){
            return NextResponse.json({
                message: "Parameters missing"
            })
        }

        const text = await prisma.paper.findFirst({
            where:{
                id: paperId
            }
        })

        const audio = text?.audio;

        return NextResponse.json({
            audio
        })
    }
    catch(err){
        console.log(err);
        NextResponse.json({
            message: "Error fetching paper"
        })
    }
}