import { Schema } from "mongoose";
import { ChatHistoryTitleSchema } from "./ChatHistroyTitle";

export const ChatHistorySchema = new Schema(
  {
    userEmail: { type: String, required: true },
    ChatHistory: {type: [ChatHistoryTitleSchema], default: []},
    timestamp: { type: Date, required: true },
  },
  { _id: false }
);
