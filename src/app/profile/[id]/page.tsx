"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, MessageSquare, Phone, Loader2, Settings } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { formatDate } from "@/src/lib/utils/date";
import Image from "next/image";
import { useAuth } from "@/src/context/AuthContext"; // 🌟 Подключаем наш контекст

interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  telegram_username: string | null;
  whatsapp_number: string | null;
}

interface Post {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  metro: string | null;
  category: string | null;
  image: string | null;
  created_at: string;
}

function SkeletonCard() {
  return (
    <div className="flex gap-3 animate-pulse bg-white rounded-2xl p-3 border border-gray-100">
      <div className="w-28 h-24 sm:w-32 rounded-2xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3.5 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

function PostCard({ post, profile }: { post: Post; profile: Profile | null }) {
  const thumb = post.image;
  const authorInitial = (profile?.full_name?.[0] ?? "А").toUpperCase();
  const authorName = profile?.full_name?.split(" ")[0] ?? "Автор";

  return (
    <div className="flex gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-3 cursor-pointer group">
      {/* Картинка */}
      <div className="relative w-28 sm:w-32 h-24 flex-shrink-0">
        <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-50 relative">
          {thumb ? (
            <Image src={thumb} alt={post.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-100 select-none">🏠</div>
          )}
        </div>
        <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
          <Heart size={13} className="text-gray-400" />
        </button>
      </div>

      {/* Инфо */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <p className="text-blue-600 font-bold text-sm sm:text-base line-clamp-1 group-hover:text-blue-700 transition-colors">{post.title}</p>
          {post.description && <p className="text-gray-500 text-xs line-clamp-2 mt-0.5 leading-relaxed">{post.description}</p>}
        </div>
        
        <div className="flex flex-col gap-1 mt-1.5">
          <p className="text-gray-400 text-[11px] truncate">
            {[post.metro, post.category].filter(Boolean).join(" · ")}
            {" · "}
            {formatDate(post.created_at)}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-[#1a1a2e] font-bold text-sm">
              {post.price != null ? `${post.price.toLocaleString("ru-RU")} ₽` : "Цена не указана"}
            </p>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold">
                {authorInitial}
              </div>
              <span className="text-gray-400 text-[11px] font-medium">{authorName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // 🌟 Достаем текущего авторизованного пользователя из контекста
  const { user } = useAuth();
  const isOwnProfile = user?.id === id; // Проверяем, мой ли это профиль

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (!isMounted) return;
        if (error || !profileData) { setNotFound(true); return; }
        setProfile(profileData);

        const { data: postsData } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", id)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (!isMounted) return;
        setPosts(postsData ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [id]);

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-gray-400 text-base">Пользователь не найден</p>
        <button onClick={() => router.back()} className="px-5 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors">
          ← Вернуться назад
        </button>
      </div>
    );
  }

  const authorInitial = (profile?.full_name?.[0] ?? "👤").toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Хедер страницы */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 mb-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 font-bold text-base sm:text-lg hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={18} />
            Жердеш - Москва
          </button>
          <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            {isOwnProfile ? "Ваш публичный профиль" : "Профиль автора"}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 flex flex-col lg:flex-row gap-6">
        {/* ЛЕВАЯ ЧАСТЬ: Список объявлений автора */}
        <div className="flex-1 order-2 lg:order-1">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="text-base sm:text-lg font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
              {isOwnProfile ? "Ваши активные объявления" : "Объявления автора"}
              <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-md font-bold">
                {posts.length}
              </span>
            </h3>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                У этого пользователя пока нет активных объявлений
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} profile={profile} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ (Сайдбар): Карточка контактов автора */}
        <div className="w-full lg:w-80 order-1 lg:order-2 shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24 space-y-5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center gap-4 text-center sm:text-left lg:text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-blue-100">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : authorInitial}
              </div>
              <div>
                <h2 className="font-bold text-[#1a1a2e] text-lg leading-tight">
                  {loading ? "Загрузка..." : profile?.full_name || "Пользователь"}
                </h2>
                <p className="text-gray-400 text-xs mt-1">На Жердеш с 2026 г.</p>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-4 space-y-3">
              {/* 🌟 Если профиль принадлежит текущему юзеру, выводим кнопку редактирования */}
              {isOwnProfile ? (
                <button 
                  onClick={() => router.push("/profile")}
                  className="flex items-center justify-center gap-2.5 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-2xl transition-all"
                >
                  <Settings size={16} />
                  Редактировать профиль
                </button>
              ) : (
                <>
                  {profile?.phone_number && (
                    <a 
                      href={`tel:${profile.phone_number}`}
                      className="flex items-center justify-center gap-2.5 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-emerald-50"
                    >
                      <Phone size={16} />
                      Позвонить
                    </a>
                  )}
                  {profile?.telegram_username && (
                    <a 
                      href={`https://t.me/${profile.telegram_username.replace("@", "")}`}
                      target="_blank"
                      className="flex items-center justify-center gap-2.5 w-full py-3 bg-[#4A90E2] hover:bg-[#3A7FD1] text-white font-bold text-sm rounded-2xl transition-all"
                    >
                      <MessageSquare size={16} />
                      Написать в Telegram
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}