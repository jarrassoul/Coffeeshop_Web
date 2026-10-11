"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart";
import { formatPrice } from "@/lib/products";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { lines, subtotal, addItem, decrementItem, removeItem, clearCart } =
    useCart();

  function handleCheckout() {
    onClose();
    router.push("/checkout");
  }

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-20 bg-stone-900/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-30 flex h-full w-full max-w-sm flex-col border-l border-amber-100 bg-white shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-amber-100 px-5 py-4">
          <h2 className="text-lg font-semibold tracking-tight text-stone-800">
            Your cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-amber-50 hover:text-stone-900"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="text-sm text-stone-600">Your cart is empty.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map(({ product, quantity }) => (
                <li key={product.id} className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-stone-800">
                        {product.name}
                      </span>
                      <span className="text-xs text-stone-500">
                        ${formatPrice(product.price)} each
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-xs font-medium text-stone-500 transition-colors hover:text-stone-900"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => decrementItem(product.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-200 text-sm text-stone-700 transition-colors hover:bg-amber-50"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm font-medium text-stone-800">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => addItem(product.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-200 text-sm text-stone-700 transition-colors hover:bg-amber-50"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-stone-800">
                      ${formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-amber-100 px-5 py-4">
          <div className="flex items-center justify-between text-base font-semibold text-stone-800">
            <span>Subtotal</span>
            <span>${formatPrice(subtotal)}</span>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={lines.length === 0}
            className="flex h-11 items-center justify-center rounded-full bg-amber-700 text-white transition-colors hover:bg-amber-800 disabled:cursor-default disabled:opacity-50"
          >
            Checkout
          </button>
          <button
            type="button"
            onClick={clearCart}
            disabled={lines.length === 0}
            className="text-center text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 disabled:cursor-default disabled:opacity-50"
          >
            Clear cart
          </button>
        </div>
      </aside>
    </>
  );
}
