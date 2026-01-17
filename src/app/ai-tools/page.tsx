"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Sparkles, Search, Bot, User, Send, ExternalLink, BookOpen, AlertCircle } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  url: string;
  enabled: boolean;
}

const tools: Tool[] = [
  {
    id: "notebooklm",
    name: "NotebookLM",
    icon: BookOpen,
    description: "Your personalized AI research assistant.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "hover:border-blue-500",
    url: "https://notebooklm.google.com/",
    enabled: false
  },
  {
    id: "perplexity",
    name: "Perplexity",
    icon: Search,
    description: "Real-time answers with cited sources.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "hover:border-emerald-500",
    url: "https://www.perplexity.ai/",
    enabled: false
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: Sparkles,
    description: "Google's most capable AI model.",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "hover:border-violet-500",
    url: "https://gemini.google.com/",
    enabled: true
  }
];

interface Message {
  role: "user" | "ai" | "error";
  content: string;
}

export default function AIToolsPage() {
  const [activeTool, setActiveTool] = useState("gemini");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    notebooklm: [{ role: "ai", content: "Hi! I'm NotebookLM. I don't support direct chat here yet, but you can use me on my official site!" }],
    perplexity: [{ role: "ai", content: "Hi! I'm Perplexity. Please visit my official site for real-time search." }],
    gemini: [{ role: "ai", content: "Hello! I'm Gemini. How can I help you be more creative and productive today?" }],
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTool]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentTool = activeTool;
    const userMessage = input;
    setInput("");

    // Add user message
    setMessages(prev => ({
      ...prev,
      [currentTool]: [...prev[currentTool], { role: "user", content: userMessage }]
    }));

    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages(prev => ({
        ...prev,
        [currentTool]: [...prev[currentTool], { role: "ai", content: data.response }]
      }));
    } catch (error) {
      setMessages(prev => ({
        ...prev,
        [currentTool]: [...prev[currentTool], {
          role: "error",
          content: error instanceof Error ? error.message : "An error occurred"
        }]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const activeToolData = tools.find(t => t.id === activeTool);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      <Sidebar />

      <main className="md:ml-64 ml-0 p-4 md:p-8 h-screen flex flex-col">
        <header className="mb-6 flex-none">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-violet-400" />
            Gen AI Tools
          </h1>
          <p className="text-slate-400">Supercharge your learning with AI.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
          {/* Tools Sidebar */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 group",
                  activeTool === tool.id
                    ? `bg-slate-800 border-${tool.color.split("-")[1]}-500 shadow-[0_0_15px_rgba(0,0,0,0.3)]`
                    : "bg-slate-900 border-slate-800 hover:bg-slate-800"
                )}
              >
                <div className={cn("p-3 rounded-full transition-transform group-hover:scale-110", tool.bgColor, tool.color)}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={cn("font-medium transition-colors", activeTool === tool.id ? "text-white" : "text-slate-400 group-hover:text-white")}>
                    {tool.name}
                  </h3>
                  {!tool.enabled && (
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded ml-2">Link Only</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Chat Interface */}
          <Card variant="neon" className="lg:col-span-3 flex flex-col h-full relative overflow-hidden p-0">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full", activeToolData?.bgColor)}>
                  {(() => {
                    const Icon = activeToolData?.icon || Sparkles;
                    return <Icon className={cn("w-5 h-5", activeToolData?.color)} />;
                  })()}
                </div>
                <div>
                  <h2 className="font-bold text-white">{activeToolData?.name}</h2>
                  <p className="text-xs text-slate-400">{activeToolData?.description}</p>
                </div>
              </div>
              <a
                href={activeToolData?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700"
              >
                Open Official Site <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {messages[activeTool].map((msg, idx) => (
                <div key={idx} className={cn("flex gap-4", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role !== "user" && (
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-none", activeToolData?.bgColor)}>
                      {msg.role === "error" ? <AlertCircle className="w-5 h-5 text-red-400" /> : <Bot className={cn("w-5 h-5", activeToolData?.color)} />}
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-violet-600 text-white rounded-tr-none"
                      : msg.role === "error"
                        ? "bg-red-500/10 text-red-200 border border-red-500/20 rounded-tl-none"
                        : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                  )}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-none">
                      <User className="w-5 h-5 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4 justify-start">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-none", activeToolData?.bgColor)}>
                    <Bot className={cn("w-5 h-5", activeToolData?.color)} />
                  </div>
                  <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex gap-1 items-center h-12">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && activeToolData?.enabled && handleSend()}
                  placeholder={activeToolData?.enabled ? `Message ${activeToolData?.name}...` : "Chat not available for this tool"}
                  disabled={!activeToolData?.enabled}
                  className="w-full bg-slate-950 border border-slate-700 rounded-full py-3 px-5 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping || !activeToolData?.enabled}
                  className="absolute right-2 p-2 bg-violet-600 rounded-full text-white hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
