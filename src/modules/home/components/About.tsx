"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { HeartHandshake, Award, Clock } from "lucide-react";

export default function About() {
  const t = useTranslations("home.about");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <section className="py-24 relative overflow-hidden bg-black text-white">
      {/* Background elegant lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[30vh] h-[30vh] bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[30vh] h-[30vh] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image & Logo Composition */}
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-[2.5rem] p-1 bg-linear-to-tr from-yellow-600 via-yellow-400 to-transparent">
              <div className="w-full h-full bg-zinc-950 rounded-[2.3rem] overflow-hidden relative flex items-center justify-center p-8">
                {/* We use the logo as the main visual for the about section with dark elegant backdrop */}
                <Image
                  src="/images/logo.jpg"
                  alt={t("title")}
                  fill
                  className="object-cover opacity-30 scale-125 blur-sm"
                />
                <div className="relative z-10 w-64 h-64 rounded-full overflow-hidden border-4 border-yellow-500/80 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                  <Image
                    src="/images/logo.jpg"
                    alt={t("title")}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col space-y-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400 mb-4 inline-block font-cairo">
                {t("title")}
              </h2>
              <div className="w-20 h-1 bg-yellow-500 rounded-full" />
            </div>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
              {t("p1")}
            </p>

            <p className="text-xl md:text-2xl text-yellow-100/80 leading-relaxed italic">
              {t("p2")}
            </p>

            {/* Quick Stats/Features */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div className="flex flex-col gap-2">
                <Clock className="text-yellow-500" size={32} />
                <span className="font-semibold text-white">{t("stats.experience")}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Award className="text-cyan-400" size={32} />
                <span className="font-semibold text-white">{t("stats.quality")}</span>
              </div>
              <div className="flex flex-col gap-2">
                <HeartHandshake className="text-rose-400" size={32} />
                <span className="font-semibold text-white">{t("stats.handmade")}</span>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
