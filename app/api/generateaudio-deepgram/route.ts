// pages/api/generateaudio-deepgram.ts
// import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@deepgram/sdk";
import { NextRequest, NextResponse } from "next/server";

const deepgram = createClient("56884b7f29831b4056f47ecd7c30ccf558194167");

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // adjust if needed
    },
  },
};

export async function POST(req: NextRequest) {
    
  const { text } = await req.json();

  try {
    const response = await deepgram.speak.request(
      { text },
      {
        model: "aura-2-thalia-en",
        encoding: "linear16",
        container: "wav",
      }
    );

    const stream = await response.getStream();
    const chunks: Uint8Array[] = [];

    if(!stream){
        return NextResponse.json({
            message: "Error getting audio"
        })
    }

    const reader = stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));

    return new Response(buffer, {
        status: 200,
        headers: {
            "Content-Type": "audio/wav",
            "Content-Disposition": "inline; filename=audio.wav",
        },
    });

  } catch (err) {
    console.error("Deepgram error:", err);
    return NextResponse.json({
        error: "Failed to generate audio"
    })
  }
}
