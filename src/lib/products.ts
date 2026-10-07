export type ProductCategory = "espresso" | "brew" | "cold" | "pastry";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
};

export const categoryLabels: Record<ProductCategory, string> = {
  espresso: "Espresso",
  brew: "Brew",
  cold: "Cold",
  pastry: "Pastry",
};

export const products: Product[] = [
  {
    id: "espresso",
    name: "Espresso",
    description: "A rich double shot pulled from our house blend.",
    price: 3.0,
    category: "espresso",
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Espresso with steamed milk and a velvety foam cap.",
    price: 4.25,
    category: "espresso",
  },
  {
    id: "flat-white",
    name: "Flat White",
    description: "Silky micro-foam over a ristretto base.",
    price: 4.5,
    category: "espresso",
  },
  {
    id: "pour-over",
    name: "Pour Over",
    description: "Single-origin beans, brewed to order by hand.",
    price: 5.0,
    category: "brew",
  },
  {
    id: "filter-coffee",
    name: "Filter Coffee",
    description: "Clean and balanced, refilled free of charge.",
    price: 3.5,
    category: "brew",
  },
  {
    id: "iced-latte",
    name: "Iced Latte",
    description: "Chilled espresso and milk over ice.",
    price: 4.75,
    category: "cold",
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    description: "Steeped for 18 hours for a smooth, low-acid cup.",
    price: 4.5,
    category: "cold",
  },
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    description: "Flaky, golden, and baked fresh every morning.",
    price: 3.25,
    category: "pastry",
  },
];

export function formatPrice(value: number): string {
  return value.toFixed(2);
}
