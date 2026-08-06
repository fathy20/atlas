import { supabase } from "@/integrations/supabase/client";

/**
 * Compresses an image file client-side to max 1200px dimension and ~0.8 JPEG/WebP quality.
 * Returns a Blob.
 */
export const compressImage = (file: File, maxDim = 1200, quality = 0.82): Promise<Blob> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads an image to Supabase Storage bucket 'products'.
 * Falls back to compressed base64 data URL if storage upload fails.
 */
export const processAndUploadImage = async (file: File): Promise<string> => {
  try {
    const compressedBlob = await compressImage(file);

    // Try uploading to Supabase storage 'products' bucket
    const ext = compressedBlob.type.includes("webp") ? "webp" : "jpg";
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = `product_images/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, compressedBlob, {
        contentType: compressedBlob.type || "image/webp",
        cacheControl: "3600",
        upsert: true,
      });

    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage.from("products").getPublicUrl(filePath);
      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }

    // Fallback: Return compressed base64 data URL if bucket upload failed
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(compressedBlob);
    });
  } catch (err) {
    console.warn("Upload/compress failed, using original file reader:", err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
};
