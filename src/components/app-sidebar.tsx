"use client";

import { ComponentProps } from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarLinks } from "@/Data/SidebarData";
import { NavSecondary } from "./nav-secondary";

type AppSidebarProps = ComponentProps<typeof Sidebar>;

export function AppSidebar(props: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={SidebarLinks.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SidebarLinks.navMain} />
        <NavSecondary items={SidebarLinks.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={SidebarLinks.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
