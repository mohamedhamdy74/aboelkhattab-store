"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "../../../i18n/routing";
import { useState, useEffect } from "react";

export default function Hero() {
  const t = useTranslations("home");
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "/images/slide1.jpg",
    "/images/slide2.jpg",
    "/images/slide3.jpg",
    "/images/slide4.jpg",
    "/images/slide5.jpg",
    "/images/slide8.jpg",
    "/images/slide9.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide]}
              alt="Background"
              fill
              sizes="100vw"
              className="object-cover opacity-60"
              priority
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-black/90" />
            <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_0%,black_100%) opacity-60" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center mt-20">
        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-yellow-500/30 shadow-2xl shadow-yellow-500/20 backdrop-blur-sm">
            <Image
              src="/images/logo.jpg"
              alt="Abu Alkhattab Logo"
              fill
              sizes="(max-width: 768px) 160px, 224px"
              className="object-cover scale-110"
              priority
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-yellow-100 via-yellow-400 to-yellow-600 pb-6 drop-shadow-2xl"
        >
          {t("title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-2xl text-zinc-100 max-w-2xl font-medium tracking-wide mb-12 drop-shadow-md"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 mb-12"
        >
          {/* Contact Us - WhatsApp */}
          <a
            href="https://wa.me/201156732953"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-10 py-5 font-black text-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.3)] hover:shadow-[0_0_80px_rgba(234,179,8,0.5)] transition-all duration-500 scale-100 hover:scale-105 active:scale-95 text-center min-w-[220px]"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-full" />
            <span className="relative z-10 text-xl font-cairo tracking-tight">{t("contactUs")}</span>
          </a>

          {/* Browse Products - Store */}
          <Link
            href="/products"
            className="px-10 py-5 font-black text-white border-2 border-yellow-500/50 hover:border-yellow-500 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-500 transform hover:scale-105 active:scale-95 text-xl font-cairo text-center bg-black/30 backdrop-blur-md min-w-[220px]"
          >
            {t("browseProducts")}
          </Link>
        </motion.div>
      </div>

      {/* Decorative Wavy Lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-16 flex gap-3"
      >
        <div className="w-16 h-1 bg-yellow-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="w-24 h-1 bg-yellow-400 rounded-full opacity-50 animate-pulse delay-75"></div>
        <div className="w-16 h-1 bg-yellow-600 rounded-full opacity-30 animate-pulse delay-150"></div>
      </motion.div>
    </section>
  );
}
