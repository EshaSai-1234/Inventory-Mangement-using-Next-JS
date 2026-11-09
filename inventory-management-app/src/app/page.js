//File path: src/app/page.js

"use client";
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (searchValue = '') => {
    const response = await fetch(`/api/products?search=${encodeURIComponent(searchValue)}`);
    const data = await response.json();
    setProducts(data.data || []);
  };

  const stockData = {
    labels: products.map((product) => product.name),
    datasets: [
      {
        label: 'Quantity',
        data: products.map((product) => Number(product.quantity)),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Max Stock',
        data: products.map((product) => Number(product.maxStock)),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const categories = [...new Set(products.map((product) => product.category))];
  const categoryCounts = categories.map((category) =>
    products.filter((product) => product.category === category).length
  );

  const categoryData = {
    labels: categories,
    datasets: [
      {
        label: 'Category Breakdown',
        data: categoryCounts,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Management System</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Total Products</h2>
            <p className="mt-4 text-5xl font-bold text-slate-900">{products.length}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Total Categories</h2>
            <p className="mt-4 text-5xl font-bold text-slate-900">{categories.length}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Stock Level vs. Max Stock</h2>
            <div className="min-h-[320px]">
              <Bar data={stockData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Product Categories Breakdown</h2>
            <div className="min-h-[320px]">
              <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}