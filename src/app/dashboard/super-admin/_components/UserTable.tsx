"use client";

import Link from "next/link";
import { Edit, Trash2, Mail, Phone, UserCircle } from "lucide-react";

interface UserRow {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
  roles?: string[];
  status?: string;
  customerStatus?: string;
  createdAt?: string;
}

interface UserTableProps {
  users: UserRow[];
  onDelete: (id: string) => void;
  basePath: string;
}

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  INACTIVE: "bg-muted text-muted-foreground border-border",
  SUSPENDED: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  BLOCKED: "bg-destructive/10 text-destructive border-destructive/20",
  ON_LEAVE: "bg-violet-500/10 text-violet-600 border-violet-500/20",
};

export default function UserTable({ users, onDelete, basePath }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        <UserCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No users found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border">
        {users.map((u) => (
          <div key={u.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Avatar user={u} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-foreground truncate">
                  {u.firstName} {u.lastName}
                </div>
                <div className="text-xs text-muted-foreground font-mono">@{u.username}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 shrink-0" /> {u.email}
                </div>
                {u.phone && (
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 shrink-0" /> {u.phone}
                  </div>
                )}
              </div>
              {u.status && (
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border whitespace-nowrap ${
                    STATUS_STYLE[u.status] || STATUS_STYLE.INACTIVE
                  }`}
                >
                  {u.status}
                </span>
              )}
            </div>

            <RoleChips roles={u.roles} />

            <div className="flex gap-2 pt-2 border-t border-border/60">
              <Link
                href={`${basePath}/edit/${u.username}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted text-foreground text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </Link>
              <button
                onClick={() => onDelete(u.id)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive hover:text-white transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">User</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Roles</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-muted/10 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar user={u} />
                    <div className="min-w-0">
                      <div className="font-bold text-foreground truncate max-w-[220px]">
                        {u.firstName} {u.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">@{u.username}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground truncate max-w-[220px]">{u.email}</div>
                  {u.phone && <div className="text-xs text-muted-foreground mt-0.5">{u.phone}</div>}
                </td>
                <td className="p-4">
                  <RoleChips roles={u.roles} />
                </td>
                <td className="p-4">
                  {u.status && (
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        STATUS_STYLE[u.status] || STATUS_STYLE.INACTIVE
                      }`}
                    >
                      {u.status}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`${basePath}/edit/${u.username}`}
                      className="p-2 text-muted-foreground hover:text-blue-500 bg-background rounded-lg border border-transparent hover:border-border transition-all"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(u.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-lg border border-transparent hover:border-border transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Avatar({ user }: { user: UserRow }) {
  const initial = (user.firstName?.[0] || user.username?.[0] || "?").toUpperCase();
  return user.avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover border border-border" />
  ) : (
    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-border flex items-center justify-center font-bold">
      {initial}
    </div>
  );
}

function RoleChips({ roles }: { roles?: string[] }) {
  if (!roles || roles.length === 0)
    return <span className="text-xs text-muted-foreground italic">No roles</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((r) => (
        <span
          key={r}
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary"
        >
          {r.replace("_", " ")}
        </span>
      ))}
    </div>
  );
}
