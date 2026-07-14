"use client";
 
type Props = {
  activeTab: "all" | "subs";
  setActiveTab: (tab: "all" | "subs") => void;
};
 
export default function Tabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex">
      <button
        onClick={() => setActiveTab("all")}
        className={`px-6 py-2.5 text-sm font-medium cursor-pointer transition-colors rounded-tl-3xl ${
          activeTab === "all"
            ? "bg-white text-blue-500"
            : "bg-transparent text-white/90 hover:text-white"
        }`}
      >
        Все
      </button>
 
      <button
        onClick={() => setActiveTab("subs")}
        className={`px-6 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
          activeTab === "subs"
            ? "bg-white text-blue-500"
            : "bg-transparent text-white/90 hover:text-white"
        }`}
      >
        Мои подписки
      </button>
    </div>
  );
}
 