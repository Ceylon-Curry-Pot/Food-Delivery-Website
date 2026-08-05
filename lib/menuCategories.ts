import connectToDatabase from '@/lib/mongodb';
import MenuCategorySettings from '@/lib/models/MenuCategorySettings';
import { menuCategories } from '@/lib/menu';

export const DEFAULT_MENU_CATEGORIES = menuCategories.filter((category) => category !== 'All');

function normalizeCategories(categories: unknown) {
  if (!Array.isArray(categories)) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const category of categories) {
    const value = typeof category === 'string' ? category.trim() : '';
    if (!value || seen.has(value)) {
      continue;
    }

    seen.add(value);
    result.push(value);
  }

  return result;
}

export async function getMenuCategories() {
  await connectToDatabase();

  const settings = await MenuCategorySettings.findOneAndUpdate(
    { key: 'menu' },
    { $setOnInsert: { key: 'menu', categories: DEFAULT_MENU_CATEGORIES } },
    { new: true, upsert: true }
  ).lean();

  return normalizeCategories(settings?.categories ?? DEFAULT_MENU_CATEGORIES);
}

export async function saveMenuCategories(categories: unknown) {
  const normalizedCategories = normalizeCategories(categories);

  if (normalizedCategories.length === 0) {
    throw new Error('At least one category is required');
  }

  await connectToDatabase();

  await MenuCategorySettings.findOneAndUpdate(
    { key: 'menu' },
    { $set: { key: 'menu', categories: normalizedCategories } },
    { new: true, upsert: true, runValidators: true }
  );

  return normalizedCategories;
}