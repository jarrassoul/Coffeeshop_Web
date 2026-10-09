import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { type Product, type ProductCategory } from "@/lib/products";

// Wrapped in React's cache() so the layout and page share a single query
// within one server render pass.
export const getProducts = cache(async (): Promise<Product[]> => {
  const rows = await prisma.product.findMany({
    orderBy: { position: "asc" },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category as ProductCategory,
  }));
});
