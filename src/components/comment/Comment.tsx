"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Send, Smile, ThumbsUp, ThumbsDown, ChevronDown } from "lucide-react";

interface Comment {
  id: string;
  created_at: string;
  text: string;
  user_full_name: string | null;
}

type SortType = "popular" | "new";
const PAGE_SIZE = 3;

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}с`;
  if (diff < 3600) return `${Math.floor(diff / 60)}м`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}ч`;
  return `${Math.floor(diff / 86400)}д`;
}

export default function Comments({
  postId,
  onOpenAuth,
}: {
  postId: number;
  onOpenAuth?: () => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<SortType>("popular");
  const [showAll, setShowAll] = useState(false);

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (!error && data) setComments(data);
  }, [postId]);

  useEffect(() => {
    let isMounted = true;

    const initCommentsAndUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      setUser(data.user);

      const { data: commentsData, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (!error && commentsData && isMounted) setComments(commentsData);
    };

    initCommentsAndUser();
    return () => { isMounted = false; };
  }, [postId]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setLoading(true);

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const { error } = await supabase.from("comments").insert({
        text: newComment,
        post_id: postId,
        user_id: user.id,
        user_full_name: profile?.full_name || "Пользователь",
      });

      if (!error) {
        setNewComment("");
        fetchComments();
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...comments].sort((a, b) =>
    sort === "new"
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : 0
  );

  const visible = showAll ? sorted : sorted.slice(0, PAGE_SIZE);
  const hiddenCount = sorted.length - PAGE_SIZE;

  return (
    <div className="mt-8 border-t border-gray-100 pt-8">

      {/* ── Заголовок + сортировка ── */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">
          Комментарии{" "}
          <span className="text-gray-400 font-normal">{comments.length}</span>
        </h2>
        <button
          onClick={() => setSort(sort === "popular" ? "new" : "popular")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {sort === "popular" ? "Сначала популярные" : "Сначала новые"}
          <ChevronDown size={15} />
        </button>
      </div>

      {/* ── Поле ввода ── */}
      <form onSubmit={handleSubmit}>
        <div className="relative mb-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Написать комментарий"
            className="w-full px-5 py-3.5 pr-24 bg-[#F5F7FF] rounded-full outline-none text-sm text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-200 transition"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Smile size={20} />
            </button>
            <button
              type="submit"
              disabled={!newComment.trim() || loading}
              className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-full transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </form>

      {/* «Войти» — открывает AuthModal через коллбэк */}
      {!user && (
        <p className="text-right text-sm mb-5 text-gray-400">
          <button
            onClick={onOpenAuth}
            className="text-blue-500 hover:underline font-medium"
          >
            Войти
          </button>
          {", чтобы комментировать"}
        </p>
      )}

      {/* ── Список комментариев ── */}
      <div className="space-y-5 mt-5">
        {visible.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">
            Здесь пока пусто. Станьте первым!
          </p>
        )}

        {visible.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-500 uppercase">
              {comment.user_full_name?.[0] ?? "?"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900">
                  {comment.user_full_name}
                </span>
                <span className="text-xs text-gray-400">
                  {timeAgo(comment.created_at)}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                {comment.text}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <button className="hover:text-blue-500 transition-colors font-medium">
                  Ответить
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                  <ThumbsUp size={13} />
                </button>
                <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                  <ThumbsDown size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Показать ещё ── */}
      {!showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-5 text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors"
        >
          Ещё {hiddenCount} комментари{hiddenCount === 1 ? "й" : hiddenCount < 5 ? "я" : "ев"}
        </button>
      )}
    </div>
  );
}