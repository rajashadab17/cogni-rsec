"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import React, { useState, JSX } from "react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  files?: MessageFile[];
  isStreaming: boolean;
}

interface MessageFile {
  name: string;
  type: string;
  preview?: string;
}

const page = () => {
    const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Assalam-o-Alaikum! 🌟 I’m ShadBot — your smart (and slightly overconfident 😅) assistant. I may not know your secrets, but I sure know a lot of facts 🤓. Let’s see if I can impress you — what’s your first question?",
      // content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
      isStreaming: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {};

  const messageFormatter = (text: string): JSX.Element[] => {
    // Normalize newlines (some APIs use \r\n or just \r)
    console.log(text);
    const lines = text.replace(/\r\n|\r/g, "\n").split("\n");
    const elements: JSX.Element[] = [];
    let currentList: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeLanguage = "";

    const flushList = (index: number) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${index}`} className="list-disc ml-6">
            {currentList}
          </ul>
        );
        currentList = [];
      }
    };

    const flushCodeBlock = (index: number) => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <div key={`code-${index}`} className="my-4">
            <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
              <code className={`language-${codeLanguage}`}>
                {codeBlockContent.join("\n")}
              </code>
            </pre>
          </div>
        );
        codeBlockContent = [];
        codeLanguage = "";
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Check for code block delimiters
      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          // End of code block
          inCodeBlock = false;
          flushCodeBlock(index);
        } else {
          // Start of code block
          flushList(index);
          inCodeBlock = true;
          // Extract language if specified (e.g., ```javascript)
          codeLanguage = trimmed.slice(3).trim() || "text";
        }
        return;
      }

      // If we're inside a code block, collect the content
      if (inCodeBlock) {
        codeBlockContent.push(line); // Keep original spacing
        return;
      }

      // Handle inline code (single backticks)
      const processInlineCode = (text: string): (string | JSX.Element)[] => {
        const parts = text.split(/(`[^`]+`)/);
        return parts
          .map((part, partIndex) => {
            if (part.startsWith("`") && part.endsWith("`")) {
              return (
                <code
                  key={partIndex}
                  className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
                >
                  {part.slice(1, -1)}
                </code>
              );
            }
            return replaceBold(part);
          })
          .flat();
      };

      // Headings
      if (trimmed.startsWith("###")) {
        flushList(index);
        const headingText = trimmed.replace(/^###\s*/, "");
        elements.push(
          <h3 key={`h3-${index}`} className="text-lg font-bold mt-4 mb-2">
            {processInlineCode(headingText)}
          </h3>
        );
      }
      // Bullets
      else if (trimmed.startsWith("-")) {
        const itemText = trimmed.replace(/^- /, "");
        currentList.push(
          <li key={`li-${index}`}>{processInlineCode(itemText)}</li>
        );
      }
      // Paragraphs
      else if (trimmed !== "") {
        flushList(index);
        elements.push(
          <p key={`p-${index}`} className="mb-2 leading-relaxed">
            {processInlineCode(trimmed)}
          </p>
        );
      }
    });

    flushList(lines.length);
    if (inCodeBlock) {
      flushCodeBlock(lines.length);
    }

    return elements;
  };

  // Handles **bold** text
  const replaceBold = (text: string): (string | JSX.Element)[] => {
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <b key={index}>{part.slice(2, -2)}</b>;
      }
      return part;
    });
  };

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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            CogniQuery AI can make mistakes. Check important info.
          </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
