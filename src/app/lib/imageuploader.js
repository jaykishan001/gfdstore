import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image file to Cloudinary
 * @param {File} imageFile - The image file from FormData
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export async function uploadImage(imageFile, folder = "products") {
  const buffer = await imageFile.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString("base64");
  const dataUri = `data:${imageFile.type};base64,${base64Image}`;

  const response = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });

  return response.secure_url;
}

/**
 * Uploads multiple images to Cloudinary
 * @param {File[]} imageFiles - Array of image files
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<string[]>} - Array of secure URLs
 */
export async function uploadMultipleImages(imageFiles, folder = "products") {
  const uploadPromises = imageFiles.map((image) => uploadImage(image, folder));
  return await Promise.all(uploadPromises);
}
