"use client";

import { POPULAR_ITEMS } from "../../data/mock";

type Props = {
  activeFilter: string;
  onItemClick?: (categoryId: string) => void;
};

export default function Popular({ activeFilter, onItemClick }: Props) {
  const items =
    activeFilter === "all"
      ? POPULAR_ITEMS
      : POPULAR_ITEMS.filter((item) => item.categoryId === activeFilter);

  if (items.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 py-3">
      <h2 className="text-base font-bold text-gray-800 mb-3">Популярные</h2>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 lg:flex-wrap">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick?.(item.categoryId)}
            className={`${item.color} rounded-2xl shrink-0 cursor-pointer
              w-36 h-24 sm:w-44 sm:h-28
              hover:opacity-90 active:scale-95
              transition-all duration-150
              flex flex-col items-center justify-center gap-2 p-3`}
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="text-white text-xs font-bold text-center leading-tight line-clamp-2">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}