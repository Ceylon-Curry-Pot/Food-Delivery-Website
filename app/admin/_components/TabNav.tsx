"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, UtensilsCrossed, Users } from "lucide-react";

const tabs = [
  { label: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { label: 'Menu Management', href: '/admin/menu', icon: UtensilsCrossed },
  { label: 'User Management', href: '/admin/users', icon: Users, badgeKey: 'pendingUsers' },
];

export default function TabNav({ pendingUsersCount }: { pendingUsersCount: number }) {
  const pathname = usePathname();

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <nav className="flex items-center gap-8 px-6 max-w-7xl mx-auto overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                isActive
                  ? 'text-brand border-brand'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={18} className={`transition-colors ${isActive ? "text-brand" : "text-gray-400 group-hover:text-gray-500"}`} />
              {tab.label}
              {tab.badgeKey === 'pendingUsers' && pendingUsersCount > 0 && (
                <span className="ml-1.5 bg-brand text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                  {pendingUsersCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
