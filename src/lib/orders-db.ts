import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { AdminOrder, OrderStatus } from "@/lib/admin";

// Wrapped in React's cache() so multiple reads within one server render pass
// share a single query. Money is stored as integer cents and converted to
// dollars here so the admin API/UI can render it directly.
export const getOrders = cache(async (): Promise<AdminOrder[]> => {
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return rows.map((order) => ({
    id: order.id,
    customerName: order.customerName,
    pickupTime: order.pickupTime,
    status: order.status as OrderStatus,
    total: order.totalCents / 100,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitAmountCents / 100,
    })),
  }));
});
