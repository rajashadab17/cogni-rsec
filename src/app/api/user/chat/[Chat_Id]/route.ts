import { connectToDatabase } from "@/lib/db";
import ChatModel from "@/models/ChatSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: any) {
  await connectToDatabase();

  const { Chat_Id } = await params;
  const userMessage = await req.json();

  try {
    const chatDoc = await ChatModel.findOneAndUpdate(
      { Chat_Id },
      {
        $push: { Chat: userMessage },
        $setOnInsert: { Chat_Id } // ensures Chat_Id is set for new docs
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, chatDoc });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update chat" },
      { status: 500 }
    );
  }
}
