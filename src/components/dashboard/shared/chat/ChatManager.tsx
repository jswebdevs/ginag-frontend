"use client";

import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import ChatTableToolbar from "./ChatTableToolbar";
import ChatTable from "./ChatTable";
import ChatBox from "./ChatBox";

export default function ChatManager() {
    const [view, setView] = useState<"TABLE" | "CHAT">("TABLE");
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    // Table Controls
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 🔥 FIX: Trigger state to safely refresh data without stale socket closures
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchSessions = useCallback(async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ page: String(page), limit: "15" });
            if (search) query.append("search", search);
            if (statusFilter) query.append("status", statusFilter);

            const res = await api.get(`/chat/sessions?${query.toString()}`);
            setSessions(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        } finally {
            setLoading(false);
        }
    }, [page, search, statusFilter]);

    useEffect(() => {
        fetchSessions();
        setSelectedIds([]);
    }, [fetchSessions, refreshTrigger]);

    // 🔥 Global Socket Connection for the Dashboard
    useEffect(() => {
        // Bulletproof Token Fetching
        const token = localStorage.getItem('token') ||
            document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] ||
            "";

        const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || "http://localhost:5000";
        const newSocket = io(SOCKET_URL, {
            auth: { token }
        });

        newSocket.on('connect', () => {
            console.log("🟢 Admin Dashboard Connected to Real-Time Server");
            newSocket.emit('join_admin_room');
        });

        // Update the table dynamically when a message happens anywhere
        newSocket.on('admin_receive_message', () => {
            setRefreshTrigger(prev => prev + 1); // Safely trigger refresh using latest state
        });

        // Update the table if AI requests a human
        newSocket.on('agent_requested', () => {
            setRefreshTrigger(prev => prev + 1);
        });

        setSocket(newSocket);
        return () => { newSocket.disconnect(); };
    }, []);

    // --- ACTIONS ---
    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await api.patch(`/chat/sessions/${id}/status`, { status: newStatus });
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `Marked as ${newStatus}`, showConfirmButton: false, timer: 2000 });
            setRefreshTrigger(prev => prev + 1);
        } catch (error: any) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Action failed', showConfirmButton: false, timer: 2000 });
        }
    };

    const handleBulkAction = async (newStatus: string) => {
        if (selectedIds.length === 0) return;
        try {
            await api.patch('/chat/sessions/bulk', { ids: selectedIds, status: newStatus });
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `Updated ${selectedIds.length} chats`, showConfirmButton: false, timer: 2000 });
            setSelectedIds([]);
            setRefreshTrigger(prev => prev + 1);
        } catch (error: any) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Bulk update failed', showConfirmButton: false, timer: 2000 });
        }
    };

    const openChat = (id: string) => {
        setActiveSessionId(id);
        setView("CHAT");
    };

    const closeChat = () => {
        setActiveSessionId(null);
        setView("TABLE");
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden flex flex-col h-[80vh] animate-in fade-in duration-300">
            {view === "TABLE" ? (
                <>
                    <ChatTableToolbar
                        search={search}
                        setSearch={setSearch}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        selectedCount={selectedIds.length}
                        onBulkAction={handleBulkAction}
                    />
                    <ChatTable
                        sessions={sessions}
                        loading={loading}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                        onRowClick={openChat}
                        onStatusChange={handleStatusChange}
                    />
                </>
            ) : (
                activeSessionId && <ChatBox sessionId={activeSessionId} onBack={closeChat} socket={socket} />
            )}
        </div>
    );
}