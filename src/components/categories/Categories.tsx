"use client";

import { FILTER_TABS } from "../../data/mock";

type Props = {
  activeFilter: string;
  onFilter: (id: string) => void;
};

export default function Categories({ activeFilter, onFilter }: Props) {
  return (
    <section className="px-4 sm:px-6 py-3">
     <h2 className="text-base font-bold text-gray-800 mb-3">Категории</h2>

      <div className="flex gap-2 overflow-x-auto sm:flex-wrap pb-2 sm:pb-0 no-scrollbar">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onFilter(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5  text-sm font-medium whitespace-nowrap transition-all  cursor-pointer shrink-0 ${
                isActive
                  ? "bg-white text-gray-700"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-500"
              }`}
            >
              
              <div className={`w-8 h-8 rounded ${tab.color} flex items-center justify-center p-0.5 shrink-0`}>
                <IconComponent 
                  size={20} 
                  className={isActive ? "text-white" : "text-white"}
                  strokeWidth={2}
                />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}