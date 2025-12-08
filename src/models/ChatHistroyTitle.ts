import { Schema } from "mongoose";

export const ChatHistoryTitleSchema = new Schema(
  {
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  { _id: false }
);
