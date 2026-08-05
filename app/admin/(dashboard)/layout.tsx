import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import AdminHeader from '../_components/AdminHeader';
import TabNav from '../_components/TabNav';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

async function getPendingUsersCount() {
  try {
    await connectToDatabase();
    return await User.countDocuments({ approved: false });
  } catch (error) {
    console.error("Failed to fetch pending users count:", error);
    return 0;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  const sessionUser = session.user as { email?: string | null; role?: string; approved?: boolean } | undefined;

  if (sessionUser?.role === 'staff' && !sessionUser.approved && sessionUser.email) {
      await connectToDatabase();
      const user = await User.findOne({ email: sessionUser.email });
      if (!user || (user.role === 'staff' && !user.approved)) {
        redirect('/admin/login');
      }
  }

  const pendingUsersCount = await getPendingUsersCount();

  return (
    <div className="min-h-screen bg-page flex flex-col font-sans">
      <AdminHeader />
      <TabNav pendingUsersCount={pendingUsersCount} />
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {children}
      </main>
    </div>
  );
}
