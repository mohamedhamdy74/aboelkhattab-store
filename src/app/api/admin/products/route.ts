import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { createProductInDB } from "@/app/admin/products/actions";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const imageFile = formData.get("image") as File | null;
    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "الصورة الرئيسية مطلوبة" }, { status: 400 });
    }

    const imageUrl = await uploadImageToCloudinary(imageFile);
    if (!imageUrl) {
      return NextResponse.json({ error: "فشل رفع الصورة الرئيسية" }, { status: 500 });
    }

    // Gallery images
    const galleryFiles = formData.getAll("gallery") as File[];
    const galleryUrls: string[] = [];
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const url = await uploadImageToCloudinary(file);
        if (url) galleryUrls.push(url);
      }
    }

    const variantsRaw = formData.get("variants") as string;
    const variants = JSON.parse(variantsRaw);

    const result = await createProductInDB({
      nameAr:        formData.get("nameAr") as string,
      nameEn:        formData.get("nameEn") as string,
      descriptionAr: (formData.get("descriptionAr") as string) || null,
      descriptionEn: (formData.get("descriptionEn") as string) || null,
      image:         imageUrl,
      images:        galleryUrls,
      categoryId:    formData.get("categoryId") as string,
      isActive:      formData.get("isActive")   !== "false",
      isFeatured:    formData.get("isFeatured") === "true",
      variants: variants.map((v: any) => ({
        sizeAr:    v.sizeAr,
        sizeEn:    v.sizeEn,
        price:     parseFloat(v.price),
        oldPrice:  v.oldPrice ? parseFloat(v.oldPrice) : null,
        stock:     parseInt(v.stock, 10) || 0,
        isDefault: v.isDefault || false,
      })),
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[CREATE_PRODUCT]", err);
    return NextResponse.json({ error: err.message || "خطأ في السيرفر" }, { status: 500 });
  }
}
