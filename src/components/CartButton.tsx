"use client";

import { useState } from "react";
import { useCart } from "@/context/cart";
import CartDrawer from "@/components/CartDrawer";

export default function CartButton() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 items-center justify-center gap-2 rounded-full border border-amber-200 px-4 text-sm font-medium text-stone-700 transition-colors hover:bg-amber-50"
      >
        Cart
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-700 px-1 text-xs font-semibold text-white">
          {count}
        </span>
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
