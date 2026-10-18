export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getCurrentAdmin } from "@/lib/authGuard";
import { can } from "@/lib/permissions";
import UsersTable from "./_components/UsersTable";
import UsersPageClient from "./_components/UsersPageClient";
import type { AdminUserRow } from "./_components/types";

// Shape of what Mongo returns for the fields we select.
type UserDoc = {
  _id: { toString(): string };
  name: string;
  email: string;
  role: string;
  approved?: boolean;
  requestedAt?: Date;
  approvedAt?: Date;
};

export default async function UserManagementPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (!can(admin.role, 'users:view')) redirect('/admin/orders');

  await connectToDatabase();

  // Only the fields the table needs. Never the password hash.
  const rawUsers = (await User.find()
    .select('name email role approved requestedAt approvedAt')
    .sort({ requestedAt: -1 })
    .lean()) as unknown as UserDoc[];

  const serializedUsers: AdminUserRow[] = rawUsers.map((u) => ({
    _id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    approved: !!u.approved,
    requestedAt: u.requestedAt?.toISOString(),
    approvedAt: u.approvedAt?.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <UsersPageClient viewerRole={admin.role} />
      <UsersTable users={serializedUsers} viewerRole={admin.role} viewerId={admin.id} />
    </div>
  );
}