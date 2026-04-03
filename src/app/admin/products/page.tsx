import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Package, Grid2X2, Layers } from "lucide-react";
import { deleteProduct, toggleProductStatus } from "./actions";
import DeleteButton from "../components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { nameAr: true } },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-500" />
            إدارة المنتجات
          </h1>
          <p className="text-sm text-zinc-500 mt-1">إجمالي {products.length} منتج</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة منتج جديد
        </Link>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/30 p-16 text-center">
          <Package className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">لا توجد منتجات بعد</p>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">أضف منتجاتك لتبدأ البيع</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80">
                  <th className="text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-6 py-4">المنتج</th>
                  <th className="text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-6 py-4">القسم</th>
                  <th className="text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-6 py-4">الأحجام/الأسعار</th>
                  <th className="text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-6 py-4">الحالة</th>
                  <th className="text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-6 py-4">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors group">
                    {/* المنتج */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {prod.image ? (
                          <img src={prod.image} alt={prod.nameAr} className="w-10 h-10 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                            <Package className="w-5 h-5 text-indigo-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{prod.nameAr}</p>
                          <p className="text-xs text-zinc-400 line-clamp-1">{prod.nameEn}</p>
                        </div>
                      </div>
                    </td>
                    {/* القسم */}
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <Grid2X2 className="w-3.5 h-3.5 text-zinc-400" />
                        {prod.category.nameAr}
                      </div>
                    </td>
                    {/* الأحجام */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-zinc-400" />
                        <span className="text-zinc-600 dark:text-zinc-300 font-medium">{prod.variants.length} أحجام</span>
                      </div>
                      {prod.variants.length > 0 && (
                        <p className="text-[11px] text-zinc-500 mt-1">
                          السعر يبدأ من: <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.min(...prod.variants.map((v) => v.price))} ج.م</span>
                        </p>
                      )}
                    </td>
                    {/* الحالة */}
                    <td className="px-6 py-4">
                      <form action={async () => {
                        "use server";
                        await toggleProductStatus(prod.id, !prod.isActive);
                      }}>
                        <button type="submit" className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          prod.isActive
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200"
                        }`}>
                          {prod.isActive
                            ? <><ToggleRight className="w-3.5 h-3.5" /> متاح</>
                            : <><ToggleLeft className="w-3.5 h-3.5" /> مخفي</>
                          }
                        </button>
                      </form>
                    </td>
                    {/* الإجراءات */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${prod.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-xs font-medium"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          تعديل
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteProduct(prod.id);
                        }}>
                          <DeleteButton itemName={`منتج "${prod.nameAr}"`} />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
