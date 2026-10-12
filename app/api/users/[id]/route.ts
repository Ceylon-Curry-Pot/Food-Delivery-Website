import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import { requireAdminRole } from "@/lib/authGuard";
import { logSecurityEvent } from "@/lib/securityLog";

// Approving or deleting an account is a sensitive privilege — restricted to
// the 'admin' role, not just any approved staff member (self- or
// peer-approval by staff would otherwise be possible).
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdminRole(req);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await req.json();
    const { approved } = body;

    const updateData: { approved?: boolean; approvedAt?: Date } = {};
    if (approved === true) {
      updateData.approved = true;
      updateData.approvedAt = new Date();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
    }

    await connectToDatabase();
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    logSecurityEvent('admin_action', { action: 'user_approve', actor: user!.email, targetId: id });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdminRole(req);
  if (response) return response;

  try {
    const { id } = await params;
    await connectToDatabase();
    const deletedUser = await User.findByIdAndDelete(id).lean();

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    logSecurityEvent('admin_action', { action: 'user_delete', actor: user!.email, targetId: id });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}
