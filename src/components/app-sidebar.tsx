"use client"

import {
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { SidebarHistory } from "@/components/sidebar-history"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar"
import { ThemeToggle } from "./theme-toggle"

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
  navMain: [
  ],
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
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarHistory />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle TypeButton={true}/>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
