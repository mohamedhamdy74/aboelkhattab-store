"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ImagePlus, X } from "lucide-react";
import Link from "next/link";
import { Category, Product, ProductVariant } from "@prisma/client";

type VariantState = {
  sizeAr: string;
  sizeEn: string;
  price: string;
  oldPrice: string;
  stock: string;
  isDefault: boolean;
};

type ProductWithVariants = Product & { variants: ProductVariant[] };

export default function EditProductForm({
  product,
  categories,
}: {
  product: ProductWithVariants;
  categories: Category[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image);
  const [imageChanged, setImageChanged] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>(product.images || []);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const imageRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [variants, setVariants] = useState<VariantState[]>(
    product.variants.map((v) => ({
      sizeAr: v.sizeAr,
      sizeEn: v.sizeEn,
      price: String(v.price),
      oldPrice: v.oldPrice ? String(v.oldPrice) : "",
      stock: String(v.stock),
      isDefault: v.isDefault,
    }))
  );

  const addVariant = () => {
    setVariants([...variants, { sizeAr: "", sizeEn: "", price: "", oldPrice: "", stock: "0", isDefault: false }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantState, value: string | boolean) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    if (field === "isDefault" && value === true) {
      newVariants.forEach((v, i) => { if (i !== index) v.isDefault = false; });
    }
    setVariants(newVariants);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageChanged(true);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setNewGalleryPreviews(prev => [...prev, ...newUrls]);
    }
  };

  const removeExistingGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewGalleryImage = (index: number) => {
    setNewGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData();

    formData.append("nameAr",        (form.elements.namedItem("nameAr") as HTMLInputElement).value);
    formData.append("nameEn",        (form.elements.namedItem("nameEn") as HTMLInputElement).value);
    formData.append("descriptionAr", (form.elements.namedItem("descriptionAr") as HTMLTextAreaElement).value);
    formData.append("descriptionEn", (form.elements.namedItem("descriptionEn") as HTMLTextAreaElement).value);
    formData.append("categoryId",    (form.elements.namedItem("categoryId") as HTMLSelectElement).value);
    formData.append("isActive",      String((form.elements.namedItem("isActive") as HTMLInputElement).checked));

    if (imageChanged && imageRef.current?.files?.[0]) {
      formData.append("image", imageRef.current.files[0]);
    }

    // Existing gallery images to keep
    formData.append("existingImages", JSON.stringify(galleryImages));

    // New gallery images
    const galleryFiles = galleryRef.current?.files;
    if (galleryFiles) {
      Array.from(galleryFiles).forEach(file => {
          formData.append("gallery", file);
      });
    }

    formData.append("variants", JSON.stringify(variants));

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "PATCH", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "خطأ غير معروف");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      alert(`حدث خطأ: ${err.message}`);
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-24">

      {/* ── البيانات الأساسية ── */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">البيانات الأساسية</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">اسم المنتج بالعربي <span className="text-red-500">*</span></label>
            <input required name="nameAr" defaultValue={product.nameAr} type="text" className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">الاسم بالإنجليزي <span className="text-red-500">*</span></label>
            <input required name="nameEn" defaultValue={product.nameEn} type="text" dir="ltr" className={inputClass} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">القسم التابع له <span className="text-red-500">*</span></label>
          <select required name="categoryId" defaultValue={product.categoryId} className={`${inputClass} cursor-pointer`}>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.nameAr}</option>
            ))}
          </select>
        </div>

        {/* صور المنتج */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* صورة المنتج الرئيسية */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">صورة المنتج الرئيسية</label>
            <div className="flex items-start gap-4">
              <div
                className="w-28 h-28 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition overflow-hidden bg-zinc-50 dark:bg-zinc-800/40 shrink-0"
                onClick={() => imageRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-zinc-400">
                    <ImagePlus className="w-7 h-7" />
                    <span className="text-[10px] font-medium">اضغط لرفع</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input ref={imageRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <button type="button" onClick={() => imageRef.current?.click()} className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                  <ImagePlus className="w-4 h-4 inline ml-1" />
                  تغيير الصورة
                </button>
                {imageChanged && (
                  <button type="button" onClick={() => { setImagePreview(product.image); setImageChanged(false); if (imageRef.current) imageRef.current.value = ""; }} className="mr-2 px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-500 hover:bg-zinc-50 transition">
                    <X className="w-3.5 h-3.5 inline ml-1" />تراجع
                  </button>
                )}
                <p className="text-xs text-zinc-400">اتركها فارغة للإبقاء على الصورة الحالية</p>
              </div>
            </div>
          </div>

          {/* معرض الصور الإضافية */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">صور إضافية (المعرض)</label>
            <div className="flex flex-wrap gap-3">
              {/* Existing Images */}
              {galleryImages.map((url, idx) => (
                <div key={`existing-${idx}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingGalleryImage(idx)} className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {/* New Previews */}
              {newGalleryPreviews.map((url, idx) => (
                <div key={`new-${idx}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-indigo-400">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewGalleryImage(idx)} className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div
                className="w-20 h-20 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition bg-zinc-50 dark:bg-zinc-800/40"
                onClick={() => galleryRef.current?.click()}
              >
                <Plus className="w-6 h-6 text-zinc-400" />
                <span className="text-[10px] text-zinc-400 font-medium">إضافة</span>
              </div>
              <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">وصف المنتج (عربي)</label>
            <textarea name="descriptionAr" defaultValue={product.descriptionAr ?? ""} rows={3} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">وصف المنتج (إنجليزي)</label>
            <textarea name="descriptionEn" defaultValue={product.descriptionEn ?? ""} rows={3} dir="ltr" className={inputClass} />
          </div>
        </div>
      </div>

      {/* ── حالة التفعيل ── */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-6">الحالة</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3 cursor-pointer p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl">
            <input name="isActive" type="checkbox" defaultChecked={product.isActive} className="w-5 h-5 accent-indigo-600" />
            <span className="font-bold text-indigo-700 dark:text-indigo-400 select-none">المنتج نشط (يظهر للعملاء)</span>
          </label>
        </div>
      </div>

      {/* ── الأحجام والأسعار ── */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-6">
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">الأحجام والأسعار</h3>
          <button type="button" onClick={addVariant} className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-bold rounded-xl transition">
            <Plus className="w-4 h-4" /> إضافة حجم
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((v, index) => (
            <div key={index} className={`p-5 rounded-2xl border transition ${v.isDefault ? "border-indigo-300 dark:border-indigo-500/50 bg-indigo-50/30 dark:bg-indigo-900/10" : "border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30"}`}>
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                  <input type="radio" name="defaultVariant" checked={v.isDefault} onChange={() => updateVariant(index, "isDefault", true)} className="w-4 h-4 accent-indigo-600" />
                  <span className={v.isDefault ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500"}>
                    {v.isDefault ? "✓ الحجم الافتراضي" : "تعيين كافتراضي"}
                  </span>
                </label>
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(index)} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">اسم الحجم (عربي) *</label>
                  <input required value={v.sizeAr} onChange={e => updateVariant(index, "sizeAr", e.target.value)} type="text" className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">اسم الحجم (إنجليزي) *</label>
                  <input required value={v.sizeEn} onChange={e => updateVariant(index, "sizeEn", e.target.value)} type="text" dir="ltr" className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">السعر (ج.م) *</label>
                  <input required value={v.price} onChange={e => updateVariant(index, "price", e.target.value)} type="number" step="0.01" min="0" className="w-full px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">السعر القديم</label>
                  <input value={v.oldPrice} onChange={e => updateVariant(index, "oldPrice", e.target.value)} type="number" step="0.01" min="0" className="w-full px-3 py-2.5 text-sm text-zinc-500 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300" />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm">
                <label className="text-xs font-bold text-zinc-500">المخزون:</label>
                <input value={v.stock} onChange={e => updateVariant(index, "stock", e.target.value)} type="number" min="0" className="w-20 px-2 py-1.5 text-center text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                <span className="text-xs text-zinc-400">وحدة</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── أزرار الحفظ ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 z-50 flex justify-end gap-3 md:pr-72">
        <Link href="/admin/products" className="px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-semibold transition text-sm">
          إلغاء
        </Link>
        <button disabled={loading} type="submit" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-wait text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 text-sm">
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري الحفظ...</>
          ) : (
            <><Save className="w-4 h-4" /> حفظ التعديلات</>
          )}
        </button>
      </div>
    </form>
  );
}
