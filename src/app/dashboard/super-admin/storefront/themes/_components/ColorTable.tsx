"use client";

import { Edit, Trash2, Globe, Palette } from "lucide-react";

interface ColorTableProps {
    themes: any[];
    onEdit: (theme: any) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string, field: "status" | "isActive", value: boolean) => void;
}

export default function ColorTable({ themes, onEdit, onDelete, onToggle }: ColorTableProps) {

    // Helper to extract a diverse set of colors for the preview
    const getPreviewColors = (vars: any) => {
        if (!vars) return [];

        // Prioritize distinct, colorful variables over structural ones like 'card' or 'background'
        const keysToTry = ['primary', 'secondary', 'accent', 'destructive', 'muted', 'border', 'background'];
        const colors: string[] = [];
        const seenColors = new Set<string>(); // Keeps track of colors to prevent duplicates (e.g., two whites)

        for (const key of keysToTry) {
            const colorVal = vars[key]?.trim();

            if (colorVal && !seenColors.has(colorVal)) {
                colors.push(colorVal);
                seenColors.add(colorVal);
            }

            // Stop once we have 4 distinct colors
            if (colors.length === 4) break;
        }

        return colors;
    };

    return (
        <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-muted/50 border-b border-border text-xs font-black text-muted-foreground uppercase tracking-widest">
                        <tr>
                            <th className="p-5">Theme Name</th>
                            <th className="p-5">Palette Preview</th>
                            <th className="p-5">Radius</th>
                            <th className="p-5 text-center">Public Menu</th>
                            <th className="p-5 text-center">Default Site Theme</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {themes.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-muted-foreground italic font-medium">
                                    No themes found. Create one above.
                                </td>
                            </tr>
                        ) : (
                            themes.map((theme) => {
                                const previewColors = getPreviewColors(theme.lightVariables);

                                return (
                                    <tr key={theme.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-5">
                                            <div className="font-black text-foreground text-sm uppercase flex items-center gap-2">
                                                <Palette size={16} className="text-muted-foreground" />
                                                {theme.name}
                                            </div>
                                        </td>

                                        {/* Fixed Palette Preview */}
                                        <td className="p-5">
                                            <div className="flex -space-x-2">
                                                {previewColors.map((color, idx) => {
                                                    // Check if color is HSL formatted (e.g., "222.2 47.4% 11.2%") or standard HEX/RGB
                                                    const isHsl = color.includes(' ') || color.includes('%');
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                                                            style={{ backgroundColor: isHsl ? `hsl(${color})` : color }}
                                                            title={`Color: ${color}`}
                                                        ></div>
                                                    );
                                                })}
                                                {previewColors.length === 0 && <span className="text-xs text-muted-foreground italic">No colors</span>}
                                            </div>
                                        </td>

                                        <td className="p-5">
                                            <span className="bg-background border border-border px-3 py-1 rounded-lg text-xs font-bold text-muted-foreground">
                                                {theme.radius}
                                            </span>
                                        </td>

                                        {/* Public Toggle (Status) */}
                                        <td className="p-5 text-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={theme.status}
                                                    onChange={(e) => onToggle(theme.id, "status", e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                            </label>
                                        </td>

                                        {/* Default Theme Toggle (IsActive) */}
                                        <td className="p-5 text-center">
                                            {theme.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                                    <Globe size={14} /> Active Default
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => onToggle(theme.id, "isActive", true)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border border-border bg-background px-3 py-1.5 rounded-xl hover:border-primary"
                                                >
                                                    Set as Default
                                                </button>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-5 text-right space-x-2">
                                            <button onClick={() => onEdit(theme)} className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors inline-block">
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(theme.id)}
                                                disabled={theme.isActive}
                                                className={`p-2 rounded-lg transition-colors inline-block ${theme.isActive ? "text-muted-foreground/30 cursor-not-allowed" : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"}`}
                                                title={theme.isActive ? "Cannot delete the active default theme" : "Delete theme"}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}