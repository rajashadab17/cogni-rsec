"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      router.push("/");
    }
  }, []);

  return <>{children}</>;
}
