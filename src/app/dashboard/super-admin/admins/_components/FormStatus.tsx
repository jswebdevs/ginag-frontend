"use client";

import { Activity } from "lucide-react";

export default function FormStatus({ data, update }: any) {
    return (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm space-y-6">
            <div className="border-b border-border pb-4">
                <h3 className="font-black text-foreground uppercase tracking-widest text-sm flex items-center gap-2">
                    <Activity size={16} /> Account Status
                </h3>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</label>
                <select
                    value={data.status || "ACTIVE"}
                    onChange={(e) => update({ status: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all font-bold cursor-pointer"
                >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending Approval</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="BLOCKED">Blocked</option>
                </select>
            </div>
        </div>
    );
}
