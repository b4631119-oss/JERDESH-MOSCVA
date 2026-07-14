"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, ArrowUp, Zap, Palette, Loader2 } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { daysLeft, formatDate } from "@/src/lib/utils/date";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useAuth } from "@/src/context/AuthContext"; // 🌟 Подключаем наш контекст
import { User as SupabaseUser } from "@supabase/supabase-js";

interface Post {
  id: number;
  user: string; 
  title: string;
  description: string | null;
  price: number | null;
  category: string | null;
  metro: string | null;
  phone: string | null;
  image: string | null; 
  created_at: string | null; 
  is_active: boolean;
  expires_at: string | null;
}

function SkeletonCard() {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-7 bg-gray-200 rounded-full w-20" />
          <div className="h-7 bg-gray-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-50 flex items-center justify-center mb-4 mix-blend-multiply">
       <Image 
          src="/E-Commerce 02.png" 
          alt="Пустое избранное" 
          width={200} 
          height={140}
          className="w-[150px] sm:w-[200px] h-auto object-contain opacity-80" 
          priority 
        />
      </div>
      <p className="text-gray-400 text-sm sm:text-base font-medium mb-1">У вас пока нет объявлений!</p>
      <p className="text-gray-400 text-xs max-w-xs mb-5">Опубликуйте что-нибудь, чтобы начать продажи.</p>
      <Link
        href="/profile/create"
        className="px-6 py-2.5 sm:py-3 bg-[#4A90E2] hover:bg-[#3A7FD1] text-white rounded-full font-bold text-xs sm:text-sm shadow-md shadow-blue-100 transition-all flex items-center gap-2"
      >
        <Plus size={16} /> Добавить объявление
      </Link>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  color = "gray",
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color?: "gray" | "green" | "orange" | "red" | "blue";
  onClick?: () => void;
}) {
  const colors = {
    gray: "border-gray-200 text-gray-500 hover:bg-gray-50",
    green: "border-green-200 text-green-600 hover:bg-green-50",
    orange: "border-orange-200 text-orange-500 hover:bg-orange-50",
    red: "border-red-200 text-red-400 hover:bg-red-50",
    blue: "border-blue-200 text-blue-500 hover:bg-blue-50",
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all shrink-0 ${colors[color]}`}
    >
      {icon}
      {label}
    </button>
  );
}

// 🌟 Передаем currentUser внутрь карточки, чтобы не вызывать getUser() при удалении
function PostCard({ post, onDelete, currentUser }: { post: Post; onDelete: (id: number) => void; currentUser: SupabaseUser | null }) {
  const [deleting, setDeleting] = useState(false);
  const days = daysLeft(post.expires_at);
  const thumb = post.image ?? null;

  const handleDelete = async () => {
    if (!currentUser) {
      toast.error("Пользователь не авторизован");
      return;
    }
    if (!confirm("Вы уверены, что хотите удалить это объявление?")) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id)
        .eq("user_id", currentUser.id)
        .select();

      if (error) {
        if (error.code === "42501") {
          throw new Error("Supabase RLS заблокировал удаление. Проверьте права доступа в консоли.");
        }
        throw error;
      }

      toast.success("Объявление успешно удалено!");
      onDelete(post.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Неизвестная ошибка";
      toast.error("Не удалось удалить: " + msg);
      setDeleting(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${deleting ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden relative">
        {thumb ? (
          <Image src={thumb} alt={post.title} fill unoptimized className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl select-none">🏠</div>
        )}
        {!post.is_active && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full">Неактивно</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-1.5">
        <p className="font-semibold text-[#1a1a2e] text-sm sm:text-base line-clamp-1">{post.title}</p>
        {post.description && <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{post.description}</p>}
        <p className="text-gray-400 text-[11px] sm:text-xs">
          {[post.metro, post.category].filter(Boolean).join(" · ")} · {formatDate(post.created_at)}
          {post.price != null && ` · ${post.price.toLocaleString("ru-RU")} Руб`}
        </p>

        <div className="flex flex-nowrap overflow-x-auto gap-2 pt-2 scrollbar-none pb-1">
          {post.is_active ? (
            <>
              {days != null && <ActionBtn icon={<ArrowUp size={12} />} label={`${days} дней`} color="green" />}
              <ActionBtn icon={<Palette size={12} />} label="Поменять цвет" color="orange" />
              <ActionBtn icon={<Zap size={12} />} label="Продвигать" color="blue" />
            </>
          ) : (
            <ActionBtn icon={<Plus size={12} />} label="Публиковать ещё раз" color="blue" />
          )}
          <ActionBtn icon={<Trash2 size={12} />} label="Удалить" color="red" onClick={handleDelete} />
        </div>
      </div>
    </div>
  );
}

function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    
    if (page < totalPages - 2) pages.push("...");
    if (!pages.includes(totalPages)) pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-6">
      <button 
        onClick={() => onChange(page - 1)} 
        disabled={page === 1} 
        className="w-9 h-9 flex items-center justify-center rounded-xl text-sm text-gray-400 hover:text-blue-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
      >
        ‹
      </button>
      {pages.map((p, i) => p === "..." ? (
        <span key={`ellipsis-${i}`} className="w-7 text-center text-gray-300 select-none">...</span>
      ) : (
        <button 
          key={p} 
          onClick={() => onChange(p as number)} 
          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${p === page ? "bg-[#4A90E2] text-white shadow-md shadow-blue-100" : "text-gray-500 hover:bg-gray-100"}`}
        >
          {p}
        </button>
      ))}
      <button 
        onClick={() => onChange(page + 1)} 
        disabled={page === totalPages} 
        className="w-9 h-9 flex items-center justify-center rounded-xl text-sm text-gray-400 hover:text-blue-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
      >
        ›
      </button>
    </div>
  );
}

const PER_PAGE = 8;

export default function ListingsPage() {
  const router = useRouter();
  
  // 🌟 Забираем данные сессии из глобального контекста
  const { user, loading: authLoading } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const loadedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return; // Ждем, пока контекст загрузится

    if (!user?.id) {
      loadedUserIdRef.current = null;
      return;
    }

    if (loadedUserIdRef.current === user.id && posts.length > 0) return;
    loadedUserIdRef.current = user.id;

    // Если контекст проверил и юзера нет — уводим на главную
    if (!user) {
      router.push("/");
      return;
    }

    let isMounted = true;
    
    const fetchListings = async () => {
      setLoading(true);
      try {
        const from = (page - 1) * PER_PAGE;
        const to = from + PER_PAGE - 1;

        // 🌟 Используем user.id напрямую из контекста, без вызова getUser()!
        const { data, error, count } = await supabase
          .from("posts")
          .select("*", { count: "exact" })
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (!isMounted) return;

        if (error) {
          toast.error("Ошибка загрузки данных с сервера");
          console.error("❌ Ошибка Supabase:", error.message);
          return;
        }

        setPosts(data ?? []);
        setTotal(count ?? 0);
      } catch (err) {
        console.error("Критический сбой сети:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchListings();
    return () => { isMounted = false; };
  }, [authLoading, page, posts.length, router, user]);

  const handleDelete = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setTotal((prev) => prev - 1);
  };

  // Пока контекст проверяет авторизацию, крутим красивый спиннер
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-400" size={32} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="px-1 sm:px-0">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#1a1a2e]">Объявления</h2>
        <Link href="/profile/create" className="flex items-center gap-1.5 px-4 py-2 bg-[#4A90E2] hover:bg-[#3A7FD1] text-white rounded-full font-bold text-xs sm:text-sm shadow-md shadow-blue-100 transition-all">
          <Plus size={14} /> Добавить
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onDelete={handleDelete} 
                currentUser={user} // 🌟 Прокидываем юзера
              />
            ))}
          </div>
          <Pagination page={page} total={total} perPage={PER_PAGE} onChange={setPage} />
        </>
      )}
    </div>
  );
}