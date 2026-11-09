"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/products/add", label: "Add Product" },
];

const getLinkClasses = (pathname, href) =>
  `block rounded-2xl px-4 py-3 transition ${
    pathname === href ? "bg-slate-100 text-slate-950" : "text-slate-800 hover:bg-slate-100"
  }`;

export default function SidebarNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white p-6 shadow-lg sm:block">
        <div className="mb-10">
          <span className="block text-2xl font-bold tracking-tight text-slate-950">Inventory</span>
          <p className="mt-2 text-sm text-slate-500">Management system</p>
        </div>
        <nav className="space-y-2 text-sm font-medium text-slate-700">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={getLinkClasses(pathname, item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white p-4 sm:hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-xl font-bold tracking-tight text-slate-950">Inventory</span>
            <p className="text-xs text-slate-500">Management system</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
        {mobileOpen && (
          <nav className="mt-4 space-y-2 text-sm font-medium text-slate-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getLinkClasses(pathname, item.href)}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
