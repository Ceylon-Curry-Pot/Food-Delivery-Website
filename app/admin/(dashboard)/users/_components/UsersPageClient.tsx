"use client";

import { useState } from "react";
import CreateUserModal from "./CreateUserModal";
import { Plus } from "lucide-react";

export default function UsersPageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">View and manage staff accounts</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition"
        >
          <Plus size={18} /> Create User
        </button>
      </div>

      <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
