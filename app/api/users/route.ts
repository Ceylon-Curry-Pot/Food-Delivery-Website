import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { sanitizeText, sanitizeEmail } from "@/lib/sanitize";
import { requireAdmin, getAdminSession } from "@/lib/authGuard";
import { logSecurityEvent } from "@/lib/securityLog";

// POST is dual-purpose: the public staff sign-up form (unauthenticated —
// always lands as unapproved staff, pending admin review) and the admin
// "create user" modal (authenticated as admin, may set role/approved
// directly). Which one a given request gets is decided server-side from the
// session — never from the request body — so an anonymous caller can no
// longer hand itself `role: "admin", approved: true`.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name  = sanitizeText(body.name, 100);
    const email = sanitizeEmail(body.email);
    const { password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const adminUser = await getAdminSession();

    const role = adminUser?.role === 'admin' && (body.role === 'admin' || body.role === 'staff')
      ? body.role
      : 'staff';
    const approved = adminUser?.role === 'admin' ? Boolean(body.approved) : false;

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      approved,
      requestedAt: new Date()
    });

    if (adminUser) {
      logSecurityEvent('admin_action', { action: 'user_create', actor: adminUser.email, targetEmail: email, role, approved });
    }

    return NextResponse.json({ message: "User created successfully", user: { id: newUser._id, email: newUser.email } }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  try {
    const { searchParams } = new URL(req.url);
    const count = searchParams.get("count");
    const approved = searchParams.get("approved");

    await connectToDatabase();

    const query: any = {};
    if (approved !== null) {
      query.approved = approved === "true";
    }

    if (count === "true") {
      const total = await User.countDocuments(query);
      return NextResponse.json({ count: total });
    }

    const users = await User.find(query).select('-password').sort({ requestedAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }
}
