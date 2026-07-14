"use client";

import { useState } from "react";
import { SlidersHorizontal, Search, ChevronLeft, ChevronRight } from "lucide-react";
import CardList from "../cards/Cardlist";
import type { Post } from "../../lib/types";

const POSTS_PER_PAGE = 10; 
type Props = {
  posts: Post[];
  onFilterClick: () => void;
  onResetFilters: () => void;
};

export default function Feed({ posts, onFilterClick, onResetFilters }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);


  const activePage = currentPage > totalPages ? 1 : currentPage;

  const indexOfLastPost = activePage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="flex items-center justify-between mt-4 mb-3">
        <h2 className="text-base font-bold text-gray-800">
          Последние объявления
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={onFilterClick}
            className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={16} />
            Фильтр
          </button>
          <span className="text-sm text-gray-400">
            {posts.length} объявлений
          </span>
        </div>
      </div>

      {posts.length > 0 ? (
        <>
          <CardList posts={currentPosts} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 mb-6">

              <button
                onClick={() => handlePageChange(activePage - 1)}
                disabled={activePage === 1}
                className={`p-2 rounded-xl border border-gray-200 transition-colors cursor-pointer ${activePage === 1
                    ? "opacity-40 cursor-not-allowed bg-gray-50 text-gray-400"
                    : "hover:bg-blue-50 hover:text-blue-500 hover:border-blue-300 text-gray-600 bg-white"
                  }`}
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${activePage === pageNumber
                        ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-100"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-300"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(activePage + 1)}
                disabled={activePage === totalPages}
                className={`p-2 rounded-xl border border-gray-200 transition-colors cursor-pointer ${activePage === totalPages
                    ? "opacity-40 cursor-not-allowed bg-gray-50 text-gray-400"
                    : "hover:bg-blue-50 hover:text-blue-500 hover:border-blue-300 text-gray-600 bg-white"
                  }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed my-6">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Ничего не найдено</h3>
          <p className="text-sm text-gray-500 max-w-sm mb-5">
            По вашему запросу нет объявлений. Попробуйте изменить параметры поиска или сбросить фильтры.
          </p>
          <button
            onClick={onResetFilters}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Сбросить все фильтры
          </button>
        </div>
      )}
    </>
  );
}