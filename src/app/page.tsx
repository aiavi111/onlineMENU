"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Dish } from "@/types";
import { CATEGORIES, fetchMenu } from "@/data/menu";
import { Hero } from "@/components/hero";
import { SearchBar, type SortId } from "@/components/search-bar";
import { CategoryNav, type CategoryFilter } from "@/components/category-nav";
import { DishGrid } from "@/components/dish-grid";
import { DishSheet } from "@/components/dish-sheet";
import { CartFab } from "@/components/cart/cart-fab";
import { CartSheet } from "@/components/cart/cart-sheet";
import { RESTAURANT } from "@/data/menu";

export default function HomePage() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState<SortId>("recommended");
  const [activeDish, setActiveDish] = useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const { data: dishes, isLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenu,
  });

  const filtered = useMemo(() => {
    let list = dishes ?? [];
    if (category !== "all") list = list.filter((d) => d.category === category);
    if (vegOnly) list = list.filter((d) => d.badges.includes("veg"));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.ingredients.some((i) => i.toLowerCase().includes(q)),
      );
    }
    switch (sort) {
      case "price":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort(
          (a, b) =>
            Number(b.badges.includes("popular")) -
            Number(a.badges.includes("popular")),
        );
    }
    return list;
  }, [dishes, category, vegOnly, query, sort]);

  const heading =
    category === "all"
      ? "Всё меню"
      : CATEGORIES.find((c) => c.id === category)?.label ?? "Меню";

  const resetAll = () => {
    setQuery("");
    setVegOnly(false);
    setSort("recommended");
    setCategory("all");
  };

  return (
    <>
      <main className="pb-36">
        <Hero />
        <SearchBar
          query={query}
          onQuery={setQuery}
          vegOnly={vegOnly}
          onVegOnly={setVegOnly}
          sort={sort}
          onSort={setSort}
        />
        <CategoryNav active={category} onChange={setCategory} />
        <DishGrid
          dishes={filtered}
          loading={isLoading}
          heading={heading}
          onOpen={setActiveDish}
          onReset={resetAll}
        />
        <footer className="px-5 pt-12 text-center text-[12px] font-medium text-dim">
          Mubarak · Чайхана
          <br />
          {RESTAURANT.address} · Ежедневно {RESTAURANT.hours}
        </footer>
      </main>

      <DishSheet dish={activeDish} onClose={() => setActiveDish(null)} />
      <CartFab onOpen={() => setCartOpen(true)} hidden={cartOpen || !!activeDish} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
