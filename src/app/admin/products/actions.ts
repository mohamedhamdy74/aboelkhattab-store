"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

// ─── حذف منتج ────────────────────────────────────
export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

// ─── تبديل حالة التفعيل للمنتج ─────────────────────
export async function toggleProductStatus(id: string, isActive: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath("/admin/products");
}

// ─── تبديل حالة "مميز" للمنتج ─────────────────────
export async function toggleProductFeatured(id: string, isFeatured: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isFeatured },
  });
  revalidatePath("/admin/products");
}

// ─── إنشاء منتج جديد (Called from API route) ────────
export async function createProductInDB(data: {
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  image: string;
  images: string[];
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  variants: Array<{
    sizeAr: string;
    sizeEn: string;
    price: number;
    oldPrice: number | null;
    stock: number;
    isDefault: boolean;
  }>;
}) {
  const newProduct = await prisma.product.create({
    data: {
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      descriptionAr: data.descriptionAr,
      descriptionEn: data.descriptionEn,
      image: data.image,
      images: data.images,
      categoryId: data.categoryId,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      variants: {
        create: data.variants,
      },
    },
  });

  revalidatePath("/admin/products");
  return { success: true, id: newProduct.id };
}
