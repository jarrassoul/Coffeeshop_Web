import Link from "next/link";
import { getOrders } from "@/lib/orders-db";
import { formatPrice } from "@/lib/products";

export const metadata = {
  title: "Orders | Coffeeshop",
};

// Always read the latest orders from the database on each request.
export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Orders
          </h1>
          <Link
            href="/#menu"
            className="flex h-11 w-fit items-center justify-center rounded-full border border-black/[.08] px-5 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-white/[.08]"
          >
            Back to menu
          </Link>
        </div>

        {orders.length === 0 ? (
          <section className="rounded-2xl border border-black/[.08] bg-white p-8 text-sm text-zinc-600 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-400">
            No orders yet. Place one from the menu and it will show up here.
          </section>
        ) : (
          <ul className="flex flex-col gap-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-col gap-4 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
                    {order.id}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {dateFormatter.format(order.createdAt)}
                  </span>
                </div>

                <ul className="flex flex-col gap-2">
                  {order.items.map((item, index) => (
                    <li
                      key={`${order.id}-${index}`}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {item.quantity} x {item.name}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400">
                        ${formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t border-black/[.08] pt-4 text-base font-semibold dark:border-white/[.145]">
                  <span>Total</span>
                  <span>${formatPrice(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
