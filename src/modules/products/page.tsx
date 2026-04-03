import { prisma } from "@/lib/prisma";
import ProductsClient from "./components/ProductsClient";

export default async function ProductsModule({ searchParams }: { searchParams: { category?: string, q?: string, page?: string } }) {
  const categoryId = searchParams.category;
  const q = searchParams.q || "";
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  // Prisma query
  const whereClause: any = { isActive: true };

  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  if (q) {
    whereClause.OR = [
      { nameAr: { contains: q, mode: 'insensitive' } },
      { nameEn: { contains: q, mode: 'insensitive' } },
      { descriptionAr: { contains: q, mode: 'insensitive' } },
      { descriptionEn: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [categories, products, totalProducts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(totalProducts / limit);
  const selectedCategory = categoryId ? categories.find(c => c.id === categoryId) : null;

  return (
    <main className="min-h-dvh bg-zinc-950 py-24">
      <div className="container mx-auto px-4">
        <ProductsClient 
          initialProducts={products} 
          categories={categories} 
          selectedCategory={selectedCategory} 
          initialSearch={q} 
          initialCategoryId={categoryId || ""}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </main>
  );
}
