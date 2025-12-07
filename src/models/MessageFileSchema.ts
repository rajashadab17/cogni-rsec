import { Schema } from "mongoose";

export const messageFileSchema = new Schema<MessageFile>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    preview: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  { _id: false }
);
