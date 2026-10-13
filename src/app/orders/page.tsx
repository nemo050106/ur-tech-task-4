import React from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/product";

export const metadata = {
  title: "Orders | ShopDesk",
  description: "View and manage incoming customer orders.",
};

const sampleOrders = [
  {
    id: "ORD-9421",
    customer: "Rahim Ahmed",
    items: "Wireless Noise-Canceling Headphones, Stainless Steel Water Bottle",
    total: 224.98,
    date: "2026-10-12",
    status: "In Stock", // maps to success
    payment: "Paid",
  },
  {
    id: "ORD-9420",
    customer: "Sadia Sultana",
    items: "Ergonomic Office Chair",
    total: 249.50,
    date: "2026-10-11",
    status: "In Stock",
    payment: "Paid",
  },
  {
    id: "ORD-9419",
    customer: "Tanvir Hossain",
    items: "Smart Fitness Tracker (Awaiting Restock)",
    total: 69.99,
    date: "2026-10-10",
    status: "Out of Stock", // maps to danger
    payment: "Pending",
  },
  {
    id: "ORD-9418",
    customer: "Anika Tabassum",
    items: "Organic Cotton T-Shirt, Cast Iron Skillet 10-inch",
    total: 54.94,
    date: "2026-10-09",
    status: "Low Stock", // maps to warning
    payment: "Paid",
  },
];

export default function OrdersPage() {
  return (
    <AppShell title="Orders">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Customer Orders
            </h2>
            <p className="text-xs text-slate-500 sm:text-sm">
              Review and process recent retail store orders and fulfillment statuses.
            </p>
          </div>
          <Button variant="primary" size="sm">
            Export Order CSV
          </Button>
        </div>

        <Card className="overflow-hidden p-0 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Items</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Stock Status</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {sampleOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-indigo-600">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
