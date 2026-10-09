"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { products, type Product } from "@/lib/products";

const STORAGE_KEY = "coffeeshop.cart";

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartState = Record<string, number>;

type CartAction =
  | { type: "add"; id: string }
  | { type: "decrement"; id: string }
  | { type: "remove"; id: string }
  | { type: "clear" }
  | { type: "hydrate"; state: CartState };

// Keeps only entries that map to a known product with a positive integer qty,
// guarding against corrupt or stale localStorage payloads.
function sanitizeCart(value: unknown): CartState {
  if (!value || typeof value !== "object") return {};
  const known = new Set(products.map((product) => product.id));
  const result: CartState = {};
  for (const [id, quantity] of Object.entries(value as Record<string, unknown>)) {
    if (known.has(id) && typeof quantity === "number" && quantity >= 1) {
      result[id] = Math.floor(quantity);
    }
  }
  return result;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add":
      return { ...state, [action.id]: (state[action.id] ?? 0) + 1 };
    case "decrement": {
      const next = (state[action.id] ?? 0) - 1;
      const updated = { ...state };
      if (next <= 0) {
        delete updated[action.id];
      } else {
        updated[action.id] = next;
      }
      return updated;
    }
    case "remove": {
      const updated = { ...state };
      delete updated[action.id];
      return updated;
    }
    case "clear":
      return {};
    case "hydrate":
      return action.state;
    default:
      return state;
  }
}

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  quantityOf: (id: string) => number;
  addItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {});
  const isFirstPersist = useRef(true);

  // Load the persisted cart once on mount (client only).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        dispatch({ type: "hydrate", state: sanitizeCart(JSON.parse(raw)) });
      }
    } catch {
      // Ignore unreadable or corrupt storage.
    }
  }, []);

  // Persist on every change, skipping the initial mount so an empty cart
  // never overwrites stored data before hydration completes.
  useEffect(() => {
    if (isFirstPersist.current) {
      isFirstPersist.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore write failures (e.g. private mode / quota).
    }
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = Object.entries(state).flatMap(
      ([id, quantity]) => {
        const product = products.find((item) => item.id === id);
        return product ? [{ product, quantity }] : [];
      },
    );
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce(
      (sum, line) => sum + line.quantity * line.product.price,
      0,
    );

    return {
      lines,
      count,
      subtotal,
      quantityOf: (id) => state[id] ?? 0,
      addItem: (id) => dispatch({ type: "add", id }),
      decrementItem: (id) => dispatch({ type: "decrement", id }),
      removeItem: (id) => dispatch({ type: "remove", id }),
      clearCart: () => dispatch({ type: "clear" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
