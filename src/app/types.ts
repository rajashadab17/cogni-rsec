export interface IUser {
  username: string;
  userEmail: string;
  password: string;
  confirmPassword: string;
  createdAt: Date;
  updatedAt: Date;
  // ChatHistory: Message []
}

interface ChatHistory {
  userEmail:string;
  ChatHistory: ChatTitle []
}

interface ChatTitle {
  title: string;
  timestamp: Date;
  Chat_Id: string
}

interface Chat {
  Chat_Id: string;
  userEmail: string;
  Chat: Message [];
  timestamp: Date;
}

interface MessageFile {
  name: string;
  type: string;
  preview?: string;
  timestamp: Date;
}

interface Message {
  id: string;
  title:string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  files?: MessageFile[];
  isStreaming: boolean;
}

interface UploadedFile {
  file: File;
  preview?: string;
  isLoading: boolean;
}