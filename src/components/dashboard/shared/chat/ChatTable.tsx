"use client";

import { MessageSquare, CheckCircle, Archive, ShieldBan, XCircle, Trash2, Loader2, User } from "lucide-react";

export default function ChatTable({ sessions, loading, selectedIds, setSelectedIds, onRowClick, onStatusChange }: any) {

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedIds(sessions.map((s: any) => s.id));
        else setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((item: string) => item !== id));
        else setSelectedIds([...selectedIds, id]);
    };

    if (loading) return <div className="flex-1 flex justify-center items-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

    return (
        <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-muted/50 border-b border-border text-xs font-black text-muted-foreground uppercase tracking-widest sticky top-0 z-10">
                    <tr>
                        <th className="p-4 w-12 text-center">
                            <input type="checkbox" onChange={toggleSelectAll} checked={sessions.length > 0 && selectedIds.length === sessions.length} className="rounded cursor-pointer" />
                        </th>
                        <th className="p-4">Customer</th>
                        <th className="p-4 w-1/3">Last Message</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {sessions.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground italic font-medium">No chat sessions found.</td></tr>
                    ) : (
                        sessions.map((session: any) => {
                            const unreadCount = session._count.messages;
                            const isUnread = unreadCount > 0;
                            const lastMsg = session.messages[0]?.content || "No messages yet.";

                            return (
                                <tr
                                    key={session.id}
                                    onClick={() => onRowClick(session.id)}
                                    // 🔥 If Unread: Give it a primary tint and thicker font. If Read: Standard card background.
                                    className={`cursor-pointer transition-colors ${isUnread ? "bg-primary/5 hover:bg-primary/10" : "bg-card hover:bg-muted/30"}`}
                                >
                                    {/* Checkbox (Stop Propagation so clicking checkbox doesn't open chat) */}
                                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox" checked={selectedIds.includes(session.id)} onChange={() => toggleSelect(session.id)} className="rounded cursor-pointer" />
                                    </td>

                                    {/* Customer Details */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border shrink-0">
                                                {session.user?.avatar ? <img src={session.user.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={18} className="text-muted-foreground" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm ${isUnread ? 'font-black text-foreground' : 'font-bold text-foreground'}`}>
                                                    {session.user?.firstName} {session.user?.lastName}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{session.user?.email}</span>
                                                    <span className="px-1.5 py-0.5 rounded-md bg-muted text-[8px] font-black uppercase tracking-widest">{session.user?.customerStatus}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Last Message Preview */}
                                    <td className="p-4">
                                        <p className={`text-sm truncate max-w-xs ${isUnread ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                                            {session.messages[0]?.senderType === 'AGENT' ? '🎧 ' : ''}
                                            {lastMsg}
                                        </p>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${session.status === 'AGENT_ACTIVE' ? 'bg-red-500/10 text-red-600 border-red-500/20 animate-pulse' :
                                                    'bg-muted text-muted-foreground border-border'
                                            }`}>
                                            {session.status.replace('_', ' ')}
                                        </span>
                                    </td>

                                    {/* Action Icons (Stop Propagation on all buttons) */}
                                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-end gap-2 items-center">

                                            {/* Message Icon with Superscript Unread Count */}
                                            <div className="relative p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer" title="Open Chat" onClick={() => onRowClick(session.id)}>
                                                <MessageSquare size={18} />
                                                {unreadCount > 0 && (
                                                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </div>

                                            <button onClick={() => onStatusChange(session.id, 'DONE')} className="p-2 text-muted-foreground hover:text-emerald-500 transition-colors" title="Mark Done"><CheckCircle size={18} /></button>
                                            <button onClick={() => onStatusChange(session.id, 'ARCHIVED')} className="p-2 text-muted-foreground hover:text-blue-500 transition-colors" title="Archive"><Archive size={18} /></button>
                                            <button onClick={() => onStatusChange(session.id, 'SPAM')} className="p-2 text-muted-foreground hover:text-orange-500 transition-colors" title="Mark as Spam"><ShieldBan size={18} /></button>
                                            <button onClick={() => onStatusChange(session.id, 'CLOSED')} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Close"><XCircle size={18} /></button>

                                            <div className="w-px h-5 bg-border mx-1"></div> {/* Separator */}

                                            <button onClick={() => onStatusChange(session.id, 'DELETED')} className="p-2 text-muted-foreground hover:text-red-500 transition-colors" title="Delete (Super Admin Only)"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}