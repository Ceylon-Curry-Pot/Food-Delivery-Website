"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminHeader() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="h-1 bg-brand w-full" />
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-baseline gap-4">
          <h1 className="font-bold text-2xl text-brand tracking-tight">
            Ceylon Curry Pot
          </h1>
          <span className="text-xs text-gray-500 uppercase tracking-widest hidden sm:inline-block">
            Admin Dashboard
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
