import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

const assemblyai = new AssemblyAI({ apiKey: process.env.ASSEMBLY_API_KEY });

// export async function GET(req) {
//     const token = await assemblyai.realtime.createTemporaryToken({ expires_in: 3600 });
//     return NextResponse.json(token);
// }

export async function GET(req) {
    try {
      const token = await assemblyai.realtime.createTemporaryToken({ expires_in: 3600 });
      return NextResponse.json(token);
    } catch (error) {
      console.error("Error generating token:", error);
      return new NextResponse("Failed to generate token", { status: 500 });
    }
  }
  