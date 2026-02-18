import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config();
// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(
            localFilePath, {
            folder: "/insta-clone",
            resource_type: "image",
            transformation: [
                { width: 800, height: 800, crop: "limit" },
                { quality: "auto",fetch_format: "auto", },
            ]

        }
        )
        // console.log("File Uploaded on cloudinary . File Src :", response.url);
        //once the file is uploaded , we would like to delete it from our server
        if (fs.unlinkSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return response
    } catch (error) {
        console.log("Error on Cloudinary :", error)
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        console.log("Deleted from cloudinary. Public Id : ", publicId)
        return result

    } catch (error) {
        console.log("Error deleting from cloudinary", error)
    }

}

export { uploadOnCloudinary, deleteFromCloudinary }