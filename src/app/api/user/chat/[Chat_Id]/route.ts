import { connectToDatabase } from "@/lib/db";
import ChatHistoryModel from "@/models/ChatHistorySchema";
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
        $setOnInsert: { Chat_Id } 
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

export async function GET(req: Request, { params }: any) {
  await connectToDatabase();

  try {
    const { Chat_Id } = await params;

    if (!Chat_Id) {
      return NextResponse.json(
        { error: "Missing Chat_Id in params" },
        { status: 400 }
      );
    }

    const chatDoc = await ChatModel.findOne({ Chat_Id });

    if (!chatDoc) {
      return NextResponse.json(
        { error: "No chat found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, chatDoc });

  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: any) {
  await connectToDatabase();

  try {
    const { Chat_Id } = await params;

    if (!Chat_Id) {
      return NextResponse.json(
        { error: "Missing Chat_Id in params" },
        { status: 400 }
      );
    }

    const deletedChat = await ChatModel.findOneAndDelete({ Chat_Id });

    if (!deletedChat) {
      return NextResponse.json(
        { error: "No chat found to delete" },
        { status: 404 }
      );
    }

    await ChatHistoryModel.updateMany(
      {},
      { $pull: { ChatHistory: { Chat_Id } } }
    );

    return NextResponse.json({
      success: true,
      message: "Chat & chat history deleted successfully",
      deletedChat
    });

  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 }
    );
  }
}

