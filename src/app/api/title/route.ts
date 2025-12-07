import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.API_KEY,
});

const titleModel = "openai/gpt-3.5-turbo-16k";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ title: "New Chat" });
    }

    const completion = await openai.chat.completions.create({
      model: titleModel,
      messages: [
        {
          role: "system",
          content:
            "Generate a concise 3–6 word title summarizing the user's message. Return ONLY the title."
        },
        { role: "user", content: prompt }
      ],
    });

    const title = completion.choices[0]?.message?.content?.trim() || "New Chat";

    return NextResponse.json({ title });
  } catch (err) {
    console.error("Title generation failed:", err);
    return NextResponse.json({ title: "New Chat" });
  }
}
