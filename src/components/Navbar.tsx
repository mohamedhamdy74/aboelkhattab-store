"use client";

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Globe, ShoppingBag } from 'lucide-react';
import { usePathname, useRouter, Link } from '../i18n/routing';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCart } from '@/store/useCart';
import CartSheet from '../modules/cart/components/CartSheet';

export default function Navbar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItemsCount = useCart(state => state.getTotalCount());
  
  // To avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  const t = useTranslations("home");

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10"
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-500/50">
              <Image 
                src="/images/logo.jpg" 
                alt="Logo" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-200 to-yellow-600 hidden sm:block font-cairo">
              {t('brand')}
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 ring-offset-black focus:ring-2 focus:ring-yellow-500 ring-inset"
            >
              <ShoppingBag size={20} className="text-yellow-500" />
              {mounted && cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300"
            >
              <Globe size={18} className="text-yellow-500" />
              <span className="font-medium text-xs sm:text-sm">
                {locale === 'ar' ? 'English' : 'عربي'}
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

