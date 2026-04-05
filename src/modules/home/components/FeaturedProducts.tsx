"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { ShoppingBag, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "../../../i18n/routing";
import { useCart } from "@/store/useCart";
import { useState, useRef, useEffect } from "react";

import { Category, Product, ProductVariant } from "@prisma/client";

type ProductWithDetails = Product & {
  category: Category;
  variants: ProductVariant[];
};

export default function FeaturedProducts({ products }: { products: ProductWithDetails[] }) {
  const t = useTranslations("home.featured");
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Responsive items per view
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerView);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden" id="featured-products">
      {/* Background Decorative Blurs */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 font-cairo tracking-tight">
              {t("title")}
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-medium">
              {t("subtitle")}
            </p>
            <div className="w-20 h-1.5 bg-yellow-500 rounded-full mt-6 mx-auto" />
          </motion.div>
        </div>

        {/* Slider Window */}
        <div className="relative overflow-visible lg:overflow-clip -mx-4 px-4 h-full min-h-[500px]">
          <motion.div
            ref={containerRef}
            animate={{ x: `-${index * 100}%` }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="flex gap-6 h-full"
            style={{ direction: 'ltr' }}
          >
            {products.map((product) => {
              const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
              return (
                <div 
                  key={product.id} 
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                >
                  <Link href={`/products/${product.id}` as any}>
                    <motion.div
                      whileHover={{ y: -10 }}
                      className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden group hover:border-yellow-500/30 transition-all duration-500 shadow-2xl h-full flex flex-col"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square overflow-hidden bg-zinc-950">
                        <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                        <Image 
                          src={product.image || "/images/img1.jpg"} 
                          alt={locale === "ar" ? product.nameAr : product.nameEn} 
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute top-4 left-4 z-20">
                          <span className="px-4 py-1.5 bg-black/60 backdrop-blur-xl text-yellow-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-yellow-500/20">
                            {locale === "ar" ? product.category.nameAr : product.category.nameEn}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-black text-white mb-3 font-cairo line-clamp-1 group-hover:text-yellow-400 transition-colors duration-300">
                          {locale === "ar" ? product.nameAr : product.nameEn}
                        </h3>
                        
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                          <div className="flex flex-col">
                            <span className="text-2xl font-black text-yellow-500 tracking-tight">
                              {defaultVariant?.price || 0}
                              <span className="text-xs font-bold text-zinc-500 ms-1 uppercase">{t("currency")}</span>
                            </span>
                          </div>
                          <AddToCartButton product={product} variant={defaultVariant} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Navigation Controls - Moved to Bottom */}
        <div className="flex flex-col items-center gap-12 mt-12">
          <div className="flex items-center justify-center gap-6" dir="ltr">
            <button 
              onClick={prevSlide}
              className="p-5 rounded-full bg-zinc-900 border border-white/5 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-2xl active:scale-95 group"
            >
              <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex gap-2">
               {Array.from({ length: totalPages }).map((_, i) => (
                 <div 
                   key={i} 
                   className={`h-2 rounded-full transition-all duration-500 ${index === i ? 'w-10 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'w-2 bg-white/10'}`}
                 />
               ))}
            </div>
            <button 
              onClick={nextSlide}
              className="p-5 rounded-full bg-zinc-900 border border-white/5 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-2xl active:scale-95 group"
            >
              <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Footer CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              href="/products"
              className="flex items-center gap-4 px-10 py-5 rounded-full border-2 border-yellow-500/30 hover:border-yellow-500 text-yellow-500 hover:text-black hover:bg-yellow-500 font-black transition-all duration-500 group shadow-lg"
            >
              <span className="font-cairo text-lg tracking-tight">{t("viewAll")}</span>
              {locale === "ar" ? (
                <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              )}
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

function AddToCartButton({ product, variant }: { product: any, variant: any }) {
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
      className="w-12 h-12 rounded-2xl bg-zinc-800 hover:bg-yellow-500 flex items-center justify-center text-white hover:text-black transition-all duration-300 border border-white/5 hover:border-yellow-500 shadow-xl active:scale-90"
    >
      <ShoppingBag size={20} />
    </button>
  );
}

