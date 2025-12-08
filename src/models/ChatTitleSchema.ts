import { Schema } from "mongoose";

export const ChatHistoryTitleSchema = new Schema<ChatTitle>(
  {
    title: { type: String, required: true },
    Chat_Id: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  { _id: false }
);
