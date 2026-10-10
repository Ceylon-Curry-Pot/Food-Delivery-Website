import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';
import { revalidatePath } from 'next/cache';
import { getR2PublicBaseUrl, uploadToR2 } from '@/lib/r2';
import { validateImageUpload, buildImageKey, ImageUploadError } from '@/lib/imageUpload';
import { requireAdmin } from '@/lib/authGuard';
import { logSecurityEvent } from '@/lib/securityLog';

export const runtime = 'nodejs';

type MenuItemPayload = {
  name?: string;
  price?: string | number;
  category?: string;
  description?: string;
  available?: string | boolean;
  imageUrl?: string;
};

// PATCH /api/menu/:id — update menu item fields
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin(req);
  if (response) return response;

  try {
    const { id } = await params;
    const { payload, imageFile } = await readMenuItemRequest(req);

    if (Object.keys(payload).length === 0 && !imageFile) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }

    await connectToDatabase();

    const existingItem = await MenuItem.findById(id).lean<{
      imageUrl?: string;
      image?: string;
    }>();

    if (!existingItem) {
      return NextResponse.json({ message: 'Menu item not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (typeof payload.name === 'string') updateData.name = payload.name.trim();
    if (payload.price !== undefined) {
      const parsedPrice = Number(payload.price);
      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        return NextResponse.json({ message: 'Price must be a valid positive number' }, { status: 400 });
      }
      updateData.price = parsedPrice;
    }
    if (typeof payload.category === 'string') updateData.category = payload.category;
    if (typeof payload.description === 'string') updateData.description = payload.description.trim();
    if (payload.available !== undefined) updateData.available = parseBoolean(payload.available, true);

    if (imageFile) {
      const previousImageUrl = existingItem.imageUrl || existingItem.image || '';
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      let contentType: string;
      let extension: string;
      try {
        ({ contentType, extension } = validateImageUpload(imageFile, buffer));
      } catch (err) {
        if (err instanceof ImageUploadError) {
          return NextResponse.json({ message: err.message }, { status: 400 });
        }
        throw err;
      }

      const key = buildImageKey('menu-items', extension);
      const uploadedUrl = await uploadToR2(key, buffer, contentType);

      updateData.imageUrl = uploadedUrl;
      updateData.image = uploadedUrl;
      if (previousImageUrl) {
        updateData.previousImageUrl = previousImageUrl;
      }
    } else if (typeof payload.imageUrl === 'string' && payload.imageUrl.trim()) {
      const trimmed = payload.imageUrl.trim();
      if (!trimmed.startsWith(getR2PublicBaseUrl())) {
        return NextResponse.json({ message: 'Images must be uploaded to R2 before saving' }, { status: 400 });
      }
      updateData.imageUrl = trimmed;
      updateData.image = trimmed;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }

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

    logSecurityEvent('admin_action', { action: 'menu_item_update', actor: user!.email, itemId: id });
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
  const { user, response } = await requireAdmin(req);
  if (response) return response;

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

    logSecurityEvent('admin_action', { action: 'menu_item_delete', actor: user!.email, itemId: id });
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/menu/:id]', error);
    return NextResponse.json({ message: 'Failed to delete menu item' }, { status: 500 });
  }
}

async function readMenuItemRequest(req: Request): Promise<{ payload: MenuItemPayload; imageFile: File | null }> {
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const file = formData.get('imageFile');

    return {
      payload: {
        name: formData.get('name')?.toString(),
        price: formData.get('price')?.toString(),
        category: formData.get('category')?.toString(),
        description: formData.get('description')?.toString() || '',
        available: formData.get('available')?.toString(),
        imageUrl: formData.get('imageUrl')?.toString() || '',
      },
      imageFile: file instanceof File && file.size > 0 ? file : null,
    };
  }

  const body = (await req.json()) as MenuItemPayload;
  return {
    payload: body,
    imageFile: null,
  };
}

function parseBoolean(value: string | boolean | undefined, fallback: boolean) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return fallback;

  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

