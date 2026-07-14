"use client";

import { CITIES } from "../../data/mock";

type Props = {
  activeCity: string;
  onCityChange: (city: string) => void;
};

export default function MetroFilterDesktop({ activeCity, onCityChange }: Props) {
  return (
    <aside className="hidden lg:block w-52 shrink-0">
      <h3 className="text-blue-500 font-bold text-base mb-3 mt-2">Метро</h3>
      <ul className="flex flex-col gap-0.5 max-h-150 overflow-y-auto pr-1">
        {CITIES.map((city) => (
          <li key={city}>
            <button
              onClick={() => onCityChange(city === "По всей Москве" ? "all" : city)}
              className={`text-left w-full text-sm px-2 py-1 rounded transition-colors ${
                (activeCity === "all" && city === "По всей Москве") || activeCity === city
                  ? "text-blue-500 font-medium bg-blue-50"
                  : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
              }`}
            >
              {city}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
