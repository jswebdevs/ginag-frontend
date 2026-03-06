"use client";

import { useState, useEffect } from "react";
import { AlignLeft, List, Plus, Trash2, ShieldAlert, Sparkles, BookOpen, Layers, Settings2 } from "lucide-react";

// Helper Component: Renders a field that can toggle between Paragraph and Bulleted List
const FieldEditor = ({ label, field, value, update, icon: Icon, isWarning = false }: any) => {
    const [descType, setDescType] = useState<"paragraph" | "list">("paragraph");

    useEffect(() => {
        if (value?.includes('\n')) setDescType("list");
    }, [value]);

    const listItems = value ? value.split("\n") : [""];

    const updateListItem = (index: number, val: string) => {
        const newList = [...listItems];
        newList[index] = val;
        update({ [field]: newList.join("\n") });
    };

    const addListItem = () => {
        update({ [field]: (value || "") + "\n" });
    };

    const removeListItem = (index: number) => {
        const newList = listItems.filter((_: string, i: number) => i !== index);
        update({ [field]: newList.join("\n") });
    };

    const colorClass = isWarning ? "text-orange-500" : "text-muted-foreground";
    const focusClass = isWarning ? "focus:border-orange-500" : "focus:border-primary";
    const markerClass = isWarning ? "bg-orange-500" : "bg-primary";

    return (
        <div className="space-y-4 bg-muted/10 p-5 rounded-2xl border border-border">
            <div className="flex items-center justify-between">
                <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${colorClass}`}>
                    <Icon size={16} /> {label}
                </label>

                <div className="flex bg-muted p-1 rounded-xl">
                    <button
                        type="button" onClick={() => setDescType("paragraph")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${descType === 'paragraph' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    >
                        <AlignLeft size={12} /> Paragraph
                    </button>
                    <button
                        type="button" onClick={() => setDescType("list")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${descType === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                    >
                        <List size={12} /> Bulleted List
                    </button>
                </div>
            </div>

            {descType === "paragraph" ? (
                <textarea
                    value={value || ""}
                    onChange={(e) => update({ [field]: e.target.value })}
                    rows={4}
                    placeholder={`Enter ${label.toLowerCase()} details...`}
                    className={`w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all ${focusClass}`}
                />
            ) : (
                <div className="space-y-2 animate-in fade-in duration-300">
                    {listItems.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 group">
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${markerClass}`} />
                            <input
                                type="text" value={item} onChange={(e) => updateListItem(idx, e.target.value)}
                                placeholder={`Point ${idx + 1}`}
                                className={`flex-1 bg-transparent border-b border-border py-1.5 text-sm outline-none ${focusClass}`}
                            />
                            <button
                                type="button" onClick={() => removeListItem(idx)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all"
                                title="Remove point"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button" onClick={addListItem}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-wider mt-4 hover:underline ${isWarning ? 'text-orange-500' : 'text-primary'}`}
                    >
                        <Plus size={14} /> Add Point
                    </button>
                </div>
            )}
        </div>
    );
};

export default function AdditionalInfoPart({ product, update }: any) {
    return (
        <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-8">
            <h2 className="text-xl font-black text-foreground border-b border-border pb-4 tracking-tight">Part 4: Extended Details</h2>

            {/* Material & Build (Single Input) */}
            <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Layers size={16} /> Material & Build Overview
                </label>
                <input
                    type="text" value={product.material || ""}
                    onChange={(e) => update({ material: e.target.value })}
                    placeholder="e.g. 100% Organic Cotton, Aerospace Grade Aluminum..."
                    className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm outline-none focus:border-primary transition-all"
                />
            </div>

            {/* Grid of Toggleable Editors */}
            <div className="grid grid-cols-1 gap-2">
                <FieldEditor label="Specifications" field="specifications" icon={Settings2} value={product.specifications} update={update} />
                <FieldEditor label="Usage Instructions" field="usage" icon={BookOpen} value={product.usage} update={update} />
                <FieldEditor label="Usefulness & Benefits" field="usefulness" icon={Sparkles} value={product.usefulness} update={update} />
                <FieldEditor label="Warnings & Awareness" field="awareness" icon={ShieldAlert} value={product.awareness} update={update} isWarning={true} />
            </div>

        </div>
    );
}