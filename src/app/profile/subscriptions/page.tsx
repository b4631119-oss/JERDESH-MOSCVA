"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Bot, Loader2 } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import toast from "react-hot-toast";
import { useAuth } from "@/src/context/AuthContext"; 

interface Subscription {
  id: string;
  user: string; 
  search_query: string | null;
  metro: string | null;
  category: string | null;
  price_from: number | null;
  price_to: number | null;
  with_photo: boolean | null;
  created_at: string;
}

function SkeletonRow() {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 mb-3 sm:mb-0 sm:rounded-none sm:bg-transparent sm:flex sm:items-center sm:gap-4 sm:py-4 sm:border-b sm:border-gray-100 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-1/3 sm:w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-full sm:w-1/2" />
      </div>
      <div className="w-20 h-7 bg-gray-200 rounded-full mt-3 sm:mt-0 shrink-0" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center gap-3">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
        <Bot size={28} className="text-blue-400" />
      </div>
      <p className="text-gray-400 text-sm sm:text-base font-medium">У вас пока нет активных подписок</p>
      <p className="text-gray-400 text-xs max-w-xs">Сохраняйте фильтры поиска, чтобы бот мгновенно присылал новые объявления.</p>
    </div>
  );
}

export default function SubscriptionsPage() {
  const router = useRouter();
  
  // 🌟 Забираем данные сессии и флаг загрузки из контекста
  const { user, loading: authLoading } = useAuth();

  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const loadedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return; // Ждем, пока контекст инициализируется

    if (!user?.id) {
      loadedUserIdRef.current = null;
      return;
    }

    if (loadedUserIdRef.current === user.id && subs.length > 0) return;
    loadedUserIdRef.current = user.id;

    if (!user) {
      router.push("/");
      return;
    }

    let isMounted = true;

    const fetchSubs = async () => {
      try {
        // 🌟 Берем user.id напрямую из контекста синхронно
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user", user.id)
          .order("created_at", { ascending: false });

        if (!isMounted) return;
        if (error) throw error;
        setSubs(data ?? []);
      } catch (err: unknown) {
        const errorDetails = err as Record<string, unknown>;
        console.error("❌ Ошибка загрузки подписок:", errorDetails?.message);
        toast.error("Не удалось загрузить подписки");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSubs();
    return () => { isMounted = false; };
  }, [authLoading, router, subs.length, user]);

 const handleDelete = async (id: string) => {
    if (!confirm("Удалить подписку?")) return; 
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSubs((prev) => prev.filter((s) => s.id !== id));
      toast.success("Подписка удалена");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Неизвестная ошибка";
      toast.error("Не удалось удалить: " + msg);
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="animate-spin text-blue-400" size={32} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="px-1 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1a1a2e]">Подписки и бот</h2>
          <p className="text-gray-400 text-xs mt-0.5 hidden sm:block">Управление автоматическими уведомлениями</p>
        </div>
        <button 
          onClick={() => toast.success("Запуск бота настраивается...")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A90E2] hover:bg-[#3A7FD1] text-white rounded-full font-bold text-xs sm:text-sm shadow-md shadow-blue-50 transition-all w-full sm:w-auto"
        >
          <Bot size={16} />
          Активировать чат-бот
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-gray-100">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : subs.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          <div className="hidden md:block w-full overflow-x-auto">
            <div className="grid grid-cols-[1.2fr_1fr_1.2fr_1fr_1fr_0.6fr_90px] gap-x-4 px-3 pb-3 border-b border-gray-100">
              {["Поиск", "Метро", "Категория", "Цена от", "Цена до", "Фото", ""].map((col, i) => (
                <span key={i} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {col}
                </span>
              ))}
            </div>

            <div className="divide-y divide-gray-100">
              {subs.map((sub) => (
                <div
                  key={sub.id}
                  className={`grid grid-cols-[1.2fr_1fr_1.2fr_1fr_1fr_0.6fr_90px] gap-x-4 items-center px-3 py-4 transition-all ${
                    deletingId === sub.id ? "opacity-40 pointer-events-none" : ""
                  }`}
                >
                  <span className="text-sm font-semibold text-gray-800 truncate">{sub.search_query || "—"}</span>
                  <span className="text-sm text-gray-600 truncate">{sub.metro || "—"}</span>
                  <span className="text-sm text-gray-600 truncate">{sub.category || "—"}</span>
                  <span className="text-sm font-medium text-gray-800">
                    {sub.price_from != null ? `${sub.price_from.toLocaleString("ru-RU")} ₽` : "—"}
                  </span>
                  <span className="text-sm font-semibold text-[#4A90E2]">
                    {sub.price_to != null ? `${sub.price_to.toLocaleString("ru-RU")} ₽` : "—"}
                  </span>
                  <span className="text-sm text-gray-700">{sub.with_photo ? "Да" : "Нет"}</span>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    disabled={deletingId === sub.id}
                    className="flex items-center justify-center gap-1 px-2.5 py-1.5 border border-red-100 hover:border-red-200 text-red-400 hover:bg-red-50 rounded-full text-xs font-semibold transition-all"
                  >
                    {deletingId === sub.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="block md:hidden space-y-3">
            {subs.map((sub) => (
              <div 
                key={sub.id} 
                className={`bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative transition-all ${
                  deletingId === sub.id ? "opacity-40 pointer-events-none" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2.5 py-0.5 rounded-md mb-1.5 inline-block">
                      {sub.category || "Все категории"}
                    </span>
                    <h4 className="text-sm font-bold text-gray-800 leading-snug">
                      {sub.search_query ? `«${sub.search_query}»` : "Поиск без ключевых слов"}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    disabled={deletingId === sub.id}
                    className="p-2 text-red-400 hover:bg-red-50 border border-red-50 rounded-xl transition-all shrink-0"
                  >
                    {deletingId === sub.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-t border-gray-50 pt-2.5 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Метро / Город</span>
                    <span className="text-gray-700 font-medium truncate block max-w-35">{sub.metro || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Диапазон цен</span>
                    <span className="text-gray-800 font-semibold">
                      {sub.price_from || sub.price_to
                        ? `${sub.price_from ?? 0} - ${sub.price_to ?? "∞"} ₽`
                        : "Любая цена"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Только с фото</span>
                    <span className="text-gray-700 font-medium">{sub.with_photo ? "Да" : "Не важно"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}