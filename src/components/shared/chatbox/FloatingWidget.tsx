"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X, LogOut } from "lucide-react";
import ChatLogin from "./ChatLogin";
import CustomerChatBox from "./CustomerChatBox";

export default function FloatingWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const storedToken = localStorage.getItem("token") || document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (storedToken) setToken(storedToken);
        }
    }, [isOpen]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setToken(null);
    };

    return (
        <div
            // 🔥 Bulletproof inline positioning
            style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}
            // 🔥 Tailwind handles the mobile hiding
            className="hidden md:flex flex-col items-end"
        >

            {isOpen && (
                <div style={{ marginBottom: "16px", width: "350px", height: "500px" }} className="bg-background border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">

                    <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center z-10 shadow-md">
                        <div>
                            <h3 className="font-black text-lg tracking-tight leading-none">Live Support</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">We typically reply instantly</p>
                        </div>
                        <div className="flex gap-2">
                            {token && (
                                <button onClick={handleLogout} className="p-1.5 hover:bg-black/10 rounded-lg transition-colors">
                                    <LogOut size={16} />
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-black/10 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        {!token ? (
                            <ChatLogin onLoginSuccess={(newToken) => setToken(newToken)} />
                        ) : (
                            <CustomerChatBox token={token} />
                        )}
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 bg-primary text-primary-foreground"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
}