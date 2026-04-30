"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
    History, Eye, X, Shield, Trash2,
    ChevronLeft, ChevronRight, Loader2, Database, AlertTriangle
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);

    const [selectedLog, setSelectedLog] = useState<any | null>(null);
    const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

    const { user } = useUserStore();
    const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN") || (user as any)?.role === "SUPER_ADMIN";

    useEffect(() => {
        fetchLogs(page);
    }, [page]);

    const fetchLogs = async (pageNumber: number) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/audit?page=${pageNumber}&limit=15`);
            setLogs(res.data.data || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
            setTotalLogs(res.data.pagination?.total || 0);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
            toast.error("Failed to fetch audit logs.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await api.delete(`/audit/${id}`);
            toast.success("Audit log deleted.");
            setLogs(prev => prev.filter(l => l.id !== id));
            setTotalLogs(prev => prev - 1);
            if (selectedLog?.id === id) setSelectedLog(null);
        } catch (error) {
            toast.error("Failed to delete audit log.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteAll = async () => {
        setShowDeleteAllConfirm(false);
        try {
            await api.delete('/audit/all');
            toast.success("All audit logs deleted.");
            setLogs([]);
            setTotalLogs(0);
            setTotalPages(1);
            setPage(1);
        } catch (error) {
            toast.error("Failed to delete all audit logs.");
        }
    };

    const getActionColor = (action: string) => {
        const act = action.toUpperCase();
        if (act.includes("CREATE") || act.includes("ADD")) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
        if (act.includes("UPDATE") || act.includes("EDIT")) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        if (act.includes("DELETE") || act.includes("REMOVE")) return "bg-destructive/10 text-destructive border-destructive/20";
        if (act.includes("LOGIN") || act.includes("AUTH")) return "bg-purple-500/10 text-purple-500 border-purple-500/20";
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-3xl border border-border shadow-theme-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight">Audit & Activity Logs</h1>
                        <p className="text-sm text-muted-foreground mt-1">Track who did what, when, and where across the platform.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-muted px-4 py-2 rounded-xl border border-border">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Total Records</p>
                        <p className="text-lg font-black text-foreground text-center">{totalLogs.toLocaleString()}</p>
                    </div>
                    {isSuperAdmin && logs.length > 0 && (
                        <button
                            onClick={() => setShowDeleteAllConfirm(true)}
                            className="h-full px-4 py-2 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-bold hover:bg-destructive hover:text-white transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* TABLE DATA */}
            <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col h-64 items-center justify-center space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm font-bold text-muted-foreground animate-pulse">Fetching security records...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col h-64 items-center justify-center text-muted-foreground">
                        <History className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold">No logs found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="border-b border-border bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground font-black">
                                    <th className="p-4 w-48">Timestamp</th>
                                    <th className="p-4 w-32">User Role</th>
                                    <th className="p-4 w-40">Action</th>
                                    <th className="p-4">Entity Modified</th>
                                    <th className="p-4 w-32">IP Address</th>
                                    <th className="p-4 w-28 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {logs.map((log) => (
                                    <tr key={log.id} className="border-b border-border hover:bg-muted/10 transition-colors">

                                        <td className="p-4 text-xs font-medium text-muted-foreground">
                                            <div className="flex flex-col">
                                                <span className="text-foreground font-bold">{new Date(log.createdAt).toLocaleDateString()}</span>
                                                <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span className="text-xs font-black uppercase tracking-wider bg-muted px-2 py-1 rounded-md text-foreground">
                                                {log.userRole || "SYSTEM"}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground capitalize flex items-center gap-1.5">
                                                    <Database size={14} className="text-muted-foreground" />
                                                    {log.entity}
                                                </span>
                                                {log.entityId && (
                                                    <span className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate max-w-[200px]" title={log.entityId}>
                                                        ID: {log.entityId}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4 text-xs font-mono text-muted-foreground">
                                            {log.ipAddress || "N/A"}
                                        </td>

                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedLog(log)}
                                                    className="p-2 bg-muted rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {isSuperAdmin && (
                                                    <button
                                                        onClick={() => handleDelete(log.id)}
                                                        disabled={deletingId === log.id}
                                                        className="p-2 bg-muted rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                                                        title="Delete Log"
                                                    >
                                                        {deletingId === log.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!isLoading && totalPages > 1 && (
                    <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-xl bg-background border border-border text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-xl bg-background border border-border text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* JSON DETAILS MODAL */}
            {selectedLog && (
                <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
                    <div className="bg-card border border-border rounded-3xl w-full max-w-3xl flex flex-col overflow-hidden shadow-theme-2xl animate-in zoom-in-95">

                        <div className="p-5 border-b border-border flex justify-between items-center bg-muted/10">
                            <div>
                                <h3 className="font-black text-foreground uppercase tracking-wider text-sm flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] border ${getActionColor(selectedLog.action)}`}>
                                        {selectedLog.action}
                                    </span>
                                    Payload Details
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 font-mono">Log ID: {selectedLog.id}</p>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="p-2 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 bg-[#0d1117] overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <pre className="text-sm font-mono text-[#e6edf3] whitespace-pre-wrap break-words">
                                {selectedLog.details ? JSON.stringify(selectedLog.details, null, 2) : "// No additional payload details provided for this action."}
                            </pre>
                        </div>

                        <div className="p-4 border-t border-border bg-muted/10 flex justify-between items-center text-xs text-muted-foreground">
                            <span><strong>User Agent:</strong> {selectedLog.userAgent || "Unknown"}</span>
                            <span><strong>User ID:</strong> {selectedLog.userId || "System Action"}</span>
                        </div>

                    </div>
                </div>
            )}

            {/* DELETE ALL CONFIRMATION MODAL */}
            {showDeleteAllConfirm && (
                <div className="fixed inset-0 z-[110] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-card border border-border rounded-3xl w-full max-w-md p-8 shadow-theme-2xl animate-in zoom-in-95 text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                            <AlertTriangle size={32} className="text-destructive" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground">Clear All Audit Logs?</h2>
                            <p className="text-sm text-muted-foreground mt-2">
                                This will permanently delete all <strong>{totalLogs.toLocaleString()}</strong> audit log records. This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteAllConfirm(false)}
                                className="flex-1 py-3 rounded-xl border border-border bg-muted text-foreground font-bold text-sm hover:bg-muted/80 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                className="flex-1 py-3 rounded-xl bg-destructive text-white font-bold text-sm hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} /> Delete All
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
