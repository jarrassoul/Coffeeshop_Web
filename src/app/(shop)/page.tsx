import MenuGrid from "@/components/MenuGrid";
import { getProducts } from "@/lib/products-db";

export default async function Home() {
  const products = await getProducts();

  return (
    <div id="top" className="flex flex-1 flex-col bg-amber-50/40 font-sans">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16">
        <section className="flex flex-col gap-4">
          <span className="text-sm font-medium uppercase tracking-wide text-amber-700">
            Hand-crafted, fresh daily
          </span>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-stone-800 sm:text-5xl">
            Coffee, dates &amp; maple warmth
          </h1>
          <p className="max-w-xl text-lg leading-8 text-stone-600">
            Hand-crafted drinks, fresh pastries, and cozy vibes. Order online
            for pickup, or browse the menu below.
          </p>
        </section>

        <section id="menu" className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-stone-800">
            Our menu
          </h2>
          <MenuGrid products={products} />
        </section>

        <section id="about" className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-stone-800">
            About us
          </h2>
          <p className="max-w-2xl text-base leading-7 text-stone-600">
            Date &amp; Maple Cafe brings the warmth of home-baked date treats
            together with the sweetness of pure maple syrup. Every drink is
            hand-crafted and every pastry is baked fresh each morning.
          </p>
        </section>
      </main>
    </div>
  );
}
