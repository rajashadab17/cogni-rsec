import { Schema } from "mongoose";

export const messageSchema = new Schema<Message>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    sender: { type: String, enum: ["user", "ai"], required: true },
    timestamp: { type: Date, required: true },
    files: { type: [MessageFile], default: [] }, // or define a MessageFile schema if you want
    isStreaming: { type: Boolean, required: true },
  },
  { _id: false } // optional: prevents creating an automatic _id for each message
);
