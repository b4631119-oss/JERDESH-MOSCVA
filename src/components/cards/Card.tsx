"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Post } from "@/src/lib/types";

type Props = {
  post: Post;
  view: "grid" | "list";
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function Card({ post, view, isFavorite, onToggleFavorite }: Props) {
  
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <Link href={`/listing/${post.id}`} className="group block h-full">
      <div className={`border rounded-3xl bg-white shadow-sm hover:shadow-lg transition-all h-full flex relative ${view === "list" ? "flex-row gap-4 p-3" : "flex-col p-2"}`}>
        <div className={`relative overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center shrink-0 ${view === "list" ? "w-32 h-32" : "w-full h-48 mb-4"}`}>
          
          <Image 
            src={post.image || "https://images.unsplash.com/photo-1557683316-973673baf926"} 
            alt={post.title} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition" 
          />

          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all ${
              isFavorite ? "bg-red-50 text-red-500" : "bg-white/90 text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="flex flex-col flex-1 p-2">
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2">{post.title}</h3>
          {post.price && (
            <span className="font-bold text-blue-600 text-sm mt-1">
              {post.price.toLocaleString("ru-RU")} ₽
            </span>
          )}
          <p className="text-xs text-gray-500 mt-2 line-clamp-1">{post.description}</p>
        </div>
      </div>
    </Link>
  );
}