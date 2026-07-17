/* eslint-disable @typescript-eslint/no-require-imports */

// One-time migration: move external menu item images to Cloudflare R2.

const crypto = require('crypto');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { uploadToR2, getR2PublicBaseUrl } = require('../lib/r2');

dotenv.config({ path: path.join(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const dryRun = /^(1|true|yes)$/i.test(process.env.DRY_RUN || '');

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set');
  process.exit(1);
}

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    description: { type: String },
    available: { type: Boolean, default: true },
    imageUrl: { type: String },
    previousImageUrl: { type: String },
    image: { type: String },
  },
  { timestamps: true, collection: 'menuitems' }
);

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);

function getFileExtension(imageUrl, contentType) {
  try {
    const url = new URL(imageUrl);
    const match = url.pathname.match(/\.([a-zA-Z0-9]+)$/);
    if (match) {
      return match[1].toLowerCase();
    }
  } catch {
    // Ignore invalid URLs and fall back to the response content type.
  }

  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/webp') return 'webp';
  if (contentType === 'image/gif') return 'gif';
  if (contentType === 'image/avif') return 'avif';

  return 'jpg';
}

function getCurrentImageUrl(item) {
  return item.imageUrl || item.image || '';
}

async function migrateMenuItemImages() {
  let connected = false;
  const stats = {
    scanned: 0,
    migrated: 0,
    skipped: 0,
    failed: 0,
  };

  try {
    console.log(`Connecting to MongoDB${dryRun ? ' (dry run)' : ''}...`);
    await mongoose.connect(MONGODB_URI);
    connected = true;

    const items = await MenuItem.find({
      $or: [
        { imageUrl: { $exists: true, $ne: '' } },
        { image: { $exists: true, $ne: '' } },
      ],
    }).sort({ category: 1, name: 1 }).lean();

    console.log(`Found ${items.length} menu items with images to inspect.`);

    for (const item of items) {
      stats.scanned += 1;
      const currentImageUrl = getCurrentImageUrl(item);

      if (!currentImageUrl) {
        stats.skipped += 1;
        console.log(`[skip] ${item.name}: no image URL found`);
        continue;
      }

      if (currentImageUrl.startsWith(getR2PublicBaseUrl())) {
        stats.skipped += 1;
        console.log(`[skip] ${item.name}: already on R2`);
        continue;
      }

      console.log(`[${stats.scanned}/${items.length}] Migrating ${item.name}`);

      if (dryRun) {
        console.log(`  would upload ${currentImageUrl}`);
        console.log('  would set imageUrl, image, and previousImageUrl');
        stats.migrated += 1;
        continue;
      }

      const response = await fetch(currentImageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download ${currentImageUrl}: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      const extension = getFileExtension(currentImageUrl, contentType);
      const key = `menu-items/${item._id}-${crypto.randomUUID()}.${extension}`;
      const uploadedUrl = await uploadToR2(key, buffer, contentType);

      await MenuItem.updateOne(
        { _id: item._id },
        {
          $set: {
            imageUrl: uploadedUrl,
            previousImageUrl: currentImageUrl,
            image: uploadedUrl,
          },
        }
      );

      stats.migrated += 1;
      console.log(`  migrated to ${uploadedUrl}`);
    }

    console.log('');
    console.log('Migration summary');
    console.log(`  scanned:  ${stats.scanned}`);
    console.log(`  migrated: ${stats.migrated}`);
    console.log(`  skipped:  ${stats.skipped}`);
    console.log(`  failed:   ${stats.failed}`);
    console.log(dryRun ? '  mode:     DRY_RUN' : '  mode:     LIVE');
  } catch (error) {
    stats.failed += 1;
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    if (connected) {
      await mongoose.disconnect();
    }
  }
}

migrateMenuItemImages();