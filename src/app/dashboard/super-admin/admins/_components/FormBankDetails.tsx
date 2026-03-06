"use client";

import { Landmark, Smartphone } from "lucide-react";

export default function FormBankDetails({ data, update }: any) {

    const updateBank = (field: string, value: string) => {
        update({ bankDetails: { ...(data.bankDetails || {}), [field]: value } });
    };

    const updateMobile = (field: string, value: string) => {
        update({ mobileBanking: { ...(data.mobileBanking || {}), [field]: value } });
    };

    return (
        <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-8 mt-8">
            <div className="border-b border-border pb-4">
                <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                    <Landmark className="text-primary" /> Financial Details
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Salary processing and payout information.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Bank Details */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2 bg-muted/30 p-3 rounded-xl border border-border">
                        <Landmark size={16} className="text-muted-foreground" /> Bank Transfer
                    </h3>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Bank Name</label>
                            <input
                                type="text" value={data.bankDetails?.bankName || ""} onChange={(e) => updateBank("bankName", e.target.value)}
                                placeholder="e.g. Dutch-Bangla Bank"
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Branch Name</label>
                            <input
                                type="text" value={data.bankDetails?.branch || ""} onChange={(e) => updateBank("branch", e.target.value)}
                                placeholder="e.g. Mirpur Branch"
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Account Number</label>
                            <input
                                type="text" value={data.bankDetails?.accNo || ""} onChange={(e) => updateBank("accNo", e.target.value)}
                                placeholder="e.g. 115.110.12345"
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary font-mono"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Routing Number</label>
                            <input
                                type="text" value={data.bankDetails?.routingNo || ""} onChange={(e) => updateBank("routingNo", e.target.value)}
                                placeholder="9-digit routing number"
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Banking */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2 bg-muted/30 p-3 rounded-xl border border-border">
                        <Smartphone size={16} className="text-muted-foreground" /> Mobile Banking
                    </h3>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Provider</label>
                            <select
                                value={data.mobileBanking?.provider || ""}
                                onChange={(e) => updateMobile("provider", e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary cursor-pointer"
                            >
                                <option value="">Select Provider...</option>
                                <option value="bkash">bKash</option>
                                <option value="nagad">Nagad</option>
                                <option value="rocket">Rocket</option>
                                <option value="upay">Upay</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Account Number</label>
                            <input
                                type="tel" value={data.mobileBanking?.number || ""} onChange={(e) => updateMobile("number", e.target.value)}
                                placeholder="e.g. 01712345678"
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary font-mono"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}