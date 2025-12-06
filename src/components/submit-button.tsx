"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MouseEvent, useState } from "react";

interface SubmitButtonProps {
  buttonTitle: string;
  formType: "signin" | "signup";
  onClickFunction?: () => void | Promise<void>;
  WhileLoading: string;
  size?: "small" | "default" | "large";
  width?: string;
  buttonVarient?: "default" | "outline" | "ghost" | "link" | "destructive"; 
  colorClass?: string;
}

export default function SubmitButton({
  buttonTitle,
  onClickFunction,
  WhileLoading,
  size = "default",
  width,
  buttonVarient = "default",
  colorClass = "",
}: SubmitButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (onClickFunction) {
        await onClickFunction();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={buttonVarient}
      type="button"
      className={`cursor-pointer ${colorClass} transition-colors hover:bg-primary/90 active:scale-[0.98] ${
        !width && size !== "small" ? "w-full" : ""
      }`}
      style={width ? { width } : {}}
      disabled={isLoading}
      onClick={handleSubmit}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {WhileLoading}
        </>
      ) : (
        buttonTitle
      )}
    </Button>
  );
}
