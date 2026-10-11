"use client";

import { useEffect, useState } from "react";
import { adminHeaders, formatPrice } from "@/lib/admin";
import type { AdminOrder } from "@/lib/admin";

export default function DashboardHome() {
  // Live snapshot from the orders API so the overview matches the Orders page.
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    // Orders are only visible to users with the "orders" privilege — for
    // anyone else the API answers 403 and the cards simply show zeros.
    fetch("/api/orders", {
      cache: "no-store",
      headers: { ...adminHeaders() },
    })
      .then((res) => (res.ok ? (res.json() as Promise<AdminOrder[]>) : []))
      .then((data) => setOrders(data))
      .catch(() => setOrders([]));
  }, []);

  const openOrders = orders.filter((order) => order.status !== "Completed");
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  const stats = [
    { label: "Total orders", value: String(orders.length) },
    { label: "Open orders", value: String(openOrders.length) },
    { label: "Completed", value: String(orders.length - openOrders.length) },
    { label: "Revenue", value: formatPrice(revenue) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">Overview</h1>
      <p className="mt-1 text-sm text-stone-500">
        A quick snapshot of what is happening at the cafe today.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200"
          >
            <p className="text-sm font-medium text-stone-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-amber-700">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h2 className="text-lg font-semibold text-stone-800">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">
            No orders yet — they appear here as customers check out.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-stone-100">
            {orders.slice(0, 5).map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-stone-800">
                    {order.customerName}
                  </p>
                  <p className="text-stone-500">
                    {order.items
                      .map((item) => `${item.quantity} x ${item.name}`)
                      .join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-stone-800">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-xs text-stone-500">{order.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
