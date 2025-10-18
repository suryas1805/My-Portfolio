import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        // Determine resource type based on file mimetype
        let resource_type = "auto";
        let format = undefined;

        if (file.mimetype.startsWith('image/')) {
            resource_type = "image";
            // Don't set format for images - let Cloudinary handle it
        } else if (file.mimetype === 'application/pdf') {
            resource_type = "raw";
        } else if (file.mimetype.includes('document') ||
            file.mimetype.includes('msword') ||
            file.mimetype.includes('wordprocessingml')) {
            resource_type = "raw";
        }

        return {
            folder: "portfolio_uploads",
            resource_type: resource_type,
            // For raw files, use public access for easier downloading
            access_mode: 'public',
            // Only set format for specific cases, remove auto format
            ...(resource_type === 'image' && {
                transformation: [
                    { quality: 'auto' },
                    { format: 'auto' }
                ]
            })
        };
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, PDFs, and Word documents are allowed.'), false);
        }
    }
});

export default upload;