import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { UploadApiResponse, DeleteApiResponse } from "cloudinary";
import streamifier from "streamifier";
import { Express } from "express";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder = "products"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "products-preset", // Use environment variable or default
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

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
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
