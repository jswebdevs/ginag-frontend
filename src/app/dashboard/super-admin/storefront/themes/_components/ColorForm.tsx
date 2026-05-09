"use client";

import { useState } from "react";
// 🔥 Fixed: Imported Palette here
import { X, Plus, Trash2, Save, Loader2, Palette } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";

interface ColorFormProps {
    initialData?: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ColorForm({ initialData, onClose, onSuccess }: ColorFormProps) {
    const isEdit = !!initialData;
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"light" | "dark">("light");

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        radius: initialData?.radius || "0.5rem",
    });

    const formatVarsForUI = (jsonObj: any) => {
        if (!jsonObj) return [{ key: "background", value: "" }, { key: "primary", value: "" }];
        return Object.entries(jsonObj).map(([key, value]) => ({ key, value: String(value) }));
    };

    const [lightVars, setLightVars] = useState<{ key: string, value: string }[]>(formatVarsForUI(initialData?.lightVariables));
    const [darkVars, setDarkVars] = useState<{ key: string, value: string }[]>(formatVarsForUI(initialData?.darkVariables));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const updateVar = (type: "light" | "dark", index: number, field: "key" | "value", val: string) => {
        if (type === "light") {
            const newVars = [...lightVars];
            newVars[index][field] = val;
            setLightVars(newVars);
        } else {
            const newVars = [...darkVars];
            newVars[index][field] = val;
            setDarkVars(newVars);
        }
    };

    const addVar = (type: "light" | "dark") => {
        if (type === "light") setLightVars([...lightVars, { key: "", value: "" }]);
        else setDarkVars([...darkVars, { key: "", value: "" }]);
    };

    const removeVar = (type: "light" | "dark", index: number) => {
        if (type === "light") setLightVars(lightVars.filter((_, i) => i !== index));
        else setDarkVars(darkVars.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return Swal.fire("Required", "Theme name is required", "warning");

        const lightJson = lightVars.reduce((acc, curr) => {
            if (curr.key.trim()) acc[curr.key.trim()] = curr.value.trim();
            return acc;
        }, {} as Record<string, string>);

        const darkJson = darkVars.reduce((acc, curr) => {
            if (curr.key.trim()) acc[curr.key.trim()] = curr.value.trim();
            return acc;
        }, {} as Record<string, string>);

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                radius: formData.radius,
                lightVariables: lightJson,
                darkVariables: darkJson,
            };

            if (isEdit) {
                await api.patch(`/themes/${initialData.id}`, payload);
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Theme updated', showConfirmButton: false, timer: 1500 });
            } else {
                await api.post(`/themes`, payload);
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Theme created', showConfirmButton: false, timer: 1500 });
            }
            onSuccess();
        } catch (error: any) {
            Swal.fire("Error", error.response?.data?.message || "Failed to save theme.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-background border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-card">
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                        <Palette className="text-primary" /> {isEdit ? "Edit Theme" : "Create Theme"}
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-muted rounded-full hover:bg-destructive hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-8">

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Theme Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Ocean Blue" className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-bold outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Radius</label>
                            <input type="text" name="radius" value={formData.radius} onChange={handleInputChange} placeholder="e.g. 0.5rem" className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-bold outline-none focus:border-primary" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex bg-muted p-1 rounded-xl">
                            <button type="button" onClick={() => setActiveTab("light")} className={`flex-1 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${activeTab === "light" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Light Variables</button>
                            <button type="button" onClick={() => setActiveTab("dark")} className={`flex-1 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${activeTab === "dark" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Dark Variables</button>
                        </div>

                        <div className="space-y-3 bg-card border border-border p-4 rounded-2xl">
                            <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                                <span className="flex-1">CSS Variable (e.g. primary)</span>
                                <span className="flex-1">Value (HEX or HSL)</span>
                                <span className="w-8"></span>
                            </div>

                            {(activeTab === "light" ? lightVars : darkVars).map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-center group">
                                    <input type="text" value={item.key} onChange={(e) => updateVar(activeTab, idx, "key", e.target.value)} placeholder="background" className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm font-semibold outline-none focus:border-primary" />
                                    <input type="text" value={item.value} onChange={(e) => updateVar(activeTab, idx, "value", e.target.value)} placeholder="222.2 47.4% 11.2%" className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm font-semibold outline-none focus:border-primary" />
                                    <button type="button" onClick={() => removeVar(activeTab, idx)} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            <button type="button" onClick={() => addVar(activeTab)} className="w-full py-3 mt-2 border-2 border-dashed border-border rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-all flex justify-center items-center gap-2">
                                <Plus size={16} /> Add Variable
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-card flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-3 bg-muted text-foreground font-black text-xs uppercase tracking-widest rounded-xl hover:bg-border transition-colors">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2 shadow-theme-sm">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isEdit ? "Save Changes" : "Create Theme"}
                    </button>
                </div>

            </div>
        </div>
    );
}