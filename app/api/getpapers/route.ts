import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get("userId");
        const page = searchParams.get("page");
        const limit = searchParams.get("limit");

        if(!page || !limit || !userId ){
            return NextResponse.json({
                message: "Parameters missing"
            })
        }

        const pageNum = parseInt(page);
        const PageSize = parseInt(limit);

        if(!userId){
            return NextResponse.json({
                message: "Parameters Missing"
            })
        }

        const papers =  await prisma.paper.findMany({
            where:{
                userId: userId,
            },
            orderBy: {createdAt: "desc"},
            skip: (pageNum-1)*PageSize,
            take: PageSize
        })

        const totalCount = await prisma.paper.count({
            where:{
                userId
            }
        })

        return NextResponse.json({
            papers,
            totalCount,
            totalPages: Math.ceil(totalCount/PageSize),
            currentPage: pageNum
        })
    }
    catch(err){
        console.log(err);
        return NextResponse.json({
            message: "Error fetching papers"
        })        
    }
}