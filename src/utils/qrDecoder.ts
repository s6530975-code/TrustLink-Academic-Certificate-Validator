import jsQR from 'jsqr';

export interface DecodedQrResult {
  data: string;
  location?: {
    topLeftCorner: { x: number; y: number };
    topRightCorner: { x: number; y: number };
    bottomLeftCorner: { x: number; y: number };
    bottomRightCorner: { x: number; y: number };
  };
}

/**
 * Decodes a QR code directly from an uploaded Image File (PNG, JPG, JPEG) using an offscreen Canvas and jsQR.
 * Returns decoded string payload, or null if no QR code is found.
 */
export async function decodeQrFromImageFile(file: File): Promise<DecodedQrResult | null> {
  if (!file.type.startsWith('image/')) {
    return null;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data && code.data.trim().length > 0) {
            resolve({
              data: code.data.trim(),
              location: code.location,
            });
          } else {
            resolve(null);
          }
        } catch (err) {
          console.warn('Local QR decode exception:', err);
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}
