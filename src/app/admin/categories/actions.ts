"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

// ─── إنشاء قسم جديد ───────────────────────────────
export async function createCategory(formData: FormData) {
  const nameAr        = formData.get("nameAr") as string;
  const nameEn        = formData.get("nameEn") as string;
  const descriptionAr = formData.get("descriptionAr") as string || null;
  const descriptionEn = formData.get("descriptionEn") as string || null;
  const imageFile   = formData.get("image") as File | null;

  if (!nameAr || !nameEn) throw new Error("جميع الحقول الأساسية مطلوبة");

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImageToCloudinary(imageFile);
  }

  await prisma.category.create({
    data: { nameAr, nameEn, descriptionAr, descriptionEn, image: imageUrl },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

// ─── تحديث قسم موجود ─────────────────────────────
export async function updateCategory(id: string, formData: FormData) {
  const nameAr        = formData.get("nameAr") as string;
  const nameEn        = formData.get("nameEn") as string;
  const descriptionAr = formData.get("descriptionAr") as string || null;
  const descriptionEn = formData.get("descriptionEn") as string || null;
  const imageFile   = formData.get("image") as File | null;
  const isActive    = formData.get("isActive") === "on";

  let updateData: any = { nameAr, nameEn, descriptionAr, descriptionEn, isActive };

  // Only update image if a new one is selected
  if (imageFile && imageFile.size > 0) {
    const imageUrl = await uploadImageToCloudinary(imageFile);
    if (imageUrl) {
      updateData.image = imageUrl;
    }
  }

  await prisma.category.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

// ─── حذف قسم ─────────────────────────────────────
export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

// ─── تبديل حالة التفعيل ───────────────────────────
export async function toggleCategoryStatus(id: string, isActive: boolean) {
  await prisma.category.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath("/admin/categories");
}
