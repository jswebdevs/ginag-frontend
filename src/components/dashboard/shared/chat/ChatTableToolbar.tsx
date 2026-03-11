"use client";

import { Search, CheckCircle2, Archive, ShieldBan, Trash2 } from "lucide-react";

export default function ChatTableToolbar({
    search, setSearch,
    statusFilter, setStatusFilter,
    selectedCount, onBulkAction
}: any) {
    return (
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row justify-between items-center gap-4">

            {/* Search & Filter */}
            <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        placeholder="Search name, email..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-all"
                    />
                </div>

                <select
                    value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary cursor-pointer font-medium"
                >
                    <option value="">All Active Chats</option>
                    <option value="AGENT_ACTIVE">Human Needed</option>
                    <option value="BOT_ACTIVE">Handled by AI</option>
                    <option value="DONE">Done</option>
                    <option value="SPAM">Spam</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
            </div>

            {/* Bulk Actions (Only visible if rows are selected) */}
            {selectedCount > 0 && (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                    <span className="text-xs font-black uppercase tracking-widest text-primary mr-2">
                        {selectedCount} Selected
                    </span>
                    <button onClick={() => onBulkAction('DONE')} className="p-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors" title="Mark Done">
                        <CheckCircle2 size={18} />
                    </button>
                    <button onClick={() => onBulkAction('ARCHIVED')} className="p-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg transition-colors" title="Archive">
                        <Archive size={18} />
                    </button>
                    <button onClick={() => onBulkAction('SPAM')} className="p-2 bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white rounded-lg transition-colors" title="Mark as Spam">
                        <ShieldBan size={18} />
                    </button>
                    <button onClick={() => onBulkAction('DELETED')} className="p-2 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Delete (Super Admin)">
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}