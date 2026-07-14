"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES } from "../../data/mock";
// Импортируем нужные иконки
import { Train, SlidersHorizontal, X, ChevronRight } from "lucide-react";

type Props = {
  query: string;
  setQuery: (v: string) => void;
};

export default function MobileSearch({ query, setQuery }: Props) {
  const router = useRouter();
  const [metroOpen, setMetroOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("По всей Москве");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (selectedCity !== "По всей Москве") params.set("city", selectedCity);
    router.push(`/filter?${params.toString()}`);
  };

  return (
    <div className="lg:hidden px-4 pt-3 pb-4 bg-white border-b border-gray-100">

      <div className="flex items-center gap-2">

        <div className="flex-1 flex items-center bg-gray-100 rounded-2xl px-4 py-2.5 gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={selectedCity}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-500 min-w-0"
          />
        </div>

        <button
          onClick={() => setMetroOpen(!metroOpen)}
          className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
            metroOpen || selectedCity !== "По всей Москве"
              ? "bg-blue-500 border-blue-500 text-white"
              : "bg-white border-gray-200 text-blue-500"
          }`}
          aria-label="Метро"
        >
          <Train size={20} strokeWidth={1.8} />
        </button>

        <button
          onClick={() => router.push("/filter")}
          className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
          aria-label="Фильтр"
        >
          <SlidersHorizontal size={20} strokeWidth={1.8} />
        </button>
      </div>

      {metroOpen && (
        <div className="mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">Выбрать метро</span>
            <button
              onClick={() => setMetroOpen(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <ul className="max-h-52 overflow-y-auto">
            {CITIES.map((city) => (
              <li
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  setMetroOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between ${
                  selectedCity === city
                    ? "text-blue-500 font-medium bg-blue-50"
                    : "text-gray-700"
                }`}
              >
                <span>{city}</span>
                {selectedCity === city && <ChevronRight size={16} strokeWidth={2} />}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}