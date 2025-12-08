import { Schema } from "mongoose";

export const ChatHistorySchema = new Schema(
  {
    userEmail: { type: String, required: true },
    ChatHistory: {type: [], default: []}
  },
  { _id: false }
);
