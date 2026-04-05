import { prisma } from "@/lib/prisma";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditProductForm from "./EditProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { isDefault: "desc" } } },
    }),
    prisma.category.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  if (!product) notFound();

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
            تعديل: {product.nameAr}
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">قم بتعديل بيانات المنتج وأحجامه</p>
        </div>
      </div>

      <EditProductForm product={product} categories={categories} />
    </div>
  );
}
