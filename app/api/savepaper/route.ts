import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/serverAuth";
import {Queue} from "bullmq";

const queue = new Queue("file-upload-queue",{
  connection:{
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379
  }
});


export async function POST(req: NextRequest) {
    try{
        const body =  await req.json();
        const {title, pdfUrl} = body;

        const user = await getCurrentUser();

        if(!user){
            return NextResponse.json({
                message: "User not found"
            },{
                status: 500
            })
        };

        const paper = await prisma.paper.create({
            data:{
                title,
                pdfUrl,
                content: "",
                userId: user.id
            }
        })

        await queue.add("process-pdf",{
            paperId: paper.id,
            pdfUrl
        })

        return NextResponse.json({
            success: true,
            paper
        })
    }
    catch(err){
        console.log(err);
        return NextResponse.json({
            success: false,
            message: "Error Saving paper"
        })
    }
}