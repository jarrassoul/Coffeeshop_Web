import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrders } from "@/lib/orders-db";
import { authenticate, canAccess } from "@/lib/session";
import { orderStatusFlow } from "@/lib/admin";
import type { OrderStatus } from "@/lib/admin";

export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };

// Admin-only: list every order (money already converted to dollars).
export async function GET(request: Request) {
  const user = await authenticate(request);
  if (!canAccess(user, "orders")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const orders = await getOrders();
  return NextResponse.json(orders, { headers: noStore });
}

// Admin-only: advance an order's fulfilment status.
export async function PUT(request: Request) {
  const user = await authenticate(request);
  if (!canAccess(user, "orders")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    id?: string;
    status?: string;
  };
  const id = body.id ?? "";
  const status = body.status as OrderStatus | undefined;
  if (!id || !status || !orderStatusFlow.includes(status)) {
    return NextResponse.json(
      { error: "A valid order id and status are required." },
      { status: 400 },
    );
  }

  const order = await prisma.order
    .update({ where: { id }, data: { status } })
    .catch(() => null);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id, status }, { headers: noStore });
}
