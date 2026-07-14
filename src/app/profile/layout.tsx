"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, BookMarked, Megaphone, ArrowLeft } from "lucide-react";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Профиль", href: "/profile", icon: <LayoutGrid size={18} /> },
    { name: "Подписки", href: "/profile/subscriptions", icon: <BookMarked size={18} /> },
    { name: "Мои объявления", href: "/profile/listings", icon: <Megaphone size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <div className="bg-white border-b border-gray-100 px-6 py-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors w-fit">
            <ArrowLeft size={20} />
            <span className="font-bold text-lg text-blue-600">Жердеш - Москва</span>
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-56 shrink-0 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-medium text-sm transition-all ${
                  isActive 
                    ? "bg-[#EEF3FF] text-blue-600 font-semibold" 
                    : "text-gray-500 hover:bg-white"
                }`}
              >
                {item.icon} {item.name}
              </Link>
            );
          })}
        </aside>

        <main className="flex-1 bg-white rounded-[28px] p-8 shadow-sm border border-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}