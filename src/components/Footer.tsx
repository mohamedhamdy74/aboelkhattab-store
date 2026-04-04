"use client";

import { useTranslations } from "next-intl";
import { MapPin, Clock, Phone, AlertTriangle, Truck } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("home.footer");
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-black text-gray-300 border-t border-white/10 relative overflow-hidden font-cairo">
      {/* Decorative Blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-[200px] bg-yellow-600/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex justify-center mb-16">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-yellow-500/50 mb-4 opacity-80">
              <Image src="/images/logo.jpg" alt="Logo" fill sizes="96px" priority className="object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-500 mb-2">{t("title")}</h3>
            <p className="text-center text-gray-400 max-w-sm mb-6">{t("desc")}</p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/profile.php?id=100054711702647&mibextid=LQQJ4d" 
                target="_blank" 
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
              >
                {/* Facebook SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/201156732953" 
                target="_blank" 
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-green-500 hover:border-green-500 transition-all duration-300"
              >
                {/* WhatsApp approximation or Message icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>

          </div>
        </div>

        <div className="mb-12">
          <h4 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4 inline-block">
            {t("branchesTitle")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Branch 1 */}
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-colors">
              <h5 className="font-bold text-white mb-4 text-lg">{t("branches.b1.name")}</h5>
              <div className="space-y-3 text-sm">
                <p className="flex items-start gap-2"><MapPin size={16} className="text-yellow-500 shrink-0 mt-1" /> <span>{t("branches.b1.address")}</span></p>
                <p className="flex items-start gap-2"><Clock size={16} className="text-cyan-400 shrink-0 mt-1" /> <span>{t("hours")} {t("branches.b1.time")}</span></p>
              </div>
            </div>

            {/* Branch 2 */}
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-colors">
              <h5 className="font-bold text-white mb-4 text-lg">{t("branches.b2.name")}</h5>
              <div className="space-y-3 text-sm">
                <p className="flex items-start gap-2"><MapPin size={16} className="text-yellow-500 shrink-0 mt-1" /> <span>{t("branches.b2.address")}</span></p>
                <p className="flex items-start gap-2"><Clock size={16} className="text-cyan-400 shrink-0 mt-1" /> <span>{t("hours")} {t("branches.b2.time")}</span></p>
              </div>
            </div>

            {/* Branch 3 */}
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-colors">
              <h5 className="font-bold text-white mb-4 text-lg">{t("branches.b3.name")}</h5>
              <div className="space-y-3 text-sm">
                <p className="flex items-start gap-2"><MapPin size={16} className="text-yellow-500 shrink-0 mt-1" /> <span>{t("branches.b3.address")}</span></p>
                <p className="flex items-start gap-2"><Phone size={16} className="text-rose-400 shrink-0 mt-1" /> <span dir="ltr">{t("branches.b3.phones")}</span></p>
                <p className="flex items-start gap-2"><Clock size={16} className="text-cyan-400 shrink-0 mt-1" /> <span>{t("hours")} {t("branches.b3.time")}</span></p>
              </div>
            </div>

            {/* Branch 4 */}
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-colors">
              <h5 className="font-bold text-white mb-4 text-lg">{t("branches.b4.name")}</h5>
              <div className="space-y-3 text-sm">
                <p className="flex items-start gap-2"><MapPin size={16} className="text-yellow-500 shrink-0 mt-1" /> <span>{t("branches.b4.address")}</span></p>
                <p className="flex items-start gap-2"><Clock size={16} className="text-cyan-400 shrink-0 mt-1" /> <span>{t("hours")} {t("branches.b4.time")}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Policy and Notice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-zinc-900/80 border border-white/5 p-6 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h5 className="font-bold text-white mb-1">{t("shippingPolicy.title")}</h5>
              <p className="text-sm text-gray-400 leading-relaxed">{t("shippingPolicy.desc")}</p>
            </div>
          </div>

          <div className="bg-rose-500/10 text-rose-300 border border-rose-500/20 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <p className="font-bold text-sm md:text-base">{t("importantNotice")}</p>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-white/10 text-sm opacity-60">
          {t("rights", { year })}
        </div>
      </div>
    </footer>
  );
}
