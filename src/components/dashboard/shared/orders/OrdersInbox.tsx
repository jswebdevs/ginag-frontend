"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  ClipboardList,
  Loader2,
  Search,
  Phone,
  Mail,
  MapPin,
  Truck,
  Sparkles,
  Eye,
  Trash2,
  X,
  Save,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

type OrderStatus = "PENDING" | "CONTACTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface CustomOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  charmColorAndStyle: string;
  addInitial: boolean;
  initial: string | null;
  deliveryMethod: "PICKUP" | "MAILING";
  mailingAddress: string | null;
  notes: string | null;
  status: OrderStatus;
  createdAt: string;
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  CONTACTED: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  IN_PROGRESS: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/30",
};

const STATUSES: OrderStatus[] = ["PENDING", "CONTACTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function OrdersInbox() {
  const { user } = useUserStore();
  const isSuperAdmin = (user?.roles || []).includes("SUPER_ADMIN");

  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  const [viewing, setViewing] = useState<CustomOrder | null>(null);
  const [draftStatus, setDraftStatus] = useState<OrderStatus | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/custom-orders", {
        params: {
          limit: 100,
          ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
          ...(search ? { search } : {}),
        },
      });
      setOrders(res.data?.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
  }, [search]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { ALL: orders.length };
    for (const s of STATUSES) m[s] = orders.filter((o) => o.status === s).length;
    return m;
  }, [orders]);

  const openView = (o: CustomOrder) => {
    setViewing(o);
    setDraftStatus(o.status);
  };

  const closeView = () => {
    setViewing(null);
    setDraftStatus(null);
  };

  // Save status only when the draft differs from the current value. Show a
  // success toast and auto-close the modal after ~1.5s so the user sees the
  // confirmation before the dialog disappears.
  const saveStatus = async () => {
    if (!viewing || !draftStatus || draftStatus === viewing.status) return;
    setSavingStatus(true);
    try {
      await api.patch(`/custom-orders/${viewing.id}`, { status: draftStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === viewing.id ? { ...o, status: draftStatus } : o))
      );
      toast.success(`Order moved to ${draftStatus.replace("_", " ").toLowerCase()}`);
      setTimeout(() => {
        closeView();
        setSavingStatus(false);
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
      setSavingStatus(false);
    }
  };

  // Sonner-driven confirm. The toast holds itself open until the user picks
  // an option; "Delete" then issues the DELETE and removes the row.
  const confirmDelete = (o: CustomOrder) => {
    if (!isSuperAdmin) {
      toast.error("Only super admins can delete orders.");
      return;
    }
    toast(`Delete order ${o.orderNumber}?`, {
      description: `This permanently removes ${o.customerName}'s submission. This cannot be undone.`,
      duration: 10000,
      action: {
        label: "Delete",
        onClick: () => deleteOrder(o),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const deleteOrder = async (o: CustomOrder) => {
    setDeletingId(o.id);
    try {
      await api.delete(`/custom-orders/${o.id}`);
      setOrders((prev) => prev.filter((x) => x.id !== o.id));
      toast.success(`Deleted order ${o.orderNumber}`);
      if (viewing?.id === o.id) closeView();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-heading uppercase tracking-tight flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-primary" />
            Custom Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submissions from the customer order form. Click a card to view full details.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, order #…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["ALL", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer ${
              statusFilter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {s.replace("_", " ")} <span className="opacity-60">({counts[s] ?? 0})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-16 text-center text-muted-foreground">
          No orders yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onView={() => openView(o)}
              onDelete={() => confirmDelete(o)}
              canDelete={isSuperAdmin}
              deleting={deletingId === o.id}
            />
          ))}
        </div>
      )}

      {viewing && (
        <ViewModal
          order={viewing}
          draftStatus={draftStatus}
          setDraftStatus={setDraftStatus}
          onClose={closeView}
          onSave={saveStatus}
          saving={savingStatus}
          canDelete={isSuperAdmin}
          onDelete={() => confirmDelete(viewing)}
        />
      )}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onView,
  onDelete,
  canDelete,
  deleting,
}: {
  order: CustomOrder;
  onView: () => void;
  onDelete: () => void;
  canDelete: boolean;
  deleting: boolean;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView();
        }
      }}
      className="group bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Top row — order number + status pill */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-black text-primary truncate">
          {order.orderNumber}
        </span>
        <span
          className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border whitespace-nowrap ${STATUS_STYLE[order.status]}`}
        >
          {order.status.replace("_", " ")}
        </span>
      </div>

      {/* Customer name */}
      <div>
        <div className="text-base font-bold text-foreground truncate">{order.customerName}</div>
        <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5 mt-0.5">
          <Phone className="w-3 h-3" /> {order.customerPhone}
        </div>
      </div>

      {/* Charm style truncated + two action buttons on the same line */}
      <div className="flex items-center gap-2">
        <p className="flex-1 text-sm text-muted-foreground truncate" title={order.charmColorAndStyle}>
          {order.charmColorAndStyle}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
          title="View details"
        >
          <Eye className="w-3 h-3" /> View
        </button>
        <a
          href={`tel:${order.customerPhone.replace(/[^\d+]/g, "")}`}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
          title="Call customer"
        >
          <Phone className="w-3 h-3" /> Call
        </a>
      </div>

      {/* Footer — date + delete (super admin only) */}
      <div className="flex items-center justify-between gap-2 pt-3 mt-auto border-t border-border">
        <span className="text-[10px] text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
        {canDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={deleting}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/30 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete permanently"
          >
            {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

// ─── View Modal ───────────────────────────────────────────────────────────

function ViewModal({
  order,
  draftStatus,
  setDraftStatus,
  onClose,
  onSave,
  saving,
  canDelete,
  onDelete,
}: {
  order: CustomOrder;
  draftStatus: OrderStatus | null;
  setDraftStatus: (s: OrderStatus) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  canDelete: boolean;
  onDelete: () => void;
}) {
  const dirty = !!draftStatus && draftStatus !== order.status;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = `order-modal-title-${order.id}`;

  // Trap focus inside the dialog and restore it on close. Esc closes too.
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    const dialog = dialogRef.current;
    // Move focus into the modal so screen readers announce the dialog.
    const firstFocusable = dialog?.querySelector<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("aria-hidden"));
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    // Lock body scroll while the modal is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">
              Custom Order
            </p>
            <h2 id={titleId} className="text-xl font-mono font-black text-primary truncate">
              {order.orderNumber}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Submitted {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <Field label="Customer">
            <p className="text-base font-bold text-foreground">{order.customerName}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
              <a
                href={`tel:${order.customerPhone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" /> {order.customerPhone}
              </a>
              {order.customerEmail && (
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" /> {order.customerEmail}
                </a>
              )}
            </div>
          </Field>

          <Field label="Charm Color & Style">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {order.charmColorAndStyle}
            </p>
          </Field>

          {order.addInitial && (
            <Field label="Initial Requested">
              <p className="text-sm text-foreground inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {order.initial || "(unspecified)"}
              </p>
            </Field>
          )}

          <Field label="Delivery">
            <p className="text-sm text-foreground inline-flex items-center gap-2">
              {order.deliveryMethod === "PICKUP" ? (
                <>
                  <MapPin className="w-4 h-4" /> Pick up
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" /> Mailing
                </>
              )}
            </p>
            {order.deliveryMethod === "MAILING" && order.mailingAddress && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                {order.mailingAddress}
              </p>
            )}
          </Field>

          {order.notes && (
            <Field label="Notes">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {order.notes}
              </p>
            </Field>
          )}

          <Field label="Status">
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => {
                const active = (draftStatus ?? order.status) === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDraftStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                      active
                        ? STATUS_STYLE[s]
                        : "bg-card border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {s.replace("_", " ")}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        {/* Footer — Save button only appears when status is dirty */}
        <footer className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-muted/20">
          <div>
            {canDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/30 rounded-lg text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Close
            </button>
            {dirty && (
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed animate-in fade-in slide-in-from-right-2 duration-200"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Now
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-1.5">
        {label}
      </div>
      {children}
    </div>
  );
}
