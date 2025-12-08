import { Model, model, Schema } from "mongoose";
import { ChatHistoryTitleSchema } from "./ChatTitleSchema";

export const ChatHistorySchema = new Schema<ChatHistory>(
  {
    userEmail: { type: String, required: true },
    ChatHistory: {type: [ChatHistoryTitleSchema], default: []},
  },
  { _id: false }
);

const ChatHistoryModel: Model<ChatHistory> = model<ChatHistory>("ChatHistory", ChatHistorySchema);

export default ChatHistoryModel;
