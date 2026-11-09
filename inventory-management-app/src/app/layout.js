import { Inter } from "next/font/google";
import "./globals.css";
import SidebarNavigation from "./SidebarNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Inventory Management App",
  description: "Inventory Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <div className="min-h-screen">
          <SidebarNavigation />

          <main className="sm:ml-64">
            <div className="min-h-screen bg-white px-4 py-6 sm:px-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
