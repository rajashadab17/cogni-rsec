import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const userData = await request.json();
    const newUser = new User(userData);
    await newUser.save();
    return NextResponse.json({ status: 201 });
    
  } catch (error) {
    console.error("Error registering User", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
