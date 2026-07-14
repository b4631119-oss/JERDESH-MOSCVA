"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Heart, Plus, Grid, User } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { useAuthModal } from "@/src/context/AuthModalContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();

  const handleProtectedLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal();
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-5000">
      <Link
        href="/"
        className={`flex flex-col items-center text-xs gap-0.5 ${
          pathname === "/" ? "text-blue-500" : "text-gray-500"
        }`}
      >
        <Home className="w-6 h-6" />
        <span>Главная</span>
      </Link>

      <Link
        href="/favorites"
        onClick={handleProtectedLink}
        className={`flex flex-col items-center text-xs gap-0.5 ${
          pathname === "/favorites" ? "text-blue-500" : "text-gray-500"
        }`}
      >
        <Heart className="w-6 h-6" />
        <span>Избранные</span>
      </Link>

      <Link
        href="/profile/create"
        onClick={handleProtectedLink}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center -mt-6 shadow-lg transition-colors"
        aria-label="Подать объявление"
      >
        <Plus className="w-7 h-7" />
      </Link>

      <Link
        href="/profile/listings"
        onClick={handleProtectedLink}
        className={`flex flex-col items-center text-xs gap-0.5 ${
          pathname === "/profile/listings" ? "text-blue-500" : "text-gray-500"
        }`}
      >
        <Grid className="w-6 h-6" />
        <span>Мои объявл.</span>
      </Link>

      <Link
        href="/profile"
        onClick={handleProtectedLink}
        className={`flex flex-col items-center text-xs gap-0.5 ${
          pathname === "/profile" ? "text-blue-500" : "text-gray-500"
        }`}
      >
        <User className="w-6 h-6" />
        <span>Профиль</span>
      </Link>
    </div>
  );
}