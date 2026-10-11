"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart";
import { formatPrice } from "@/lib/products";
import { placeOrder } from "./actions";

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();
  const [order, setOrder] = useState<{ id: string; total: number } | null>(
    null,
  );
  const [customerName, setCustomerName] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlaceOrder() {
    if (customerName.trim().length === 0) {
      setError("Please enter a name for the order.");
      return;
    }
    setPending(true);
    setError(null);
    const result = await placeOrder({
      customerName,
      pickupTime,
      lines: lines.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
    });
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
    <div className="flex flex-1 flex-col bg-amber-50/40 font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-stone-800">
          Checkout
        </h1>

        {order ? (
          <section className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-stone-800">
              Thanks for your order!
            </h2>
            <p className="text-sm leading-6 text-stone-600">
              We saved your order and it will be ready shortly. This is a demo
              checkout, so no payment was taken.
            </p>
            <dl className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Order</dt>
                <dd className="font-mono text-stone-800">{order.id}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Total</dt>
                <dd className="font-semibold text-stone-800">
                  ${formatPrice(order.total)}
                </dd>
              </div>
            </dl>
            <Link
              href="/#menu"
              className="mt-2 flex h-11 w-fit items-center justify-center rounded-full bg-amber-700 px-5 text-sm font-medium text-white transition-colors hover:bg-amber-800"
            >
              Back to menu
            </Link>
          </section>
        ) : lines.length === 0 ? (
          <section className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-white p-8 shadow-sm">
            <p className="text-sm text-stone-600">Your cart is empty.</p>
            <Link
              href="/#menu"
              className="flex h-11 w-fit items-center justify-center rounded-full bg-amber-700 px-5 text-sm font-medium text-white transition-colors hover:bg-amber-800"
            >
              Browse the menu
            </Link>
          </section>
        ) : (
          <section className="flex flex-col gap-6 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
            <ul className="flex flex-col gap-4">
              {lines.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-stone-800">
                      {product.name}
                    </span>
                    <span className="text-xs text-stone-500">
                      {quantity} x ${formatPrice(product.price)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-stone-800">
                    ${formatPrice(product.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 border-t border-amber-100 pt-4">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-stone-700">
                  Name for the order
                </span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="e.g. Alex"
                  maxLength={80}
                  className="h-11 rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-stone-700">
                  Pickup time <span className="text-stone-400">(optional)</span>
                </span>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(event) => setPickupTime(event.target.value)}
                  className="h-11 w-fit rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </label>
            </div>

            <div className="flex items-center justify-between border-t border-amber-100 pt-4 text-base font-semibold text-stone-800">
              <span>Total</span>
              <span>${formatPrice(subtotal)}</span>
            </div>

            {error ? (
              <p className="text-sm font-medium text-red-600">{error}</p>
            ) : null}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={pending}
              className="flex h-11 items-center justify-center rounded-full bg-amber-700 text-white transition-colors hover:bg-amber-800 disabled:cursor-default disabled:opacity-60"
            >
              {pending ? "Placing order..." : "Place order"}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
