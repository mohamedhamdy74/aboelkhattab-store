"use client";

import { useCart } from "@/store/useCart";
import { X, ShoppingBag, Plus, Minus, Trash2, MessageCircle, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const WHATSAPP_NUMBER = "201156732953";

export default function CartSheet({ isOpen, onClose }: Props) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCheckout = () => {
    if (items.length === 0) return;

    let message = isAr 
      ? `🛒 *طلب جديد من متجر أبو الخطاب*\n\n`
      : `🛒 *New Order from Abu Alkhattab Store*\n\n`;

    items.forEach((item, index) => {
      message += `--------------------------\n`;
      message += isAr
        ? `${index + 1}. *المنتج:* ${item.nameAr}\n` +
          `📏 *الحجم:* ${item.sizeAr}\n` +
          `🔢 *الكمية:* ${item.quantity}\n` +
          `💰 *السعر:* ${item.price * item.quantity} جنيه\n`
        : `${index + 1}. *Product:* ${item.nameEn}\n` +
          `📏 *Size:* ${item.sizeEn}\n` +
          `🔢 *Quantity:* ${item.quantity}\n` +
          `💰 *Price:* ${item.price * item.quantity} EGP\n`;
    });

    message += `--------------------------\n`;
    message += isAr
      ? `\n💵 *إجمالي المنتجات:* ${getTotalPrice()} جنيه\n` +
        `🚚 *ملاحظة:* سيتم إضافة تكلفة الشحن حسب المنطقة\n\n` +
        `يرجى ملء البيانات التالية:\n` +
        `👤 الاسم:\n` +
        `📱 الهاتف:\n` +
        `📍 العنوان بالتفصيل:`
      : `\n💵 *Total Price:* ${getTotalPrice()} EGP\n` +
        `🚚 *Note:* Shipping cost will be added based on location.\n\n` +
        `Please provide your details:\n` +
        `👤 Name:\n` +
        `📱 Phone:\n` +
        `📍 Address details:`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isAr ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 bottom-0 ${isAr ? "left-0" : "right-0"} w-full max-w-md bg-zinc-950 border-x border-zinc-800 z-[101] shadow-2xl flex flex-col`}
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-yellow-500" />
                <h2 className="text-xl font-black text-white">
                  {isAr ? "سلة التسوق" : "Shopping Cart"}
                </h2>
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center">
                    <ShoppingBag size={40} className="text-zinc-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {isAr ? "سلتك فارغة" : "Your cart is empty"}
                    </h3>
                    <p className="text-zinc-500 text-sm">
                      {isAr ? "أضف بعض العطور لتبدأ التسوق" : "Add some perfumes to start shopping"}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-xl text-sm"
                  >
                    {isAr ? "نسوق الآن" : "Shop Now"}
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                      <Image
                        src={item.image || "/images/img1.jpg"}
                        alt={isAr ? item.nameAr : item.nameEn}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-white font-bold text-sm line-clamp-1">
                            {isAr ? item.nameAr : item.nameEn}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-zinc-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-zinc-500 text-xs mt-1">
                          {isAr ? item.sizeAr : item.sizeEn}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-500 font-bold">
                          {item.price * item.quantity} <span className="text-[10px] text-zinc-500 uppercase">{isAr ? "ج" : "EGP"}</span>
                        </span>
                        <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-800">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 hover:text-yellow-500 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 hover:text-yellow-500 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-zinc-800 bg-zinc-900/30 space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex items-start gap-3">
                  <Truck size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-yellow-500 font-medium">
                    {isAr
                      ? "السعر لا يشمل مصاريف الشحن، سيتم حسابها عند التواصل عبر واتساب"
                      : "Price ignores shipping costs, they will be calculated via WhatsApp"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-bold">{isAr ? "الإجمالي:" : "Total:"}</span>
                  <span className="text-2xl font-black text-white">
                    {getTotalPrice()} <span className="text-sm font-medium text-zinc-500">{isAr ? "جنيه" : "EGP"}</span>
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-lg rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-yellow-500/20"
                >
                  <MessageCircle size={20} />
                  {isAr ? "إتمام الطلب عبر واتساب" : "Checkout via WhatsApp"}
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-zinc-500 hover:text-red-500 text-xs font-bold transition-colors"
                >
                  {isAr ? "مسح السلة" : "Clear Cart"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
