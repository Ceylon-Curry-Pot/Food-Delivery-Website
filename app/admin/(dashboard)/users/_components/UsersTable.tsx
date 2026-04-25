"use client";

import { ShieldCheck, User } from "lucide-react";

interface UsersTableProps {
  users: any[];
}

export default function UsersTable({ users }: UsersTableProps) {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
              <th className="py-3 px-6 font-medium text-sm">Name</th>
              <th className="py-3 px-6 font-medium text-sm">Email</th>
              <th className="py-3 px-6 font-medium text-sm">Role</th>
              <th className="py-3 px-6 font-medium text-sm">Date Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/50">
                <td className="py-3 px-6 text-gray-900 font-medium">{user.name}</td>
                <td className="py-3 px-6 text-gray-500 text-sm">{user.email}</td>
                <td className="py-3 px-6">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-brand/10 text-brand' : 'bg-blue-100 text-blue-800'
                  }`}>
                    <ShieldCheck size={14} /> {user.role === 'admin' ? 'Admin' : 'Staff'}
                  </span>
                </td>
                <td className="py-3 px-6 text-gray-500 text-sm">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
