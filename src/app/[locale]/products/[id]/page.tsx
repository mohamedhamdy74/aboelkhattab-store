import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/modules/products/components/ProductDetailClient";

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const product = await prisma.product.findUnique({
    where: { id: params.id, isActive: true },
    include: {
      category: true,
      variants: {
        orderBy: { price: 'asc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
