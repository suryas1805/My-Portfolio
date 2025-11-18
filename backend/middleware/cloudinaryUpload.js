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

// Helper function to get extension from mimetype
function getExtensionFromMimetype(mimetype) {
    const extensionMap = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
    };
    return extensionMap[mimetype] || 'file';
}

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        // Get file extension
        const originalExtension = file.originalname.includes('.')
            ? file.originalname.split('.').pop().toLowerCase()
            : getExtensionFromMimetype(file.mimetype);

        // Determine resource type based on file mimetype
        let resource_type = "auto";
        let format = originalExtension;

        if (file.mimetype.startsWith('image/')) {
            resource_type = "image";
            // For images, let Cloudinary handle format
            format = undefined;
        } else if (file.mimetype === 'application/pdf') {
            resource_type = "raw";
            format = "pdf";
        } else if (file.mimetype.includes('document') ||
            file.mimetype.includes('msword') ||
            file.mimetype.includes('wordprocessingml')) {
            resource_type = "raw";
            format = originalExtension; // doc or docx
        }

        // Create a clean public_id with extension for raw files
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const public_id = `resume_${timestamp}_${randomString}`;

        return {
            folder: "portfolio_uploads",
            resource_type: resource_type,
            public_id: public_id,
            format: format,
            access_mode: 'public',
            use_filename: false,
            unique_filename: true,
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