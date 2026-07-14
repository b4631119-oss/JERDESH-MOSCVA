"use client";

import Tabs from "./Tabs";
import SearchBar from "./Searchbar";
import MobileSearch from "./Mobilesearch";
import Image from "next/image";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  activeTab: "all" | "subs";
  setActiveTab: (tab: "all" | "subs") => void;
};

export default function SearchBanner({ query, setQuery, activeTab, setActiveTab }: Props) {
  return (
    <>
      <section className="px-6 sm:px-6 pt-4 pb-6 hidden lg:block">
        <div className="bg-[#2AABEE] rounded-3xl relative ">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="pl-6 sm:pl-10 pr-6 pt-5 pb-8 relative z-10 max-w-[75%]">
            <h1 className="text-lg sm:text-xl font-bold text-white mb-5 max-w-[75%]">
              Онлайн-платформа по поиску работы в Москве!
            </h1>
            <SearchBar query={query} setQuery={setQuery} />
          </div>

          <div className="absolute right-0 top-0 h-full w-full pointer-events-none overflow-hidden">
            <Image 
              src="/ornament.svg" 
              alt="" 
              width={390} 
              height={100} 
              className="absolute top-13 md:top-[11px] -right-[54px] w-auto h-auto object-cover object-top hidden lg:block" 
              priority 
            />
          </div>
        </div>
      </section>
      <MobileSearch query={query} setQuery={setQuery} />
    </>
  );
}