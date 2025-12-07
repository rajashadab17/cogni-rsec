"use client";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "./ui/sidebar";

export function ThemeToggle({ TypeButton }: { TypeButton: boolean }) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  if (!resolvedTheme) return null;

  return TypeButton ? (
    <SidebarMenuButton
      size="lg"
      variant="outline"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
    >
      <div className=" flex aspect-square size-8 items-center justify-center rounded-lg">
        <Sun
          className={`absolute h-4 w-4 transform transition-all duration-500 ease-in-out ${
            theme === "dark" ? "rotate-0 opacity-100" : "rotate-180 opacity-0"
          }`}
        />
        <Moon
          className={`absolute h-4 w-4 transform transition-all duration-500 ease-in-out ${
            theme === "dark" ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
          }`}
        />
      </div>

      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="font-medium capitalize">{theme} Theme</span>
      </div>
    </SidebarMenuButton>
  ) : (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative"
    >
      <Sun
        className={`absolute h-4 w-4 transform transition-all duration-500 ease-in-out ${
          theme === "dark" ? "rotate-0 opacity-100" : "rotate-180 opacity-0"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transform transition-all duration-500 ease-in-out ${
          theme === "dark" ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
        }`}
      />
    </Button>
  );
}
