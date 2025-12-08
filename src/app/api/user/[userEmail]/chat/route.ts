import { connectToDatabase } from "@/lib/db";
import ChatHistoryModel from "@/models/ChatHistorySchema";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: any) {
  await connectToDatabase();

  const { userEmail } = await params;
  const titleObj = await req.json();
  console.log({ userEmail });

  try {
    const requiredUser = await User.findOne({ userEmail });

    if (!requiredUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    } else {
      const chatHistoryDoc = await ChatHistoryModel.findOneAndUpdate(
  { userEmail },
  [
    {
      $set: {
        ChatHistory: {
          $concatArrays: [
            { $ifNull: ["$ChatHistory", []] }, // existing array or empty
            [titleObj]                         // new item to push
          ]
        },
        userEmail: { $ifNull: ["$userEmail", userEmail] }
      }
    }
  ],
  { new: true, upsert: true, updatePipeline: true }
);

      return NextResponse.json({ success: true, chatHistoryDoc });
    }

  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to update chat history" },
      { status: 500 }
    );
  }
}
