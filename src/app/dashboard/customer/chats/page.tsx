"use client";

import { useEffect, useState } from "react";
import { MessageCircleMore } from "lucide-react";
import CustomerChatBox from "@/components/shared/chatbox/CustomerChatBox";

export default function CustomerChatsPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored =
      localStorage.getItem("token") ||
      document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=")[1] ||
      document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1] ||
      null;
    setToken(stored);
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <header>
        <h1 className="text-3xl font-black text-heading uppercase tracking-tight flex items-center gap-3">
          <MessageCircleMore className="w-7 h-7 text-primary" />
          Live Support
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chat directly with our team — usually instant during business hours.
        </p>
      </header>

      <div className="bg-card border border-border rounded-3xl overflow-hidden h-[70vh] flex flex-col">
        {token ? (
          <CustomerChatBox token={token} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground p-8 text-center">
            We couldn't find your session. Try logging out and back in.
          </div>
        )}
      </div>
    </div>
  );
}
