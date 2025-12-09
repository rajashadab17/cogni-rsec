"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api-handler";
import { cn } from "@/lib/utils";
import { Check, Copy, Loader2, Paperclip, Plus, Send, X } from "lucide-react";
import type React from "react";
import { JSX, useEffect, useRef, useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      title: "New Chat",
      content:
        "Assalam-o-Alaikum! 🌟 I’m ShadBot — your smart (and slightly overconfident 😅) assistant. I may not know your secrets, but I sure know a lot of facts 🤓. Let’s see if I can impress you — what’s your first question?",

      sender: "ai",
      timestamp: new Date(),
      isStreaming: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [Model, setModel] = useState<string>("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const userDataEmail = localStorage.getItem("userEmail");
    if (userDataEmail) {
      setUserEmail(userDataEmail);
    }
  }, []);
  
  const [Chat_Id] = useState(() => `${Date.now()}-${crypto.randomUUID()}`);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    const isFirstMessage = messages.length === 1;

    let generatedTitle = "New Chat";

    if (isFirstMessage) {
      try {
        const titleResp = await fetch("/api/title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: inputValue }),
        });

        const titleData = await titleResp.json();
        generatedTitle = titleData.title || "New Chat";
        console.log({ generatedTitle });

        const TitleObj: ChatTitle = {
          Chat_Id,
          title: generatedTitle,
          timestamp: new Date(),
        };

        await apiClient.SaveTitle(TitleObj, userEmail)
      } catch (err) {
        console.error("Title generation failed:", err);
      }
    } else {
      generatedTitle = messages[0]?.title || "New Chat";
    }

    const messageFiles: MessageFile[] = uploadedFiles.map((uf) => ({
      name: uf.file.name,
      type: uf.file.type,
      preview: uf.preview,
      timestamp: new Date(),
    }));

    const userMessage: Message = {
      id: Date.now().toString(),
      title: generatedTitle,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      files: messageFiles.length > 0 ? messageFiles : undefined,
      isStreaming: false,
    };

    setMessages((prev) => [...prev, userMessage]);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      title: generatedTitle,
      content: "",
      sender: "ai",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, aiMessage]);

    const currentInput = inputValue;
    setInputValue("");
    setUploadedFiles([]);

    try {
      await apiClient.SaveChat(userEmail, Chat_Id, userMessage)

      const response = await apiClient.Prompt(currentInput, Model);

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: accumulatedContent, isStreaming: true }
              : msg
          )
        );
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
      await apiClient.SaveChat(userEmail, Chat_Id, {
        ...aiMessage,
        content: accumulatedContent,
      })
      
    } catch (err) {
      console.error("Streaming error:", err);
      setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        title: generatedTitle,
        content: "Sorry, there was an error processing your request.",
        sender: "ai",
        timestamp: new Date(),
        isStreaming: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFile: UploadedFile = {
        file,
        isLoading: true,
      };

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          setUploadedFiles((prev) => [...prev, { ...newFile, preview }]);
          setTimeout(() => {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.file === file ? { ...f, isLoading: false } : f
              )
            );
          }, 2000);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadedFiles((prev) => [...prev, newFile]);
        setTimeout(() => {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.file === file ? { ...f, isLoading: false } : f))
          );
        }, 2000);
      }
    }
  };

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles((prev) => prev.filter((f) => f.file !== fileToRemove));
  };

  const messageRef = useRef<HTMLDivElement>(null);

  const messageFormatter = (text: string): JSX.Element[] => {
    console.log(text);
    const lines = text
      .replace(/\r\n|\r/g, "\n")
      .replace(/<s>/g, "")
      .replace(/<\/s>/g, "")
      .replace(/\[\/s\>/g, "")
      .replace(/\[OUT\]/g, "")
      .replace(/\[\/OUT\]/g, "")
      .replace(/\[INST\]/g, "")
      .replace(/\[\/INST\]/g, "")
      .replace(/<\/?think>/gi, "")
      .trim()
      .split("\n");

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

      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          flushCodeBlock(index);
        } else {
          flushList(index);
          inCodeBlock = true;

          codeLanguage = trimmed.slice(3).trim() || "text";
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

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

      if (trimmed.startsWith("###")) {
        flushList(index);
        const headingText = trimmed.replace(/^###\s*/, "");
        elements.push(
          <h3 key={`h3-${index}`} className="text-lg font-bold mt-4 mb-2">
            {processInlineCode(headingText)}
          </h3>
        );
      } else if (trimmed.startsWith("-")) {
        const itemText = trimmed.replace(/^- /, "");
        currentList.push(
          <li key={`li-${index}`}>{processInlineCode(itemText)}</li>
        );
      } else if (trimmed !== "") {
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

  const replaceBold = (text: string): (string | JSX.Element)[] => {
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <b key={index}>{part.slice(2, -2)}</b>;
      }
      return part;
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    }
  };

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const handleCopy = async (messageId: string, content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  const models = [
    {
      Model: "llama v3.1-8b-instruct",
      Api: "meta-llama/llama-3.1-8b-instruct:free",
    },
    {
      Model: "Arcee-AI/trinity-mini",
      Api: "arcee-ai/trinity-mini:free",
    },
    {
      Model: "Mistral v7b-instruct",
      Api: "mistralai/mistral-7b-instruct:free",
    },
    { Model: "GPT Oss-120b:free", Api: "openai/gpt-oss-120b:free" },
    { Model: "GPT v3.5 Turbo-16k", Api: "openai/gpt-3.5-turbo-16k" },
    { Model: "Tngtech/deepseek-r1t2-chimera", Api: "tngtech/deepseek-r1t2-chimera:free" },
    { Model: "DeepSeek v3.1:free", Api: "deepseek/deepseek-chat-v3.1:free" },
  ];

  return (
    <div className="flex h-auto w-full bg-white dark:bg-gray-900">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <div className="text-center">
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">
              How can I help you?
            </h1>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-in slide-in-from-bottom-2 duration-300",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-8 w-18  mt-1">
                    <AvatarFallback className="bg-green-500 text-white text-xs font-medium">
                      CogniQuery
                    </AvatarFallback>
                  </Avatar>
                )}

                <Card
                  className={cn(
                    "max-w-[80%] p-4 shadow-sm transition-all duration-200 relative group rounded-2xl",
                    message.sender === "user"
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                  )}
                >
                  {/* Files (if any) */}
                  {message.files && message.files.length > 0 && (
                    <div className="mb-3 flex gap-2 flex-wrap">
                      {message.files.map((file, fileIndex) => (
                        <div key={fileIndex} className="relative">
                          {file.type.startsWith("image/") && file.preview ? (
                            <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                              <img
                                src={file.preview || "/placeholder.svg"}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg">
                              <Paperclip className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300 max-w-32 truncate">
                                {file.name}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Content */}
                  {message.sender === "ai" ? (
                    <>
                      {message.isStreaming ? (
                        <>
                          {/* Loader while waiting */}
                          <div className="flex gap-1 mb-2">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                          </div>
                          {message.content && (
                            <div className="text-sm leading-relaxed space-y-2">
                              {messageFormatter(message.content)}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-sm leading-relaxed space-y-2">
                          {messageFormatter(message.content)}
                        </div>
                      )}
                    </>
                  ) : (
                    message.content && (
                      <div className="text-sm leading-relaxed space-y-2">
                        {messageFormatter(message.content)}
                      </div>
                    )
                  )}

                  {/* Timestamp */}
                  <span
                    className={cn(
                      "text-xs mt-2 block opacity-70",
                      message.sender === "user"
                        ? "text-gray-300 dark:text-gray-600"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {/* Copy Button */}
                  {message.content && !message.isStreaming && (
                    <Button
                      onClick={() => handleCopy(message.id, message.content)}
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "absolute bottom-2 right-2 cursor-pointer h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                        message.sender === "user"
                          ? "hover:bg-white/10 text-gray-300 hover:text-white"
                          : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      )}
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </Card>

                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-gray-600 text-white text-xs font-medium">
                      U
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="w-full mx-auto"></div>
        <div className="w-full mx-auto">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm focus-within:shadow-md transition-shadow">
            {uploadedFiles.length > 0 && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                <div className="flex gap-2 flex-wrap">
                  {uploadedFiles.map((uploadedFile, index) => (
                    <div
                      key={index}
                      className="relative animate-in slide-in-from-bottom-2 duration-300"
                    >
                      {uploadedFile.file.type.startsWith("image/") ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                          {uploadedFile.preview && (
                            <img
                              src={uploadedFile.preview || "/placeholder.svg"}
                              alt={uploadedFile.file.name}
                              className={cn(
                                "w-full h-full object-cover transition-all duration-300",
                                uploadedFile.isLoading ? "blur-sm" : "blur-0"
                              )}
                            />
                          )}
                          {uploadedFile.isLoading && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                              </div>
                            </div>
                          )}
                          <button
                            onClick={() => removeFile(uploadedFile.file)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                          {uploadedFile.isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                          ) : (
                            <Paperclip className="h-3 w-3 text-gray-500" />
                          )}
                          <span className="text-xs text-gray-700 dark:text-gray-300 max-w-24 truncate">
                            {uploadedFile.file.name}
                          </span>
                          <button
                            onClick={() => removeFile(uploadedFile.file)}
                            className="w-4 h-4 bg-gray-400 hover:bg-gray-500 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-end gap-2 p-3">
              <Select value={Model} onValueChange={(val) => setModel(val)}>
                <SelectTrigger className="w-[20x  0px]">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Models</SelectLabel>
                    {models.map((model) => (
                      <SelectItem value={model.Api} key={model.Api}>
                        {model.Model}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors flex-shrink-0 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 rounded-xl shadow-xl border p-1"
                >
                  <DropdownMenuItem
                    onClick={handleFileUpload}
                    className="cursor-pointer py-3 px-4 rounded-lg transition-colors"
                  >
                    <Paperclip className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Add Photos & files
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                disabled={!inputValue.trim() && uploadedFiles.length === 0}
                size="icon"
                className="h-8 w-8 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-600 disabled:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 dark:text-gray-300 dark:disabled:text-gray-500 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            CogniQuery can make mistakes. Check important info.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,text/*,.pdf,.doc,.docx"
        />
      </div>
    </div>
  );
}
