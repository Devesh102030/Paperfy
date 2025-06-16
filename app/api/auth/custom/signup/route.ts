import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest){
    try{
        const body = await req.json();

        console.log(body);

        const {name, email, password} = body;
        

        if(!name || !email || !password){
            console.log(name,email,password);
            
            return NextResponse.json({
                message: "Missing feilds"
            },{
                status: 400
            })
        }

        const existingUser = await prisma.user.findUnique({
            where:{
                email: email
            }
        });

        if(existingUser){
            return(
                NextResponse.json({
                    message: "User already exits"
                },{
                    status: 409
                })
            )
        }

        const hashPassword = await bcrypt.hash(password,10);

        await prisma.user.create({
            data:{
                name,
                email,
                password: hashPassword
            }
        })

        return NextResponse.json({
            message: "User Created"
        },{status: 201})
    }
    catch(error){
        console.log(error);
        return NextResponse.json({
            message: "Internel server error"
        },{status: 500})
    }

}