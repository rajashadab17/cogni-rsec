
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "@/lib/api-handler";

interface ChatContextType {
  chats: Message[];                  
  setChats: React.Dispatch<React.SetStateAction<Message[]>>;
  chatHistory: ChatTitle[];        
  setChatHistory: React.Dispatch<React.SetStateAction<ChatTitle[]>>;
}


const ChatContext = createContext<ChatContextType | undefined>(undefined);


export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatTitle[]>([]);

  useEffect(() => {
    console.log("context chala")
    const storedUserEmail = localStorage.getItem("userEmail");
    if (!storedUserEmail) return;

    const loadChatHistory = async () => {
      try {
        const response = await apiClient.fetchChatHistory(storedUserEmail);
        const data = await response.json();
        // console.log(data)
        const chatHistoryDocument: ChatHistory | undefined = data.chatHistoryDoc;

        if (chatHistoryDocument?.ChatHistory) {
          setChatHistory(chatHistoryDocument.ChatHistory);
        //   console.log({chatHistoryDocument})
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    loadChatHistory();
  }, []);

  return (
    <ChatContext.Provider value={{ chats, setChats, chatHistory, setChatHistory }}>
      {children}
    </ChatContext.Provider>
  );
};


export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
