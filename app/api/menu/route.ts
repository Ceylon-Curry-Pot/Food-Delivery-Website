import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';
import { getR2PublicBaseUrl, uploadToR2 } from '@/lib/r2';

export const runtime = 'nodejs';

type MenuItemPayload = {
  name?: string;
  price?: string | number;
  category?: string;
  description?: string;
  available?: string | boolean;
  imageUrl?: string;
};

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
    const { payload, imageFile } = await readMenuItemRequest(req);
    const { name, price, category, description, available } = payload;

    if (!name || !category) {
      return NextResponse.json({ message: 'Name and category are required' }, { status: 400 });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ message: 'Price must be a valid positive number' }, { status: 400 });
    }

    await connectToDatabase();

    const uploadedImageUrl = await resolveImageUrlFromUpload(imageFile, payload.imageUrl);
    if (payload.imageUrl?.trim() && !uploadedImageUrl) {
      return NextResponse.json({ message: 'Images must be uploaded to R2 before saving' }, { status: 400 });
    }

    const item = await MenuItem.create({
      name:        name.trim(),
      price:       parsedPrice,
      category,
      description: typeof description === 'string' ? description.trim() : '',
      available:   parseBoolean(available, true),
      imageUrl:    uploadedImageUrl ?? '',
      image:       uploadedImageUrl ?? '',
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
        (error as unknown as { errors: Record<string, { message: string }> }).errors
      )
        .map((e) => e.message)
        .join(', ');
      return NextResponse.json({ message: msg }, { status: 400 });
    }

    return NextResponse.json({ message: 'Failed to create menu item' }, { status: 500 });
  }
}

// ── Helper ──────────────────────────────────────────────────────────────────
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
        available: formData.get('available')?.toString() || 'true',
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

async function resolveImageUrlFromUpload(imageFile: File | null, imageUrl?: string) {
  if (imageFile) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const extension = getFileExtension(imageFile.name, imageFile.type);
    const key = `menu-items/new-${crypto.randomUUID()}.${extension}`;
    return uploadToR2(key, buffer, imageFile.type || 'application/octet-stream');
  }

  const trimmed = imageUrl?.trim();
  if (!trimmed) {
    return undefined;
  }

  if (!trimmed.startsWith(getR2PublicBaseUrl())) {
    return undefined;
  }

  return trimmed;
}

function getFileExtension(fileName: string, contentType: string) {
  const match = fileName.match(/\.([a-zA-Z0-9]+)$/);
  if (match) {
    return match[1].toLowerCase();
  }

  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/webp') return 'webp';
  if (contentType === 'image/gif') return 'gif';
  if (contentType === 'image/avif') return 'avif';

  return 'jpg';
}

function serializeItem(item: Record<string, unknown> & { _id?: unknown; createdAt?: unknown; updatedAt?: unknown }) {
  return {
    ...item,
    _id:       String(item._id),
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
    updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
  };
}