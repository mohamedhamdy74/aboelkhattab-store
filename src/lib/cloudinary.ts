import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadImageToCloudinary(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Data = buffer.toString('base64');
  const fileUri = `data:${file.type};base64,${base64Data}`;
  
  const result = await cloudinary.uploader.upload(fileUri, {
    folder: 'alkhattab_store'
  });
  
  return result.secure_url;
}
