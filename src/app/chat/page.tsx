"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import React, { useState } from "react";

const page = () => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {};

  return (
    <>
      <div className="flex h-auto w-full bg-white dark:bg-gray-900">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <div className="text-center">
              <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                How can I help you?
              </h1>
            </div>
          </div>

          <div className="w-full mx-auto">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm focus-within:shadow-md transition-shadow">
              <div className="flex items-end gap-2 p-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Message ChatGPT..."
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-sm bg-transparent! placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="h-8 w-8 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-600 disabled:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 dark:text-gray-300 dark:disabled:text-gray-500 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
