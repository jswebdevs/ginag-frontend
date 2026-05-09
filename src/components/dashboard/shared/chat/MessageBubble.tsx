"use client";

import { format } from "date-fns";

export default function MessageBubble({ message }: { message: any }) {
    const isUser = message.senderType === "USER";
    const isBot = message.senderType === "BOT";
    const isAgent = message.senderType === "AGENT";

    return (
        <div className={`flex w-full ${isUser ? "justify-start" : "justify-end"}`}>
            <div className={`flex flex-col max-w-[75%] sm:max-w-[60%] ${isUser ? "items-start" : "items-end"}`}>

                {/* The Message Box */}
                <div
                    className={`p-3.5 rounded-2xl text-sm shadow-sm ${isUser
                            ? "bg-muted text-foreground rounded-tl-none border border-border"
                            : isBot
                                ? "bg-blue-500/10 text-blue-700 border border-blue-500/20 rounded-tr-none"
                                : "bg-primary text-primary-foreground rounded-tr-none"
                        }`}
                >
                    {/* Image Attachment (If Any) */}
                    {message.attachmentUrl && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-black/10">
                            <img
                                src={message.attachmentUrl}
                                alt="Attachment"
                                className="w-full max-h-60 object-cover hover:scale-105 transition-transform cursor-pointer"
                                onClick={() => window.open(message.attachmentUrl, '_blank')}
                            />
                        </div>
                    )}

                    {/* Text Content */}
                    {message.content && <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>}
                </div>

                {/* Meta Info (Timestamp & Sender Type) */}
                <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                        {isUser ? "Customer" : isBot ? "Auto Reply" : "You (Agent)"}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 font-semibold">
                        {format(new Date(message.createdAt), "h:mm a")}
                    </span>
                </div>

            </div>
        </div>
    );
}