"use client";

import {
  Frame,
  GalleryVerticalEnd,
  Map,
  MessagesSquare,
  PieChart,
  Sun,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { SidebarHistory } from "@/components/sidebar-history";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { useChat } from "@/context/chat-context";

// This is sample data.
const data = {
  user: {
    name: "CogniQuery",
    email: "CogniQuery@ai.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "CogniQuery",
      logo: GalleryVerticalEnd,
      plan: "AI-Bot",
    },
    //
  ],
  navMain: [],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setChats } = useChat();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarMenuButton
        size="lg"
        variant="outline"
        onClick={() =>
          setChats([
            {
              id: "1",
              title: "New Chat",
              content:
                "Assalam-o-Alaikum! 🌟 I’m ShadBot — your smart (and slightly overconfident 😅) assistant. I may not know your secrets, but I sure know a lot of facts 🤓. Let’s see if I can impress you — what’s your first question?",

              sender: "ai",
              timestamp: new Date(),
              isStreaming: false,
            },
          ])
        }
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
      >
        <div className=" flex aspect-square size-8 items-center justify-center rounded-lg">
          <MessagesSquare
            className={`absolute h-4 w-4 transform transition-all duration-500 ease-in-out `}
          />
        </div>
        <div className="grid flex-1 text-center text-sm leading-tight">
          <span className="font-bold text-base">New Chat</span>
        </div>
      </SidebarMenuButton>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarHistory />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle TypeButton={true} />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
