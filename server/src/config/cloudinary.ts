import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { UploadApiResponse, DeleteApiResponse } from "cloudinary";
import sharp from "sharp";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder = "products"
): Promise<UploadApiResponse> => {
  try {
    const resizedBuffer = await sharp(file.buffer)
      .resize(800, 800, { fit: "inside" })
      .jpeg({ quality: 80 })
      .toBuffer();

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          upload_preset:
            process.env.CLOUDINARY_UPLOAD_PRESET || "products-preset",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      );

      stream.end(resizedBuffer);
    });
  } catch (err) {
    console.error("Image processing error:", err);
    throw err;
  }
};

export const deleteFromCloudinary = (
  publicId: string
): Promise<DeleteApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result as DeleteApiResponse);
    });
  });
};

export { cloudinary };
