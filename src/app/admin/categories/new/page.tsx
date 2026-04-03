import { createCategory } from "../actions";
import { ArrowRight, Grid2X2 } from "lucide-react";
import Link from "next/link";

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/categories"
          className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Grid2X2 className="w-6 h-6 text-indigo-500" />
            إضافة قسم جديد
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">أضف قسماً جديداً لمنتجات المتجر</p>
        </div>
      </div>

      {/* Form */}
      <form
        action={createCategory}
        className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-8 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* الاسم بالعربي */}
          <div className="space-y-2">
            <label htmlFor="nameAr" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              الاسم بالعربي <span className="text-red-500">*</span>
            </label>
            <input
              id="nameAr"
              name="nameAr"
              type="text"
              required
              placeholder="مثال: خمرة، بخور، شباشب..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition text-sm"
            />
          </div>

          {/* الاسم بالانجليزي */}
          <div className="space-y-2">
            <label htmlFor="nameEn" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              الاسم بالإنجليزي <span className="text-red-500">*</span>
            </label>
            <input
              id="nameEn"
              name="nameEn"
              type="text"
              required
              placeholder="e.g. Perfumes, Incense..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition text-sm"
              dir="ltr"
            />
          </div>
          {/* الوصف بالعربي */}
          <div className="space-y-2">
            <label htmlFor="descriptionAr" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              الوصف بالعربي
            </label>
            <textarea
              id="descriptionAr"
              name="descriptionAr"
              rows={3}
              placeholder="اكتب وصفاً للقسم..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition text-sm"
            />
          </div>

          {/* الوصف بالانجليزي */}
          <div className="space-y-2">
            <label htmlFor="descriptionEn" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              الوصف بالإنجليزي
            </label>
            <textarea
              id="descriptionEn"
              name="descriptionEn"
              rows={3}
              placeholder="Category description..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition text-sm"
              dir="ltr"
            />
          </div>
        </div>

        {/* صورة القسم */}
        <div className="space-y-2">
          <label htmlFor="image" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            صورة القسم
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition text-sm"
          />
          <p className="text-xs text-zinc-400">اختياري — سيتم رفع الصورة تلقائياً</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 text-sm"
          >
            حفظ القسم
          </button>
          <Link
            href="/admin/categories"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium transition text-sm"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
