"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Filters,
  DEFAULT_FILTERS,
  filterPosts,
  filtersToParams,
  paramsToFilters,
} from "../lib/filters";
import type { Post } from "../lib/types";

export function useFilters(initialPosts: Post[] = []) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>(() =>
    paramsToFilters(new URLSearchParams(searchParams.toString()))
  );

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const filteredPosts = useMemo(
    () => filterPosts(initialPosts, filters),
    [initialPosts, filters]
  );

  const goToFilter = () => {
    const params = filtersToParams(filters);
    router.push(`/filter?${params.toString()}`);
  };

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    filteredPosts,
    goToFilter,
  };
}