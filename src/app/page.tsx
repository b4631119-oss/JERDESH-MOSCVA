import { Suspense } from "react";
import { createSupabaseServerClient } from "@/src/lib/supabase-server";
import PageContent from "./PageContent";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка загрузки объявлений:", error);
  }
  
    return (
    <Suspense fallback={<div className="">Загрузка.....</div>}>
      <PageContent initialPosts={posts || []} />
    </Suspense>
  );
}