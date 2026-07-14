"use client";

import { useRef, useEffect } from "react";
import { CITIES } from './../../data/mock';

type Props = {
  open: boolean;
  onToggle: () => void;
  selected: string;
  onSelect: (city: string) => void;
};

export default function CityDropdown({ open, onToggle, selected, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (open) onToggle();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onToggle]);

  return (
    <div ref={ref} className="relative" style={{ flex: "1.3", minWidth: 0 }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 text-sm text-gray-500 flex items-center justify-between gap-1 cursor-pointer bg-transparent"
      >
        <span className="truncate">{selected || "По всей Москве"}</span>
        <svg
          className={`w-3.5 h-3.5 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow border border-gray-100 z-50  max-h-64 overflow-y-auto py-1">
          {CITIES.map((city) => (
            <li
              key={city}
              onClick={() => {
                onSelect(city);
                onToggle(); 
              }}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors ${
                selected === city
                  ? "text-blue-500 font-medium bg-blue-50"
                  : "text-gray-700"
              }`}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}