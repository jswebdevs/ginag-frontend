"use client";

import { Shield, Activity, Check } from "lucide-react";

const AVAILABLE_ROLES = [
    "ADMIN",
    "PRODUCT_MANAGER",
    "ORDER_MANAGER",
    "SUPPORT_AGENT",
    "MARKETING_SPECIALIST",
    "DELIVERY_MANAGER"
];

export default function FormStatus({ data, update }: any) {

    const toggleRole = (role: string) => {
        let newRoles = [...(data.roles || [])];

        if (newRoles.includes(role)) {
            newRoles = newRoles.filter((r: string) => r !== role);
        } else {
            newRoles.push(role);
        }

        // Fallback: A staff member must have at least one role
        if (newRoles.length === 0) newRoles.push("ADMIN");
        update({ roles: newRoles });
    };

    return (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm space-y-6">
            <div className="border-b border-border pb-4">
                <h3 className="font-black text-foreground uppercase tracking-widest text-sm flex items-center gap-2">
                    <Activity size={16} /> Status & Roles
                </h3>
            </div>

            {/* Account Status */}
            <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Account Status</label>
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

            {/* Multi-Select Roles */}
            <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <Shield size={14} /> Assigned Roles
                </label>

                <div className="space-y-2">
                    {/* Super Admin Protection */}
                    {(data.roles || []).includes("SUPER_ADMIN") && (
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-3 cursor-not-allowed opacity-80">
                            <div className="w-5 h-5 rounded bg-purple-500 text-white flex items-center justify-center shrink-0">
                                <Check size={14} />
                            </div>
                            <span className="text-sm font-black text-purple-600">SUPER ADMIN (Immutable)</span>
                        </div>
                    )}

                    {/* Standard Roles */}
                    {AVAILABLE_ROLES.map((role) => {
                        const isSelected = (data.roles || []).includes(role);
                        return (
                            <div
                                key={role}
                                onClick={() => toggleRole(role)} // <--- FIXED HERE
                                className={`p-3 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${isSelected ? 'bg-primary/5 border-primary/30' : 'bg-background border-border hover:border-primary/30'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-muted border border-border'
                                    }`}>
                                    {isSelected && <Check size={14} />}
                                </div>
                                <span className={`text-sm font-bold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {role.replace('_', ' ')}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}