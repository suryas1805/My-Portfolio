// utils/imageUtils.js
export const getImageUrl = (path) => {
    if (!path) return null;

    // Cloudinary URLs are absolute, return as-is
    if (path.startsWith('http') || path.startsWith('https')) {
        return path;
    }

    // Fallback (for old local images)
    return `${import.meta.env.VITE_API_URL}${path}`;
};