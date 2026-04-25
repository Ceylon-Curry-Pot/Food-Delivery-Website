import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';

// GET /api/menu — list all menu items
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    // Sort by category first, then by name
    const items = await MenuItem.find().sort({ category: 1, name: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    console.error('[GET /api/menu]', error);
    return NextResponse.json({ message: 'Failed to fetch menu items' }, { status: 500 });
  }
}

// POST /api/menu — create new menu item
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, category, description, available, image } = body;

    if (!name || typeof price !== 'number' || !category) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const item = await MenuItem.create({
      name,
      price,
      category,
      description,
      available: available ?? true,
      image
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('[POST /api/menu]', error);
    return NextResponse.json({ message: 'Failed to create menu item' }, { status: 500 });
  }
}
