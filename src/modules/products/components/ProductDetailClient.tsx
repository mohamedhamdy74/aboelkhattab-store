"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Category, Product, ProductVariant } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Link } from "../../../i18n/routing";
import { useCart } from "@/store/useCart";
import {
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Phone,
  User,
  MapPin,
  MessageCircle,
  Package,
  Truck,
  Shield,
} from "lucide-react";

type ProductWithDetails = Product & {
  category: Category;
  variants: ProductVariant[];
};

// WhatsApp number - change this to your real number
const WHATSAPP_NUMBER = "201156732953";

export default function ProductDetailClient({
  product,
}: {
  product: ProductWithDetails;
}) {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find((v) => v.isDefault) || product.variants[0]
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);

  // All images: main + gallery
  const allImages = [product.image, ...product.images].filter(Boolean);

  // Order form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleOrderSubmit = () => {
    const productName = isAr ? product.nameAr : product.nameEn;
    const variantSize = isAr ? selectedVariant.sizeAr : selectedVariant.sizeEn;

    const message = isAr
      ? `🛒 *طلب جديد من متجر أبو الخطاب*\n\n` +
      `📦 *المنتج:* ${productName}\n` +
      `📏 *الحجم:* ${variantSize}\n` +
      `💰 *السعر:* ${selectedVariant.price} جنيه\n` +
      `🚚 *ملاحظة:* سيتم إضافة تكلفة الشحن\n\n` +
      `👤 *الاسم:* ${formData.name}\n` +
      `📱 *الهاتف:* ${formData.phone}\n` +
      `📍 *العنوان:* ${formData.address}\n` +
      (formData.notes ? `📝 *ملاحظات:* ${formData.notes}\n` : "")
      : `🛒 *New Order from Abu Alkhattab Store*\n\n` +
      `📦 *Product:* ${productName}\n` +
      `📏 *Size:* ${variantSize}\n` +
      `💰 *Price:* ${selectedVariant.price} EGP\n` +
      `🚚 *Note:* Shipping cost will be added\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📱 *Phone:* ${formData.phone}\n` +
      `📍 *Address:* ${formData.address}\n` +
      (formData.notes ? `📝 *Notes:* ${formData.notes}\n` : "");

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    setShowOrderForm(false);
  };

  const isFormValid =
    formData.name.trim() && formData.phone.trim() && formData.address.trim();

  const discount =
    selectedVariant.oldPrice
      ? Math.round(
        ((selectedVariant.oldPrice - selectedVariant.price) /
          selectedVariant.oldPrice) *
        100
      )
      : 0;

  return (
    <main className="min-h-dvh bg-zinc-950 pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-yellow-500 transition-colors">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-yellow-500 transition-colors"
          >
            {isAr ? "المنتجات" : "Products"}
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.categoryId}` as any}
            className="hover:text-yellow-500 transition-colors"
          >
            {isAr ? product.category.nameAr : product.category.nameEn}
          </Link>
          <span>/</span>
          <span className="text-yellow-500 font-medium">
            {isAr ? product.nameAr : product.nameEn}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ============ LEFT: Image Gallery ============ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={allImages[currentImageIndex] || "/images/img1.jpg"}
                    alt={isAr ? product.nameAr : product.nameEn}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                  -{discount}%
                </div>
              )}

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) =>
                          (prev - 1 + allImages.length) % allImages.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) => (prev + 1) % allImages.length
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all duration-300 ${currentImageIndex === idx
                        ? "border-yellow-500 ring-2 ring-yellow-500/30"
                        : "border-zinc-800 opacity-60 hover:opacity-100"
                      }`}
                  >
                    <Image
                      src={img!}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ============ RIGHT: Product Info ============ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Category Badge */}
            <Link
              href={`/products?category=${product.categoryId}` as any}
              className="inline-flex items-center gap-2 text-sm font-bold text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20 w-fit mb-4 hover:bg-yellow-500/20 transition-colors"
            >
              {isAr ? product.category.nameAr : product.category.nameEn}
            </Link>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              {isAr ? product.nameAr : product.nameEn}
            </h1>

            {/* Description */}
            {(product.descriptionAr || product.descriptionEn) && (
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                {isAr
                  ? product.descriptionAr || product.descriptionEn
                  : product.descriptionEn || product.descriptionAr}
              </p>
            )}

            {/* Variants / Sizes */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">
                {isAr ? "اختر الحجم" : "Select Size"}
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 border ${selectedVariant.id === variant.id
                        ? "bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20"
                        : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600"
                      }`}
                  >
                    {isAr ? variant.sizeAr : variant.sizeEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
              <div className="flex items-end gap-4">
                <span className="text-4xl font-black text-yellow-500">
                  {selectedVariant.price}
                  <span className="text-lg font-medium text-zinc-500 mr-2 ml-2">
                    {isAr ? "جنيه" : "EGP"}
                  </span>
                </span>
                {selectedVariant.oldPrice && (
                  <span className="text-xl text-zinc-600 line-through">
                    {selectedVariant.oldPrice} {isAr ? "جنيه" : "EGP"}
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-500 mt-2 flex items-center gap-2">
                <Truck size={14} />
                {isAr
                  ? "* السعر لا يشمل تكلفة الشحن"
                  : "* Price does not include shipping cost"}
              </p>
            </div>

            {/* Buy Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowOrderForm(true)}
                className="flex-1 py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-yellow-500/20"
              >
                <ShoppingBag size={24} />
                {isAr ? "اطلب الآن" : "Order Now"}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => useCart.getState().addItem({
                  id: `${selectedVariant.id}-${product.id}`,
                  productId: product.id,
                  variantId: selectedVariant.id,
                  nameAr: product.nameAr,
                  nameEn: product.nameEn,
                  sizeAr: selectedVariant.sizeAr,
                  sizeEn: selectedVariant.sizeEn,
                  image: product.image,
                  price: selectedVariant.price,
                  quantity: 1
                })}
                className="flex-1 py-5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-black text-xl rounded-2xl flex items-center justify-center gap-3 transition-colors"
              >
                <ShoppingBag size={24} className="text-yellow-500" />
                {isAr ? "إضافة للسلة" : "Add to Cart"}
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <Package
                  size={24}
                  className="text-yellow-500 mb-2"
                />
                <span className="text-xs text-zinc-400 font-medium">
                  {isAr ? "منتج أصلي" : "Original"}
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <Truck
                  size={24}
                  className="text-yellow-500 mb-2"
                />
                <span className="text-xs text-zinc-400 font-medium">
                  {isAr ? "شحن لكل مصر" : "Nationwide"}
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <Shield
                  size={24}
                  className="text-yellow-500 mb-2"
                />
                <span className="text-xs text-zinc-400 font-medium">
                  {isAr ? "ضمان الجودة" : "Quality"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============ ORDER FORM MODAL ============ */}
      <AnimatePresence>
        {showOrderForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOrderForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white">
                  {isAr ? "تأكيد الطلب" : "Confirm Order"}
                </h2>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-zinc-950 rounded-2xl p-4 mb-6 flex items-center gap-4 border border-zinc-800">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold truncate">
                    {isAr ? product.nameAr : product.nameEn}
                  </h4>
                  <p className="text-zinc-500 text-sm">
                    {isAr ? selectedVariant.sizeAr : selectedVariant.sizeEn}
                  </p>
                </div>
                <div className="text-yellow-500 font-bold text-lg shrink-0">
                  {selectedVariant.price}{" "}
                  <span className="text-xs text-zinc-500">
                    {isAr ? "جنيه" : "EGP"}
                  </span>
                </div>
              </div>

              {/* Shipping Note */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <Truck size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-500/90 font-medium">
                  {isAr
                    ? "هذا السعر للمنتج فقط وسيتم إضافة تكلفة الشحن حسب المنطقة"
                    : "This is the product price only. Shipping cost will be added based on your location."}
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 mb-8">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2">
                    <User size={14} className="inline mr-1 ml-1" />
                    {isAr ? "الاسم بالكامل" : "Full Name"} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder={isAr ? "اكتب اسمك هنا..." : "Enter your name..."}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-zinc-700"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2">
                    <Phone size={14} className="inline mr-1 ml-1" />
                    {isAr ? "رقم الهاتف" : "Phone Number"} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder={isAr ? "01XXXXXXXXX" : "01XXXXXXXXX"}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-zinc-700"
                    dir="ltr"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2">
                    <MapPin size={14} className="inline mr-1 ml-1" />
                    {isAr ? "العنوان بالتفصيل" : "Delivery Address"} *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    rows={2}
                    placeholder={
                      isAr
                        ? "المحافظة، المدينة، الشارع..."
                        : "Governorate, City, Street..."
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all resize-none placeholder:text-zinc-700"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2">
                    <MessageCircle size={14} className="inline mr-1 ml-1" />
                    {isAr ? "ملاحظات (اختياري)" : "Notes (Optional)"}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={2}
                    placeholder={
                      isAr
                        ? "أي تفاصيل إضافية..."
                        : "Any additional details..."
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all resize-none placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!isFormValid}
                onClick={handleOrderSubmit}
                className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${isFormValid
                    ? "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/20"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  }`}
              >
                <MessageCircle size={22} />
                {isAr
                  ? "تأكيد وإرسال عبر واتساب"
                  : "Confirm & Send via WhatsApp"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
