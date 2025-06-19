import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const body = await req.json();
    const {paperId,overview} = body;
    try{
        await prisma.paper.update({
            where:{
                id: paperId
            },
            data:{
                overview
            }
        })

        return NextResponse.json({
            message: "Overview saved successfully"
        })

    }catch(err){
        console.log(err);
        return NextResponse.json({
            message: "Error Saving Overview"
        })
    }
}