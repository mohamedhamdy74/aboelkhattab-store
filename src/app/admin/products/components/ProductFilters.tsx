"use client";

import { Search, Grid2X2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function ProductFilters({
  categories,
  searchTerm,
  categoryId,
}: {
  categories: { id: string; nameAr: string }[];
  searchTerm: string;
  categoryId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleCategoryChange = (cid: string) => {
    const params = new URLSearchParams(searchParams);
    if (cid && cid !== "all") {
      params.set("category", cid);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-opacity ${isPending ? "opacity-60" : "opacity-100"}`}>
      <div className="md:col-span-2 relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          defaultValue={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="ابحث باسم المنتج..."
          className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
        />
      </div>

      <div className="relative">
        <select
          value={categoryId || "all"}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition appearance-none cursor-pointer"
        >
          <option value="all">كل الأقسام</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
          ))}
        </select>
        <Grid2X2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
      </div>
    </div>
  );
}
