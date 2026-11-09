"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (query = '') => {
    setLoading(true);
    const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
    const data = await response.json();
    setProducts(data.data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this product from inventory?');
    if (!confirmed) return;

    setActionLoading(true);
    const response = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const result = await response.json();
    setActionLoading(false);

    if (result.success) {
      setMessage('Product deleted successfully.');
      fetchProducts(search);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setMessage(result.message || 'Unable to delete product.');
    setTimeout(() => setMessage(''), 3000);
  };

  const categories = [...new Set(products.map((product) => product.category))];
  const categoryCounts = categories.map((category) =>
    products.filter((product) => product.category === category).length
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">All inventory products are shown here. Use delete to remove items.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/products/add" className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Add Product
          </Link>
          <button
            type="button"
            onClick={() => fetchProducts(search)}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-400"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-sm">
          <label className="sr-only" htmlFor="product-search">
            Search products
          </label>
          <input
            id="product-search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchProducts(e.target.value);
            }}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Search products..."
          />
        </div>
        {message ? <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Product List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Quantity</th>
                  <th className="px-4 py-3 font-semibold">Max Stock</th>
                  <th className="px-4 py-3 font-semibold">Min Stock</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900">{product.name}</td>
                      <td className="px-4 py-4">{product.category}</td>
                      <td className="px-4 py-4">{product.price}</td>
                      <td className="px-4 py-4">{product.quantity}</td>
                      <td className="px-4 py-4">{product.maxStock}</td>
                      <td className="px-4 py-4">{product.minStock}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          disabled={actionLoading}
                          className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Category Summary</h2>
            <div className="space-y-4">
              {categories.length ? (
                categories.map((category, index) => (
                  <div key={category} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{category}</p>
                      <p className="text-sm text-slate-500">{categoryCounts[index]} items</p>
                    </div>
                    <span className="inline-flex h-3.5 w-3.5 rounded-full bg-blue-500" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No category data available.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold text-slate-900">Quick Stats</h2>
            <div className="grid gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total Products</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{products.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total Categories</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
