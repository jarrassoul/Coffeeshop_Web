import type { ReactNode } from "react";
import { CartProvider } from "@/context/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/products-db";

// Storefront chrome (header, footer, cart) lives here so the admin portal —
// which shares the minimal root layout — never inherits it. Route groups
// don't affect URLs, so this still serves "/" and "/checkout".
export default async function ShopLayout({
  children,
}: {
  children: ReactNode;
}) {
  const products = await getProducts();

  return (
    <CartProvider products={products}>
      <Header />
      {children}
      <Footer />
    </CartProvider>
  );
}
