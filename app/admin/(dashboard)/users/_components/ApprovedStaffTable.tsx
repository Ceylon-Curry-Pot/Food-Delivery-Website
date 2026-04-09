"use client";

import { ChevronDown, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function ApprovedStaffTable({ users }: { users: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (users.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
      >
        <div className="flex items-center gap-2">
          <ChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
          <span className="font-semibold text-gray-900">Active Staff Members ({users.length})</span>
        </div>
        <span className="text-sm font-medium text-gray-500">Click to {isOpen ? 'collapse' : 'expand'}</span>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <th className="py-3 px-6 font-medium text-sm">Name</th>
                <th className="py-3 px-6 font-medium text-sm">Email</th>
                <th className="py-3 px-6 font-medium text-sm">Role</th>
                <th className="py-3 px-6 font-medium text-sm">Approved On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-6 text-gray-900 font-medium">{user.name}</td>
                  <td className="py-3 px-6 text-gray-500 text-sm">{user.email}</td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <ShieldCheck size={14} /> {user.role === 'admin' ? 'Admin' : 'Staff'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-gray-500 text-sm">
                    {user.approvedAt ? new Date(user.approvedAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
