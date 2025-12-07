import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.API_KEY,
});

const models = [
  "deepseek/deepseek-chat-v3.1:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "openai/gpt-oss-120b:free",
  "openai/gpt-3.5-turbo-16k"
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const encoder = new TextEncoder();

  let stream: any = null;
  let lastError: any = null;

  for (const model of models) {
    try {
      stream = await openai.chat.completions.create({
        model,
        messages: body.messages,
        stream: true,
      });
      console.log(`✅ Using model: ${model}`);
      break; 
    } catch (err) {
      console.error(`❌ Failed on ${model}`, err);
      lastError = err;
    }
  }

  if (!stream) {
    return new Response(
      JSON.stringify({ error: "All free models failed", details: lastError }),
      { status: 500 }
    );
  }

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
