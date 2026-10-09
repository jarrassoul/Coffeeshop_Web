import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type OrderItemView = {
  name: string;
  quantity: number;
  price: number;
};

export type OrderView = {
  id: string;
  createdAt: Date;
  total: number;
  items: OrderItemView[];
};

// Wrapped in React's cache() so multiple reads within one server render pass
// share a single query.
export const getOrders = cache(async (): Promise<OrderView[]> => {
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return rows.map((order) => ({
    id: order.id,
    createdAt: order.createdAt,
    total: order.total,
    items: order.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
    })),
  }));
});
