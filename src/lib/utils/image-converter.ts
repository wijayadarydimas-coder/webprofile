/**
 * Utilitas kompresi dan konversi gambar otomatis ke WebP di sisi klien (browser).
 * Mengurangi ukuran gambar hingga 80% sebelum diunggah ke server tanpa menurunkan kualitas visual.
 * Sangat ideal untuk hosting gratis seperti Vercel dan batasan kuota storage.
 */

export interface ConversionResult {
  file: File;
  originalSize: number;
  convertedSize: number;
  wasConverted: boolean;
}

export async function convertImageToWebP(
  originalFile: File,
  maxDimension = 1920,
  quality = 0.85
): Promise<ConversionResult> {
  // Hanya proses jika file adalah gambar dan bukan SVG
  if (!originalFile.type.startsWith("image/") || originalFile.type === "image/svg+xml") {
    return {
      file: originalFile,
      originalSize: originalFile.size,
      convertedSize: originalFile.size,
      wasConverted: false,
    };
  }

  // Jika browser tidak mendukung Canvas/Image (misal SSR), kembalikan file asli
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      file: originalFile,
      originalSize: originalFile.size,
      convertedSize: originalFile.size,
      wasConverted: false,
    };
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(originalFile);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve({
          file: originalFile,
          originalSize: originalFile.size,
          convertedSize: originalFile.size,
          wasConverted: false,
        });
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              file: originalFile,
              originalSize: originalFile.size,
              convertedSize: originalFile.size,
              wasConverted: false,
            });
            return;
          }

          // Buat nama file baru dengan ekstensi .webp
          const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
          const newFileName = `${baseName}.webp`;
          const convertedFile = new File([blob], newFileName, {
            type: "image/webp",
            lastModified: Date.now(),
          });

          resolve({
            file: convertedFile,
            originalSize: originalFile.size,
            convertedSize: convertedFile.size,
            wasConverted: true,
          });
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        file: originalFile,
        originalSize: originalFile.size,
        convertedSize: originalFile.size,
        wasConverted: false,
      });
    };

    img.src = objectUrl;
  });
}
