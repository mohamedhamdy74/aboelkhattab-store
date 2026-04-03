import { prisma } from "@/lib/prisma";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import ProductForm from "./ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-500" />
            إضافة منتج جديد
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">أضف بيانات المنتج وأحجامه وأسعاره</p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-500">
          ⚠️ <strong>عذراً:</strong> يجب عليك <Link href="/admin/categories/new" className="underline">إضافة قسم واحد على الأقل</Link> قبل أن تتمكن من إضافة منتجات.
        </div>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
