import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type {
  CatalogCategoryCount,
  CatalogGroupId,
  CatalogProduct,
  CatalogSortId
} from "../types";

const SEARCH_PARAM_KEYS = {
  filter: "filter",
  query: "q",
  sort: "sort"
} as const;

function normalizeValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function parseFilter(value: string | null): CatalogGroupId {
  if (value === "naturais" || value === "industrializadas" || value === "outros") {
    return value;
  }

  return "all";
}

function parseSort(value: string | null): CatalogSortId {
  if (value === "name-desc" || value === "category") {
    return value;
  }

  return "name-asc";
}

function getNextSearchParams(
  currentParams: URLSearchParams,
  updates: Partial<Record<keyof typeof SEARCH_PARAM_KEYS, string>>
) {
  const nextParams = new URLSearchParams(currentParams);

  if (updates.filter !== undefined) {
    if (updates.filter && updates.filter !== "all") {
      nextParams.set(SEARCH_PARAM_KEYS.filter, updates.filter);
    } else {
      nextParams.delete(SEARCH_PARAM_KEYS.filter);
    }
  }

  if (updates.query !== undefined) {
    const normalizedQuery = updates.query.trim();

    if (normalizedQuery) {
      nextParams.set(SEARCH_PARAM_KEYS.query, normalizedQuery);
    } else {
      nextParams.delete(SEARCH_PARAM_KEYS.query);
    }
  }

  if (updates.sort !== undefined) {
    if (updates.sort && updates.sort !== "name-asc") {
      nextParams.set(SEARCH_PARAM_KEYS.sort, updates.sort);
    } else {
      nextParams.delete(SEARCH_PARAM_KEYS.sort);
    }
  }

  return nextParams;
}

function sortCatalogProducts(products: CatalogProduct[], sort: CatalogSortId) {
  const sortable = [...products];

  switch (sort) {
    case "name-desc":
      return sortable.sort((left, right) => right.title.localeCompare(left.title, "pt-BR"));
    case "category":
      return sortable.sort((left, right) => {
        const byCategory = left.category.localeCompare(right.category, "pt-BR");

        if (byCategory !== 0) {
          return byCategory;
        }

        return left.sortPriority - right.sortPriority;
      });
    case "name-asc":
    default:
      return sortable.sort((left, right) => left.title.localeCompare(right.title, "pt-BR"));
  }
}

type UseProductCatalogArgs = {
  products: CatalogProduct[];
};

export function useProductCatalog({ products }: UseProductCatalogArgs) {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsSnapshot = searchParams.toString();
  const initialParams = useMemo(() => {
    const filter = parseFilter(searchParams.get(SEARCH_PARAM_KEYS.filter));
    const query = searchParams.get(SEARCH_PARAM_KEYS.query) ?? "";
    const sort = parseSort(searchParams.get(SEARCH_PARAM_KEYS.sort));

    return { filter, query, sort };
  }, [paramsSnapshot]);

  const [activeFilter, setActiveFilterState] = useState<CatalogGroupId>(initialParams.filter);
  const [queryInput, setQueryInput] = useState(initialParams.query);
  const [sortBy, setSortByState] = useState<CatalogSortId>(initialParams.sort);
  const [debouncedQuery, setDebouncedQuery] = useState(initialParams.query);
  const [isLoading, setIsLoading] = useState(false);
  const didMountRef = useRef(false);

  const commitSearchParams = (updates: Partial<Record<keyof typeof SEARCH_PARAM_KEYS, string>>) => {
    const nextParams = getNextSearchParams(searchParams, updates);

    if (nextParams.toString() !== paramsSnapshot) {
      setSearchParams(nextParams, { replace: true });
    }
  };

  useEffect(() => {
    setActiveFilterState(initialParams.filter);
    setSortByState(initialParams.sort);
    setQueryInput(initialParams.query);
    setDebouncedQuery(initialParams.query);
  }, [initialParams.filter, initialParams.query, initialParams.sort]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(queryInput);
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [queryInput]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    setIsLoading(true);
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeFilter, debouncedQuery, sortBy]);

  useEffect(() => {
    commitSearchParams({
      filter: activeFilter,
      query: debouncedQuery,
      sort: sortBy
    });
  }, [activeFilter, debouncedQuery, paramsSnapshot, searchParams, sortBy]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeValue(debouncedQuery);

    const productsByFilter = products.filter((product) => {
      return activeFilter === "all" ? true : product.categoryGroup === activeFilter;
    });

    const productsBySearch = normalizedQuery
      ? productsByFilter.filter((product) => {
          const searchableText = normalizeValue(
            [
              product.title,
              product.category,
              product.categorySlug,
              product.description,
              product.application,
              ...product.searchKeywords
            ].join(" ")
          );

          return searchableText.includes(normalizedQuery);
        })
      : productsByFilter;

    return sortCatalogProducts(productsBySearch, sortBy);
  }, [activeFilter, debouncedQuery, products, sortBy]);

  const categoryCounts = useMemo<CatalogCategoryCount[]>(() => {
    const counts = new Map<CatalogCategoryCount["id"], number>([
      ["naturais", 0],
      ["industrializadas", 0],
      ["outros", 0]
    ]);

    filteredProducts.forEach((product) => {
      counts.set(product.categoryGroup, (counts.get(product.categoryGroup) ?? 0) + 1);
    });

    return [
      { id: "naturais", label: "Pedras Naturais", count: counts.get("naturais") ?? 0 },
      {
        id: "industrializadas",
        label: "Industrializadas",
        count: counts.get("industrializadas") ?? 0
      },
      { id: "outros", label: "Outras categorias", count: counts.get("outros") ?? 0 }
    ];
  }, [filteredProducts]);

  const hasPendingSearch = queryInput !== debouncedQuery;

  return {
    activeFilter,
    categoryCounts,
    clearQuery: () => {
      setQueryInput("");
      setDebouncedQuery("");
      commitSearchParams({ query: "" });
    },
    filteredProducts,
    isLoading: isLoading || hasPendingSearch,
    queryInput,
    resetCatalog: () => {
      setActiveFilterState("all");
      setQueryInput("");
      setDebouncedQuery("");
      setSortByState("name-asc");
      commitSearchParams({ filter: "all", query: "", sort: "name-asc" });
    },
    setActiveFilter: (filter: CatalogGroupId) => {
      setActiveFilterState(filter);
      commitSearchParams({ filter, query: queryInput });
    },
    setQueryInput,
    setSortBy: (sort: CatalogSortId) => {
      setSortByState(sort);
      commitSearchParams({ sort, query: queryInput });
    },
    sortBy,
    totalFound: filteredProducts.length,
    totalProducts: products.length
  };
}
