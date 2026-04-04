import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Package, Grid2X2, Layers, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { deleteProduct, toggleProductStatus, toggleProductFeatured } from "./actions";
import DeleteButton from "../components/DeleteButton";
import ProductFilters from "./components/ProductFilters";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const query = await searchParams;
  const searchTerm = query.q || "";
  const categoryId = query.category || "";
  const currentPage = parseInt(query.page || "1", 10);
  const pageSize = 10;

  // 1. Fetch data with filtering & pagination
  const where: any = {};
  if (searchTerm) {
    where.OR = [
      { nameAr: { contains: searchTerm, mode: "insensitive" } },
      { nameEn: { contains: searchTerm, mode: "insensitive" } },
    ];
  }
  if (categoryId && categoryId !== "all") {
    where.categoryId = categoryId;
  }

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { nameAr: true } },
        variants: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ select: { id: true, nameAr: true }, orderBy: { nameAr: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-500" />
            إدارة المنتجات
          </h1>
          <p className="text-sm text-zinc-500 mt-1">إجمالي {totalCount} منتج</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة منتج جديد
        </Link>
      </div>

      {/* Filters & Search - Now a Client Component */}
      <ProductFilters 
        categories={categories} 
        searchTerm={searchTerm} 
        categoryId={categoryId} 
      />

      {/* Table */}
      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/30 p-16 text-center">
          <Package className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">لا توجد منتجات تطابق بحثك</p>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">جرب تغيير الكلمات أو القسم</p>
        </div>
      ) : (
        <>
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
                  {products.map((prod: any) => (
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
                        <div className="flex items-center gap-1.5 font-medium">
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
                            السعر يبدأ من: <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.min(...prod.variants.map((v: any) => v.price))} ج.م</span>
                          </p>
                        )}
                      </td>
                      {/* الحالة ومميز */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          {/* مميز */}
                          <form action={async () => {
                            "use server";
                            await toggleProductFeatured(prod.id, !prod.isFeatured);
                          }}>
                            <button type="submit" className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                              prod.isFeatured
                                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50 shadow-sm"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600"
                            }`}>
                              <Star className={`w-3 h-3 ${prod.isFeatured ? "fill-yellow-500" : ""}`} />
                              {prod.isFeatured ? "منتج مميز" : "تمييز المنتج"}
                            </button>
                          </form>

                          {/* نشط */}
                          <form action={async () => {
                            "use server";
                            await toggleProductStatus(prod.id, !prod.isActive);
                          }}>
                            <button type="submit" className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                              prod.isActive
                                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200"
                            }`}>
                              {prod.isActive
                                ? <><ToggleRight className="w-3.5 h-3.5" /> متاح</>
                                : <><ToggleLeft className="w-3.5 h-3.5" /> مخفي</>
                              }
                            </button>
                          </form>
                        </div>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white dark:bg-zinc-900/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <span className="text-xs font-medium text-zinc-500">
                عرض {products.length} من {totalCount} منتج | صفحة {currentPage} من {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products?page=${currentPage - 1}${searchTerm ? `&q=${searchTerm}` : ""}${categoryId ? `&category=${categoryId}` : ""}`}
                  className={`p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all ${currentPage === 1 ? "opacity-30 pointer-events-none" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
                
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  if (totalPages > 5 && Math.abs(p - currentPage) > 1 && p !== 1 && p !== totalPages) return null;
                  return (
                    <Link
                      key={p}
                      href={`/admin/products?page=${p}${searchTerm ? `&q=${searchTerm}` : ""}${categoryId ? `&category=${categoryId}` : ""}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${currentPage === p ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                    >
                      {p}
                    </Link>
                  );
                })}

                <Link
                  href={`/admin/products?page=${currentPage + 1}${searchTerm ? `&q=${searchTerm}` : ""}${categoryId ? `&category=${categoryId}` : ""}`}
                  className={`p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all ${currentPage === totalPages ? "opacity-30 pointer-events-none" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
