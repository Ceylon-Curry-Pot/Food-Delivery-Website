export const dynamic = "force-dynamic";

import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import UsersTable from "./_components/UsersTable";
import UsersPageClient from "./_components/UsersPageClient"; // Added client wrapper for create button

export default async function UserManagementPage() {
  await connectToDatabase();
  
  // Fetch all users
  const rawUsers = await User.find().sort({ createdAt: -1 }).lean();
  
  const serializedUsers = rawUsers.map((u: any) => ({
    ...u,
    _id: u._id.toString(),
    createdAt: u.createdAt?.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <UsersPageClient />

      <UsersTable users={serializedUsers} />
    </div>
  );
}
