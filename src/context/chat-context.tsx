import { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  chat: ChatTitle[];
  setChat: React.Dispatch<React.SetStateAction<ChatTitle[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chat, setChat] = useState<ChatTitle[]>([]);

  return (
    <ChatContext.Provider value={{ chat, setChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
