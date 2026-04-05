"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Category } from "@prisma/client";
import Image from "next/image";
import { Link } from "../../../i18n/routing";

const staticColors = [
  "from-amber-400 to-orange-500",
  "from-red-500 to-rose-600",
  "from-blue-400 to-cyan-500",
  "from-green-400 to-emerald-500",
  "from-purple-400 to-fuchsia-500",
  "from-pink-400 to-rose-400"
];

export default function Categories({ categories }: { categories: Category[] }) {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section id="categories" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Decorative stars/particles */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] mask-[radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t("categoriesTitle")}
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat, index) => {
            const color = staticColors[index % staticColors.length];
            const delay = 0.1 * (index + 1);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: delay }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >
                <Link href={`/products?category=${cat.id}` as any}>
                  <div className={`absolute inset-0 bg-linear-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl blur-lg ${color}`}></div>
                    <div className="relative aspect-square w-full bg-zinc-900 border border-zinc-800/50 hover:border-yellow-500/30 transition-colors duration-500 rounded-3xl flex flex-col overflow-hidden">
                    
                    {/* Full image background */}
                    {cat.image ? (
                          <Image 
                            src={cat.image} 
                            fill 
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw" 
                            className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100" 
                            alt={locale === "ar" ? cat.nameAr : cat.nameEn} 
                          />
                    ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800/30">
                              <Sparkles size={32} className="text-zinc-600 mb-2" strokeWidth={1} />
                          </div>
                    )}

                    {/* Gradient Overlay for Text */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 duration-500" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col items-center text-center">
                      <h3 className="text-lg md:text-xl font-black text-white group-hover:text-yellow-400 transition-colors duration-300 mb-1 drop-shadow-lg font-cairo">
                          {locale === "ar" ? cat.nameAr : cat.nameEn}
                      </h3>
                      
                      {/* View Button - appearing on hover */}
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-yellow-500 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <span>{locale === "ar" ? "تسوق الآن" : "Shop now"}</span>
                          {locale === "ar" ? <ArrowLeft size={10} /> : <ArrowRight size={10} />}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
