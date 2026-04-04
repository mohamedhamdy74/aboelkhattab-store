"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Reviews() {
  const t = useTranslations("home.reviews");
  const locale = useLocale();
  const [index, setIndex] = useState(0);

  const images = [
    "/images/reviews.jpg",
    "/images/reviews 2.jpg",
    "/images/reviews3.jpg",
    "/images/reviews4.jpg",
    "/images/reviews5.jpg",
    "/images/reviews6.jpg",
    "/images/reviews7.jpg",
    "/images/reviews8.jpg",
    "/images/reviews9.jpg",
    "/images/reviews10.jpg",
    "/images/reviews11.jpg",
    "/images/reviews12.jpg",
    "/images/reviews13.jpg",
    "/images/reviews14.jpg",
    "/images/reviews15.jpg",
    "/images/reviews16.jpg",
    "/images/reviews17.jpg",
    "/images/reviews18.jpg",
    "/images/reviews19.jpg",
    "/images/reviews20.jpg",
  ];

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-black relative overflow-hidden" id="reviews">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center gap-1.5 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" size={20} />
            ))}
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 font-cairo tracking-tight">
            {t("title")}
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-medium">
            {t("subtitle")}
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Slider */}
        <div className="relative w-full max-w-5xl mx-auto flex items-center justify-between gap-2 md:gap-8">
          
          {/* Previous Button */}
          <button 
            onClick={locale === "ar" ? nextSlide : prevSlide}
            className="z-20 p-2 md:p-5 rounded-full bg-zinc-900/80 border border-white/10 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300 backdrop-blur-xl shrink-0 focus:outline-none shadow-2xl active:scale-90"
          >
            <ChevronLeft size={24} className="md:w-7 md:h-7" />
          </button>

          <div className="relative w-full aspect-auto rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/5 bg-zinc-950/50 group flex items-center justify-center backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -10 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-[80vh] md:h-[100vh] relative p-1 md:p-4 cursor-zoom-in"
              >
                <Image
                  src={images[index]}
                  alt={`Customer Review ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  className="object-contain w-full h-full p-2 md:p-8"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Corner decorative accents */}
            <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-xl pointer-events-none" />
          </div>

          {/* Next Button */}
          <button 
            onClick={locale === "ar" ? prevSlide : nextSlide}
            className="z-20 p-2 md:p-5 rounded-full bg-zinc-900/80 border border-white/10 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300 backdrop-blur-xl shrink-0 focus:outline-none shadow-2xl active:scale-90"
          >
            <ChevronRight size={24} className="md:w-7 md:h-7" />
          </button>

        </div>

        {/* Indicators and Counter */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="text-yellow-500/60 font-mono font-bold tracking-widest text-sm">
            {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === i 
                  ? "w-8 bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.5)]" 
                  : "w-2 bg-white/10 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
