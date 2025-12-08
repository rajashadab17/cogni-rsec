import { Model, model, Schema } from "mongoose";
import { ChatHistoryTitleSchema } from "./ChatTitleSchema";
import { messageSchema } from "./MessageSchema";

export const ChatHistorySchema = new Schema<Chat>(
  {
    userEmail: { type: String, required: true },
    Chat_Id: { type: String, required: true },
    Chat: {type: [messageSchema], default: []},
    timestamp: { type: Date, required: true },
  },
  { _id: false }
);

const ChatModel: Model<Chat> = model<Chat>("ChatHistory", ChatHistorySchema);

export default ChatModel;
