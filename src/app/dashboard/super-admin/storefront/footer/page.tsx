"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Plus,
  Trash2,
  Save,
  Loader2,
  Link as LinkIcon,
  Info,
  Phone,
  Mail,
  MapPin,
  Store,
  ExternalLink,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import IconRenderer from "@/components/shared/IconRenderer";
import IconPickerModal from "@/components/dashboard/shared/icon/IconPickerModal";

type FooterLink = {
  label: string;
  href: string;
};

type FooterContact = {
  icon: string;
  text: string;
  link?: string;
};

type FooterConfig = {
  col1: {
    showLogo: boolean;
    showTitle: boolean;
    title: string;
    description: string;
  };
  col2: {
    title: string;
    links: FooterLink[];
  };
  col3: {
    title: string;
    links: FooterLink[];
  };
  col4: {
    title: string;
    contacts: FooterContact[];
  };
};

const DEFAULT_CONFIG: FooterConfig = {
  col1: {
    showLogo: true,
    showTitle: true,
    title: "Industrial Artifacts",
    description: "Precision engineered accessories designed for the modern architectural lifestyle."
  },
  col2: {
    title: "Quick Links",
    links: [
      { label: "Shop All Products", href: "/shop" },
      { label: "Help Center & FAQ", href: "/faq" }
    ]
  },
  col3: {
    title: "Customer Support",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Track Order", href: "/track-order" }
    ]
  },
  col4: {
    title: "Contact Us",
    contacts: [
      { icon: "LuMapPin", text: "Rajshahi, Bangladesh" },
      { icon: "LuPhone", text: "+880 1700 000000" },
      { icon: "LuMail", text: "support@jswebdevs.com" }
    ]
  }
};

export default function FooterManagementPage() {
  const [config, setConfig] = useState<FooterConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"col1" | "col2" | "col3" | "col4">("col1");
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [activeContactIndex, setActiveContactIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/settings");
      const settings = res.data.data;
      if (settings?.footerConfig) {
        // Merge with default to ensure all fields exist
        setConfig({
          col1: { ...DEFAULT_CONFIG.col1, ...settings.footerConfig.col1 },
          col2: { ...DEFAULT_CONFIG.col2, ...settings.footerConfig.col2 },
          col3: { ...DEFAULT_CONFIG.col3, ...settings.footerConfig.col3 },
          col4: { ...DEFAULT_CONFIG.col4, ...settings.footerConfig.col4 },
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
      toast.error("Failed to load footer settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch("/settings", { footerConfig: config });
      toast.success("Footer configuration updated successfully");
    } catch (error) {
      console.error("Failed to save settings", error);
      toast.error("Failed to save footer settings");
    } finally {
      setIsSaving(false);
    }
  };

  const addLink = (col: "col2" | "col3") => {
    setConfig(prev => ({
      ...prev,
      [col]: {
        ...prev[col],
        links: [...prev[col].links, { label: "New Link", href: "#" }]
      }
    }));
  };

  const removeLink = (col: "col2" | "col3", index: number) => {
    setConfig(prev => ({
      ...prev,
      [col]: {
        ...prev[col],
        links: prev[col].links.filter((_, i) => i !== index)
      }
    }));
  };

  const updateLink = (col: "col2" | "col3", index: number, field: keyof FooterLink, value: string) => {
    const newLinks = [...config[col].links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setConfig(prev => ({
      ...prev,
      [col]: { ...prev[col], links: newLinks }
    }));
  };

  const addContact = () => {
    setConfig(prev => ({
      ...prev,
      col4: {
        ...prev.col4,
        contacts: [...prev.col4.contacts, { icon: "LuMapPin", text: "New Contact Info" }]
      }
    }));
  };

  const removeContact = (index: number) => {
    setConfig(prev => ({
      ...prev,
      col4: {
        ...prev.col4,
        contacts: prev.col4.contacts.filter((_, i) => i !== index)
      }
    }));
  };

  const updateContact = (index: number, field: keyof FooterContact, value: string) => {
    const newContacts = [...config.col4.contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setConfig(prev => ({
      ...prev,
      col4: { ...prev.col4, contacts: newContacts }
    }));
  };

  const moveItem = (col: "col2" | "col3" | "col4", index: number, direction: 'up' | 'down') => {
    const items = col === 'col4' ? [...config.col4.contacts] : [...config[col].links];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    [items[index], items[newIndex]] = [items[newIndex], items[index]];

    setConfig(prev => ({
      ...prev,
      [col]: col === 'col4' ? { ...prev.col4, contacts: items } : { ...prev[col], links: items }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-64 items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-bold text-muted-foreground animate-pulse">Loading footer configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-3xl border border-border shadow-theme-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Footer Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Configure the storefront footer columns and content.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-primary-foreground h-11 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-theme-md w-full md:w-auto cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* TABS */}
        <div className="flex flex-col gap-2">
          {(["col1", "col2", "col3", "col4"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-theme-sm"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
                }`}
            >
              <div className={`p-1.5 rounded-lg ${activeTab === tab ? "bg-white/20" : "bg-muted"}`}>
                {tab === "col1" && <Info size={16} />}
                {(tab === "col2" || tab === "col3") && <LinkIcon size={16} />}
                {tab === "col4" && <Phone size={16} />}
              </div>
              {tab === "col1" ? "Column 1: Branding" :
                tab === "col2" ? "Column 2: Quick Links" :
                  tab === "col3" ? "Column 3: Support" :
                    "Column 4: Contacts"}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-8">

            {/* COLUMN 1 */}
            {activeTab === "col1" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border">
                  <div>
                    <h3 className="font-bold text-foreground">Branding Display</h3>
                    <p className="text-xs text-muted-foreground">Toggle logo and title visibility</p>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative inline-flex items-center">
                        <input type="checkbox" checked={config.col1.showLogo} onChange={e => setConfig({ ...config, col1: { ...config.col1, showLogo: e.target.checked } })} className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </div>
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">Show Logo</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative inline-flex items-center">
                        <input type="checkbox" checked={config.col1.showTitle} onChange={e => setConfig({ ...config, col1: { ...config.col1, showTitle: e.target.checked } })} className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </div>
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">Show Title</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2 block">Footer Site Title</label>
                    <input
                      type="text"
                      value={config.col1.title}
                      onChange={e => setConfig({ ...config, col1: { ...config.col1, title: e.target.value } })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2 block">Footer Description (About Section)</label>
                    <textarea
                      rows={4}
                      value={config.col1.description}
                      onChange={e => setConfig({ ...config, col1: { ...config.col1, description: e.target.value } })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none font-medium leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COLUMN 2 & 3 */}
            {(activeTab === "col2" || activeTab === "col3") && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2 block">Column Title</label>
                  <input
                    type="text"
                    value={config[activeTab].title}
                    onChange={e => setConfig({ ...config, [activeTab]: { ...config[activeTab], title: e.target.value } })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none font-black uppercase tracking-widest"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Links</label>
                    <button
                      onClick={() => addLink(activeTab)}
                      className="text-[10px] font-black uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Plus size={12} /> Add Link
                    </button>
                  </div>

                  <div className="space-y-3">
                    {config[activeTab].links.map((link, i) => (
                      <div key={i} className="flex gap-3 group animate-in slide-in-from-left-2 duration-200">
                        <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveItem(activeTab, i, 'up')} disabled={i === 0} className="p-1 hover:text-primary disabled:opacity-30"><ChevronUp size={14} /></button>
                          <button onClick={() => moveItem(activeTab, i, 'down')} disabled={i === config[activeTab].links.length - 1} className="p-1 hover:text-primary disabled:opacity-30"><ChevronDown size={14} /></button>
                        </div>
                        <input
                          type="text"
                          placeholder="Label"
                          value={link.label}
                          onChange={e => updateLink(activeTab, i, "label", e.target.value)}
                          className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none font-bold"
                        />
                        <input
                          type="text"
                          placeholder="URL / Path"
                          value={link.href}
                          onChange={e => updateLink(activeTab, i, "href", e.target.value)}
                          className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none font-mono"
                        />
                        <button
                          onClick={() => removeLink(activeTab, i)}
                          className="p-3 bg-muted rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COLUMN 4 */}
            {activeTab === "col4" && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2 block">Column Title</label>
                  <input
                    type="text"
                    value={config.col4.title}
                    onChange={e => setConfig({ ...config, col4: { ...config.col4, title: e.target.value } })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none font-black uppercase tracking-widest"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Contacts</label>
                    <button
                      onClick={addContact}
                      className="text-[10px] font-black uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Plus size={12} /> Add Contact
                    </button>
                  </div>

                  <div className="space-y-4">
                    {config.col4.contacts.map((contact, i) => (
                      <div key={i} className="flex gap-4 items-start group p-4 border border-border rounded-2xl bg-muted/10 animate-in slide-in-from-left-2 duration-200">
                        <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity self-center">
                          <button onClick={() => moveItem('col4', i, 'up')} disabled={i === 0} className="p-1 hover:text-primary disabled:opacity-30"><ChevronUp size={14} /></button>
                          <button onClick={() => moveItem('col4', i, 'down')} disabled={i === config.col4.contacts.length - 1} className="p-1 hover:text-primary disabled:opacity-30"><ChevronDown size={14} /></button>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-primary shadow-sm group-hover:border-primary transition-colors cursor-pointer"
                            onClick={() => { setActiveContactIndex(i); setIsIconPickerOpen(true); }}>
                            <IconRenderer name={contact.icon} className="w-6 h-6" />
                          </div>
                          <span className="text-[8px] font-black text-muted-foreground uppercase text-center">Icon</span>
                        </div>

                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            placeholder="Contact Text / Value"
                            value={contact.text}
                            onChange={e => updateContact(i, "text", e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none font-bold"
                          />
                          <div className="flex items-center gap-2">
                            <ExternalLink size={14} className="text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="Optional Link (tel:, mailto:, or URL)"
                              value={contact.link || ""}
                              onChange={e => updateContact(i, "link", e.target.value)}
                              className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-[11px] focus:border-primary outline-none font-mono"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => removeContact(i)}
                          className="p-3 bg-muted rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors self-center"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ICON PICKER MODAL */}
      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelect={(iconName) => {
          if (activeContactIndex !== null) {
            updateContact(activeContactIndex, "icon", iconName);
          }
          setIsIconPickerOpen(false);
          setActiveContactIndex(null);
        }}
      />
    </div>
  );
}
