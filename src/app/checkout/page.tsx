"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart";
import { formatPrice } from "@/lib/products";
import { placeOrder } from "./actions";

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();
  const [order, setOrder] = useState<{ id: string; total: number } | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlaceOrder() {
    setPending(true);
    setError(null);
    const result = await placeOrder(
      lines.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
    );
    if (!result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }
    clearCart();
    setOrder({ id: result.orderId, total: result.total });
    setPending(false);
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Checkout
        </h1>

        {order ? (
          <section className="flex flex-col gap-4 rounded-2xl border border-black/[.08] bg-white p-8 dark:border-white/[.145] dark:bg-zinc-950">
            <h2 className="text-xl font-semibold tracking-tight">
              Thanks for your order!
            </h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              We saved your order and it will be ready shortly. This is a demo
              checkout, so no payment was taken.
            </p>
            <dl className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">Order</dt>
                <dd className="font-mono">{order.id}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">Total</dt>
                <dd className="font-semibold">
                  ${formatPrice(order.total)}
                </dd>
              </div>
            </dl>
            <Link
              href="/#menu"
              className="mt-2 flex h-11 w-fit items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Back to menu
            </Link>
          </section>
        ) : lines.length === 0 ? (
          <section className="flex flex-col gap-4 rounded-2xl border border-black/[.08] bg-white p-8 dark:border-white/[.145] dark:bg-zinc-950">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Your cart is empty.
            </p>
            <Link
              href="/#menu"
              className="flex h-11 w-fit items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Browse the menu
            </Link>
          </section>
        ) : (
          <section className="flex flex-col gap-6 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
            <ul className="flex flex-col gap-4">
              {lines.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {product.name}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {quantity} x ${formatPrice(product.price)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    ${formatPrice(product.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-black/[.08] pt-4 text-base font-semibold dark:border-white/[.145]">
              <span>Total</span>
              <span>${formatPrice(subtotal)}</span>
            </div>

            {error ? (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={pending}
              className="flex h-11 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-[#383838] disabled:cursor-default disabled:opacity-60 dark:hover:bg-[#ccc]"
            >
              {pending ? "Placing order..." : "Place order"}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
