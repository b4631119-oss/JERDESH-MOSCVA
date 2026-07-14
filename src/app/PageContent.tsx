"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import SearchBanner from "@/src/components/search/SearchBanner";
import Categories from "@/src/components/categories/Categories";
import Popular from "@/src/components/popular/Popular";
import Feed from "@/src/components/feed/Feed";
import { useFilters } from "@/src/hooks/useFilters";
import MetroFilterDesktop from "@/src/components/filter/MetroFilterDesktop";
import MetroFilterMobile from "@/src/components/filter/MetroFilterMobile";
import { useRouter } from "next/navigation";
import { filtersToParams, Filters } from "@/src/lib/filters";
import type { Post } from "@/src/lib/types";
import { supabase } from "@/src/lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "@/src/context/AuthContext";
import { useAuthModal } from "@/src/context/AuthModalContext";

type Subscription = {
  id: number;
  user: string | null;
  search_query: string | null;
  metro: string | null;
  category: string | null;
  price_from: number | null;
  price_to: number | null;
  with_photo: boolean | null;
  created_at: string | null;
};

type Props = {
  initialPosts: Post[];
};

export default function PageContent({ initialPosts }: Props) {
  const { filters, updateFilter, resetFilters, filteredPosts } = useFilters(initialPosts);
  const { user, isAuthenticated } = useAuth(); 
  const { openAuthModal } = useAuthModal(); 
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"all" | "subs">("all");
  const [userSubs, setUserSubs] = useState<Subscription[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const fetchedUserIdRef = useRef<string | null>(null);

  // Эффект для загрузки подписок из базы данных
  useEffect(() => {
    if (activeTab !== "subs") return;

    // Если не авторизован, просто сбрасываем ref и выходим. Без вызова setState.
    if (!isAuthenticated || !user?.id) {
      fetchedUserIdRef.current = null;
      return;
    }

    // Защита от дублирования запросов, если подписки этого пользователя уже загружены
    if (fetchedUserIdRef.current === user.id && userSubs.length > 0) {
      return;
    }

    fetchedUserIdRef.current = user.id;

    let isMounted = true;
    const fetchUserSubs = async () => {
      setLoadingSubs(true);
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user", user.id);

      if (isMounted) {
        if (error) {
          console.error("Ошибка при получении подписок:", error);
          toast.error("Не удалось загрузить подписки");
        } else {
          setUserSubs((data as Subscription[]) || []);
        }
        setLoadingSubs(false);
      }
    };

    fetchUserSubs();
    return () => {
      isMounted = false;
    };
  }, [activeTab, user, isAuthenticated, userSubs.length]);

  // Вычисление финального списка постов на основе выбранной вкладки
  const finalPosts = useMemo(() => {
    if (activeTab === "all") return filteredPosts;
    
    // Если вкладка "subs", но юзер не вошел или подписок нет — отдаем пустой список
    if (!isAuthenticated || userSubs.length === 0) return [];

    return filteredPosts.filter((post) => {
      return userSubs.some((sub) => {
        const matchCategory = !sub.category || sub.category === "all" || (post.categoryId !== null && post.categoryId === sub.category);
        const matchMetro = !sub.metro || sub.metro === "all" || (post.city !== null && post.city === sub.metro);
        const matchPriceFrom = !sub.price_from || (post.price !== null && post.price >= sub.price_from);
        const matchPriceTo = !sub.price_to || (post.price !== null && post.price <= sub.price_to);
        return matchCategory && matchMetro && matchPriceFrom && matchPriceTo;
      });
    });
  }, [filteredPosts, activeTab, userSubs, isAuthenticated]);

  const navigateToFilter = (newFilters: Filters) => {
    const params = filtersToParams(newFilters);
    router.push(`/filter?${params.toString()}`);
  };

  return (
    <>
      <SearchBanner
        query={filters.query}
        setQuery={(v) => updateFilter("query", v)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          // Если кликают на подписки неавторизованным — открываем глобальную модалку входа
          if (tab === "subs" && !isAuthenticated) {
            openAuthModal(); 
            return;
          }
          setActiveTab(tab);
        }} 
      />

      <div className="flex gap-6 px-4 sm:px-6 py-3">
        <div className="flex-1 min-w-0">
          <Categories activeFilter={filters.category} onFilter={(v) => navigateToFilter({ ...filters, category: v })} />
          <Popular activeFilter={filters.category} onItemClick={(id) => navigateToFilter({ ...filters, category: id })} />

          {loadingSubs ? (
            <div className="text-center py-20 text-gray-400 text-sm">Загрузка объявлений...</div>
          ) : (
            <Feed 
              posts={finalPosts} 
              onFilterClick={() => navigateToFilter(filters)} 
              onResetFilters={() => { 
                resetFilters(); 
                setActiveTab("all"); 
              }} 
            />
          )}
          <MetroFilterMobile activeCity={filters.city} onCityChange={(c) => navigateToFilter({ ...filters, city: c })} />
        </div>
        <MetroFilterDesktop activeCity={filters.city} onCityChange={(c) => navigateToFilter({ ...filters, city: c })} />
      </div>
    </>
  );
}
