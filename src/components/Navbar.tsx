"use client";

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Globe, ShoppingBag, Menu, X } from 'lucide-react';
import { usePathname, useRouter, Link } from '../i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCart } from '@/store/useCart';
import CartSheet from '../modules/cart/components/CartSheet';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemsCount = useCart(state => state.getTotalCount());
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  const t = useTranslations("home");
  const navT = useTranslations("navbar");

  const navLinks = [
    { name: navT('home'), href: '/' },
    { name: navT('products'), href: '/products' },
    { name: navT('categories'), href: '/#categories' },
    { name: navT('contact'), href: '/#footer' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10"
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
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
              <span className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-200 to-yellow-600 hidden lg:block font-cairo">
                {t('brand')}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-yellow-500",
                    pathname === link.href ? "text-yellow-500" : "text-white/70"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Actions */}
            <div className="flex items-center gap-2">
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
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300"
              >
                <Globe size={18} className="text-yellow-500" />
                <span className="font-medium text-sm">
                  {locale === 'ar' ? 'English' : 'عربي'}
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 md:hidden"
              >
                {isMenuOpen ? <X size={22} className="text-yellow-500" /> : <Menu size={22} className="text-yellow-500" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-zinc-900/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium p-2 rounded-lg transition-colors",
                      pathname === link.href ? "bg-yellow-500/10 text-yellow-500" : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {/* Mobile Language Toggle */}
                <button
                  onClick={() => { toggleLanguage(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 p-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Globe size={20} className="text-yellow-500" />
                  <span className="font-medium">
                    {locale === 'ar' ? 'English Language' : 'اللغة العربية'}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
