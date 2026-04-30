"use client";

import { useState, useEffect } from "react";
import { Palette, Save, Loader2, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const VARIABLE_LABELS: Record<string, string> = {
  background: "App Background",
  foreground: "Body Text",
  heading: "Heading Text",
  subheading: "Subheading Text",
  card: "Card / Surface Background",
  "card-foreground": "Card Text",
  popover: "Popover Background",
  "popover-foreground": "Popover Text",
  primary: "Primary (Buttons / Links)",
  "primary-foreground": "Primary Text",
  secondary: "Secondary Action",
  "secondary-foreground": "Secondary Text",
  muted: "Muted Background",
  "muted-foreground": "Muted Text",
  accent: "Accent / Hover Highlight",
  "accent-foreground": "Accent Text",
  destructive: "Destructive / Error",
  "destructive-foreground": "Destructive Text",
  border: "Border / Divider",
  input: "Input Background",
  ring: "Focus Ring",
  "shadow-color": "Shadow Color",
  "gradient-from": "Gradient Start",
  "gradient-to": "Gradient End",
};

function hslToHex(hsl: string): string {
  try {
    const parts = hsl.trim().split(/\s+/);
    if (parts.length < 3) return "#cccccc";
    const h = parseFloat(parts[0]);
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  } catch {
    return "#cccccc";
  }
}

function hexToHsl(hex: string): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  } catch {
    return "0 0% 50%";
  }
}

export default function ColorsPage() {
  const [theme, setTheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeMode, setActiveMode] = useState<"light" | "dark">("dark");
  const [lightVars, setLightVars] = useState<Record<string, string>>({});
  const [darkVars, setDarkVars] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const res = await api.get("/themes/active");
      if (res.data.data) {
        const t = res.data.data;
        setTheme(t);
        setLightVars(t.lightVariables || {});
        setDarkVars(t.darkVariables || {});
      }
    } catch (err) {
      toast.error("Failed to load color palette.");
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (mode: "light" | "dark", key: string, hex: string) => {
    const hsl = hexToHsl(hex);
    if (mode === "light") setLightVars(prev => ({ ...prev, [key]: hsl }));
    else setDarkVars(prev => ({ ...prev, [key]: hsl }));
  };

  const handleSave = async () => {
    if (!theme) return;
    setSaving(true);
    try {
      await api.patch(`/themes/${theme.id}`, {
        lightVariables: lightVars,
        darkVariables: darkVars,
      });
      toast.success("Color palette saved!");
    } catch (err) {
      toast.error("Failed to save palette.");
    } finally {
      setSaving(false);
    }
  };

  const currentVars = activeMode === "light" ? lightVars : darkVars;
  const setCurrentVar = (key: string, hex: string) => handleColorChange(activeMode, key, hex);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-3xl border border-border shadow-theme-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Palette size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Store Colors</h1>
            <p className="text-sm text-muted-foreground mt-1">Customize the light and dark mode color palette for your storefront.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-primary-foreground h-11 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-theme-md disabled:opacity-50 w-full sm:w-auto"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Palette
        </button>
      </div>

      {/* MODE TABS */}
      <div className="bg-card border border-border rounded-3xl shadow-theme-sm overflow-hidden">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveMode("dark")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold text-sm transition-all ${activeMode === "dark" ? "bg-muted/50 text-foreground border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/30"}`}
          >
            <Moon size={16} /> Dark Mode
          </button>
          <button
            onClick={() => setActiveMode("light")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold text-sm transition-all ${activeMode === "light" ? "bg-muted/50 text-foreground border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/30"}`}
          >
            <Sun size={16} /> Light Mode
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(VARIABLE_LABELS).map(([key, label]) => {
            const hslValue = currentVars[key] || "0 0% 50%";
            const hexValue = hslToHex(hslValue);

            return (
              <div key={key} className="flex items-center gap-4 p-4 bg-background border border-border rounded-2xl hover:border-primary/30 transition-colors group">
                <div className="relative shrink-0">
                  <input
                    type="color"
                    value={hexValue}
                    onChange={e => setCurrentVar(key, e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border-2 border-border bg-transparent p-0.5"
                    title={`Change ${label}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{label}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5 truncate">--{key}: {hslValue}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
