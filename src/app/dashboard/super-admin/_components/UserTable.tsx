"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Edit, Trash2, ShieldAlert, Crown } from "lucide-react";
import Image from "next/image";

interface UserTableProps {
    users: any[];
    onDelete?: (id: string) => void;
    basePath: string; // e.g. /dashboard/super-admin/customers
}

export default function UserTable({ users, onDelete, basePath }: UserTableProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            case "PENDING": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
            case "SUSPENDED":
            case "BLOCKED": return "bg-red-500/10 text-red-600 border-red-500/20";
            case "ON_LEAVE": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            default: return "bg-muted text-muted-foreground border-border";
        }
    };

    const getRoleBadge = (roles: string[]) => {
        if (roles.includes("SUPER_ADMIN")) return "bg-purple-500 text-white shadow-sm";
        if (roles.includes("ADMIN")) return "bg-primary text-white shadow-sm";
        return "bg-muted text-foreground border border-border";
    };

    const getCustomerBadge = (status: string) => {
        if (status === "VIP") return "bg-amber-500/10 text-amber-600 border-amber-500/20";
        return "bg-muted text-muted-foreground border-border";
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-muted/30 border-b border-border">
                    <tr>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">User</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role/Status</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                        <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground font-medium italic">
                                No users found.
                            </td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-muted border border-border overflow-hidden relative shrink-0">
                                            {user.avatar ? (
                                                <Image src={user.avatar} alt={user.username} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground text-sm uppercase">
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-foreground text-sm">{user.firstName} {user.lastName}</p>
                                                {user.customerStatus === 'VIP' && <Crown size={12} className="text-amber-500" />}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">@{user.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="font-medium text-foreground text-sm">{user.email}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{user.phone || "No phone"}</p>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {user.roles?.slice(0, 2).map((role: string) => (
                                            <span key={role} className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${getRoleBadge([role])}`}>
                                                {role.replace('_', ' ')}
                                            </span>
                                        ))}
                                        {user.customerStatus && user.customerStatus !== 'REGULAR' && user.customerStatus !== 'NONE' && (
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider border ${getCustomerBadge(user.customerStatus)}`}>
                                                {user.customerStatus}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusColor(user.status)}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`${basePath}/${user.username}`} 
                                            className="p-2 bg-background border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            href={`${basePath}/edit/${user.username}`} 
                                            className="p-2 bg-background border border-border rounded-lg text-muted-foreground hover:text-orange-500 hover:border-orange-500 transition-colors"
                                            title="Edit User"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        {onDelete && !user.roles?.includes("SUPER_ADMIN") && (
                                            <button
                                                onClick={() => onDelete(user.id)}
                                                className="p-2 bg-background border border-border rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
