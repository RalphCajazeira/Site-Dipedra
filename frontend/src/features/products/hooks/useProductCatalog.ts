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
  if (
    value === "ambientes" ||
    value === "nome" ||
    value === "tipo" ||
    value === "material" ||
    value === "chapas"
  ) {
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

    nextParams.delete("search");
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
    const query =
      searchParams.get(SEARCH_PARAM_KEYS.query) ?? searchParams.get("search") ?? "";
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
      if (activeFilter === "chapas") {
        return product.application === "Seleção de chapa";
      }

      return true;
    });

    const productsByMode = [...productsByFilter].sort((left, right) => {
      switch (activeFilter) {
        case "ambientes":
          return (
            left.environments[0]?.localeCompare(right.environments[0] ?? "", "pt-BR") ??
            left.title.localeCompare(right.title, "pt-BR")
          );
        case "nome":
          return left.legacyName.localeCompare(right.legacyName, "pt-BR");
        case "tipo":
          return left.category.localeCompare(right.category, "pt-BR");
        case "material":
          return left.title.localeCompare(right.title, "pt-BR");
        case "chapas":
          return left.title.localeCompare(right.title, "pt-BR");
        case "all":
        default:
          return left.sortPriority - right.sortPriority;
      }
    });

    const productsBySearch = normalizedQuery
      ? productsByMode.filter((product) => {
          const searchableText = normalizeValue(
            [
              product.title,
              product.legacyName,
              product.category,
              product.categorySlug,
              product.description,
              product.application,
              product.environments.join(" "),
              product.category,
              ...product.searchKeywords
            ].join(" ")
          );

          return searchableText.includes(normalizedQuery);
        })
      : productsByMode;

    if (activeFilter !== "all" && sortBy === "name-asc") {
      return productsBySearch;
    }

    return sortCatalogProducts(productsBySearch, sortBy);
  }, [activeFilter, debouncedQuery, products, sortBy]);

  const categoryCounts = useMemo<CatalogCategoryCount[]>(() => {
    const counts = new Map<CatalogCategoryCount["id"], number>([
      ["chapas", 0],
      ["quartzitos", 0],
      ["granitos", 0],
      ["marmores", 0],
      ["travertinos", 0],
      ["dolomiticos", 0],
      ["onix", 0],
      ["limestone", 0],
      ["rocha_ornamental", 0],
      ["sinteticos", 0],
      ["ultracompactos", 0],
      ["outros", 0]
    ]);

    products.forEach((product) => {
      counts.set(product.categoryGroup, (counts.get(product.categoryGroup) ?? 0) + 1);
      if (product.application === "Seleção de chapa") {
        counts.set("chapas", (counts.get("chapas") ?? 0) + 1);
      }
    });

    return [
      { id: "chapas", label: "Chapas", count: counts.get("chapas") ?? 0 },
      { id: "quartzitos", label: "Quartzitos", count: counts.get("quartzitos") ?? 0 },
      { id: "granitos", label: "Granitos", count: counts.get("granitos") ?? 0 },
      { id: "marmores", label: "Mármores", count: counts.get("marmores") ?? 0 },
      { id: "travertinos", label: "Travertinos", count: counts.get("travertinos") ?? 0 },
      { id: "dolomiticos", label: "Dolomíticos", count: counts.get("dolomiticos") ?? 0 },
      { id: "onix", label: "Ônix", count: counts.get("onix") ?? 0 },
      { id: "limestone", label: "Limestone", count: counts.get("limestone") ?? 0 },
      {
        id: "rocha_ornamental",
        label: "Rocha ornamental",
        count: counts.get("rocha_ornamental") ?? 0
      },
      { id: "sinteticos", label: "Sintéticos", count: counts.get("sinteticos") ?? 0 },
      {
        id: "ultracompactos",
        label: "UltraCompactos",
        count: counts.get("ultracompactos") ?? 0
      },
      { id: "outros", label: "Outras pedras", count: counts.get("outros") ?? 0 }
    ];
  }, [products]);

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
