import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { requirePermission } from '@/lib/authGuard';
import { canManageUser } from '@/lib/permissions';
import { sanitizeText, sanitizeEmail } from '@/lib/sanitize';
import { checkPassword } from '@/lib/passwordPolicy';
import { logSecurityEvent } from '@/lib/securityLog';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requirePermission(req, 'users:edit');
  if (response) return response;

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const body = await req.json();

    await connectToDatabase();

    const target = await User.findById(id).select('name email role approved');
    if (!target) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    // Rank rule: you can't touch anyone above your own role.
    if (!canManageUser(user!.role, target.role)) {
      return NextResponse.json(
        { message: 'You cannot modify a user with a higher role than your own' },
        { status: 403 }
      );
    }

    const update: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const name = sanitizeText(body.name, 100);
      if (!name) return NextResponse.json({ message: 'Name cannot be empty' }, { status: 400 });
      update.name = name;
    }

    if (body.email !== undefined) {
      const email = sanitizeEmail(body.email);
      if (!EMAIL_RE.test(email)) {
        return NextResponse.json({ message: 'Please enter a valid email address' }, { status: 400 });
      }
      if (email !== target.email) {
        const taken = await User.findOne({ email, _id: { $ne: id } }).select('_id');
        if (taken) {
          return NextResponse.json({ message: 'That email is already in use' }, { status: 409 });
        }
        update.email = email;
      }
    }

    // A blank password means "leave it unchanged", so the edit form can keep it empty.
    if (typeof body.password === 'string' && body.password !== '') {
      const finalName = (update.name as string | undefined) ?? target.name;
      const finalEmail = (update.email as string | undefined) ?? target.email;
      const passwordError = checkPassword(body.password, finalName, finalEmail);
      if (passwordError) return NextResponse.json({ message: passwordError }, { status: 400 });
      update.password = await bcrypt.hash(body.password, 12);
    }

    if (body.approved === true && !target.approved) {
      update.approved = true;
      update.approvedAt = new Date();
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ message: 'Nothing to update' }, { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true })
      .select('-password')
      .lean();

    // Log WHICH fields changed, never their values.
    logSecurityEvent('admin_action', {
      action: 'user_update', actor: user!.email, targetId: id, fields: Object.keys(update),
    });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
      return NextResponse.json({ message: 'That email is already in use' }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requirePermission(req, 'users:delete');
  if (response) return response;

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    if (id === user!.id) {
      return NextResponse.json({ message: 'You cannot delete your own account' }, { status: 400 });
    }

    await connectToDatabase();

    const target = await User.findById(id).select('role');
    if (!target) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    if (!canManageUser(user!.role, target.role)) {
      return NextResponse.json(
        { message: 'You cannot delete a user with a higher role than your own' },
        { status: 403 }
      );
    }

    if (target.role === 'super_admin') {
      const superAdmins = await User.countDocuments({ role: 'super_admin' });
      if (superAdmins <= 1) {
        return NextResponse.json({ message: 'You cannot delete the last super admin' }, { status: 400 });
      }
    }

    await User.findByIdAndDelete(id);

    logSecurityEvent('admin_action', { action: 'user_delete', actor: user!.email, targetId: id });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
  }
}