import { prisma } from "@/lib/prisma";
import { Grid2X2, Package, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [categoriesCount, productsCount, variantsCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.productVariant.count(),
  ]);

  const stats = [
    { label: "إجمالي الأقسام", value: categoriesCount, icon: Grid2X2, color: "from-blue-500 to-indigo-600", shadow: "shadow-indigo-500/30" },
    { label: "إجمالي المنتجات", value: productsCount, icon: Package, color: "from-emerald-400 to-teal-600", shadow: "shadow-teal-500/30" },
    { label: "إجمالي مقاسات/أحجام", value: variantsCount, icon: TrendingUp, color: "from-orange-400 to-rose-600", shadow: "shadow-rose-500/30" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2 relative">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 relative z-10">ملخص النظام</h1>
        <p className="text-zinc-500 dark:text-zinc-400 relative z-10">نظرة عامة سريعة على إحصائيات متجر أبو الخطاب للعطور.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="relative group overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className={`absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r ${stat.color} opacity-80`} />
              <div className="p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">{stat.value}</h3>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-2">{stat.label}</p>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg ${stat.shadow} transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
              {/* Decorative blob */}
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br opacity-[0.03] dark:opacity-[0.05] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
         {/* Placeholder for Quick Actions */}
         <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
            <h3 className="text-xl font-bold dark:text-zinc-100 flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-indigo-500" />
              إجراءات سريعة
            </h3>
            <div className="flex flex-col gap-3">
              <Link href="/admin/products/new" className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition flex items-center justify-between group">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">إضافة منتج جديد</span>
                <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg leading-none group-hover:scale-110 transition">+</span>
              </Link>
              <Link href="/admin/categories/new" className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition flex items-center justify-between group">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-teal-600 dark:group-hover:text-teal-400">إضافة قسم جديد</span>
                <span className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-lg leading-none group-hover:scale-110 transition">+</span>
              </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
