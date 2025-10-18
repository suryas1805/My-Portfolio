import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FaDownload, FaTimes, FaFilePdf, FaFileWord, FaFileImage, FaExternalLinkAlt } from "react-icons/fa";

// Configure PDF.js worker with fallback
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ResumeViewer({ fileUrl, fileType, fileName, fileExtension, onClose }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [useFallback, setUseFallback] = useState(false);

    // Get direct URL for preview - simplified approach
    const getPreviewUrl = () => {
        if (!fileUrl) return fileUrl;

        let url = fileUrl.replace('http://', 'https://');

        // Remove any existing query parameters that might cause issues
        if (url.includes('?')) {
            url = url.split('?')[0];
        }

        return url;
    };

    // Get download URL with proper filename
    const getDownloadUrl = () => {
        let downloadUrl = fileUrl.replace('http://', 'https://');
        const ext = fileExtension || getExtensionFromType(fileType, fileName);
        const downloadName = getDownloadFileName();

        if (downloadUrl.includes('cloudinary.com')) {
            if (downloadUrl.includes('?')) {
                downloadUrl += `&fl_attachment&filename=${encodeURIComponent(downloadName)}`;
            } else {
                downloadUrl += `?fl_attachment&filename=${encodeURIComponent(downloadName)}`;
            }
        }

        return downloadUrl;
    };

    const getExtensionFromType = (type, name) => {
        if (fileExtension) return fileExtension;

        if (name && name.includes('.')) {
            return name.split('.').pop().toLowerCase();
        }

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

        return extensionMap[type] || 'file';
    };

    const getDownloadFileName = () => {
        const ext = fileExtension || getExtensionFromType(fileType, fileName);
        const baseName = "Surya S Resume";

        // If the original filename is meaningful, use it, otherwise use the standard name
        if (fileName && !fileName.toLowerCase().includes('resume')) {
            // Extract name without extension and combine with standard name
            const originalName = fileName.includes('.')
                ? fileName.split('.').slice(0, -1).join('.')
                : fileName;
            return `${originalName} - ${baseName}.${ext}`;
        }

        return `${baseName}.${ext}`;
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        console.log("PDF loaded successfully, pages:", numPages);
        setNumPages(numPages);
        setLoading(false);
        setError(null);
    };

    const onDocumentLoadError = (error) => {
        console.error("PDF loading error:", error);
        setError("Failed to load PDF preview. Trying alternative viewer...");
        setUseFallback(true);
        setLoading(false);
    };

    const onImageLoad = () => {
        console.log("Image loaded successfully");
        setLoading(false);
        setError(null);
    };

    const onImageError = () => {
        console.error("Image loading failed");
        setError("Failed to load image");
        setLoading(false);
    };

    const getFileIcon = () => {
        const ext = fileExtension || getExtensionFromType(fileType, fileName);
        if (ext === 'pdf' || fileType?.includes('pdf'))
            return <FaFilePdf className="text-red-500" size={24} />;
        if (['doc', 'docx'].includes(ext) || fileType?.includes('word') || fileType?.includes('document'))
            return <FaFileWord className="text-blue-500" size={24} />;
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) || fileType?.includes('image'))
            return <FaFileImage className="text-green-500" size={24} />;
        return <FaFilePdf className="text-gray-500" size={24} />;
    };

    const getFileTypeDisplay = () => {
        const ext = fileExtension || getExtensionFromType(fileType, fileName);
        const typeMap = {
            'pdf': 'PDF Document',
            'doc': 'Word Document',
            'docx': 'Word Document',
            'jpg': 'JPEG Image',
            'jpeg': 'JPEG Image',
            'png': 'PNG Image',
            'gif': 'GIF Image',
            'webp': 'WebP Image'
        };
        return typeMap[ext] || 'Document';
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = getDownloadUrl();
        link.download = getDownloadFileName();
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenNewTab = () => {
        window.open(getPreviewUrl(), '_blank', 'noopener,noreferrer');
    };

    // Render Google Docs fallback viewer
    const renderGoogleDocsViewer = () => {
        return (
            <div className="w-full h-[80vh]">
                <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(getPreviewUrl())}&embedded=true`}
                    title={fileName || "Resume"}
                    className="w-full h-full border-0"
                    onLoad={() => {
                        console.log("Google Docs viewer loaded");
                        setLoading(false);
                    }}
                    onError={() => {
                        console.error("Google Docs viewer failed");
                        setError("Unable to preview document. Please download the file.");
                        setLoading(false);
                    }}
                />
            </div>
        );
    };

    // Render PDF with react-pdf
    const renderPdfViewer = () => {
        return (
            <div className="w-full h-full flex flex-col">
                {numPages > 1 && (
                    <div className="flex justify-center items-center gap-4 p-4 bg-gray-100 border-b">
                        <button
                            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                            disabled={pageNumber <= 1}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
                        >
                            Previous
                        </button>
                        <span className="text-gray-700">
                            Page {pageNumber} of {numPages}
                        </span>
                        <button
                            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                            disabled={pageNumber >= numPages}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
                        >
                            Next
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-auto flex justify-center p-4">
                    <Document
                        file={getPreviewUrl()}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                            <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                                <div>Loading PDF document...</div>
                            </div>
                        }
                        options={{
                            cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                            cMapPacked: true,
                            httpHeaders: {
                                // Add any necessary headers for CORS
                            }
                        }}
                    >
                        <Page
                            pageNumber={pageNumber}
                            width={Math.min(800, window.innerWidth - 100)}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            loading={
                                <div className="flex items-center justify-center py-10 text-gray-600">
                                    Loading page {pageNumber}...
                                </div>
                            }
                        />
                    </Document>
                </div>
            </div>
        );
    };

    // Render appropriate viewer based on file type
    const renderViewer = () => {
        const previewUrl = getPreviewUrl();
        const ext = fileExtension || getExtensionFromType(fileType, fileName);
        const isPdf = ext === 'pdf' || fileType?.includes('pdf');
        const isWord = ['doc', 'docx'].includes(ext) || fileType?.includes('word') || fileType?.includes('document');
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) || fileType?.includes('image');

        console.log("File details:", { ext, isPdf, isWord, isImage, previewUrl });

        if (isPdf) {
            // For PDFs, try react-pdf first, then fallback to Google Docs
            if (useFallback) {
                return renderGoogleDocsViewer();
            } else {
                return renderPdfViewer();
            }
        } else if (isWord) {
            return (
                <div className="w-full h-[80vh]">
                    <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`}
                        title={fileName || "Resume"}
                        className="w-full h-full border-0"
                        onLoad={() => {
                            console.log("Office Online viewer loaded");
                            setLoading(false);
                        }}
                        onError={() => {
                            console.error("Office Online viewer failed");
                            setError("Failed to load document preview. Please download the file to view it.");
                            setLoading(false);
                        }}
                    />
                </div>
            );
        } else if (isImage) {
            return (
                <div className="flex justify-center items-center h-full p-4">
                    <img
                        src={previewUrl}
                        alt={fileName || "Resume"}
                        className="max-w-full max-h-full object-contain"
                        onLoad={onImageLoad}
                        onError={onImageError}
                    />
                </div>
            );
        } else {
            return (
                <div className="py-20 text-gray-600 text-center w-full">
                    <p className="text-lg mb-4">Preview not available for this file type</p>
                    <button
                        onClick={handleDownload}
                        className="bg-teal-500 px-6 py-3 rounded hover:bg-teal-400 text-white flex items-center gap-2 transition mx-auto"
                    >
                        <FaDownload /> Download File
                    </button>
                </div>
            );
        }
    };

    useEffect(() => {
        console.log("ResumeViewer mounted with URL:", fileUrl);
        setLoading(true);
        setError(null);
        setUseFallback(false);
        setPageNumber(1);
        setNumPages(null);

        // Set a timeout to handle stuck loading
        const loadingTimeout = setTimeout(() => {
            if (loading) {
                console.log("Loading timeout reached, trying fallback");
                setError("Loading taking too long. Trying alternative viewer...");
                setUseFallback(true);
                setLoading(false);
            }
        }, 10000); // 10 second timeout

        return () => clearTimeout(loadingTimeout);
    }, [fileUrl]);

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center p-4 overflow-auto">
            {/* Header */}
            <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                    {getFileIcon()}
                    <div>
                        <h3 className="text-white font-semibold text-lg">
                            {fileName || "Resume"}
                        </h3>
                        <p className="text-gray-400 text-sm">{getFileTypeDisplay()}</p>
                        <p className="text-gray-400 text-xs">
                            Download as: {getDownloadFileName()}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={handleOpenNewTab}
                            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400 text-white flex items-center gap-2 transition text-sm"
                        >
                            <FaExternalLinkAlt /> Open
                        </button>
                        <button
                            onClick={handleDownload}
                            className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-400 text-white flex items-center gap-2 transition text-sm"
                        >
                            <FaDownload /> Download
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 text-white transition text-sm"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            </div>

            {/* Viewer Content */}
            <div className="w-full max-w-6xl flex-1 bg-white rounded-lg shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                {loading && !error && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-600 w-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <div>Loading document preview...</div>
                        <div className="text-sm text-gray-500 mt-2">This may take a few moments</div>
                    </div>
                )}

                {error && (
                    <div className="py-20 text-red-500 text-center w-full">
                        <p className="text-lg font-semibold mb-2">Unable to preview document</p>
                        <p className="text-sm text-gray-600 mb-4">
                            {error}
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={handleOpenNewTab}
                                className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-400 text-white flex items-center gap-2 transition mx-auto"
                            >
                                <FaExternalLinkAlt /> Open in New Tab
                            </button>
                            <button
                                onClick={handleDownload}
                                className="bg-teal-500 px-6 py-2 rounded hover:bg-teal-400 text-white flex items-center gap-2 transition mx-auto"
                            >
                                <FaDownload /> Download File
                            </button>
                        </div>
                    </div>
                )}

                {!loading && !error && renderViewer()}
            </div>

            {/* Debug info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-gray-400 max-w-6xl w-full">
                    <div>URL: {fileUrl}</div>
                    <div>Type: {fileType} | Extension: {fileExtension}</div>
                    <div>Preview URL: {getPreviewUrl()}</div>
                </div>
            )}
        </div>
    );
}