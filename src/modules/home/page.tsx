import Hero from "./components/Hero";
import About from "./components/About";
import FeaturedProducts from "./components/FeaturedProducts";
import Categories from "./components/Categories";
import Bridal from "./components/Bridal";
import Reviews from "./components/Reviews";

import { prisma } from "@/lib/prisma";

export default async function HomeModule() {
  const [categories, featuredProducts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
      take: 6,
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'asc' },
      take: 12, // Increased count for the new slider
    }),
  ]);

  return (
    <main className="min-h-dvh bg-black w-full overflow-hidden">
      <Hero />
      <About />
      <FeaturedProducts products={featuredProducts} />
      <Categories categories={categories} />
      <Bridal />
      <Reviews />
    </main>
  );
}
