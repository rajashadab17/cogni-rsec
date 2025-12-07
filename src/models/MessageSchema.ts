import { Schema } from "mongoose";
import { messageFileSchema } from "./MessageFileSchema";

export const messageSchema = new Schema<Message>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    sender: { type: String, enum: ["user", "ai"], required: true },
    timestamp: { type: Date, required: true },
    files: { type: [messageFileSchema], default: [] },
    isStreaming: { type: Boolean, required: true },
  },
  { _id: false } 
);
