import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const upload = async (path) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(path);
    fs.unlinkSync(path);
    return uploadResult.secure_url;
  } catch (error) {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
    console.log("Error in cloudinary", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export default upload;
