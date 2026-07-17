import mongoose from 'mongoose';
import MenuItem from '@/lib/models/MenuItem';

export const DELIVERY_FEE = 300;

type IncomingOrderItem = {
  menuItem?: string;
  id?: string;
  qty?: number | string;
  quantity?: number | string;
};

type DbMenuItem = {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  imageUrl?: string;
  image?: string;
};

type SerializedOrderItem = Record<string, unknown> & {
  menuItem?: unknown;
};

type OrderCustomer = {
  name: string;
  phone: string;
  email?: string;
};

type SerializableOrder = {
  orderNumber: string;
  customer: OrderCustomer;
  type: 'delivery' | 'pickup';
  total: number;
  paymentStatus: string;
  status: string;
  deliveryAddress?: string;
  note?: string;
  paymentMethod?: string;
  _id?: { toString(): string };
  items?: SerializedOrderItem[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  paidAt?: Date | string;
};

type SerializedOrder = {
  _id: string;
  orderNumber: string;
  customer: OrderCustomer;
  type: 'delivery' | 'pickup';
  deliveryAddress?: string;
  items: Array<Record<string, unknown> & { menuItem?: unknown }>;
  total: number;
  note?: string;
  paymentMethod?: string;
  paymentStatus: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  paidAt?: string;
};

export class OrderInputError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'OrderInputError';
    this.status = status;
  }
}

export async function buildOrderItems(items: IncomingOrderItem[], requireAvailable = false) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new OrderInputError('Order must contain at least one item');
  }

  const ids = items.map((item) => item.menuItem || item.id || '');
  const invalidId = ids.find((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidId !== undefined) {
    throw new OrderInputError('Every order item must reference a valid menu item');
  }

  const uniqueIds = Array.from(new Set(ids));
  const menuItems = await MenuItem.find({
    _id: { $in: uniqueIds },
    ...(requireAvailable ? { available: true } : {}),
  }).lean<DbMenuItem[]>();

  const menuById = new Map(menuItems.map((item) => [item._id.toString(), item]));
  if (menuById.size !== uniqueIds.length) {
    throw new OrderInputError('One or more menu items were not found');
  }

  return items.map((item, index) => {
    const id = ids[index];
    const menuItem = menuById.get(id);
    const qty = Number(item.qty ?? item.quantity);

    if (!menuItem) {
      throw new OrderInputError('One or more menu items were not found');
    }

    if (!Number.isInteger(qty) || qty < 1) {
      throw new OrderInputError('Order item quantities must be whole numbers greater than zero');
    }

    return {
      menuItem: menuItem._id,
      name: menuItem.name,
      image: menuItem.imageUrl || menuItem.image,
      qty,
      price: menuItem.price,
    };
  });
}

export function calculateOrderTotal(
  items: Array<{ qty: number; price: number }>,
  type: 'delivery' | 'pickup'
) {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  return subtotal + (type === 'delivery' ? DELIVERY_FEE : 0);
}

export function serializeOrder(order: SerializableOrder): SerializedOrder {
  return {
    ...order,
    _id: order._id!.toString(),
    items: order.items?.map((item) => ({
      ...item,
      menuItem: serializeMenuItemRef(item.menuItem),
    })) ?? [],
    createdAt: serializeDate(order.createdAt),
    updatedAt: serializeDate(order.updatedAt),
    paidAt: serializeDate(order.paidAt),
  };
}

function serializeMenuItemRef(menuItem: unknown) {
  if (!menuItem || typeof menuItem !== 'object') {
    return menuItem && 'toString' in Object(menuItem) ? String(menuItem) : menuItem;
  }

  const item = menuItem as Record<string, unknown> & {
    _id?: { toString(): string };
  };

  if (!('_id' in item)) {
    return String(menuItem);
  }

  return {
    ...item,
    _id: item._id?.toString(),
  };
}

function serializeDate(value: Date | string | undefined) {
  return value instanceof Date ? value.toISOString() : value;
}
