"use client";

import { useState } from "react";
import { type Product, categoryLabels, formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  return (
    <article className="flex flex-col justify-between gap-4 rounded-2xl border border-black/[.08] bg-white p-5 transition-colors hover:border-black/[.16] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/[.24]">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {categoryLabels[product.category]}
        </span>
        <h3 className="text-lg font-semibold tracking-tight">{product.name}</h3>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">
          ${formatPrice(product.price)}
        </span>
        <button
          type="button"
          onClick={() => setAdded(true)}
          disabled={added}
          className="flex h-9 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-default disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          {added ? "Added" : "Add"}
        </button>
      </div>
    </article>
  );
}
