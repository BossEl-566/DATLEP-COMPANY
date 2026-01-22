// lib/imagekit.ts
import ImageKit, { toFile } from '@imagekit/nodejs';

export const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

export class ImageKitService {
  /**
   * Upload image (server-side only)
   */
  static async uploadProductImage(
    file: Buffer,
    fileName: string,
    options?: {
      folder?: string;
      tags?: string[];
    }
  ) {
    try {
      const uploadableFile = await toFile(file, fileName);

      const response = await imagekit.files.upload({
        file: uploadableFile,
        fileName,
        useUniqueFileName: true,
        folder: options?.folder ?? '/products',
        tags: options?.tags ?? ['product-image'],
      });

      return {
        success: true,
        fileId: response.fileId,
        fileName: response.name,
        filePath: response.filePath,
        url: `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${response.filePath}`,
      };
    } catch (error: any) {
      console.error('Product image upload failed:', error);
      return {
        success: false,
        error: error.message ?? 'Upload failed',
      };
    }
  }

  /**
   * Delete product image by fileId
   */
  static async deleteProductImage(fileId: string) {
    try {
      await imagekit.files.delete(fileId);
      return { success: true };
    } catch (error: any) {
      console.error('Product image deletion failed:', error);
      return {
        success: false,
        error: error.message ?? 'Deletion failed',
      };
    }
  }

  /**
   * Generate ImageKit URL with transformations (manual – NEW SDK compatible)
   *
   * Example transformations string:
   * "w-400,h-400,q-80,e-retouch"
   */
  static generateUrlWithTransformations(
    filePath: string,
    transformations?: string
  ) {
    const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

    if (!transformations) {
      return `${endpoint}${filePath}`;
    }

    return `${endpoint}/tr:${transformations}${filePath}`;
  }

  /**
   * Extract ImageKit filePath from full URL
   */
  static extractFilePath(url: string): string {
    try {
      const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
      return url.replace(endpoint, '');
    } catch (error) {
      console.error('Error extracting file path:', error);
      return '';
    }
  }

  /**
   * Generate enhanced URL from full ImageKit URL
   */
  static generateEnhancedUrl(
    imageUrl: string,
    transformations?: string
  ) {
    if (!transformations) return imageUrl;

    const filePath = this.extractFilePath(imageUrl);
    if (!filePath) return imageUrl;

    return this.generateUrlWithTransformations(filePath, transformations);
  }
}
