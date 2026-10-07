"use client";

import { useCart } from "@/context/cart";
import { formatPrice } from "@/lib/products";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { lines, subtotal, addItem, decrementItem, removeItem, clearCart } =
    useCart();

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-20 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-30 flex h-full w-full max-w-sm flex-col border-l border-black/[.08] bg-white shadow-xl transition-transform duration-200 dark:border-white/[.145] dark:bg-zinc-950 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/[.08] px-5 py-4 dark:border-white/[.145]">
          <h2 className="text-lg font-semibold tracking-tight">Your cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm font-medium text-zinc-600 transition-colors hover:bg-black/[.04] hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[.08] dark:hover:text-zinc-50"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Your cart is empty.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map(({ product, quantity }) => (
                <li key={product.id} className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {product.name}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        ${formatPrice(product.price)} each
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => decrementItem(product.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-black/[.08] text-sm transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.08]"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm font-medium">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => addItem(product.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-black/[.08] text-sm transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.08]"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold">
                      ${formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-black/[.08] px-5 py-4 dark:border-white/[.145]">
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Subtotal</span>
            <span>${formatPrice(subtotal)}</span>
          </div>
          <button
            type="button"
            disabled={lines.length === 0}
            className="flex h-11 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-[#383838] disabled:cursor-default disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            Checkout
          </button>
          <button
            type="button"
            onClick={clearCart}
            disabled={lines.length === 0}
            className="text-center text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 disabled:cursor-default disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Clear cart
          </button>
        </div>
      </aside>
    </>
  );
}
