"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, ShieldCheck, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { ROLE_LABEL, canManageUser, isRole, type Role } from "@/lib/permissions";
import EditUserModal from "./EditUserModal";
import type { AdminUserRow } from "./types";

interface UsersTableProps {
  users: AdminUserRow[];
  viewerRole: Role;
  viewerId: string;
}

const ROLE_STYLES: Record<Role, string> = {
  staff: 'bg-blue-100 text-blue-800',
  admin: 'bg-brand/10 text-brand',
  super_admin: 'bg-purple-100 text-purple-800',
};

export default function UsersTable({ users, viewerRole, viewerId }: UsersTableProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminUserRow | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = async (user: AdminUserRow, init: RequestInit, successMessage: string) => {
    setBusyId(user._id);
    try {
      const res = await fetch(`/api/users/${user._id}`, init);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Request failed");
      toast.success(successMessage);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusyId(null);
    }
  };

  const approve = (user: AdminUserRow) =>
    run(user, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: true }),
    }, `${user.name} approved`);

  const remove = (user: AdminUserRow) => {
    const message = user.approved
      ? `Delete ${user.name}? This cannot be undone.`
      : `Reject the sign-up request from ${user.name}?`;
    if (!confirm(message)) return;
    run(user, { method: "DELETE" }, `${user.name} removed`);
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <User size={64} className="text-gray-300 mb-4" />
        <h3 className="font-semibold text-gray-900 text-lg">No Users Found</h3>
        <p className="text-gray-500 text-sm">Create a user to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <th className="py-3 px-6 font-medium text-sm">Name</th>
                <th className="py-3 px-6 font-medium text-sm">Email</th>
                <th className="py-3 px-6 font-medium text-sm">Role</th>
                <th className="py-3 px-6 font-medium text-sm">Status</th>
                <th className="py-3 px-6 font-medium text-sm">Date Joined</th>
                <th className="py-3 px-6 font-medium text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const role: Role = isRole(user.role) ? user.role : 'staff';
                const manageable = canManageUser(viewerRole, role);
                const isSelf = user._id === viewerId;
                const busy = busyId === user._id;

                return (
                  <tr key={user._id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-6 text-gray-900 font-medium">{user.name}</td>
                    <td className="py-3 px-6 text-gray-500 text-sm">{user.email}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLES[role]}`}>
                        <ShieldCheck size={14} /> {ROLE_LABEL[role]}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {user.approved ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-gray-500 text-sm">
                      {user.requestedAt ? new Date(user.requestedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-6">
                      {manageable && (
                        <div className="flex justify-end gap-1">
                          {!user.approved && (
                            <button onClick={() => approve(user)} disabled={busy} title="Approve" aria-label="Approve"
                              className="p-2 rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-50">
                              <Check size={16} />
                            </button>
                          )}
                          <button onClick={() => setEditing(user)} disabled={busy} title="Edit" aria-label="Edit"
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50">
                            <Pencil size={16} />
                          </button>
                          {!isSelf && (
                            <button onClick={() => remove(user)} disabled={busy} title="Delete" aria-label="Delete"
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-50">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <EditUserModal user={editing} onClose={() => setEditing(null)} />
    </>
  );
}