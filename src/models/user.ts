import { Document, Model, model, Schema } from "mongoose";
import { messageSchema } from "./MessageSchema";
import { IUser } from "@/app/types";

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    // ChatHistory: {
    //   type: [messageSchema],
    //   default: []
    // }
  },
  { timestamps: true }
);

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;
