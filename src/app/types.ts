interface MessageFile {
  name: string;
  type: string;
  preview?: string;
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