"use client";

import { useEffect, useState, useRef } from "react";
import { chat } from "@/lib/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { MessageSquare, Send, Plus, Bot, User } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chat.listSessions().then((res) => {
      setSessions(res.data?.sessions || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createSession = async () => {
    try {
      const res = await chat.createSession({ title: "New Chat" });
      const sid = res.data.session_id;
      setSessions((prev) => [{ _id: sid, title: "New Chat", updated_at: new Date().toISOString() }, ...prev]);
      setActiveSession(sid);
      setMessages([]);
    } catch (err: any) {
      toast.error(err.message || "Failed to create session");
    }
  };

  const loadSession = async (sessionId: string) => {
    setActiveSession(sessionId);
    try {
      const res = await chat.getSession(sessionId);
      setMessages(res.data?.messages || []);
    } catch {
      toast.error("Failed to load chat");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeSession) return;

    const userMsg = { role: "user", content: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await chat.sendMessage(activeSession, input);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.response,
          timestamp: new Date().toISOString(),
          sources: res.data.sources,
        },
      ]);
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading chat..." />;

  return (
    <div className="flex gap-0 h-[calc(100vh-12rem)] border border-foreground">
      {/* Sessions sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-foreground flex flex-col bg-background">
        <div className="p-4 border-b-2 border-foreground">
          <Button onClick={createSession} className="w-full" size="sm">
            <Plus size={16} strokeWidth={1.5} /> New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map((s) => (
            <button
              key={s._id}
              onClick={() => loadSession(s._id)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm font-body transition-colors duration-100",
                activeSession === s._id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <MessageSquare size={12} strokeWidth={1.5} className="inline mr-2" />
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-background">
        {activeSession ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 border border-foreground flex items-center justify-center flex-shrink-0">
                      <Bot size={16} strokeWidth={1.5} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] px-4 py-3 text-sm font-body",
                      msg.role === "user"
                        ? "bg-foreground text-background"
                        : "border border-foreground bg-background"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.sources?.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border-light">
                        <p className="text-xs font-mono text-muted-foreground">Sources: {msg.sources.join(", ")}</p>
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 border border-foreground flex items-center justify-center flex-shrink-0">
                      <User size={16} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t-2 border-foreground">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask about credit analysis, financial metrics..."
                  className="flex-1 px-4 py-2.5 bg-transparent border-2 border-foreground text-foreground font-body placeholder:text-muted-foreground placeholder:italic focus:outline-none focus:border-b-[4px]"
                  disabled={sending}
                />
                <Button onClick={sendMessage} loading={sending} disabled={!input.trim()}>
                  <Send size={16} strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={32} strokeWidth={1} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-body italic">Select a chat or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
