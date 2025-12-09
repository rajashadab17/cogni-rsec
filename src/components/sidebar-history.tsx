"use client";

import {
  History
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { useChat } from "@/context/chat-context";
import { apiClient } from "@/lib/api-handler";
import { useState } from "react";

export function SidebarHistory() {
  const { isMobile } = useSidebar();

  const {  chatHistory, setChats } = useChat();

  const loadChat = async (Chat_Id: string) => {
    try {
      const response = await apiClient.fetchChat(Chat_Id!);
      const data = await response.json();
      // console.log(data);
      const chatDocument = data.chatDoc;
      // console.log("chat doc ",data.chatDoc)
      // console.log("chat doc chat",chatDocument.Chat)
      if (chatDocument) {
        setChats(chatDocument.Chat);
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Discussed History</SidebarGroupLabel>
      <SidebarMenu>
        {chatHistory.map((chat) => (
          <SidebarMenuItem key={chat.Chat_Id}>
            <SidebarMenuButton asChild>
              <a
                href={"#"}
                onClick={(e) => {
                  loadChat(chat.Chat_Id);
                }}
              >
                <History />
                <span>{chat.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  );
}
