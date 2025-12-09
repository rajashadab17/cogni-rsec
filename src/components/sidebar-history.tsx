"use client";

import {
  Folder,
  Forward,
  History,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { apiClient } from "@/lib/api-handler";
import { useEffect, useState } from "react";

export function SidebarHistory({ history }: { history: ChatTitle[] }) {
  const { isMobile } = useSidebar();

  const [chat, setChat] = useState<ChatTitle[] | null>(null);
  

  const loadChat = async (Chat_Id: string) => {
    try {
      const response = await apiClient.fetchChat(Chat_Id!);
      const data = await response.json();
      console.log(data);
      const chatDocument = data.ChatDoc;
      if (chatDocument) {
        setChat(chatDocument.ChatHistory);
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Discussed History</SidebarGroupLabel>
      <SidebarMenu>
        {history.map((chat) => (
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
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
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
