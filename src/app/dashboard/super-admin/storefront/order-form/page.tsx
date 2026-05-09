"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Save, Loader2, X, Plus, ClipboardList } from "lucide-react";
import MediaManager from "@/components/dashboard/shared/media/MediaManager";

interface OrderHeroConfig {
  title: string;
  subtitle: string;
  personName: string;
  phone: string;
  email: string;
  badgeText: string;
  imageId: string | null;
  imageUrl: string | null;
  bottomImageId: string | null;
  bottomImageUrl: string | null;
  instructions: string;
}

const EMPTY: OrderHeroConfig = {
  title: "",
  subtitle: "",
  personName: "",
  phone: "",
  email: "",
  badgeText: "CUSTOM CHARMS MADE JUST FOR YOU!",
  imageId: null,
  imageUrl: null,
  bottomImageId: null,
  bottomImageUrl: null,
  instructions: "",
};

export default function OrderFormHeroEditor() {
  const [data, setData] = useState<OrderHeroConfig>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState<null | "top" | "bottom">(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/settings/homepage");
        const cfg = (res.data?.data?.orderHero as Partial<OrderHeroConfig>) || {};
        setData({ ...EMPTY, ...cfg });
      } catch (err) {
        console.error("Failed to load order hero config", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const update = (patch: Partial<OrderHeroConfig>) => setData((d) => ({ ...d, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/settings/homepage/orderHero", data);
      toast.success("Order page hero saved");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <header className="bg-card border border-border rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            Order Page Hero
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edit the left panel of the public <code className="text-primary">/order-now</code> page.
            The form on the right is fixed.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm disabled:opacity-50 hover:scale-105 transition-transform"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </header>

      <Section title="Brand">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Top image (logo / charms)">
            <ImagePicker
              url={data.imageUrl}
              onPick={() => setPickerOpen("top")}
              onRemove={() => update({ imageId: null, imageUrl: null })}
              hint="Falls back to store logo / script title if empty."
            />
          </Field>
          <Field label="Bottom-left image (decorative charms)">
            <ImagePicker
              url={data.bottomImageUrl}
              onPick={() => setPickerOpen("bottom")}
              onRemove={() => update({ bottomImageId: null, bottomImageUrl: null })}
              hint="Optional — appears next to the round badge."
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title (script)">
            <input
              value={data.title}
              onChange={(e) => update({ title: e.target.value })}
              className="form-input"
              placeholder="GinaG"
            />
          </Field>
          <Field label="Subtitle (uppercase)">
            <input
              value={data.subtitle}
              onChange={(e) => update({ subtitle: e.target.value })}
              className="form-input"
              placeholder="PURSE CHARMS and CHAINS"
            />
          </Field>
        </div>
      </Section>

      <Section title="Contact">
        <Field label="Person Name">
          <input
            value={data.personName}
            onChange={(e) => update({ personName: e.target.value })}
            className="form-input"
            placeholder="GINA ALEXANDER-GREENLEE"
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Phone">
            <input
              value={data.phone}
              onChange={(e) => update({ phone: e.target.value })}
              className="form-input"
              placeholder="615-202-2317"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              className="form-input"
              placeholder="alexgreeng@att.net"
            />
          </Field>
        </div>
        <Field label='"To order" instructions block'>
          <textarea
            value={data.instructions}
            onChange={(e) => update({ instructions: e.target.value })}
            rows={3}
            className="form-input resize-none"
            placeholder={"Text or call 615-202-2317\nor email alexgreeng@att.net"}
          />
          <p className="text-[11px] text-muted-foreground mt-1">Newlines preserved.</p>
        </Field>
      </Section>

      <Section title="Badge">
        <Field label="Badge text (in the gold circle)">
          <input
            value={data.badgeText}
            onChange={(e) => update({ badgeText: e.target.value })}
            className="form-input"
            placeholder="CUSTOM CHARMS MADE JUST FOR YOU!"
          />
        </Field>
      </Section>

      {/* Sticky save */}
      <div className="sticky bottom-4 z-30">
        <div className="bg-card border border-border rounded-3xl p-4 shadow-theme-lg">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            Save Order Hero
          </button>
        </div>
      </div>

      {/* Media picker modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="bg-card border border-border rounded-3xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
              <h3 className="font-black uppercase tracking-wider text-sm">
                Pick {pickerOpen === "top" ? "Top" : "Bottom"} Image
              </h3>
              <button
                onClick={() => setPickerOpen(null)}
                className="p-2 bg-background border border-border hover:bg-destructive hover:text-white rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-background">
              <MediaManager
                isPicker
                multiple={false}
                onSelect={(media: any) => {
                  const url = media.originalUrl || media.thumbUrl;
                  if (pickerOpen === "top") {
                    update({ imageId: media.id, imageUrl: url });
                  } else {
                    update({ bottomImageId: media.id, bottomImageUrl: url });
                  }
                  setPickerOpen(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 0.875rem;
          padding: 0.65rem 0.875rem;
          color: hsl(var(--foreground));
          font-size: 0.9rem;
          outline: none;
          transition: border-color 150ms, box-shadow 150ms;
        }
        :global(.form-input:focus) {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.18);
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-5 shadow-theme-sm">
      <h2 className="text-base font-black text-foreground uppercase tracking-widest border-b border-border pb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function ImagePicker({
  url,
  onPick,
  onRemove,
  hint,
}: {
  url: string | null;
  onPick: () => void;
  onRemove: () => void;
  hint?: string;
}) {
  return (
    <div>
      {url ? (
        <div className="relative w-full aspect-video rounded-2xl border border-border bg-black overflow-hidden group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
            <button
              type="button"
              onClick={onPick}
              className="bg-white text-black px-4 py-2 rounded-xl text-xs font-black"
            >
              Change
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="text-white/80 hover:text-red-400 text-xs font-bold flex items-center gap-1"
            >
              <X size={14} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPick}
          className="w-full aspect-video rounded-2xl border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="w-6 h-6" />
          <span className="text-sm font-bold">Pick image</span>
        </button>
      )}
      {hint && <p className="text-[11px] text-muted-foreground mt-2">{hint}</p>}
    </div>
  );
}
