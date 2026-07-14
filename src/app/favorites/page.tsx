"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import CardList from "@/src/components/cards/Cardlist";
import type { Post } from "@/src/lib/types";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

export default function FavoritesPage() {
  // Забираем состояние авторизации из единого контекста
  const { user, loading: authLoading, favoriteIds } = useAuth();

  const [favorites, setFavorites] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const loadedUserIdRef = useRef<string | null>(null);
  const visibleFavorites = useMemo(
    () => favorites.filter((post) => favoriteIds.has(post.id)),
    [favorites, favoriteIds]
  );

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      loadedUserIdRef.current = null;
      return;
    }
    if (loadedUserIdRef.current === user.id) return;
    loadedUserIdRef.current = user.id;

    let isMounted = true;

    const loadFavorites = async () => {
      try {
        setLoading(true);

        // 1. Достаем ID всех постов из избранного (Строго по user.id)
        const { data: favData, error: favError } = await supabase
          .from("favorites")
          .select("post_id")
          .eq("user_id", user.id);

        if (favError) throw favError;

        if (favData && favData.length > 0 && isMounted) {
          const postIds = favData.map(fav => fav.post_id);

          // 2. Запрашиваем сами посты по их ID
          const { data: postsData, error: postsError } = await supabase
            .from("posts")
            .select("*")
            .in("id", postIds)
            .eq("is_active", true);

          if (postsError) throw postsError;

          if (postsData && isMounted) {
            setFavorites(postsData as Post[]);
          }
        } else {
          if (isMounted) setFavorites([]);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
        toast.error("Не удалось загрузить избранное");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user?.id]);

  // 1. Сначала проверяем, идет ли загрузка сессии авторизации
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  // 2. Если сессия загрузилась, но юзера нет — СРАЗУ показываем пустой экран авторизации
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-10">
        <div className="mb-4 sm:mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
            На главную
          </Link>
        </div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 sm:mb-8">
          <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2 text-gray-900">
            <span className="text-red-500 text-base sm:text-2xl">❤️</span> Избранное
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 max-w-2xl mx-auto">
          <div className="mb-5 sm:mb-6 flex items-center justify-center mix-blend-multiply">
            <Image src="/E-Commerce 02.png" alt="Пустое избранное" width={200} height={140} className="w-[140px] sm:w-[200px] h-auto object-contain opacity-80" priority />
          </div>
          <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1.5">Войдите в аккаунт</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm leading-relaxed px-2">
            Чтобы просматривать и сохранять избранные объявления, необходимо авторизоваться.
          </p>
          <Link href="/" className="mt-5 px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-xl transition-colors shadow-sm">
            На главную для входа
          </Link>
        </div>
      </div>
    );
  }

  // 3. Если юзер есть, но запросы в БД еще выполняются, крутим локальный спиннер
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  // 4. Юзер авторизован, данные загружены — рендерим его избранное
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-10">
      <div className="mb-4 sm:mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group">
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          На главную
        </Link>
      </div>

      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 sm:mb-8">
        <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2 text-gray-900">
          <span className="text-red-500 text-base sm:text-2xl">❤️</span> Избранное
        </h1>
        {visibleFavorites.length > 0 && (
          <span className="text-[11px] sm:text-sm font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
            {visibleFavorites.length} шт.
          </span>
        )}
      </div>

      {visibleFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 max-w-2xl mx-auto">
          <div className="mb-5 sm:mb-6 flex items-center justify-center mix-blend-multiply">
            <Image src="/E-Commerce 02.png" alt="Пустое избранное" width={200} height={140} className="w-[140px] sm:w-[200px] h-auto object-contain opacity-80" priority />
          </div>
          <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1.5">В избранном пока пусто</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm leading-relaxed px-2">
            Нажимайте на сердечко в объявлениях, чтобы сохранить интересные предложения здесь.
          </p>
          <Link href="/" className="mt-5 px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-xl transition-colors shadow-sm">
            Перейти к объявлениям
          </Link>
        </div>
      ) : (
        <CardList posts={visibleFavorites} />
      )}
    </div>
  );
}