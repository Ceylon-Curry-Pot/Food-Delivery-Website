/* eslint-disable @typescript-eslint/no-require-imports */

// scripts/seedMenuItems.js
// Run with: node scripts/seedMenuItems.js
// This script seeds menu items into MongoDB

const mongoose = require('mongoose');
const path = require('path');

// Load .env from project root
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URL;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URL is not defined in your .env file');
  process.exit(1);
}

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { 
      type: String, 
      enum: ['Rice & Curry', 'Kottu', 'Hoppers', 'Fried Rice', 'Biryani', 'Desserts', 'Beverages'],
      required: true
    },
    description: { type: String },
    available: { type: Boolean, default: true },
    imageUrl: { type: String },
    previousImageUrl: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

// Avoid model re-registration error
const MenuItem = mongoose.models?.MenuItem || mongoose.model('MenuItem', MenuItemSchema);

// Menu items to seed
const menuItems = [
  {
    name: 'Red Pork Yellow Rice',
    category: 'Rice & Curry',
    price: 1850,
    description: 'Red pork boneless curry, 4 vegetable choices, Steamed yellow rice',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Black Pork White Rice',
    category: 'Rice & Curry',
    price: 1750,
    description: 'Black pork boneless curry, 4 vegetable choices, Steamed white rice',
    imageUrl: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=600&h=400&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=600&h=400&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Chicken Biryani',
    category: 'Biryani',
    price: 1650,
    description: 'Fragrant basmati rice, Tender chicken pieces, Raita & pickle',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Veggie Kottu Roti',
    category: 'Kottu',
    price: 1250,
    description: 'Mixed vegetables, Chopped roti & egg, Spiced gravy',
    imageUrl: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Chicken Kottu Roti',
    category: 'Kottu',
    price: 1550,
    description: 'Shredded chicken, Chopped roti, egg & veg, Signature spice mix',
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Beef Kottu Roti',
    category: 'Kottu',
    price: 1650,
    description: 'Slow-cooked beef, Roti, eggs & vegetables, Rich gravy base',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Egg Hoppers',
    category: 'Hoppers',
    price: 350,
    description: 'Crispy bowl-shaped hopper, Farm-fresh egg centre, Coconut sambol',
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Fish Curry Rice',
    category: 'Rice & Curry',
    price: 1450,
    description: 'Spiced ambul thiyal fish, Coconut rice, Dhal & 3 vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Lamprais',
    category: 'Rice & Curry',
    price: 2200,
    description: 'Dutch-Burgher classic, Meatball, cutlet & frikkadels, Baked in banana leaf',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Pol Sambol Rice',
    category: 'Rice & Curry',
    price: 950,
    description: 'Fresh coconut sambol, Dhal curry & rice, Seasonal greens',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80',
    available: true,
  },
];

async function seedMenuItems() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Check for existing items
    const existingCount = await MenuItem.countDocuments();
    if (existingCount > 0) {
      console.log(`\n${existingCount} menu items already exist in the database`);
      console.log('Skipping seed. To reset, manually delete items from MongoDB first.');
      process.exit(0);
    }

    // Insert menu items
    console.log('\nSeeding menu items...');
    const result = await MenuItem.insertMany(menuItems);
    console.log(`✅ Successfully added ${result.length} menu items!`);

    console.log('\nMenu items added:');
    result.forEach((item) => {
      console.log(`  - ${item.name} (${item.category}) - Rs. ${item.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding menu items:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedMenuItems();
