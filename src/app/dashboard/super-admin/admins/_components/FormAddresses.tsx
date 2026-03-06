"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, CheckCircle2, Home } from "lucide-react";

const DIVISIONS = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"];
const ADDRESS_TYPES = ["PRESENT", "PERMANENT", "HOME", "WORK", "SHIPPING", "BILLING"];

export default function FormAddresses({ data, update }: any) {
    const [isAdding, setIsAdding] = useState(false);

    // Temporary state for the address currently being drafted
    const [draft, setDraft] = useState({
        type: "PRESENT",
        isDefault: false,
        house: "",
        road: "",
        area: "",
        postalCode: "",
        thana: "",
        district: "",
        division: "Dhaka",
        country: "Bangladesh"
    });

    const handleAddAddress = () => {
        if (!draft.district || !draft.thana || !draft.postalCode) {
            alert("District, Thana, and Postal Code are required.");
            return;
        }

        const newAddresses = [...(data.addresses || [])];

        // If this is the first address, or marked as default, unset other defaults
        if (newAddresses.length === 0 || draft.isDefault) {
            newAddresses.forEach(a => a.isDefault = false);
            draft.isDefault = true;
        }

        newAddresses.push({ ...draft });
        update({ addresses: newAddresses });

        // Reset draft and close form
        setDraft({
            type: "PERMANENT", // Switch to another type automatically
            isDefault: false,
            house: "", road: "", area: "", postalCode: "",
            thana: "", district: "", division: "Dhaka", country: "Bangladesh"
        });
        setIsAdding(false);
    };

    const removeAddress = (index: number) => {
        const newAddresses = [...data.addresses];
        newAddresses.splice(index, 1);

        // If we removed the default, make the first remaining one default
        if (newAddresses.length > 0 && !newAddresses.some(a => a.isDefault)) {
            newAddresses[0].isDefault = true;
        }

        update({ addresses: newAddresses });
    };

    const setDefault = (index: number) => {
        const newAddresses = data.addresses.map((addr: any, i: number) => ({
            ...addr,
            isDefault: i === index
        }));
        update({ addresses: newAddresses });
    };

    return (
        <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-8 mt-8">
            <div className="border-b border-border pb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                        <MapPin className="text-primary" /> Address Book
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">Manage present, permanent, and work addresses.</p>
                </div>
                {!isAdding && (
                    <button
                        type="button"
                        onClick={() => setIsAdding(true)}
                        className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
                    >
                        <Plus size={14} /> Add Address
                    </button>
                )}
            </div>

            {/* List Existing Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data.addresses || []).map((addr: any, idx: number) => (
                    <div key={idx} className={`p-5 border rounded-2xl relative group transition-all ${addr.isDefault ? 'bg-primary/5 border-primary/30' : 'bg-background border-border hover:border-primary/30'}`}>
                        <button
                            type="button" onClick={() => removeAddress(idx)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded-md text-[10px] font-black uppercase tracking-wider">
                                {addr.type}
                            </span>
                            {addr.isDefault && (
                                <span className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-wider">
                                    <CheckCircle2 size={12} /> Default
                                </span>
                            )}
                        </div>

                        <div className="text-sm font-medium text-foreground leading-relaxed">
                            <p>{[addr.house, addr.road, addr.area].filter(Boolean).join(", ")}</p>
                            <p>{addr.thana}, {addr.district} - {addr.postalCode}</p>
                            <p className="text-muted-foreground">{addr.division}, {addr.country}</p>
                        </div>

                        {!addr.isDefault && (
                            <button
                                type="button" onClick={() => setDefault(idx)}
                                className="mt-4 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <Home size={12} /> Set as Default
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {(data.addresses || []).length === 0 && !isAdding && (
                <div className="text-center p-8 border border-dashed border-border rounded-2xl">
                    <MapPin className="mx-auto text-muted-foreground/30 mb-3" size={32} />
                    <p className="text-sm font-bold text-muted-foreground">No addresses added yet.</p>
                </div>
            )}

            {/* Add New Address Form */}
            {isAdding && (
                <div className="bg-muted/10 border border-border rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Plus size={16} className="text-primary" /> New Address Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Address Type</label>
                            <select
                                value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary cursor-pointer"
                            >
                                {ADDRESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1 md:col-span-2 flex items-end pb-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox" checked={draft.isDefault}
                                    onChange={(e) => setDraft({ ...draft, isDefault: e.target.checked })}
                                    className="w-4 h-4 accent-primary rounded border-border"
                                />
                                <span className="text-xs font-bold text-foreground">Set as Default Address</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">House / Apt (Opt)</label>
                            <input type="text" value={draft.house} onChange={e => setDraft({ ...draft, house: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Road / Street (Opt)</label>
                            <input type="text" value={draft.road} onChange={e => setDraft({ ...draft, road: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Area / Block (Opt)</label>
                            <input type="text" value={draft.area} onChange={e => setDraft({ ...draft, area: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Thana / Upazila *</label>
                            <input type="text" value={draft.thana} onChange={e => setDraft({ ...draft, thana: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">District / City *</label>
                            <input type="text" value={draft.district} onChange={e => setDraft({ ...draft, district: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Postal Code *</label>
                            <input type="text" value={draft.postalCode} onChange={e => setDraft({ ...draft, postalCode: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary font-mono" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Division</label>
                            <select value={draft.division} onChange={e => setDraft({ ...draft, division: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary cursor-pointer">
                                {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                        <button type="button" onClick={handleAddAddress} className="bg-foreground text-background px-5 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                            Save Address
                        </button>
                        <button type="button" onClick={() => setIsAdding(false)} className="text-muted-foreground font-bold text-sm hover:text-foreground transition-colors px-3 py-2">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}