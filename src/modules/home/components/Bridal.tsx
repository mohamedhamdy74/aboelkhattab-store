"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { CheckCircle2, MessageCircle } from "lucide-react";

export default function Bridal() {
  const t = useTranslations("home.bridal");
  const locale = useLocale();

  const handleWhatsapp = (groupTitle: string) => {
    const defaultText = locale === "ar"
      ? `مرحباً، أود الاستفسار عن: ${groupTitle}`
      : `Hello, I would like to inquire about: ${groupTitle}`;

    window.open(`https://wa.me/201156732953?text=${encodeURIComponent(defaultText)}`, "_blank");
  };

  const images = ["/images/img1.jpg", "/images/img1.jpg", "/images/img1.jpg"];

  return (
    <section className="py-24 bg-black relative overflow-hidden" id="bridal">
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-200 to-yellow-600 pb-6 font-cairo drop-shadow-md">
            {t("title")}
          </h2>
          <p className="text-yellow-100/80 max-w-2xl mx-auto text-lg md:text-xl italic">
            {t("subtitle")}
          </p>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {['g1', 'g2', 'g3'].map((groupKey, index) => {
            const features = t.raw(`groups.${groupKey}.features`) as string[];

            return (
              <motion.div
                key={groupKey}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-zinc-950/80 border border-yellow-500/20 rounded-3xl overflow-hidden shadow-2xl hover:border-yellow-500/50 transition-colors flex flex-col group"
              >
                {/* Package Image */}
                <div className="relative w-full h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-zinc-950/90 z-10" />
                  <Image
                    src={images[index]}
                    alt={t(`groups.${groupKey}.title`)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                    <h3 className="text-2xl font-bold text-white font-cairo drop-shadow-lg">
                      {t(`groups.${groupKey}.title`)}
                    </h3>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  {/* Price Badge */}
                  <div className="mb-6 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-yellow-500">{t(`groups.${groupKey}.price`)}</span>
                    <span className="text-gray-400 font-medium">{t("currency")}</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle2 className="text-cyan-400 shrink-0 mt-1" size={20} />
                        <span className="leading-relaxed text-[0.95rem]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => handleWhatsapp(t(`groups.${groupKey}.title`))}
                    className="w-full py-4 rounded-2xl bg-yellow-600 hover:bg-yellow-500 text-black font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(202,138,4,0.3)] hover:shadow-[0_0_30px_rgba(202,138,4,0.5)]"
                  >
                    <MessageCircle size={22} />
                    <span>{t("inquire")}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
