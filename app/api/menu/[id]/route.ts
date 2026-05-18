import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';
import { revalidatePath } from 'next/cache';

// PATCH /api/menu/:id — update menu item fields
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const allowedFields = ['name', 'price', 'category', 'description', 'available', 'image'];
    const updateData: Record<string, unknown> = {};

    for (const key of allowedFields) {
      if (key in body) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }

    await connectToDatabase();

    const updated = await MenuItem.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ message: 'Menu item not found' }, { status: 404 });
    }

    // Revalidate customer and admin pages
    revalidatePath('/menu');
    revalidatePath('/admin/menu');
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PATCH /api/menu/:id]', error);
    return NextResponse.json({ message: 'Failed to update menu item' }, { status: 500 });
  }
}

// DELETE /api/menu/:id — delete menu item
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deletedItem = await MenuItem.findByIdAndDelete(id).lean();

    if (!deletedItem) {
      return NextResponse.json({ message: 'Menu item not found' }, { status: 404 });
    }

    // Revalidate cache
    revalidatePath('/menu');
    revalidatePath('/admin/menu');

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/menu/:id]', error);
    return NextResponse.json({ message: 'Failed to delete menu item' }, { status: 500 });
  }
}
