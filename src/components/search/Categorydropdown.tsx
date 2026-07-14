"use client";

import { useRef, useEffect } from "react";
import { CATEGORIES } from "../../data/mock";

type Props = {
  open: boolean;
  onToggle: () => void;
  selected: string;
  onSelect: (category: string) => void;
};

export default function CategoryDropdown({ open, onToggle, selected, onSelect }: Props) {
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
    <div ref={ref} className="relative" style={{ flex: "1.5", minWidth: 0 }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 text-sm text-gray-500 flex items-center justify-between gap-1 cursor-pointer bg-transparent"
      >
        <span className="truncate">{selected || "Во всех категориях"}</span>
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
        <ul className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-[100]  max-h-72 overflow-y-auto py-1">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
      
              <div
                onClick={() => {
                  if (!cat.children) {
                    onSelect(cat.label);
                    onToggle();
                  }
                }}
                className={`px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  !cat.children
                    ? `cursor-pointer hover:text-blue-500 ${
                        selected === cat.label
                          ? "text-blue-500 font-bold bg-blue-50"
                          : "text-gray-600"
                      }`
                    : "cursor-default text-gray-400"
                }`}
              >
                {cat.label}
              </div>

              {cat.children?.map((child) => (
                <div
                  key={child.id}
                  onClick={() => {
                    onSelect(child.label);
                    onToggle(); 
                  }}
                  className={`pl-6 pr-4 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors ${
                    selected === child.label
                      ? "text-blue-500 font-medium bg-blue-50"
                      : "text-gray-700"
                  }`}
                >
                  {child.label}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}