import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    const updateData: any = {
      nameAr:        formData.get("nameAr") as string,
      nameEn:        formData.get("nameEn") as string,
      descriptionAr: (formData.get("descriptionAr") as string) || null,
      descriptionEn: (formData.get("descriptionEn") as string) || null,
      categoryId:    formData.get("categoryId") as string,
      isActive:      formData.get("isActive")   !== "false",
    };

    // Upload new image if provided
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const imageUrl = await uploadImageToCloudinary(imageFile);
      if (imageUrl) updateData.image = imageUrl;
    }

    // Gallery images
    const existingImagesRaw = formData.get("existingImages") as string;
    const existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];
    
    const galleryFiles = formData.getAll("gallery") as File[];
    const newGalleryUrls: string[] = [];
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const url = await uploadImageToCloudinary(file);
        if (url) newGalleryUrls.push(url);
      }
    }
    
    updateData.images = [...existingImages, ...newGalleryUrls];

    // Update variants
    const variantsRaw = formData.get("variants") as string;
    const variants = JSON.parse(variantsRaw);

    // Delete old variants and recreate
    await prisma.productVariant.deleteMany({ where: { productId: id } });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        variants: {
          create: variants.map((v: any) => ({
            sizeAr:    v.sizeAr,
            sizeEn:    v.sizeEn,
            price:     parseFloat(v.price),
            oldPrice:  v.oldPrice ? parseFloat(v.oldPrice) : null,
            stock:     parseInt(v.stock, 10) || 0,
            isDefault: v.isDefault || false,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    return NextResponse.json({ success: true, id: updated.id });
  } catch (err: any) {
    console.error("[UPDATE_PRODUCT]", err);
    return NextResponse.json({ error: err.message || "خطأ في السيرفر" }, { status: 500 });
  }
}
