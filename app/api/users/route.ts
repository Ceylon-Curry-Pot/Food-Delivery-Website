import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { sanitizeText, sanitizeEmail } from '@/lib/sanitize';
import { getCurrentAdmin, requirePermission } from '@/lib/authGuard';
import { can, canAssignRole, isRole, type Role } from '@/lib/permissions';
import { checkPassword } from '@/lib/passwordPolicy';
import { logSecurityEvent } from '@/lib/securityLog';

// POST serves two callers. Which one you are is decided from the SESSION, never the body:
//  • an anonymous visitor on the public sign-up form: always an unapproved staff request
//  • a signed-in admin or super admin: may set the role (up to their own) and approve at once
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = sanitizeText(body.name, 100);
    const email = sanitizeEmail(body.email);
    const { password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const passwordError = checkPassword(password, name, email);
    if (passwordError) {
      return NextResponse.json({ message: passwordError }, { status: 400 });
    }

    let role: Role = 'staff';
    let approved = false;

    const admin = await getCurrentAdmin();
    if (admin) {
      if (!can(admin.role, 'users:create')) {
        return NextResponse.json({ message: 'You do not have permission to do this' }, { status: 403 });
      }
      role = isRole(body.role) ? body.role : 'staff';
      if (!canAssignRole(admin.role, role)) {
        return NextResponse.json(
          { message: 'You cannot create a user with a higher role than your own' },
          { status: 403 }
        );
      }
      approved = body.approved === true;
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      approved,
      approvedAt: approved ? new Date() : undefined,
      requestedAt: new Date(),
    });

    if (admin) {
      logSecurityEvent('admin_action', {
        action: 'user_create', actor: admin.email, targetEmail: email, role, approved,
      });
    }

    return NextResponse.json(
      { message: 'User created successfully', user: { id: newUser._id, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { response } = await requirePermission(req, 'users:view');
  if (response) return response;

  try {
    const { searchParams } = new URL(req.url);
    const count = searchParams.get('count');
    const approved = searchParams.get('approved');

    await connectToDatabase();

    const query: { approved?: boolean } = {};
    if (approved !== null) query.approved = approved === 'true';

    if (count === 'true') {
      return NextResponse.json({ count: await User.countDocuments(query) });
    }

    const users = await User.find(query).select('-password').sort({ requestedAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}