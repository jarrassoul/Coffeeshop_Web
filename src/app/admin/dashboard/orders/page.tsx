"use client";

import { useCallback, useEffect, useState } from "react";
import { adminHeaders, formatPrice, orderStatusFlow } from "@/lib/admin";
import type { AdminOrder, OrderStatus } from "@/lib/admin";

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Preparing: "bg-blue-100 text-blue-800",
  Ready: "bg-green-100 text-green-800",
  Completed: "bg-stone-200 text-stone-600",
};

export default function OrdersPage() {
  // Live orders from the database — created by the storefront at checkout,
  // with the customer's name and pickup time so the shop knows who to hand
  // each order to.
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", {
        cache: "no-store",
        headers: { ...adminHeaders() },
      });
      if (res.ok) setOrders((await res.json()) as AdminOrder[]);
    } catch {
      // Keep the current list on transient failures.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function advanceStatus(order: AdminOrder) {
    const nextIndex = orderStatusFlow.indexOf(order.status) + 1;
    if (nextIndex >= orderStatusFlow.length) return;
    const status = orderStatusFlow[nextIndex];
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...adminHeaders() },
      body: JSON.stringify({ id: order.id, status }),
    });
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">Orders</h1>
      <p className="mt-1 text-sm text-stone-500">
        Every order shows the customer&apos;s name and pickup time, so each
        order goes to the right person.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
        {loaded && orders.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-stone-500">
            No orders yet — they appear here the moment a customer checks out
            on the storefront.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => {
                  const nextIndex = orderStatusFlow.indexOf(order.status) + 1;
                  const nextStatus =
                    nextIndex < orderStatusFlow.length
                      ? orderStatusFlow[nextIndex]
                      : null;
                  return (
                    <tr
                      key={order.id}
                      className="align-top hover:bg-stone-50/60"
                    >
                      <td className="px-5 py-3.5 font-medium text-stone-800">
                        <span className="block max-w-[12rem] truncate font-mono text-xs">
                          {order.id}
                        </span>
                        <span className="block text-xs font-normal text-stone-400">
                          {new Date(order.createdAt).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-stone-600">
                        <span className="font-semibold text-stone-800">
                          {order.customerName}
                        </span>
                        <span className="block text-xs">
                          {order.pickupTime
                            ? `Pickup at ${order.pickupTime}`
                            : "No pickup time"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-stone-600">
                        {order.items.map((item, index) => (
                          <span key={index} className="block">
                            {item.quantity} x {item.name}
                          </span>
                        ))}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-stone-800">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {nextStatus ? (
                          <button
                            type="button"
                            onClick={() => void advanceStatus(order)}
                            className="rounded-lg bg-stone-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-stone-700"
                          >
                            Mark {nextStatus}
                          </button>
                        ) : (
                          <span className="text-xs text-stone-400">Done</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
