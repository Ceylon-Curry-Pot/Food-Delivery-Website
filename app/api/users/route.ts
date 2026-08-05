import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, approved } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

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
      role: role || 'staff',
      approved: approved || false,
      requestedAt: new Date()
    });

    return NextResponse.json({ message: "User created successfully", user: { id: newUser._id, email: newUser.email } }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}

export async function GET(req: Request) {
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

    const users = await User.find(query).sort({ requestedAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }
}
