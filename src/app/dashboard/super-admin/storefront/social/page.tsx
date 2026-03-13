"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import Swal from "sweetalert2";

// 🔥 Import your central IconRenderer and specific static icons
import IconRenderer from "@/components/shared/IconRenderer";
import {
    LuShare2,
    LuPlus,
    LuLoader,
    LuLink2,
    LuExternalLink,
    LuCheckCircle,
    LuXCircle,
    LuEdit,
    LuTrash2
} from "react-icons/lu";

import IconPickerModal from "@/components/dashboard/shared/icon/IconPickerModal";

export default function SocialLinksPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        icon: "LuLink2", // Default to React-Icon Lucide name
        link: "",
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/social/admin');
            setLinks(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch social links", error);
        } finally {
            setIsLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ name: "", icon: "LuLink2", link: "", order: links.length, isActive: true });
        setIsModalOpen(true);
    };

    const openEditModal = (link: any) => {
        setEditingId(link.id);
        setFormData({
            name: link.name,
            icon: link.icon,
            link: link.link,
            order: link.order,
            isActive: link.isActive,
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingId) {
                await api.patch(`/social/${editingId}`, formData);
                Swal.fire({ icon: "success", title: "Updated", toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
            } else {
                await api.post('/social', formData);
                Swal.fire({ icon: "success", title: "Created", toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
            }
            setIsModalOpen(false);
            fetchLinks();
        } catch (error) {
            console.error(error);
            Swal.fire({ title: "Error", text: "Failed to save link.", icon: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This social link will be permanently removed.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/social/${id}`);
                setLinks(links.filter(l => l.id !== id));
                Swal.fire({ icon: "success", title: "Deleted", toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
            } catch (error) {
                Swal.fire({ title: "Error", text: "Failed to delete link.", icon: "error" });
            }
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await api.patch(`/social/${id}`, { isActive: !currentStatus });
            setLinks(links.map(l => l.id === id ? { ...l, isActive: !currentStatus } : l));
        } catch (error) {
            console.error("Failed to toggle status");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-3xl border border-border shadow-theme-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <LuShare2 size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight">Social Links</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage external links displayed in the storefront footer.</p>
                    </div>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-primary text-primary-foreground h-11 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-theme-md w-full md:w-auto"
                >
                    <LuPlus size={18} /> Add New Link
                </button>
            </div>

            {/* TABLE DATA */}
            <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col h-64 items-center justify-center space-y-4">
                        <LuLoader className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm font-bold text-muted-foreground animate-pulse">Loading links...</p>
                    </div>
                ) : links.length === 0 ? (
                    <div className="flex flex-col h-64 items-center justify-center text-muted-foreground">
                        <LuLink2 className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold">No social links configured.</p>
                        <p className="text-sm">Click 'Add New Link' to create one.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-border bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground font-black">
                                    <th className="p-4 w-20 text-center">Order</th>
                                    <th className="p-4 w-24">Icon</th>
                                    <th className="p-4">Platform / URL</th>
                                    <th className="p-4 w-32 text-center">Status</th>
                                    <th className="p-4 w-32 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {links.map((link) => (
                                    <tr key={link.id} className="border-b border-border hover:bg-muted/10 transition-colors group">
                                        <td className="p-4 text-center font-mono font-bold text-muted-foreground">{link.order}</td>

                                        <td className="p-4">
                                            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground shadow-sm">
                                                {/* 🔥 Using IconRenderer instead of local DynamicIcon */}
                                                <IconRenderer name={link.icon} className="w-5 h-5" />
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <p className="font-bold text-foreground text-base">{link.name}</p>
                                            <a href={link.link} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5 truncate max-w-[300px]">
                                                {link.link} <LuExternalLink size={10} />
                                            </a>
                                        </td>

                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => toggleStatus(link.id, link.isActive)}
                                                className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors
                                                  ${link.isActive ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                                            >
                                                {link.isActive ? <LuCheckCircle size={12} /> : <LuXCircle size={12} />}
                                                {link.isActive ? "Active" : "Hidden"}
                                            </button>
                                        </td>

                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(link)} className="p-2 bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors shrink-0">
                                                    <LuEdit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(link.id)} className="p-2 bg-muted rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0">
                                                    <LuTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ADD / EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-card border border-border rounded-3xl w-full max-w-lg shadow-theme-2xl overflow-hidden animate-in zoom-in-95">

                        <div className="p-5 border-b border-border flex justify-between items-center bg-muted/10">
                            <h2 className="font-black text-foreground uppercase tracking-wider text-sm">
                                {editingId ? "Edit Social Link" : "Add Social Link"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl transition-colors">
                                <LuXCircle size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">

                            {/* ICON PICKER FIELD */}
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Display Icon <span className="text-destructive">*</span></label>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground shadow-sm shrink-0">
                                        <IconRenderer name={formData.icon} className="w-6 h-6" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsIconPickerOpen(true)}
                                        className="flex-1 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-2xl py-3 px-4 text-sm font-bold text-muted-foreground transition-all"
                                    >
                                        Select New Icon
                                    </button>
                                </div>
                            </div>

                            {/* NAME & ORDER */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Platform Name <span className="text-destructive">*</span></label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Facebook" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Sort Order</label>
                                    <input type="number" min="0" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                                </div>
                            </div>

                            {/* URL */}
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Destination URL <span className="text-destructive">*</span></label>
                                <input required type="url" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="https://..." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none font-mono" />
                            </div>

                            {/* TOGGLE */}
                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <p className="font-bold text-sm text-foreground">Visibility Status</p>
                                    <p className="text-xs text-muted-foreground">Show this link in the storefront</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>

                            {/* ACTIONS */}
                            <div className="pt-4 border-t border-border flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                                <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-theme-sm disabled:opacity-50">
                                    {isSaving ? <LuLoader size={16} className="animate-spin" /> : <LuShare2 size={16} />}
                                    {editingId ? "Save Changes" : "Create Link"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* ICON PICKER MODAL */}
            <IconPickerModal
                isOpen={isIconPickerOpen}
                onClose={() => setIsIconPickerOpen(false)}
                onSelect={(iconName) => {
                    setFormData({ ...formData, icon: iconName });
                    setIsIconPickerOpen(false);
                }}
            />

        </div>
    );
}