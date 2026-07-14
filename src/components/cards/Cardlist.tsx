"use client";

import { useState } from "react";
import Card from "./Card";
import type { Post } from "../../lib/types";
import { LayoutGrid, List } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

type Props = {
  posts: Post[];
};

export default function CardList({ posts }: Props) {
  const [view, setView] = useState<"grid" | "list">("list");
  const { favoriteIds, toggleFavorite } = useAuth();

  return (
    <div className="p-0 sm:p-4">
      <div className="hidden lg:flex justify-end mb-4 gap-2">
        <button
          onClick={() => setView("list")}
          className={`p-2 rounded-lg border transition ${view === "list" ? "bg-blue-500 text-white" : "text-gray-500"}`}
        >
          <List size={20} />
        </button>
        <button
          onClick={() => setView("grid")}
          className={`p-2 rounded-lg border transition ${view === "grid" ? "bg-blue-500 text-white" : "text-gray-500"}`}
        >
          <LayoutGrid size={20} />
        </button>
      </div>

      <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid grid-cols-1 lg:grid-cols-2 gap-4"}>
        {posts.map((post) => (
          <Card
            key={post.id}
            post={post}
            view={view}
            isFavorite={favoriteIds.has(post.id)}
            onToggleFavorite={() => toggleFavorite(post.id)}
          />
        ))}
      </div>
    </div>
  );
}