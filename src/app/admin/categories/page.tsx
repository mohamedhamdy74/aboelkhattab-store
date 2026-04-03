import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Grid2X2 } from "lucide-react";
import { deleteCategory, toggleCategoryStatus } from "./actions";
import DeleteButton from "../components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Grid2X2 className="w-6 h-6 text-indigo-500" />
            إدارة الأقسام
          </h1>
          <p className="text-sm text-zinc-500 mt-1">إجمالي {categories.length} قسم</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة قسم جديد
        </Link>
      </div>

      {/* Table */}
      {categories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/30 p-16 text-center">
          <Grid2X2 className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">لا توجد أقسام بعد</p>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">ابدأ بإضافة قسمك الأول</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80">
                  <th className="text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-6 py-4">القسم</th>
                  <th className="text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-6 py-4">المنتجات</th>
                  <th className="text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-6 py-4">الحالة</th>
                  <th className="text-right text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-6 py-4">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors group">
                    {/* القسم */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.nameAr} className="w-10 h-10 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                            <Grid2X2 className="w-5 h-5 text-indigo-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{cat.nameAr}</p>
                          <p className="text-xs text-zinc-400">{cat.nameEn}</p>
                        </div>
                      </div>
                    </td>
                    {/* عدد المنتجات */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                        {cat._count.products}
                      </span>
                    </td>
                    {/* الحالة */}
                    <td className="px-6 py-4">
                      <form action={async () => {
                        "use server";
                        await toggleCategoryStatus(cat.id, !cat.isActive);
                      }}>
                        <button type="submit" className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          cat.isActive
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200"
                        }`}>
                          {cat.isActive
                            ? <><ToggleRight className="w-3.5 h-3.5" /> نشط</>
                            : <><ToggleLeft className="w-3.5 h-3.5" /> معطل</>
                          }
                        </button>
                      </form>
                    </td>
                    {/* الإجراءات */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/categories/${cat.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-xs font-medium"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          تعديل
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteCategory(cat.id);
                        }}>
                          <DeleteButton itemName={`قسم "${cat.nameAr}"`} />
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
