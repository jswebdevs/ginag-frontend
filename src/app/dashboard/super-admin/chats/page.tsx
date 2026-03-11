import ChatManager from "@/components/dashboard/shared/chat/ChatManager";
import { MessageSquareText } from "lucide-react";

export default function AdminMessagesPage() {
    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                    <MessageSquareText className="text-primary" /> Inbox & Support
                </h1>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                    Manage AI conversations, reply to customers, and handle support tickets.
                </p>
            </div>

            {/* The full Chat Application */}
            <ChatManager />

        </div>
    );
}