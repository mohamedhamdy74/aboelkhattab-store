"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "../../../i18n/routing";

export default function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Background elegant gradient/blur abstract shapes inspired by the brand colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[30%] h-[30%] rounded-full bg-yellow-500/20 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative w-40 h-40 pt-6 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
            <Image
              src="/images/logo.jpg"
              alt="Abu Alkhattab Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-yellow-200 via-yellow-400 to-yellow-600 pb-6 drop-shadow-sm"
        >
          {t("title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-2xl text-gray-300 max-w-2xl font-light tracking-wide mb-10"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* Contact Us - WhatsApp */}
          <a
            href="https://wa.me/201156732953"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 font-bold text-black bg-linear-to-r from-yellow-400 to-yellow-600 rounded-full overflow-hidden shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_rgba(234,179,8,0.5)] transition-all duration-300 transform hover:-translate-y-1 text-center"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-full" />
            <span className="relative z-10 text-lg md:text-xl font-cairo">{t("contactUs")}</span>
          </a>

          {/* Browse Products - Store */}
          <Link
            href="/products"
            className="px-8 py-4 font-bold text-white border-2 border-yellow-500/50 hover:border-yellow-500 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 transform hover:-translate-y-1 text-lg md:text-xl font-cairo text-center"
          >
            {t("browseProducts")}
          </Link>
        </motion.div>
      </div>

      {/* Decorative Wavy Lines (referencing logo) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 flex gap-2 child:animate-pulse"
      >
        <div className="w-16 h-1 bg-cyan-500 rounded-full opacity-50"></div>
        <div className="w-24 h-1 bg-cyan-500 rounded-full opacity-70"></div>
        <div className="w-16 h-1 bg-cyan-500 rounded-full opacity-50"></div>
      </motion.div>
    </section>
  );
}
