"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { Socket } from "socket.io-client";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import MessageBubble from "./MessageBubble";

// 🔥 Added socket to props
export default function ChatBox({ sessionId, onBack, socket }: { sessionId: string, onBack: () => void, socket: Socket | null }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [sessionData, setSessionData] = useState<any>(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchHistory();
    }, [sessionId]);

    // 🔥 Listen for new messages using the shared socket
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMsg: any) => {
            // Only append if the message belongs to THIS specific open chat
            if (newMsg.sessionId === sessionId) {
                setMessages((prev) => prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg]);
            }
        };

        socket.on('admin_receive_message', handleNewMessage);

        // Cleanup listener when closing chat
        return () => { socket.off('admin_receive_message', handleNewMessage); };
    }, [socket, sessionId]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchHistory = async () => {
        try {
            const res = await api.get(`/chat/sessions/${sessionId}/messages`);
            setMessages(res.data.data);
            if (res.data.data.length > 0) {
                setSessionData(res.data.data[0].session);
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (attachmentUrl: string | null = null) => {
        if (!input.trim() && !attachmentUrl) return;
        try {
            const res = await api.post(`/chat/sessions/${sessionId}/messages`, { content: input.trim(), attachmentUrl });

            // 🔥 FIX: Instantly add the newly created message to the screen
            setMessages((prev) => [...prev, res.data.data]);
            setInput("");

        } catch (error) {
            Swal.fire("Error", "Failed to send message", "error");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await api.post("/media/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
            await handleSendMessage(uploadRes.data.url);
        } catch (error) {
            Swal.fire("Upload Failed", "Could not upload image.", "error");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (loading) return <div className="flex-1 flex justify-center items-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

    return (
        <div className="flex flex-col h-full bg-background animate-in slide-in-from-right-8 duration-300">
            {/* Header */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-muted hover:bg-border rounded-xl transition-colors">
                        <ArrowLeft size={18} className="text-foreground" />
                    </button>
                    <div>
                        <h2 className="font-black text-foreground text-lg tracking-tight">
                            {sessionData?.user?.firstName || "Customer"} {sessionData?.user?.lastName || ""}
                        </h2>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                            Session ID: {sessionId.split('-')[0]}...
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-muted/10">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card border-t border-border">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-12 h-12 shrink-0 bg-muted hover:bg-border text-muted-foreground rounded-2xl flex items-center justify-center transition-colors disabled:opacity-50">
                        {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                    </button>
                    <textarea
                        value={input} onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                        placeholder="Type your reply... (Press Enter to send)"
                        rows={1} className="flex-1 min-h-[48px] max-h-32 bg-background border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                    <button onClick={() => handleSendMessage()} disabled={(!input.trim() && !uploading) || uploading} className="w-12 h-12 shrink-0 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-theme-sm">
                        <Send size={18} className="ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}