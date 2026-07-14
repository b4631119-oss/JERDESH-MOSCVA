"use client";
import Image from "next/image";
import Link from "next/link";
import { Plus, Heart, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { useAuthModal } from "@/src/context/AuthModalContext";

function Header() {
  const { isAuthenticated, profile, loading: authLoading } = useAuth();
  const { openAuthModal } = useAuthModal();
  const router = useRouter();

  const handleProtectedLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const profileLabel =
    profile?.full_name?.trim() || profile?.phone_number || "Профиль";

  return (
    <header className="border-b border-gray-200 bg-white w-full">
      <div className="max-w-[1800px] mx-auto flex justify-between items-center px-5 py-6">
        <Link
          href="/"
          className="flex items-center justify-center w-full lg:w-auto lg:justify-start cursor-pointer"
        >
          <Image
            src="/main.svg"
            alt="Logo"
            width={100}
            height={100}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </Link>

        <div className="hidden  lg:flex items-center gap-2 xl:gap-3.5">
          <Link
            href="/profile/create"
            onClick={handleProtectedLink}
            prefetch={false}
            className="bg-[#2AABEE] text-white rounded-full px-5 md:px-6 xl:px-8 py-2 text-[15px] xl:text-base font-semibold flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
             Опубликовать обьявление
          </Link>

          <Link
            href="/favorites"
            onClick={handleProtectedLink}
            prefetch={false}
            className="border border-yellow-400 text-yellow-500 rounded-full px-5 md:px-6 xl:px-8 py-2 text-[15px] xl:text-base font-medium flex gap-2 cursor-pointer whitespace-nowrap"
          >
            <Heart className="w-5 h-5" />
            Избранные
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-3 border border-gray-300 rounded-full px-5 md:px-6 xl:px-8 py-2 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <User className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-medium text-gray-700">
                  {authLoading ? "Загрузка..." : profileLabel}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-3 border border-gray-200 hover:bg-red-50 rounded-full text-red-400 transition-colors"
                title="Выйти"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              className="border border-gray-400 rounded-full px-5 md:px-6 xl:px-8 py-2 text-[15px] xl:text-base flex font-normal gap-2 whitespace-nowrap cursor-pointer"
              onClick={openAuthModal}
            >
              Войти
              <User className="w-5 h-5" />
              
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;