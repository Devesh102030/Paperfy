import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const {searchParams} = new URL(req.url);
        const paperId = searchParams.get("paperId");

        if(!paperId){
            return NextResponse.json({
                message: "Parameters Missing"
            })
        }

        const paper =  await prisma.paper.findFirst({
            where:{
                id: paperId
            }
        })

        const overview = paper?.overview;

        return NextResponse.json({
            overview
        })
    }
    catch(err){
        console.log(err);
        return NextResponse.json({
            message: "Error fetching overview"
        })        
    }
}