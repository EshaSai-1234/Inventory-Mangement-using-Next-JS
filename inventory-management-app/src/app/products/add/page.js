"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
    const router = useRouter();
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [maxStock, setMaxStock] = useState('');
    const [minStock, setMinStock] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productName.trim() || !category || !quantity || !price || !maxStock || !minStock) {
            setMessage('Please fill in all fields.');
            return;
        }

        if (Number(quantity) <= 0) {
            setMessage('Quantity must be greater than zero.');
            return;
        }

        if (Number(price) <= 0) {
            setMessage('Price must be greater than zero.');
            return;
        }

        if (Number(maxStock) < Number(minStock)) {
            setMessage('Max stock should be greater than or equal to min stock.');
            return;
        }

        setLoading(true);
        const newProduct = {
            name: productName.trim(),
            category,
            quantity: quantity.trim(),
            price: price.trim(),
            maxStock: maxStock.trim(),
            minStock: minStock.trim(),
        };

        const response = await fetch('/api/products/add', {
            method: 'POST',
            body: JSON.stringify(newProduct),
            headers: {
                'content-type': 'application/json',
            },
        });
        const result = await response.json();
        setLoading(false);

        if (result.success) {
            setMessage('Product added successfully. Redirecting to products...');
            setProductName('');
            setCategory('');
            setQuantity('');
            setPrice('');
            setMaxStock('');
            setMinStock('');
            setTimeout(() => router.push('/products'), 900);
            return;
        }

        setMessage(result.message || 'Could not add product.');
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Add Product</h1>
                    <p className="text-sm text-slate-500">Add a product to the inventory list with name, category, stock, and quantity.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-lg space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {message ? (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div>
                ) : null}

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Product Name</label>
                    <input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Example: Smartphone"
                        type="text"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="">Select category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Stationery">Stationery</option>
                    </select>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Quantity</label>
                        <input
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            type="number"
                            min="1"
                            placeholder="How many units"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Price</label>
                        <input
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            type="number"
                            min="0"
                            placeholder="Price per unit"
                        />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Max Stock</label>
                        <input
                            value={maxStock}
                            onChange={(e) => setMaxStock(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            type="number"
                            min="0"
                            placeholder="Max stock"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Min Stock</label>
                        <input
                            value={minStock}
                            onChange={(e) => setMinStock(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            type="number"
                            min="0"
                            placeholder="Min stock"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Add Product'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/products')}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-400"
                    >
                        View Products
                    </button>
                </div>
            </form>
        </div>
    );
}
