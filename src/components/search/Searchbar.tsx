"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryDropdown from "./Categorydropdown";
import CityDropdown from "./Citydropdown";
import SearchInput from "./Searchinput";
import { CATEGORIES } from "../../data/mock";
import { Search } from "lucide-react";

type Props = {
  query: string;
  setQuery: (v: string) => void;
};

export default function SearchBar({ query, setQuery }: Props) {
  const [cityOpen, setCityOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState("По всей Москве");
  const [selectedCategory, setSelectedCategory] = useState("Во всех категориях");
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let catId = "all";
    if (selectedCategory !== "Во всех категориях") {
      const flatCategories = CATEGORIES.flatMap((cat) =>
        cat.children
          ? [
              { id: cat.id, label: cat.label, isParent: true },
              ...cat.children.map((c) => ({ ...c, isParent: false })),
            ]
          : [{ id: cat.id, label: cat.label, isParent: false }]
      );
      const cat = flatCategories.find((c) => c.label === selectedCategory);
      if (cat) catId = cat.id;
    }

    const cityId = selectedCity === "По всей Москве" ? "all" : selectedCity;

    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (catId !== "all") params.set("category", catId);
    if (cityId !== "all") params.set("city", cityId);

    router.push(`/filter?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-white rounded-2xl p-2 flex-1"
      >
        <SearchInput value={query} onChange={setQuery} />

        <CityDropdown
          open={cityOpen}
          onToggle={() => {
            setCityOpen(!cityOpen);
            setCategoryOpen(false);
          }}
          selected={selectedCity}
          onSelect={(city) => {
            setSelectedCity(city);
            setCityOpen(false);
          }}
        />

        <CategoryDropdown
          open={categoryOpen}
          onToggle={() => {
            setCategoryOpen(!categoryOpen);
            setCityOpen(false);
          }}
          selected={selectedCategory}
          onSelect={(cat) => {
            setSelectedCategory(cat);
            setCategoryOpen(false);
          }}
        />
        <button
          type="submit"
          className="bg-[#2AABEE] text-white w-9 h-9 rounded-full flex items-center justify-center shrink-0 hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      <button
        onClick={() => {
          setQuery("");
          setSelectedCity("По всей Москве");
          setSelectedCategory("Во всех категориях");
        }}
        type="button"
        className="text-white text-sm whitespace-nowrap hover:text-blue-700 shrink-0 hidden md:block"
      >
        Сбросить значения
      </button>
    </div>
  );
}