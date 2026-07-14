import { Suspense } from "react";
import { createSupabaseServerClient } from "@/src/lib/supabase-server";
import FilterPage from "./Filterpage";

// Говорим Next.js, что страница всегда динамическая и зависит от URL-параметров
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
  // Ждем параметры, чтобы гарантировать динамический запрос к БД
  await searchParams;

  const supabase = await createSupabaseServerClient();

  // Запрашиваем только активные посты, отсортированные по свежести
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка загрузки фильтрованных объявлений:", error);
  }

  return (
    // Обязательно оборачиваем в Suspense здесь, чтобы useSearchParams на клиенте не ломал билд
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-400">Загрузка фильтров...</div>}>
      <FilterPage initialPosts={posts ?? []} />
    </Suspense>
  );
}