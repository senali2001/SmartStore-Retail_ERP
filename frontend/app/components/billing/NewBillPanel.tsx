"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle, RotateCcw, Search, ShoppingCart, Trash2, UserPlus, Check, X, Star, CreditCard, DollarSign, Smartphone } from "lucide-react";

type Product = {
  id: number;
  productName: string;
  sellingPrice: number;
  discountPercentage?: number;
  stockQuantity?: number;
  minimumStockLevel?: number;
};

type BillItem = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  discountPercentage: number;
  lineTotal: number;
  lineDiscount: number;
  lineNetTotal: number;
};

const API_BASE_URL = "http://localhost:8080";

export default function NewBillPanel() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<BillItem[]>([]);
  const [cashierName, setCashierName] = useState("Cashier");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [message, setMessage] = useState("");
  const [lowStockWarnings, setLowStockWarnings] = useState<string[]>([]);
  const [savedBillData, setSavedBillData] = useState<any>(null);

  const [phoneSearch, setPhoneSearch] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [searchMessage, setSearchMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustBirthday, setNewCustBirthday] = useState("");
  const [newCustAddress, setNewCustAddress] = useState("");

  useEffect(() => {
    if (keyword.trim().length < 1) {
      setProducts([]);
      return;
    }

    const controller = new AbortController();
    fetch(`${API_BASE_URL}/api/products/search?keyword=${encodeURIComponent(keyword)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));

    return () => controller.abort();
  }, [keyword]);

  const handleSearchCustomer = async () => {
    if (!phoneSearch.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/customers/phone/${phoneSearch.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setCustomer(data);
        setSearchMessage("");
      } else {
        setCustomer(null);
        setSearchMessage("Customer not found. Create New Customer?");
      }
    } catch (err) {
      console.error(err);
      setSearchMessage("Customer not found.");
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustName || !newCustPhone) {
      alert("Name and Phone are required.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCustName,
          phone: newCustPhone,
          email: newCustEmail,
          birthday: newCustBirthday || null,
          address: newCustAddress
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCustomer(data);
        setPhoneSearch(newCustPhone);
        setSearchMessage("");
        setShowCreateModal(false);
        setNewCustName("");
        setNewCustPhone("");
        setNewCustEmail("");
        setNewCustBirthday("");
        setNewCustAddress("");
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to create customer");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating customer.");
    }
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    let discountAmount = 0;

    items.forEach((item) => {
      subtotal += item.lineTotal;
      discountAmount += item.lineDiscount;
    });

    const totalAmount = subtotal - discountAmount;
    const balance = Number(receivedAmount || 0) - totalAmount;

    return { subtotal, discountAmount, totalAmount, balance };
  }, [items, receivedAmount]);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);

      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                lineTotal: (item.quantity + 1) * item.unitPrice,
                lineDiscount: ((item.quantity + 1) * item.unitPrice * (item.discountPercentage || 0)) / 100,
                lineNetTotal:
                  (item.quantity + 1) * item.unitPrice -
                  ((item.quantity + 1) * item.unitPrice * (item.discountPercentage || 0)) / 100,
              }
            : item
        );
      }

      const newItem: BillItem = {
        productId: product.id,
        productName: product.productName,
        unitPrice: product.sellingPrice,
        quantity: 1,
        discountPercentage: product.discountPercentage || 0,
        lineTotal: product.sellingPrice,
        lineDiscount: (product.sellingPrice * (product.discountPercentage || 0)) / 100,
        lineNetTotal: product.sellingPrice - (product.sellingPrice * (product.discountPercentage || 0)) / 100,
      };

      return [...prev, newItem];
    });

    setKeyword("");
    setMessage("");
  };

  const updateQuantity = (productId: number, qty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: qty,
              lineTotal: qty * item.unitPrice,
              lineDiscount: (qty * item.unitPrice * item.discountPercentage) / 100,
              lineNetTotal: qty * item.unitPrice - (qty * item.unitPrice * item.discountPercentage) / 100,
            }
          : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const resetBill = () => {
    setItems([]);
    setReceivedAmount("");
    setKeyword("");
    setMessage("");
    setLowStockWarnings([]);
    setCustomer(null);
    setPhoneSearch("");
    setSearchMessage("");
  };

  const saveBill = async () => {
    if (items.length === 0) {
      setMessage("Please add at least one item before saving the bill.");
      return;
    }

    try {
      const payload = {
        cashierName,
        receivedAmount: Number(receivedAmount || 0),
        customerId: customer ? customer.id : null,
        customerName: customer ? customer.name : "Walk-in Customer",
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          discountPercentage: item.discountPercentage,
        })),
      };

      const res = await fetch(`${API_BASE_URL}/api/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save bill");
      }

      setSavedBillData(data);
      setLowStockWarnings(data.lowStockWarnings || []);
      setMessage(`Bill saved successfully. Bill No: ${data.billNumber}`);

      if (customer) {
        const nextPoints = customer.loyaltyPoints + Math.floor(totals.totalAmount / 100);
        setCustomer((prev: any) => ({
          ...prev,
          loyaltyPoints: nextPoints,
          membershipLevel: nextPoints >= 5000 ? "GOLD" : nextPoints >= 1000 ? "SILVER" : "NORMAL"
        }));
      }
    } catch (err: any) {
      setMessage(err.message || "Error saving bill. Please try again.");
      console.error(err);
    }
  };

  const getTierColor = (tier: string) => {
    if (tier === 'GOLD') return 'bg-amber-100 text-amber-800'
    if (tier === 'SILVER') return 'bg-slate-200 text-slate-800'
    return 'bg-stone-100 text-stone-700'
  }

  return (
    <div className="min-h-screen bg-[#f4f2ea] p-4 md:p-6 font-sans">
      <div className="mx-auto max-w-7xl rounded-3xl border border-stone-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">SmartStore billing</p>
            <h1 className="mt-1 text-2xl font-semibold text-stone-900">New Checkout Register</h1>
            <p className="mt-1 text-sm text-stone-500">Scan barcode, search products, and reward customer loyalty points.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/cashierdashboard"
              className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr]">
          
          <div className="space-y-4">
            
            <div className="rounded-3xl border border-stone-200 bg-[#fcfbf7] p-5 space-y-3">
              <h2 className="text-base font-bold text-stone-900">Customer Loyalty Points</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter phone number (e.g. 0771234567)"
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  className="flex-1 rounded-2xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none"
                />
                <button
                  onClick={handleSearchCustomer}
                  className="rounded-2xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800 transition"
                >
                  Search
                </button>
              </div>

              {searchMessage && (
                <div className="flex items-center justify-between rounded-xl bg-orange-50 border border-orange-200 p-3 text-sm text-orange-800">
                  <span>{searchMessage}</span>
                  <button
                    onClick={() => { setShowCreateModal(true); setNewCustPhone(phoneSearch) }}
                    className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500"
                  >
                    <UserPlus size={12} /> Yes, Create
                  </button>
                </div>
              )}

              {customer && (
                <div className="rounded-2xl border border-emerald-100 bg-[#f1fcf5] p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-900">{customer.name}</span>
                    <span className={`badge px-3 py-1 rounded-full text-xs font-bold ${getTierColor(customer.membershipLevel)}`}>
                      {customer.membershipLevel} MEMBER
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                    <div>Points: <strong className="text-purple-700 font-bold">{customer.loyaltyPoints} pts</strong></div>
                    <div>Customer ID: <strong>#{customer.id}</strong></div>
                    <div className="col-span-2">Last Purchase: <strong>{customer.lastPurchaseDate ? new Date(customer.lastPurchaseDate).toLocaleDateString('en-GB') : '—'}</strong></div>
                  </div>
                  <button onClick={() => setCustomer(null)} className="text-xs text-red-600 hover:underline">Remove Customer</button>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-stone-200 bg-[#fcfbf7] p-5 space-y-3">
              <label className="text-sm font-semibold text-stone-700">Cashier Register</label>
              <input
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                className="w-full rounded-2xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none"
              />

              <label className="mt-2 block text-sm font-semibold text-stone-700">Search Products</label>
              <div className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-3 py-2.5">
                <Search size={16} className="text-stone-400" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent text-sm text-stone-800 outline-none"
                  placeholder="Type product name, brand, or barcode..."
                />
              </div>

              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-3">
                    <div>
                      <p className="font-semibold text-stone-900">{product.productName}</p>
                      <p className="text-sm text-stone-500">Unit price: LKR {product.sellingPrice.toFixed(2)}</p>
                      <p className="text-xs text-stone-400">Stock: {product.stockQuantity ?? 0}</p>
                    </div>
                    <button
                      onClick={() => addItem(product)}
                      disabled={(product.stockQuantity || 0) <= 0}
                      className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:bg-stone-300"
                    >
                      <PlusCircle size={16} /> Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {savedBillData ? (
            <div className="rounded-3xl border border-stone-200 bg-[#f1fcf5] p-6 space-y-6">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <ShoppingCart size={28} />
                </div>
                <h2 className="mt-4 text-xl font-bold text-stone-900 font-sans">Bill Processed successfully!</h2>
                <p className="mt-1 text-sm text-stone-500">Invoice: {savedBillData.billNumber}</p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4 space-y-3 shadow-sm">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Customer</span>
                  <span className="font-semibold text-stone-900">{savedBillData.customerName || 'Walk-in'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="font-semibold text-stone-900">LKR {savedBillData.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-red-600 font-semibold">
                  <span>Discount</span>
                  <span>-LKR {savedBillData.discountAmount?.toFixed(2)}</span>
                </div>
                <div className="border-t border-stone-200 my-2 pt-2 flex justify-between text-base font-bold text-stone-900">
                  <span>Grand Total</span>
                  <span>LKR {savedBillData.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Received</span>
                  <span>LKR {savedBillData.receivedAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald-700">
                  <span>Balance</span>
                  <span>LKR {savedBillData.balance?.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`${API_BASE_URL}/api/bills/${savedBillData.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500 shadow-sm"
                >
                  Print PDF Invoice
                </a>
                <button
                  onClick={() => {
                    setSavedBillData(null);
                    resetBill();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  Next Bill
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-stone-200 bg-[#faf8f3] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-900">Current Basket</h2>
                <button onClick={resetBill} className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700">
                  <RotateCcw size={12} /> Reset
                </button>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-3 min-h-[160px]">
                <div className="grid grid-cols-[minmax(0,1fr)_60px_80px_70px] gap-2 border-b border-stone-200 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  <span>Item</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Total</span>
                </div>

                {items.length === 0 ? (
                  <div className="py-12 text-center text-sm text-stone-500">Basket is empty.</div>
                ) : (
                  <div className="space-y-2 mt-2">
                    {items.map((item) => (
                      <div key={item.productId} className="grid grid-cols-[minmax(0,1fr)_60px_80px_70px] items-center gap-2 rounded-xl bg-stone-50 p-2">
                        <span className="truncate font-semibold text-sm text-stone-800">{item.productName}</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                          className="w-full rounded border bg-white p-1 text-right text-xs"
                        />
                        <span className="text-right text-xs text-stone-700">LKR {item.unitPrice.toFixed(2)}</span>
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-xs font-semibold">LKR {item.lineNetTotal.toFixed(2)}</span>
                          <button onClick={() => removeItem(item.productId)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-sm font-semibold text-stone-700">Payment Method</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CASH', icon: <DollarSign size={14} />, label: 'Cash' },
                    { id: 'CARD', icon: <CreditCard size={14} />, label: 'Card' },
                    { id: 'MOBILE', icon: <Smartphone size={14} />, label: 'Mobile' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                        paymentMethod === m.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-2">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Subtotal</span>
                  <span>LKR {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Discount</span>
                  <span>-LKR {totals.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-bold text-stone-900">
                  <span>Grand Total</span>
                  <span>LKR {totals.totalAmount.toFixed(2)}</span>
                </div>

                <label className="block text-sm font-semibold text-stone-700 mt-2">Cash Received</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                />

                <div className="flex justify-between text-sm font-bold text-emerald-700 mt-2">
                  <span>Balance Due</span>
                  <span>LKR {totals.balance.toFixed(2)}</span>
                </div>

                <button
                  onClick={saveBill}
                  className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition mt-2"
                >
                  Complete Checkout & Print
                </button>

                {message && <p className="text-center text-xs text-red-600 mt-2">{message}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-stone-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">Create Customer Account</h3>
              <button onClick={() => setShowCreateModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-600">Customer Name *</label>
                <input type="text" className="w-full rounded-xl border p-2.5 text-sm mt-1" value={newCustName} onChange={e => setNewCustName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600">Phone Number *</label>
                <input type="text" className="w-full rounded-xl border p-2.5 text-sm mt-1" value={newCustPhone} onChange={e => setNewCustPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600">Email Address (Optional)</label>
                <input type="email" className="w-full rounded-xl border p-2.5 text-sm mt-1" value={newCustEmail} onChange={e => setNewCustEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600">Birthday (Optional)</label>
                <input type="date" className="w-full rounded-xl border p-2.5 text-sm mt-1" value={newCustBirthday} onChange={e => setNewCustBirthday(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600">Address (Optional)</label>
                <input type="text" className="w-full rounded-xl border p-2.5 text-sm mt-1" value={newCustAddress} onChange={e => setNewCustAddress(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowCreateModal(false)} className="rounded-xl border px-4 py-2 text-sm font-semibold text-stone-600">Cancel</button>
              <button onClick={handleCreateCustomer} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Save Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
