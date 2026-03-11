"use client";

import { useState, useEffect } from "react";
import { Plus, Palette, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";

import ColorTable from "./_components/ColorTable";
import ColorForm from "./_components/ColorForm";

export default function ThemesPage() {
    const [themes, setThemes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTheme, setEditingTheme] = useState<any>(null);

    const fetchThemes = async () => {
        try {
            const res = await api.get("/themes/all");
            setThemes(res.data.data);
        } catch (error) {
            console.error("Failed to load themes:", error);
            Swal.fire("Error", "Could not load themes.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThemes();
    }, []);

    const handleCreate = () => {
        setEditingTheme(null);
        setIsModalOpen(true);
    };

    const handleEdit = (theme: any) => {
        setEditingTheme(theme);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#3b82f6",
            confirmButtonText: "Yes, delete it!"
        });

        if (confirm.isConfirmed) {
            try {
                await api.delete(`/themes/${id}`);
                Swal.fire("Deleted!", "The theme has been deleted.", "success");
                fetchThemes();
            } catch (error: any) {
                Swal.fire("Error", error.response?.data?.message || "Failed to delete theme.", "error");
            }
        }
    };

    const handleToggle = async (id: string, field: "status" | "isActive", value: boolean) => {
        try {
            await api.patch(`/themes/${id}/toggle`, { [field]: value });
            // Refetch to get updated state (especially important for isActive since others get set to false)
            fetchThemes();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Settings updated', showConfirmButton: false, timer: 1500 });
        } catch (error: any) {
            Swal.fire("Error", "Failed to toggle setting.", "error");
            fetchThemes(); // Revert local state visually if it fails
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTheme(null);
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                        <Palette className="text-primary" /> Theme Manager
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                        Control the global colors, radius, and available themes for your storefront.
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-theme-sm"
                >
                    <Plus size={18} /> Add New Theme
                </button>
            </div>

            <ColorTable
                themes={themes}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
            />

            {isModalOpen && (
                <ColorForm
                    initialData={editingTheme}
                    onClose={closeModal}
                    onSuccess={() => { closeModal(); fetchThemes(); }}
                />
            )}
        </div>
    );
}