"use client"

import * as React from "react"
import { CreditCard, Gauge, Settings, Users } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface NavItem {
  name: string
  icon: React.ElementType
  url: string
}

const data: { nav: NavItem[] } = {
  nav: [
    { name: "General", icon: Settings, url: "/settings/general" },
    { name: "Team", icon: Users, url: "/settings/team" },
    { name: "Billing", icon: CreditCard, url: "/settings/billing" },
    { name: "Limits", icon: Gauge, url: "/settings/limits" },
  ],
}

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activePage, setActivePage] = React.useState<string>("General")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={item.name === activePage}>
                          <div
                            className="flex cursor-pointer items-center gap-2"
                            onClick={() => setActivePage(item.name)}
                          >
                            <item.icon />
                            <span>{item.name}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                        Settings
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activePage}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {activePage === "General" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">General Settings</h3>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      Configure your general account settings
                    </p>
                  </div>
                </div>
              )}
              {activePage === "Team" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Team Settings</h3>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      Manage your team members and permissions
                    </p>
                  </div>
                </div>
              )}
              {activePage === "Billing" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Billing Settings</h3>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      Manage your subscription and payment methods
                    </p>
                  </div>
                </div>
              )}
              {activePage === "Limits" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Usage Limits</h3>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      View and manage your account usage limits
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
