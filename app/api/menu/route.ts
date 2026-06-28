import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';

// GET /api/menu — list all menu items
export async function GET() {
  try {
    await connectToDatabase();
    const items = await MenuItem.find().sort({ category: 1, name: 1 }).lean();
    return NextResponse.json(items.map(serializeItem));
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

    if (!name || !category) {
      return NextResponse.json({ message: 'Name and category are required' }, { status: 400 });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ message: 'Price must be a valid positive number' }, { status: 400 });
    }

    await connectToDatabase();

    const item = await MenuItem.create({
      name:        name.trim(),
      price:       parsedPrice,
      category,
      description: typeof description === 'string' ? description.trim() : '',
      available:   available ?? true,
      image:       image?.trim() || '',
    });

    // Fetch as lean to get a plain serializable object (same shape as GET)
    const lean = await MenuItem.findById(item._id).lean();
    return NextResponse.json(serializeItem(lean!), { status: 201 });
  } catch (error: unknown) {
    console.error('[POST /api/menu]', error);

    // Surface Mongoose validation errors so the admin sees the real problem
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      (error as { name: string }).name === 'ValidationError'
    ) {
      const msg = Object.values(
        (error as { errors: Record<string, { message: string }> }).errors
      )
        .map((e) => e.message)
        .join(', ');
      return NextResponse.json({ message: msg }, { status: 400 });
    }

    return NextResponse.json({ message: 'Failed to create menu item' }, { status: 500 });
  }
}

// ── Helper ──────────────────────────────────────────────────────────────────
function serializeItem(item: Record<string, unknown> & { _id?: unknown; createdAt?: unknown; updatedAt?: unknown }) {
  return {
    ...item,
    _id:       String(item._id),
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
    updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
  };
}