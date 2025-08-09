import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import crypto from "crypto";
import { Resend } from "resend";
import RaycastMagicLinkEmail from "@/app/components/ResetPassword-email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "No account found" }, { status: 400 });
  }

  // Create token
  try{
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 mins

        await prisma.passwordResetToken.create({
            data: {
            token,
            userId: user.id,
            expires,
            },
        });

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/password/reset?token=${token}`;

        const { data, error } = await resend.emails.send({
            from: "Paperfy <paperfy@deveshparyani.tech>",
            to: email,
            subject: "Reset Password",
            react: RaycastMagicLinkEmail({magicLink: resetLink}),
        });
        
        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        console.log("Sent");

        return NextResponse.json({ success: true });

    }catch(err){
        console.log(err);
        return NextResponse.json({ success: false });
    }

}
