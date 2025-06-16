import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get("userId");
        const paperId = searchParams.get("paperId");

        if(!userId || !paperId){
            return NextResponse.json({
                message: "Parameters Missing"
            })
        }

        const res =  await prisma.note.findMany({
            where:{
                userId: userId,
                paperId: paperId
            }
        })

        let notes: string[] = [];
        for(let i=0; i<res.length; i++){
            notes.push(res[i].content);
        }

        return NextResponse.json({
            notes
        })
    }
    catch(err){
        console.log(err);
        NextResponse.json({
            message: "Error fetching notes"
        })        
    }
}