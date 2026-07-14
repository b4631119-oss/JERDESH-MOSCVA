import type { Post } from "./types";

const CATEGORY_PARENT_MAP = new Map<string, string>(
  [
    ["rabota", "vacancy"],
    ["podrabotka", "vacancy"],
    ["rabotu-ishchu", "vacancy"],
    ["komnata", "zhilye"],
    ["koiko-mesto", "zhilye"],
    ["kvartira", "zhilye"],
    ["gostinica", "zhilye"],
    ["agentstvo", "zhilye"],
    ["ishchu-kvartiru", "zhilye"],
    ["moskva-bishkek", "taxi"],
    ["gruzoperevozki", "taxi"],
    ["taxi-zaezd", "taxi"],
    ["prodam-tovar", "prodayu"],
    ["prodam-avto", "prodayu"],
    ["nedvizhimost", "prodayu"],
    ["tehnika", "prodayu"],
    ["internet-magazin", "prodayu"],
    ["tovary-kg", "prodayu"],
    ["produkty", "prodayu"],
    ["pokupayu", "prodayu"],
    ["med-uslugi", "uslugi"],
    ["krasota", "uslugi"],
    ["yurid", "uslugi"],
    ["svadba", "uslugi"],
    ["aviakassa", "uslugi"],
    ["arenda-avto", "uslugi"],
    ["taksopark", "uslugi"],
    ["drugie", "uslugi"],
    ["kursy", "obuchenie"],
    ["shkola", "obuchenie"],
    ["detskiy-sad", "obuchenie"],
    ["ishchu-dokumenty", "ishchu"],
    ["ishchu-cheloveka", "ishchu"],
    ["blagotvoritelnost", "ishchu"],
  ]
);

export type Filters = {
  query:    string;
  category: string;
  city:     string;
};

export const DEFAULT_FILTERS: Filters = {
  query:    "",
  category: "all",
  city:     "all",
};


export function filterPosts(posts: Post[], filters: Filters): Post[] {
  const query = filters.query.trim().toLowerCase();

  return posts.filter((post) => {
    const raw = post as Record<string, unknown>;
    const catId = (raw.categoryId ?? raw.categoryid ?? "") as string;
    const normalizedCategory = catId ? CATEGORY_PARENT_MAP.get(catId) ?? catId : "";
    const matchCategory =
      filters.category === "all" ||
      catId === filters.category ||
      normalizedCategory === filters.category;

    const city = (post.city ?? post.metro ?? "").toLowerCase();
    const matchCity =
      filters.city === "all" ||
      city === filters.city.toLowerCase();

    const haystack = [post.title, post.description, post.text]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchQuery = !query || haystack.includes(query);

    return matchQuery && matchCategory && matchCity;
  });
}

export function filtersToParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query)              params.set("query",    filters.query);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.city !== "all")     params.set("city",     filters.city);
  return params;
}

export function paramsToFilters(params: URLSearchParams): Filters {
  return {
    query:    params.get("query")    ?? "",
    category: params.get("category") ?? "all",
    city:     params.get("city")     ?? "all",
  };
}