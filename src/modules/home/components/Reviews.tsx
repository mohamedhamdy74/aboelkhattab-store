"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from "lucide-react";
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
      {/* Decorative dynamic backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left Column: Title and Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/3 text-center lg:text-right rtl:lg:text-right ltr:lg:text-left overflow-x-hidden"
          >
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-8 font-cairo leading-tight">
              {t("title")}
            </h2>

            <p className="text-zinc-400 text-lg md:text-2xl font-medium leading-relaxed mb-10 max-w-xl">
              {t("subtitle")}
            </p>

            {/* Navigation Arrows for Desktop (Lateral) - Forced LTR to keep icons pointing outward */}
            <div className="hidden lg:flex items-center gap-6 mt-16" dir="ltr">
              <button
                onClick={prevSlide}
                className="p-5 rounded-full bg-zinc-900 border border-white/5 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-2xl active:scale-90 group"
              >
                <ChevronLeft size={28} className="transition-transform group-hover:-translate-x-1" />
              </button>
              <button
                onClick={nextSlide}
                className="p-5 rounded-full bg-zinc-900 border border-white/5 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-2xl active:scale-90 group"
              >
                <ChevronRight size={28} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Immersive Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-2/3 w-full relative"
          >
            <div className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-zinc-950/40 border border-white/5 shadow-[0_0_120px_rgba(0,0,0,0.7)] backdrop-blur-sm group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-[75vh] md:h-[90vh] relative"
                >
                  <Image
                    src={images[index]}
                    alt={`Review ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain w-full h-full p-4 md:p-12"
                    priority
                  />

                  {/* Decorative element */}
                  <div className="absolute top-8 right-8 text-yellow-500/20 pointer-events-none opacity-30">
                    <Quote size={80} />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Floating Mobile Controls overlay - Forced LTR for outward arrows */}
              <div className="absolute inset-x-0 bottom-12 flex justify-center lg:hidden px-6 gap-6" dir="ltr">
                <button
                  onClick={nextSlide}
                  className="p-4 rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-xl shadow-2xl active:scale-90"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={prevSlide}
                  className="p-4 rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-xl shadow-2xl active:scale-90"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Dots / Indicators */}
            <div className="flex justify-center lg:justify-start gap-2.5 mt-8 px-4 ltr:lg:justify-end rtl:lg:justify-end">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${index === i
                      ? "w-10 bg-yellow-500"
                      : "w-2 bg-white/10 hover:bg-white/30"
                    }`}
                />
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
