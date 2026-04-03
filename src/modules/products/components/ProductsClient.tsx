"use client";

import { useState, useMemo, useEffect } from "react";
import { useLocale } from "next-intl";
import { Category, Product, ProductVariant } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search, X, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "../../../i18n/routing";
import { useCart } from "@/store/useCart";

type ProductWithDetails = Product & {
  category: Category;
  variants: ProductVariant[];
};

interface Props {
  initialProducts: ProductWithDetails[];
  categories: Category[];
  selectedCategory: Category | null | undefined;
  initialSearch: string;
  initialCategoryId: string;
  currentPage: number;
  totalPages: number;
}

export default function ProductsClient({ initialProducts, categories, selectedCategory, initialSearch, initialCategoryId, currentPage, totalPages }: Props) {
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Proper debounce with useEffect - only reacts to searchTerm changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch) return initialProducts;
    const q = debouncedSearch.toLowerCase();
    return initialProducts.filter((p) =>
      p.nameAr.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      (p.descriptionAr && p.descriptionAr.toLowerCase().includes(q)) ||
      (p.descriptionEn && p.descriptionEn.toLowerCase().includes(q))
    );
  }, [initialProducts, debouncedSearch]);

  // Build category link href
  const getPageHref = (page: number) => {
    let url = `/products?page=${page}`;
    if (initialCategoryId) url += `&category=${initialCategoryId}`;
    if (initialSearch) url += `&q=${encodeURIComponent(initialSearch)}`;
    return url;
  };

  const getCategoryHref = (catId?: string) => {
    if (!catId) return "/products";
    return `/products?category=${catId}${initialSearch ? `&q=${encodeURIComponent(initialSearch)}` : ""}`;
  };

  return (
    <div className="space-y-12">
      {/* Search and Filter Section */}
      {/* ... (Search input and categories) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl relative z-20">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder={locale === "ar" ? "ابحث عن منتجات، عطور، بخور..." : "Search for products..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            <Link
              href="/products"
              className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all duration-300 border ${!initialCategoryId ? "bg-yellow-500 text-black border-yellow-500" : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700"}`}
            >
              {locale === "ar" ? "الكل" : "All"}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={getCategoryHref(cat.id) as any}
                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all duration-300 border ${initialCategoryId === cat.id ? "bg-yellow-500 text-black border-yellow-500" : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700"}`}
              >
                {locale === "ar" ? cat.nameAr : cat.nameEn}
              </Link>
            ))}
          </div>
          
        </div>
      </div>

      {/* Category Description Section */}
      {selectedCategory && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-4xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-stretch"
        >
          {selectedCategory.image && (
            <div className="relative w-full md:w-1/3 aspect-4/3 md:aspect-auto">
              <Image src={selectedCategory.image} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" alt="Category" />
              <div className="absolute inset-0 bg-linear-to-r from-zinc-900 via-transparent to-transparent md:bg-linear-to-l" />
            </div>
          )}
          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              {locale === "ar" ? selectedCategory.nameAr : selectedCategory.nameEn}
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed font-medium">
              {locale === "ar" ? ((selectedCategory as any).descriptionAr || "لا يوجد وصف متاح") : ((selectedCategory as any).descriptionEn || "No description available")}
            </p>
          </div>
        </motion.div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 && (
         <div className="w-full py-24 flex flex-col items-center justify-center text-zinc-500">
             <Search size={48} className="mb-4 opacity-50" />
             <h3 className="text-xl font-bold">{locale === 'ar' ? 'لم يتم العثور على منتجات' : 'No products found'}</h3>
         </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => {
            const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
            
            return (
              <Link key={product.id} href={`/products/${product.id}` as any}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-yellow-500/30 transition-colors shadow-lg flex flex-col cursor-pointer h-full"
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-950">
                    <Image 
                      src={product.image || "/images/img1.jpg"} 
                      alt={locale === "ar" ? product.nameAr : product.nameEn} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20">
                        {locale === "ar" ? product.category.nameAr : product.category.nameEn}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                      {locale === "ar" ? product.nameAr : product.nameEn}
                    </h3>
                    {defaultVariant?.price && (
                      <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4">
                        <span className="text-xl font-bold text-yellow-500">
                          {defaultVariant.price} <span className="text-sm font-medium text-zinc-500">EGP</span>
                        </span>
                        <AddToCartButton 
                          product={product} 
                          variant={defaultVariant} 
                          locale={locale as any} 
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16 pb-12">
          {/* Previous Button */}
          {currentPage > 1 && (
            <Link 
              href={getPageHref(currentPage - 1) as any}
              className="flex items-center justify-center min-w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:border-yellow-500/50 hover:text-yellow-500 transition-all font-bold group"
            >
              <ChevronLeft size={20} />
            </Link>
          )}

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={getPageHref(p) as any}
                className={`flex items-center justify-center min-w-12 h-12 rounded-xl border font-bold transition-all ${
                  p === currentPage
                    ? "bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>

          {/* Next Button */}
          {currentPage < totalPages && (
            <Link 
              href={getPageHref(currentPage + 1) as any}
              className="flex items-center justify-center min-w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:border-yellow-500/50 hover:text-yellow-500 transition-all font-bold group"
            >
              <ChevronRight size={20} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function AddToCartButton({ product, variant, locale }: { product: any, variant: any, locale: "ar" | "en" }) {
  const addItem = useCart(state => state.addItem);
  
  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
          id: `${variant.id}-${product.id}`,
          productId: product.id,
          variantId: variant.id,
          nameAr: product.nameAr,
          nameEn: product.nameEn,
          sizeAr: variant.sizeAr,
          sizeEn: variant.sizeEn,
          image: product.image,
          price: variant.price,
          quantity: 1
        });
      }}
      className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-yellow-500 flex items-center justify-center text-white hover:text-black transition-colors"
    >
      <ShoppingBag size={18} />
    </button>
  );
}
