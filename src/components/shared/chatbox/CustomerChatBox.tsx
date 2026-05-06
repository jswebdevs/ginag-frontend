"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Send, Headset, AlertCircle } from "lucide-react";

export default function CustomerChatBox({ token }: { token: string }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v\d+\/?$/, '') || "http://localhost:5000";
        const newSocket = io(baseUrl, {
            auth: { token },
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });

        newSocket.on('connect', () => {
            setConnected(true);
            setConnectionError(null);
        });

        newSocket.on('connect_error', (err) => {
            setConnected(false);
            setConnectionError(err?.message || 'Could not connect to chat. Please refresh.');
        });

        newSocket.on('disconnect', () => {
            setConnected(false);
        });

        newSocket.on('chat_history', (history: any[]) => {
            setMessages(history);
        });

        newSocket.on('receive_message', (msg: any) => {
            setMessages((prev) => [...prev, msg]);
        });

        setSocket(newSocket);

        return () => { newSocket.disconnect(); };
    }, [token]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !socket || !connected) return;
        socket.emit('message', { content: input.trim() });
        setInput("");
    };

    // 🔥 NEW: Helper function to turn plain URLs into clickable, wrapping links!
    const renderMessageContent = (content: string) => {
        if (!content) return null;

        // Regex to detect URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = content.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium break-all"
                    >
                        {part}
                    </a>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-background relative">

            {connectionError && (
                <div className="px-3 py-2 bg-destructive/10 border-b border-destructive/20 flex items-center gap-2 text-xs text-destructive">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="flex-1 truncate">{connectionError}</span>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                {messages.length === 0 && !connectionError && (
                    <div className="text-center text-muted-foreground text-sm mt-10">
                        <Headset size={32} className="mx-auto mb-2 text-primary" />
                        <p className="font-medium">
                            {connected ? "Hi! How can we help you today?" : "Connecting…"}
                        </p>
                    </div>
                )}

                {messages.map((msg: any, idx: number) => {
                    const isUser = msg.senderType === 'USER';
                    return (
                        <div key={msg.id || idx} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${isUser
                                ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm"
                                : "bg-card text-foreground border border-border rounded-tl-none shadow-sm"
                                }`}>
                                {msg.attachmentUrl && (
                                    <img src={msg.attachmentUrl} alt="attachment" className="w-full rounded-xl mb-2" />
                                )}

                                {/* 🔥 FIX: We pass the text to our new helper, and enforce word wrapping */}
                                <div className="whitespace-pre-wrap break-words">
                                    {renderMessageContent(msg.content)}
                                </div>

                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                                {isUser ? "You" : msg.senderType === 'BOT' ? "Auto Reply" : "Support"}
                            </span>
                        </div>
                    );
                })}
                <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 p-3 bg-card border-t border-border flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-2 min-h-[44px] text-sm outline-none focus:border-primary"
                />
                <button
                    onClick={sendMessage}
                    disabled={!input.trim() || !connected}
                    title={!connected ? "Not connected" : undefined}
                    className="w-11 h-11 shrink-0 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
}