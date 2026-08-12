"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  ChevronDown,
  ChevronUp,
  Receipt,
  Search,
  Download,
  Calendar,
  User,
  ShoppingBag,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

type BillItem = {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  discountPercentage: number;
};

type Bill = {
  id: number;
  billNumber: string;
  cashierName: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  receivedAmount: number;
  balance: number;
  createdAt: string;
  items: BillItem[];
};

export default function BillHistoryPanel() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/bills`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bills");
        return res.json();
      })
      .then((data) => {
        setBills(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load bill history. Is the backend running?");
        setLoading(false);
        console.error(err);
      });
  }, []);

  const filtered = bills.filter(
    (bill) =>
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.cashierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggle = (id: number) => setExpandedId(expandedId === id ? null : id);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso.replace(" ", "T")).toLocaleString("en-LK", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f2ea] p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Cashier billing
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-stone-900">
              Bill history
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              View and re-download all previously saved bills.
            </p>
          </div>
          <Link
            href="/cashierdashboard"
            className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
          <Search size={16} className="shrink-0 text-stone-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
            placeholder="Search by bill number or cashier name…"
          />
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-stone-200 bg-white py-16 text-sm text-stone-500 shadow-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            Loading bill history…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-sm text-stone-500">
            <Receipt size={36} className="text-stone-300" />
            {searchQuery ? "No bills match your search." : "No bills saved yet."}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {filtered.map((bill) => {
              const isOpen = expandedId === bill.id;
              return (
                <div
                  key={bill.id}
                  className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggle(bill.id)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-stone-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <FileText size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-stone-900">
                          {bill.billNumber}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          Paid
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <User size={11} />
                          {bill.cashierName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(bill.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingBag size={11} />
                          {bill.items?.length ?? 0} item
                          {(bill.items?.length ?? 0) !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-bold text-stone-900">
                        LKR {bill.totalAmount?.toFixed(2)}
                      </p>
                      <p className="text-xs text-stone-400">Total</p>
                    </div>

                    <div className="ml-2 text-stone-400">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-stone-100 px-5 pb-5 pt-4">
                      <div className="overflow-hidden rounded-2xl border border-stone-100">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-stone-100 bg-stone-50 text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
                              <th className="px-4 py-2.5 text-left">Product</th>
                              <th className="px-4 py-2.5 text-right">Qty</th>
                              <th className="px-4 py-2.5 text-right">Unit Price</th>
                              <th className="px-4 py-2.5 text-right">Disc%</th>
                              <th className="px-4 py-2.5 text-right">Line Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(bill.items ?? []).map((item) => {
                              const gross = item.unitPrice * item.quantity;
                              const net =
                                gross - (gross * item.discountPercentage) / 100;
                              return (
                                <tr
                                  key={item.id}
                                  className="border-b border-stone-50 transition hover:bg-stone-50"
                                >
                                  <td className="px-4 py-2.5 font-medium text-stone-800">
                                    {item.productName}
                                  </td>
                                  <td className="px-4 py-2.5 text-right text-stone-600">
                                    {item.quantity}
                                  </td>
                                  <td className="px-4 py-2.5 text-right text-stone-600">
                                    LKR {item.unitPrice?.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-2.5 text-right text-stone-400">
                                    {item.discountPercentage?.toFixed(1)}%
                                  </td>
                                  <td className="px-4 py-2.5 text-right font-semibold text-stone-900">
                                    LKR {net?.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex gap-6 text-stone-500">
                            <span>
                              Subtotal:{" "}
                              <span className="font-semibold text-stone-700">
                                LKR {bill.subtotal?.toFixed(2)}
                              </span>
                            </span>
                            <span>
                              Discount:{" "}
                              <span className="font-semibold text-red-600">
                                -LKR {bill.discountAmount?.toFixed(2)}
                              </span>
                            </span>
                          </div>
                          <div className="flex gap-6 text-stone-500">
                            <span>
                              Cash received:{" "}
                              <span className="font-semibold text-stone-700">
                                LKR {bill.receivedAmount?.toFixed(2)}
                              </span>
                            </span>
                            <span>
                              Balance:{" "}
                              <span className="font-semibold text-emerald-700">
                                LKR {bill.balance?.toFixed(2)}
                              </span>
                            </span>
                          </div>
                        </div>

                        <a
                          href={`${API_BASE_URL}/api/bills/${bill.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                        >
                          <Download size={15} />
                          Download PDF
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && bills.length > 0 && (
          <p className="mt-4 text-center text-xs text-stone-400">
            Showing {filtered.length} of {bills.length} bill
            {bills.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
