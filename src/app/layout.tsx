'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NavActions } from "@/components/nav-actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname() || "/";
  const authPaths = ["/", "/signin", "/signup"];
  const showSidebar = !authPaths.includes(pathname);
  const PathNameArray = pathname.split("/").filter(Boolean);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-right" closeButton />
            {showSidebar ? (
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                      <SidebarTrigger className="-ml-1" />
                      <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                      />
                      <Breadcrumb>
                        <BreadcrumbList>
                          {PathNameArray.map((pathName, index) => {
                            return (
                              <>
                                {index != PathNameArray.length - 1 && (
                                  <>
                                    <BreadcrumbItem className="hidden md:block">
                                      <BreadcrumbLink
                                        href="#"
                                        className="capitalize"
                                      >
                                        {pathName == 'sales' ? 'Billing & Sales' : pathName}
                                      </BreadcrumbLink>
                                    </BreadcrumbItem>
                                  </>
                                )}
                                {index != PathNameArray.length - 1 && (
                                  <BreadcrumbSeparator className="hidden md:block" />
                                )}
                                {index == PathNameArray.length - 1 && (
                                  <>
                                    <BreadcrumbItem>
                                      <BreadcrumbPage className="capitalize">
                                        {pathName}
                                      </BreadcrumbPage>
                                    </BreadcrumbItem>
                                  </>
                                )}
                              </>
                            );
                          })}
                        </BreadcrumbList>
                      </Breadcrumb>
                    </div>
                    <div className="ml-auto px-3">
                      <NavActions />
                    </div>
                  </header>
                  {children}
                </SidebarInset>
              </SidebarProvider>
            ) : (
              children
            )}
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
