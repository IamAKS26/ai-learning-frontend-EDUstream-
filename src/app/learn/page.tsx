"use client";

import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import apiClient from "@/lib/apiClient";
import { SkeletonBar, SkeletonBlock } from "@/components/Skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setInitializing(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const suggestions = [
    { title: "Explain today's lesson", icon: "menu_book" },
    { title: "Give example problems", icon: "calculate" },
    { title: "Summarize key concepts", icon: "summarize" },
    { title: "Quiz me on this topic", icon: "quiz" }
  ];

  const handleSend = async (text: string) => {
    const prompt = text.trim();
    if (!prompt) return;

    const userMessage: Message = {
      role: "user",
      content: prompt,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Send the entire conversation history (excluding timestamps)
      const payloadMessages = newMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await apiClient.post("/ai/chat", { messages: payloadMessages });
      
      const assistantMessage: Message = {
        role: "assistant",
        content: res.data.reply,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage: Message = {
        role: "assistant",
        content: err?.response?.data?.message || "Failed to connect to AI tutor. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const startNewChat = () => {
    setMessages([]);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col mx-auto w-full max-w-5xl h-[calc(100vh-120px)] relative">
        
        {/* Header Area */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
              AI Tutor
            </h2>
            <p className="text-slate-500 text-sm">Your personal learning assistant</p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={startNewChat}
              className="px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-xl border border-black/5 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              New Chat
            </button>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-white/50 backdrop-blur-sm rounded-3xl border border-black/5 shadow-sm">
          
          {initializing ? (
            <div className="flex-1 p-8 space-y-8 overflow-y-auto">
              <div className="flex gap-4 max-w-[80%]">
                <SkeletonBlock className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="space-y-3 w-full">
                  <SkeletonBar className="h-4 w-3/4 rounded-lg" />
                  <SkeletonBar className="h-4 w-1/2 rounded-lg" />
                </div>
              </div>
              <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                <SkeletonBlock className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="space-y-3 w-full flex flex-col items-end">
                  <SkeletonBar className="h-4 w-2/3 rounded-lg" />
                </div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="relative mb-8">
                <div className="absolute inset-0 scale-150 bg-gradient-to-tr from-pink-300/40 via-purple-300/40 to-yellow-300/40 rounded-full blur-2xl animate-pulse" />
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary via-purple-400 to-pink-400 shadow-[0_0_40px_rgba(255,179,0,0.4)] relative z-10 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-4xl">auto_awesome</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">How can I help you today?</h3>
              <p className="text-slate-500 mb-8 text-center max-w-md">Ask me anything about your courses, need explanations on complex topics, or want to test your knowledge.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.title)}
                    className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left flex items-start gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 text-sm group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">Click to prompt the AI tutor</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat History */
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {messages.map((message, idx) => (
                <div key={idx} className={`flex gap-4 max-w-[85%] ${message.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${message.role === 'user' ? 'bg-primary text-white' : 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white'}`}>
                    <span className="material-symbols-outlined text-sm">
                      {message.role === 'user' ? 'person' : 'smart_toy'}
                    </span>
                  </div>
                  <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-5 py-4 rounded-3xl ${message.role === 'user' ? 'bg-primary text-slate-900 rounded-tr-sm shadow-[0_4px_14px_rgba(255,179,0,0.2)]' : 'bg-white border border-black/5 text-slate-700 rounded-tl-sm shadow-sm'} prose prose-sm max-w-none`}>
                      {message.role === 'assistant' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({node, inline, className, children, ...props}: any) {
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  {...props}
                                  children={String(children).replace(/\n$/, '')}
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  className="rounded-xl overflow-hidden my-4 text-sm"
                                />
                              ) : (
                                <code {...props} className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded-md font-mono text-xs">
                                  {children}
                                </code>
                              )
                            },
                            p: ({children}) => <p className="leading-relaxed mb-3 last:mb-0">{children}</p>,
                            ul: ({children}) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                            li: ({children}) => <li>{children}</li>,
                            h1: ({children}) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
                            h2: ({children}) => <h2 className="text-lg font-bold mt-4 mb-2">{children}</h2>,
                            h3: ({children}) => <h3 className="text-md font-bold mt-3 mb-1">{children}</h3>,
                            a: ({children, href}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 px-2 font-medium">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-4 max-w-[85%]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm bg-gradient-to-tr from-purple-500 to-pink-500 text-white">
                    <span className="material-symbols-outlined text-sm animate-pulse">smart_toy</span>
                  </div>
                  <div className="bg-white border border-black/5 rounded-3xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white/80 backdrop-blur-md border-t border-black/5 mt-auto">
            <div className="relative max-w-4xl mx-auto flex items-end gap-2 bg-white rounded-3xl border border-black/10 shadow-sm p-2 transition-all focus-within:shadow-md focus-within:border-primary/40">
              <div className="flex pb-2 px-2">
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-[20px] rotate-45">attach_file</span>
                </button>
              </div>
              
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AI Tutor... (Shift+Enter for new line)"
                className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none text-slate-800 placeholder:text-slate-400 text-sm py-3 px-2"
                rows={1}
                style={{
                  height: 'auto',
                }}
              />
              
              <div className="flex pb-2 px-2">
                <button
                  onClick={() => handleSend(input)}
                  disabled={loading || !input.trim()}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${input.trim() && !loading ? "bg-primary text-slate-900 shadow-sm hover:scale-105" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2 font-medium">AI may produce inaccurate information about people, places, or facts.</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
