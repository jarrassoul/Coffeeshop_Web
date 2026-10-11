"use server";

import { prisma } from "@/lib/prisma";

export type OrderLineInput = {
  productId: string;
  quantity: number;
};

export type PlaceOrderInput = {
  customerName: string;
  pickupTime?: string | null;
  lines: OrderLineInput[];
};

export type PlaceOrderResult =
  | { ok: true; orderId: string; total: number }
  | { ok: false; error: string };

const MAX_NAME_LENGTH = 80;

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  const customerName = input.customerName.trim();
  if (customerName.length === 0) {
    return { ok: false, error: "Please enter a name for the order." };
  }
  if (customerName.length > MAX_NAME_LENGTH) {
    return { ok: false, error: "That name is too long." };
  }
  const pickupTime = input.pickupTime?.trim() || null;

  const cleaned = input.lines
    .map((line) => ({
      productId: line.productId,
      quantity: Math.floor(line.quantity),
    }))
    .filter((line) => line.quantity >= 1);

  if (cleaned.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  // Prices are always read from the database, never trusted from the client.
  const products = await prisma.product.findMany({
    where: { id: { in: cleaned.map((line) => line.productId) } },
  });
  const priceById = new Map(products.map((product) => [product.id, product.price]));

  const items = cleaned.flatMap((line) => {
    const price = priceById.get(line.productId);
    if (price === undefined) return [];
    return [{ productId: line.productId, quantity: line.quantity, price }];
  });

  if (items.length === 0) {
    return { ok: false, error: "No valid products in your cart." };
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      customerName,
      pickupTime,
      total,
      items: { create: items },
    },
  });

  return { ok: true, orderId: order.id, total };
}
