import { NextResponse } from 'next/server';
import { getMenuCategories, saveMenuCategories } from '@/lib/menuCategories';
import { requireAdmin } from '@/lib/authGuard';
import { logSecurityEvent } from '@/lib/securityLog';

// GET /api/menu/categories — list the persisted menu categories
export async function GET() {
  try {
    const categories = await getMenuCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('[GET /api/menu/categories]', error);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/menu/categories — replace the stored category list
export async function POST(req: Request) {
  const { user, response } = await requireAdmin(req);
  if (response) return response;

  try {
    const body = await req.json();
    const categories = body?.categories;
    const savedCategories = await saveMenuCategories(categories);

    logSecurityEvent('admin_action', { action: 'menu_categories_update', actor: user!.email });
    return NextResponse.json({ categories: savedCategories });
  } catch (error) {
    console.error('[POST /api/menu/categories]', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to save categories',
      },
      { status: 400 }
    );
  }
}