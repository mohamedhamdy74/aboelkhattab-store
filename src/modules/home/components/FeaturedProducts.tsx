"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "../../../i18n/routing";
import { useCart } from "@/store/useCart";

import { Category, Product, ProductVariant } from "@prisma/client";

type ProductWithDetails = Product & {
  category: Category;
  variants: ProductVariant[];
};

export default function FeaturedProducts({ products }: { products: ProductWithDetails[] }) {
  const t = useTranslations("home.featured");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden" id="featured-products">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-cairo">
            {t("title")}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t("subtitle")}
          </p>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => {
            const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
            
            return (
              <Link key={product.id} href={`/products/${product.id}` as any}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-black border border-white/10 rounded-2xl overflow-hidden group hover:border-yellow-500/30 transition-colors shadow-lg cursor-pointer h-full"
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-900">
                    <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                    <Image 
                      src={product.image || "/images/img1.jpg"} 
                      alt={locale === "ar" ? product.nameAr : product.nameEn} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20">
                        {locale === "ar" ? product.category.nameAr : product.category.nameEn}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 font-cairo line-clamp-1">
                      {locale === "ar" ? product.nameAr : product.nameEn}
                    </h3>
                    <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-yellow-500">
                          {defaultVariant?.price || 0} <span className="text-sm font-medium text-gray-400">{t("currency")}</span>
                        </span>
                      </div>
                      <AddToCartButton product={product} variant={defaultVariant} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <Link 
            href="/products"
            className="flex items-center gap-3 px-8 py-4 rounded-full border-2 border-yellow-500/50 hover:border-yellow-500 text-yellow-500 hover:text-black hover:bg-yellow-500 font-bold transition-all duration-300 group"
          >
            <span className="font-cairo text-lg">{t("viewAll")}</span>
            {locale === "ar" ? (
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            )}
          </Link>
        </motion.div>

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
      className="w-10 h-10 rounded-full bg-white/5 hover:bg-yellow-500 flex items-center justify-center text-white hover:text-black transition-colors border border-white/10 hover:border-yellow-500"
    >
      <ShoppingBag size={18} />
    </button>
  );
}

