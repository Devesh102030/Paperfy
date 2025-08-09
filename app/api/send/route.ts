// app/api/send/route.ts (or pages/api/send.ts if using Pages router)
import { RaycastMagicLinkEmail } from "@/app/components/email-template";// adjust path if needed
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["deveshparyani17@gmail.com"],
      subject: "Hello from Paperfy",
      react: RaycastMagicLinkEmail({magicLink: "https://paperfy.vercel.app/"}),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
