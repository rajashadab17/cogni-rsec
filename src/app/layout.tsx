'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode, useEffect, useState } from "react";
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
import { apiClient } from "@/lib/api-handler";

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
  const [chatHistory, setChatHistory] = useState<ChatHistory []>([]);

useEffect(() => {
  const storedUserEmail = localStorage.getItem("userEmail");

  const loadChatHistory = async () => {
    try {
      const response = await apiClient.fetchChatHistory(storedUserEmail!);
      const data = await response.json();

      const chatHistoryDocument = data.chatHistoryDoc; 
      setChatHistory(chatHistoryDocument?.ChatHistory || []);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  loadChatHistory();
}, []);


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
                <AppSidebar History={chatHistory}/>
                  {children}
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
