"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CITIES, CATEGORIES } from "@/src/data/mock";
import { paramsToFilters,  DEFAULT_FILTERS } from "@/src/lib/filters";
import CardList from "@/src/components/cards/Cardlist";
import { Search, ArrowLeft, Check } from "lucide-react";
import type { Post } from "@/src/lib/types";
import { supabase } from "@/src/lib/supabase";
import { toast } from "react-hot-toast";

const MIN_PRICE = 0;
const MAX_PRICE = 1000000;

type Props = {
  initialPosts: Post[];
};

export default function FilterPage({ initialPosts }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Получаем фильтры из URL напрямую
  const filters = useMemo(() => {
    return paramsToFilters(new URLSearchParams(searchParams.toString()));
  }, [searchParams]);

  // Инициализируем стейты сразу из актуальных фильтров URL
  const [query, setQuery] = useState(filters.query || "");
  const [selectedCity, setSelectedCity] = useState(filters.city || "all");
  const [selectedCategory, setSelectedCategory] = useState(filters.category || "all");
  
  const [cityOpen, setCityOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);

  // Плоский список категорий для выпадающего меню
  const flatCategories = useMemo(() => {
    return CATEGORIES.flatMap((cat) =>
      cat.children
        ? [
          { id: cat.id, label: cat.label, isParent: true, parentId: cat.id },
          ...cat.children.map((c) => ({ ...c, isParent: false, parentId: cat.id }))
        ]
        : [{ id: cat.id, label: cat.label, isParent: false, parentId: cat.id }]
    );
  }, []);

  // Оптимизированная фильтрация
  const filteredPosts = useMemo(() => {
    let posts = initialPosts;

    // 1. Фильтр по поисковому запросу
    if (query) {
      const q = query.toLowerCase();
      posts = posts.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) || 
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.text && p.text.toLowerCase().includes(q))
      );
    }

    // 2. Фильтр по городу/метро (теперь типы знают про p.metro)
    if (selectedCity !== "all") {
      posts = posts.filter(p => p.city === selectedCity || p.metro === selectedCity);
    }

    // 3. Фильтр категорий
    if (selectedCategory !== "all") {
      const isParent = CATEGORIES.some(cat => cat.id === selectedCategory);
      
      if (isParent) {
        const childIds = CATEGORIES.find(cat => cat.id === selectedCategory)?.children?.map(c => c.id) || [];
        posts = posts.filter(p => p.categoryId === selectedCategory || (p.categoryId && childIds.includes(p.categoryId)));
      } else {
        posts = posts.filter(p => p.categoryId === selectedCategory);
      }
    }

    // 4. Фильтр по цене и наличию фото
    return posts.filter((p) => {
      const price = p.price ?? 0;
      const matchPrice = price >= minPrice && price <= maxPrice;
      const matchPhoto = !onlyWithPhoto || (p.image && p.image !== "null" && p.image !== "");
      return matchPrice && matchPhoto;
    });
  }, [initialPosts, query, selectedCategory, selectedCity, minPrice, maxPrice, onlyWithPhoto]);

  const handleMinSlider = useCallback((v: number) => {
    if (v <= maxPrice) setMinPrice(v);
  }, [maxPrice]);

  const handleMaxSlider = useCallback((v: number) => {
    if (v >= minPrice) setMaxPrice(v);
  }, [minPrice]);

  const handleApply = () => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedCity !== "all") params.set("city", selectedCity);
    router.push(`/filter?${params.toString()}`);
    toast.success("Фильтры применены");
  };

  const handleApplyMobile = () => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedCity !== "all") params.set("city", selectedCity);
    router.push(`/?${params.toString()}`);
  };

  const handleSubscribe = async () => {
    const toastId = toast.loading("Сохранение подписки...");
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Для оформления подписки необходимо войти в аккаунт.", { id: toastId });
        return;
      }

      const newSubscription = {
        user: user.id,
        search_query: query || null,
        metro: selectedCity === "all" ? null : selectedCity,
        category: selectedCategory === "all" ? null : selectedCategory,
        price_from: minPrice === MIN_PRICE ? null : minPrice,
        price_to: maxPrice === MAX_PRICE ? null : maxPrice,
        with_photo: onlyWithPhoto,
      };

      const { error } = await supabase.from("subscriptions").insert([newSubscription]);
      if (error) throw error;

      toast.success("Вы успешно подписались на этот поиск!", { id: toastId });
    } catch (err) {
      console.error("Ошибка при создании подписки:", err);
      toast.error("Не удалось сохранить подписку", { id: toastId });
    }
  };

  const handleReset = () => {
    setQuery("");
    setSelectedCity(DEFAULT_FILTERS.city);
    setSelectedCategory(DEFAULT_FILTERS.category);
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
    setOnlyWithPhoto(false);
    router.push("/filter");
    toast.success("Значения сброшены");
  };

  return (
    <div className="flex min-h-screen bg-white md:bg-gray-50">
      <aside className="w-full md:w-72 bg-white md:border-r border-gray-100 p-5 shrink-0 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-gray-800 text-lg">Фильтр</h1>
          </div>
          <button onClick={handleReset} className="text-blue-500 text-sm hover:underline font-medium">
            Сбросить
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Поиск */}
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-1 block">Поиск</label>
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Что вы ищете?"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {/* Метро */}
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-1 block">Метро / Район</label>
            <div className="relative">
              <button
                onClick={() => { setCityOpen(!cityOpen); setCategoryOpen(false); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 flex items-center justify-between hover:border-blue-400 transition-colors bg-white"
              >
                <span className="truncate">{selectedCity === "all" ? "По всей Москве" : selectedCity}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${cityOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {cityOpen && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-56 overflow-y-auto py-1">
                  <li onClick={() => { setSelectedCity("all"); setCityOpen(false); }} className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex items-center justify-between ${selectedCity === "all" ? "text-blue-500 font-medium bg-blue-50" : "text-gray-700"}`}>
                    По всей Москве {selectedCity === "all" && <Check className="w-4 h-4" />}
                  </li>
                  {CITIES.filter(c => c !== "По всей Москве").map((city) => (
                    <li key={city} onClick={() => { setSelectedCity(city); setCityOpen(false); }} className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex items-center justify-between ${selectedCity === city ? "text-blue-500 font-medium bg-blue-50" : "text-gray-700"}`}>{city}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Категории */}
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-1 block">Категория</label>
            <div className="relative">
              <button
                onClick={() => { setCategoryOpen(!categoryOpen); setCityOpen(false); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 flex items-center justify-between hover:border-blue-400 transition-colors bg-white"
              >
                <span className="truncate">
                  {selectedCategory === "all" ? "Во всех категориях" : (flatCategories.find(c => c.id === selectedCategory)?.label || selectedCategory)}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${categoryOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {categoryOpen && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-64 overflow-y-auto py-1">
                  <li onClick={() => { setSelectedCategory("all"); setCategoryOpen(false); }} className={`px-3 py-2 text-sm font-medium cursor-pointer hover:bg-blue-50 ${selectedCategory === "all" ? "text-blue-500 bg-blue-50" : "text-gray-700"}`}>Во всех категориях</li>
                  {flatCategories.map((cat) => (
                    <li
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCategoryOpen(false);
                      }}
                      className={`text-sm transition-colors ${cat.isParent
                          ? "px-3 pt-3 pb-1 text-xs font-bold text-blue-500 uppercase tracking-wide cursor-default bg-gray-50/50"
                          : `pl-6 pr-3 py-2 cursor-pointer hover:bg-blue-50 ${selectedCategory === cat.id ? "text-blue-500 font-medium bg-blue-50" : "text-gray-700"}`
                        }`}
                    >
                      {cat.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Цена */}
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-2 block">Цена, ₽</label>
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="text-[10px] text-gray-400 block mb-0.5">От</label>
                <input
                  type="number" value={minPrice === 0 ? "" : minPrice} placeholder="0"
                  onChange={(e) => handleMinSlider(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 bg-gray-50/30"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-gray-400 block mb-0.5">До</label>
                <input
                  type="number" value={maxPrice === MAX_PRICE ? "" : maxPrice} placeholder="1 000 000"
                  onChange={(e) => handleMaxSlider(e.target.value === "" ? MAX_PRICE : Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 bg-gray-50/30"
                />
              </div>
            </div>
            <div className="relative h-5 flex items-center">
              <input
                type="range" min={MIN_PRICE} max={MAX_PRICE} value={maxPrice}
                onChange={(e) => handleMaxSlider(Number(e.target.value))}
                className="w-full h-1.5 accent-blue-500 cursor-pointer bg-gray-200 rounded-lg appearance-none"
              />
            </div>
          </div>

          {/* Чекбокс */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox" id="onlyWithPhoto" checked={onlyWithPhoto}
              onChange={(e) => setOnlyWithPhoto(e.target.checked)}
              className="w-4 h-4 rounded text-blue-500 border-gray-300 focus:ring-blue-400 accent-blue-500 cursor-pointer"
            />
            <label htmlFor="onlyWithPhoto" className="text-xs text-gray-600 select-none cursor-pointer font-semibold">
              Только с фото
            </label>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between mt-6 gap-2">
          <button
            onClick={handleSubscribe}
            className="border border-blue-400 text-blue-500 text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
          >
            Подписаться
          </button>
          <button onClick={handleApply} className="hidden md:block bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors cursor-pointer shadow-sm">
            Применить
          </button>
          <button onClick={handleApplyMobile} className="md:hidden bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors cursor-pointer shadow-sm">
            Применить
          </button>
        </div>
      </aside>

      {/* Правая часть: Результаты поиска */}
      <div className="hidden md:flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-800">Результаты поиска</h2>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {filteredPosts.length} объявлений
          </span>
        </div>
        {filteredPosts.length > 0 ? (
          <CardList posts={filteredPosts} />
        ) : (
          <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 max-w-xl mx-auto w-full mt-4">
            <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <h3 className="font-bold text-gray-800 text-sm mb-1">Ничего не найдено</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">Попробуйте изменить поисковый запрос или сбросить фильтры.</p>
            <button onClick={handleReset} className="mt-4 text-xs font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl transition-colors">
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
}