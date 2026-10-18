import { redirect } from 'next/navigation';
import AdminHeader from '../_components/AdminHeader';
import TabNav from '../_components/TabNav';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getCurrentAdmin } from '@/lib/authGuard';
import { can } from '@/lib/permissions';

async function getPendingUsersCount() {
  try {
    await connectToDatabase();
    return await User.countDocuments({ approved: false });
  } catch (error) {
    console.error('Failed to fetch pending users count:', error);
    return 0;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  // Only people who can manage users need to see this number.
  const pendingUsersCount = can(admin.role, 'users:view') ? await getPendingUsersCount() : 0;

  return (
    <div className="min-h-screen bg-page flex flex-col font-sans">
      <AdminHeader />
      <TabNav pendingUsersCount={pendingUsersCount} role={admin.role} />
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">{children}</main>
    </div>
  );
}