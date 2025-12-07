import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: any) {
  await connectToDatabase()

  const { userEmail } = await params;
  const message = await req.json();
  console.log({userEmail})

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userEmail },
      { $push: { ChatHistory: message } },
      { new: true } 
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log({error})
    return NextResponse.json(
      { error: "Failed to update chat history" },
      { status: 500 }
    );
  }
}
