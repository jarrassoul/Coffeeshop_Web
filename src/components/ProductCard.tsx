"use client";

import { useCart } from "@/context/cart";
import { type Product, categoryLabels, formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, decrementItem, quantityOf } = useCart();
  const quantity = quantityOf(product.id);

  return (
    <article className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition-colors hover:border-amber-200">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-amber-700">
          {categoryLabels[product.category]}
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-stone-800">
          {product.name}
        </h3>
        <p className="text-sm leading-6 text-stone-600">
          {product.description}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-stone-800">
          ${formatPrice(product.price)}
        </span>
        {quantity === 0 ? (
          <button
            type="button"
            onClick={() => addItem(product.id)}
            className="flex h-9 items-center justify-center rounded-full bg-amber-700 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-800"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => decrementItem(product.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-200 text-sm text-stone-700 transition-colors hover:bg-amber-50"
            >
              -
            </button>
            <span className="w-4 text-center text-sm font-medium text-stone-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => addItem(product.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-200 text-sm text-stone-700 transition-colors hover:bg-amber-50"
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
