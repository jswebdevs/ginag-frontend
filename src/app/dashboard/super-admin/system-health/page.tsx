"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import {
    Activity, Database, Cpu, HardDrive,
    RefreshCcw, Server, Clock, CheckCircle2, XCircle, AlertTriangle
} from "lucide-react";

export default function SystemHealthPage() {
    const [healthData, setHealthData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchHealthData = useCallback(async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        try {
            const res = await api.get('/system/health'); // Ensure this matches your route
            setHealthData(res.data.data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to fetch system health", error);
            // Fallback state if the server is completely unreachable
            setHealthData({ status: "DOWN" });
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    // Fetch on mount, and optionally auto-refresh every 60 seconds
    useEffect(() => {
        fetchHealthData();
        const interval = setInterval(() => fetchHealthData(), 60000);
        return () => clearInterval(interval);
    }, [fetchHealthData]);

    // Helper to convert raw seconds into Days/Hours/Mins
    const formatUptime = (seconds: number) => {
        if (!seconds) return "0m";
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${d > 0 ? d + 'd ' : ''}${h > 0 ? h + 'h ' : ''}${m}m`;
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
                <RefreshCcw className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-bold text-muted-foreground animate-pulse">Pinging Server...</p>
            </div>
        );
    }

    const isHealthy = healthData?.status === "HEALTHY";

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-3xl border border-border shadow-theme-sm">
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
                        System Health
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isHealthy ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                            {isHealthy ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                            {healthData?.status || "UNKNOWN"}
                        </span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Real-time monitoring for your API, Database, and Server hardware.
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    {lastUpdated && (
                        <span className="text-xs font-bold text-muted-foreground hidden sm:block">
                            Updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <button
                        onClick={() => fetchHealthData(true)}
                        disabled={isRefreshing}
                        className="bg-muted text-foreground h-11 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-muted/80 transition-colors border border-border disabled:opacity-50 w-full md:w-auto"
                    >
                        <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* BENTO GRID METRICS */}
            {healthData?.status !== "DOWN" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* 1. UPTIME & NODE INFO */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm space-y-6">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="p-3 bg-primary/10 rounded-xl"><Server size={24} /></div>
                            <h3 className="font-black tracking-tight text-lg text-foreground">Server Runtime</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Uptime</p>
                                <p className="text-3xl font-black text-foreground flex items-end gap-2">
                                    {formatUptime(healthData.system?.uptimeSeconds)}
                                    <Clock size={20} className="text-muted-foreground mb-1.5" />
                                </p>
                            </div>
                            <div className="flex justify-between items-center py-3 border-t border-border">
                                <span className="text-sm text-muted-foreground font-medium">Node.js Version</span>
                                <span className="text-sm font-bold bg-muted px-2 py-1 rounded-md">{healthData.system?.nodeVersion}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-t border-border">
                                <span className="text-sm text-muted-foreground font-medium">OS Platform</span>
                                <span className="text-sm font-bold bg-muted px-2 py-1 rounded-md uppercase">{healthData.system?.platform}</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. DATABASE LATENCY */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm space-y-6">
                        <div className="flex items-center gap-3 text-blue-500">
                            <div className="p-3 bg-blue-500/10 rounded-xl"><Database size={24} /></div>
                            <h3 className="font-black tracking-tight text-lg text-foreground">PostgreSQL DB</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Ping Latency</p>
                                <p className="text-3xl font-black text-foreground flex items-end gap-2">
                                    {healthData.database?.latencyMs} <span className="text-lg text-muted-foreground mb-0.5">ms</span>
                                </p>
                            </div>
                            <div className="flex justify-between items-center py-3 border-t border-border">
                                <span className="text-sm text-muted-foreground font-medium">Connection Status</span>
                                {healthData.database?.status === "CONNECTED" ? (
                                    <span className="text-sm font-bold text-emerald-500 flex items-center gap-1.5"><CheckCircle2 size={16} /> Connected</span>
                                ) : (
                                    <span className="text-sm font-bold text-destructive flex items-center gap-1.5"><XCircle size={16} /> Disconnected</span>
                                )}
                            </div>
                            <div className="flex justify-between items-center py-3 border-t border-border opacity-50">
                                <span className="text-sm text-muted-foreground font-medium">Prisma Client</span>
                                <span className="text-sm font-bold">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. MEMORY / RAM */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm space-y-6">
                        <div className="flex items-center gap-3 text-amber-500">
                            <div className="p-3 bg-amber-500/10 rounded-xl"><HardDrive size={24} /></div>
                            <h3 className="font-black tracking-tight text-lg text-foreground">Memory Usage</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">System RAM</p>
                                    <p className="text-xs font-black text-foreground">{healthData.system?.memory?.percentUsed}</p>
                                </div>
                                {/* Visual Progress Bar */}
                                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`h-3 rounded-full ${parseFloat(healthData.system?.memory?.percentUsed) > 85 ? 'bg-destructive' : 'bg-amber-500'}`}
                                        style={{ width: healthData.system?.memory?.percentUsed }}
                                    ></div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 text-right">
                                    {healthData.system?.memory?.usedMB} MB / {healthData.system?.memory?.totalMB} MB
                                </p>
                            </div>

                            <div className="flex justify-between items-center py-3 border-t border-border">
                                <span className="text-sm text-muted-foreground font-medium">Node Process RAM</span>
                                <span className="text-sm font-black text-foreground bg-muted px-2 py-1 rounded-md">{healthData.system?.memory?.processRAM_MB} MB</span>
                            </div>
                        </div>
                    </div>

                    {/* 4. CPU LOAD */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm space-y-6 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3 text-purple-500">
                            <div className="p-3 bg-purple-500/10 rounded-xl"><Cpu size={24} /></div>
                            <h3 className="font-black tracking-tight text-lg text-foreground">CPU Load Averages</h3>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-2">
                            <div className="bg-muted/30 border border-border rounded-2xl p-4 text-center">
                                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">1 Min</p>
                                <p className="text-xl font-black text-foreground">{healthData.system?.cpuLoad?.['1m']}</p>
                            </div>
                            <div className="bg-muted/30 border border-border rounded-2xl p-4 text-center">
                                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">5 Min</p>
                                <p className="text-xl font-black text-foreground">{healthData.system?.cpuLoad?.['5m']}</p>
                            </div>
                            <div className="bg-muted/30 border border-border rounded-2xl p-4 text-center">
                                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">15 Min</p>
                                <p className="text-xl font-black text-foreground">{healthData.system?.cpuLoad?.['15m']}</p>
                            </div>
                        </div>
                    </div>

                    {/* 5. EXTERNAL SERVICES */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm space-y-6 md:col-span-2">
                        <div className="flex items-center gap-3 text-emerald-500">
                            <div className="p-3 bg-emerald-500/10 rounded-xl"><Activity size={24} /></div>
                            <h3 className="font-black tracking-tight text-lg text-foreground">External Services</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 border border-border rounded-2xl bg-muted/10">
                                <span className="text-sm font-bold text-foreground">Cloud Storage (Media)</span>
                                {healthData.services?.storage === "OPERATIONAL" ? (
                                    <span className="flex items-center gap-1.5 text-xs font-black text-emerald-500 uppercase tracking-wider"><CheckCircle2 size={16} /> OK</span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-xs font-black text-destructive uppercase tracking-wider"><AlertTriangle size={16} /> Error</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between p-4 border border-border rounded-2xl bg-muted/10">
                                <span className="text-sm font-bold text-foreground">Email Provider</span>
                                {healthData.services?.emailProvider === "OPERATIONAL" ? (
                                    <span className="flex items-center gap-1.5 text-xs font-black text-emerald-500 uppercase tracking-wider"><CheckCircle2 size={16} /> OK</span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-xs font-black text-destructive uppercase tracking-wider"><AlertTriangle size={16} /> Error</span>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                /* CRITICAL DOWN STATE */
                <div className="bg-destructive/10 border-2 border-destructive/20 rounded-3xl p-12 text-center space-y-4">
                    <AlertTriangle className="w-16 h-16 text-destructive mx-auto animate-pulse" />
                    <h2 className="text-2xl font-black text-destructive">API Unreachable</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        The frontend cannot communicate with the Express backend. Please check your Node server logs and ensure the database is running.
                    </p>
                </div>
            )}

        </div>
    );
}