"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Reviews() {
  const t = useTranslations("home.reviews");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const [index, setIndex] = useState(0);

  const images = [
    "/images/reviews.jpg",
    "/images/reviews 2.jpg"
  ];

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden" id="reviews">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="text-yellow-400 fill-yellow-400" size={24} />
            ))}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-cairo">
            {t("title")}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl">
            {t("subtitle")}
          </p>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Slider */}
        <div className="relative w-full max-w-5xl mx-auto flex items-center justify-between gap-4 md:gap-8">
          
          {/* Previous Button */}
          <button 
            onClick={locale === "ar" ? nextSlide : prevSlide}
            className="z-20 p-2 md:p-4 rounded-full bg-zinc-800/80 border border-white/10 text-white hover:bg-yellow-500 hover:text-black transition-colors backdrop-blur-md shrink-0 focus:outline-none"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="relative w-full max-w-3xl aspect-auto md:aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 bg-zinc-900 group flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-[60vh] md:h-[80vh] relative"
              >
                <Image
                  src={images[index]}
                  alt={`Review ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain w-full h-full p-4"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next Button */}
          <button 
            onClick={locale === "ar" ? prevSlide : nextSlide}
            className="z-20 p-2 md:p-4 rounded-full bg-zinc-800/80 border border-white/10 text-white hover:bg-yellow-500 hover:text-black transition-colors backdrop-blur-md shrink-0 focus:outline-none"
          >
            <ChevronRight size={28} />
          </button>

        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${index === i ? "w-8 bg-yellow-500" : "w-3 bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
