"use client";

import { useState } from "react";
import { TrainFront, ChevronRight } from "lucide-react";
import { CITIES } from "../../data/mock";

type Props = {
  activeCity: string;
  onCityChange: (city: string) => void;
};

export default function MetroFilterMobile({ activeCity, onCityChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-blue-300 rounded-2xl text-blue-500 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <TrainFront size={16} />
          <span>{activeCity === "all" ? "Выбрать метро" : activeCity}</span>
        </div>
        <ChevronRight
          size={16}
          className={`transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
          <ul className="max-h-56 overflow-y-auto">
            {CITIES.map((city) => (
              <li
                key={city}
                onClick={() => {
                  onCityChange(city === "По всей Москве" ? "all" : city);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 transition-colors ${
                  (activeCity === "all" && city === "По всей Москве") || activeCity === city
                    ? "text-blue-500 font-medium bg-blue-50"
                    : "text-gray-700"
                }`}
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
