import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FaDownload, FaTimes, FaFilePdf, FaFileWord, FaFileImage, FaExternalLinkAlt } from "react-icons/fa";

// Configure PDF.js worker with a more reliable approach
const PDFJS_VERSION = '3.11.174'; // Use a stable version
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

export default function ResumeViewer({ fileUrl, fileType, fileName, fileExtension, resourceType, onClose }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [useFallback, setUseFallback] = useState(false);
    const [blobUrl, setBlobUrl] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    });

    // Handle window resize for responsive design
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Extract extension from various sources
    const getFileExtension = () => {
        if (fileExtension) return fileExtension.toLowerCase();

        if (fileName && fileName.includes('.')) {
            return fileName.split('.').pop().toLowerCase();
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

        return extensionMap[fileType] || 'pdf';
    };

    const ext = getFileExtension();

    // Convert Base64 to Blob for better performance
    const convertBase64ToBlob = (base64Data) => {
        try {
            // Extract the actual base64 data
            const base64String = base64Data.split(',')[1] || base64Data;

            // Convert to binary
            const binaryString = atob(base64String);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Create blob
            return new Blob([bytes], { type: fileType || 'application/pdf' });
        } catch (err) {
            console.error('Error converting base64 to blob:', err);
            return null;
        }
    };

    // Get preview URL - converts base64 to blob URL
    const getPreviewUrl = () => {
        // If we already have a blob URL, use it
        if (blobUrl) return blobUrl;

        // If it's a base64 data URL, it will be converted to blob in useEffect
        if (fileUrl?.startsWith('data:')) {
            return fileUrl; // Temporary, will be replaced by blob URL
        }

        // Regular URL (Cloudinary, etc.)
        let url = fileUrl.replace('http://', 'https://');
        if (!url.match(/\.(pdf|docx?|jpe?g|png|gif|webp)$/i) && url.includes('cloudinary.com')) {
            return `${url}.${ext}`;
        }
        return url;
    };

    // Get URL for downloading with proper filename
    const getDownloadUrl = () => {
        if (!fileUrl) return '';

        // If it's a base64 data URL, return as is for download
        if (fileUrl.startsWith('data:')) {
            return fileUrl;
        }

        let url = fileUrl.replace('http://', 'https://');

        // Ensure URL has extension
        if (!url.match(/\.(pdf|docx?|jpe?g|png|gif|webp)$/i)) {
            url = `${url}.${ext}`;
        }

        const downloadName = fileName || `Surya_S_Resume.${ext}`;

        if (url.includes('cloudinary.com')) {
            const parts = url.split('/upload/');
            if (parts.length === 2) {
                const [base, path] = parts;

                // Add download flag with filename
                const transformations = `fl_attachment:${encodeURIComponent(downloadName)}`;
                return `${base}/upload/${transformations}/${path}`;
            }
        }

        return url;
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoading(false);
        setError(null);
        setUseFallback(false);
    };

    const onDocumentLoadError = (error) => {
        console.error("PDF loading error:", error);
        setError(`PDF loading failed: ${error.message || 'Unknown error'}`);
        setLoading(false);
        setUseFallback(true);
    };

    const onImageLoad = () => {
        setLoading(false);
        setError(null);
    };

    const onImageError = (e) => {
        console.error("Image loading failed", e);
        setError("Failed to load image. The file may be corrupted or in an unsupported format.");
        setLoading(false);
    };

    const getFileIcon = () => {
        if (ext === 'pdf') return <FaFilePdf className="text-red-500 sm:size-6 size-5" />;
        if (['doc', 'docx'].includes(ext)) return <FaFileWord className="text-blue-500 sm:size-6 size-5" />;
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <FaFileImage className="text-green-500 sm:size-6 size-5" />;
        return <FaFilePdf className="text-gray-500 sm:size-6 size-5" />;
    };

    const getFileTypeDisplay = () => {
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

    const handleDownload = async () => {
        try {
            const downloadUrl = getDownloadUrl();

            // Handle base64 data URLs differently
            if (downloadUrl.startsWith('data:')) {
                // Create a blob from base64 and download
                const blob = convertBase64ToBlob(downloadUrl);
                if (!blob) {
                    throw new Error('Failed to create download blob');
                }

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName || `Surya_S_Resume.${ext}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                // Regular URL download
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = fileName || `Surya_S_Resume.${ext}`;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (err) {
            console.error("Download error:", err);
            alert("Failed to download file. Please try again.");
        }
    };

    const handleOpenNewTab = () => {
        // Use blob URL if available, otherwise use original
        const url = blobUrl || getPreviewUrl();

        // For base64 without blob URL, create one temporarily
        if (!blobUrl && fileUrl?.startsWith('data:')) {
            const blob = convertBase64ToBlob(fileUrl);
            if (blob) {
                const tempBlobUrl = URL.createObjectURL(blob);
                window.open(tempBlobUrl, '_blank', 'noopener,noreferrer');
                // Clean up after a delay
                setTimeout(() => URL.revokeObjectURL(tempBlobUrl), 1000);
                return;
            }
        }

        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Calculate responsive dimensions
    const getResponsiveDimensions = () => {
        const { width } = windowSize;

        if (width < 640) { // Mobile
            return {
                containerWidth: width - 32, // 16px padding on each side
                containerHeight: Math.max(400, width * 1.2),
                padding: 'p-2',
                headerPadding: 'p-3',
                buttonSize: 'text-xs px-3 py-2',
                headerGap: 'gap-2'
            };
        } else if (width < 768) { // Small tablet
            return {
                containerWidth: width - 64,
                containerHeight: Math.max(500, width * 1.1),
                padding: 'p-3',
                headerPadding: 'p-4',
                buttonSize: 'text-sm px-4 py-2',
                headerGap: 'gap-3'
            };
        } else if (width < 1024) { // Tablet
            return {
                containerWidth: width - 96,
                containerHeight: Math.max(600, width * 0.9),
                padding: 'p-4',
                headerPadding: 'p-4',
                buttonSize: 'text-sm px-4 py-2',
                headerGap: 'gap-4'
            };
        } else { // Desktop
            return {
                containerWidth: Math.min(1200, width - 128),
                containerHeight: Math.max(700, width * 0.7),
                padding: 'p-4',
                headerPadding: 'p-4',
                buttonSize: 'text-sm px-4 py-2',
                headerGap: 'gap-4'
            };
        }
    };

    const responsive = getResponsiveDimensions();

    // Render Google Docs fallback viewer for PDFs
    const renderGoogleDocsViewer = () => {
        // Google Docs viewer doesn't work with blob URLs, so we skip for base64
        if (fileUrl?.startsWith('data:') || blobUrl) {
            return (
                <div className="py-8 sm:py-12 md:py-16 lg:py-20 text-center w-full px-4">
                    <p className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-600">PDF Preview Unavailable</p>
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-4 sm:mb-6">
                        The browser's PDF viewer had trouble loading this file.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center">
                        <button
                            onClick={handleDownload}
                            className="bg-teal-500 px-4 sm:px-6 py-2 rounded hover:bg-teal-400 text-white flex items-center gap-2 transition text-xs sm:text-sm"
                        >
                            <FaDownload className="text-xs sm:text-sm" />
                            <span className="hidden xs:inline">Download to View</span>
                            <span className="xs:hidden">Download</span>
                        </button>
                    </div>
                </div>
            );
        }

        const previewUrl = getPreviewUrl();
        return (
            <div className="w-full h-full min-h-[50vh]">
                <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                    title={fileName || "Resume"}
                    className="w-full h-full border-0"
                    onLoad={() => {
                        setLoading(false);
                    }}
                    onError={(e) => {
                        console.error("Google Docs viewer failed", e);
                        setError("Unable to preview document. Please download the file to view it.");
                        setLoading(false);
                    }}
                />
            </div>
        );
    };

    // Simple PDF viewer using iframe
    const renderSimplePdfViewer = () => {
        const previewUrl = blobUrl || getPreviewUrl();

        return (
            <div className="w-full h-full flex flex-col">
                <div className="flex-1 overflow-hidden">
                    <iframe
                        src={previewUrl}
                        title={fileName || "Resume"}
                        className="w-full h-full border-0"
                        onLoad={() => {
                            setLoading(false);
                            setError(null);
                        }}
                        onError={(e) => {
                            console.error("PDF iframe loading failed", e);
                            setError("Failed to load PDF preview. Please download the file to view it.");
                            setLoading(false);
                        }}
                    />
                </div>
            </div>
        );
    };

    // Render PDF with react-pdf
    const renderReactPdfViewer = () => {
        const fileToRender = pdfFile || (blobUrl ? { url: blobUrl } : getPreviewUrl());

        return (
            <div className="w-full h-full flex flex-col">
                {numPages > 1 && (
                    <div className="flex justify-center items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 border-b">
                        <button
                            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                            disabled={pageNumber <= 1}
                            className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition text-xs sm:text-sm"
                        >
                            Previous
                        </button>
                        <span className="text-gray-700 text-xs sm:text-sm">
                            Page {pageNumber} of {numPages}
                        </span>
                        <button
                            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                            disabled={pageNumber >= numPages}
                            className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition text-xs sm:text-sm"
                        >
                            Next
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-auto flex justify-center p-2 sm:p-4 bg-gray-50">
                    <Document
                        file={fileToRender}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                            <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-20 text-gray-600">
                                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mb-2 sm:mb-4"></div>
                                <div className="text-sm sm:text-base">Loading PDF document...</div>
                            </div>
                        }
                        noData={
                            <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-20 text-gray-600">
                                <div className="text-sm sm:text-base">No PDF data available</div>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            width={Math.min(800, windowSize.width - 40)}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            loading={
                                <div className="flex items-center justify-center py-4 sm:py-8 md:py-10 text-gray-600 text-sm sm:text-base">
                                    Loading page {pageNumber}...
                                </div>
                            }
                        />
                    </Document>
                </div>
            </div>
        );
    };

    // Render Word documents
    const renderWordViewer = () => {
        // Office viewer doesn't work with blob URLs or base64
        if (fileUrl?.startsWith('data:') || blobUrl) {
            return (
                <div className="py-8 sm:py-12 md:py-16 lg:py-20 text-center w-full px-4">
                    <p className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-600">Word Document Preview</p>
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-4 sm:mb-6">
                        Word documents need to be downloaded to view properly.
                    </p>
                    <button
                        onClick={handleDownload}
                        className="bg-teal-500 px-4 sm:px-6 py-2 sm:py-3 rounded hover:bg-teal-400 text-white flex items-center gap-2 transition text-xs sm:text-sm mx-auto"
                    >
                        <FaDownload className="text-xs sm:text-sm" /> Download to View
                    </button>
                </div>
            );
        }

        const previewUrl = getPreviewUrl();
        return (
            <div className="w-full h-full min-h-[50vh]">
                <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`}
                    title={fileName || "Resume"}
                    className="w-full h-full border-0"
                    onLoad={() => {
                        setLoading(false);
                    }}
                    onError={(e) => {
                        console.error("Office Online viewer failed", e);
                        setError("Failed to load document preview. Please download the file to view it.");
                        setLoading(false);
                    }}
                />
            </div>
        );
    };

    // Render images
    const renderImageViewer = () => {
        const previewUrl = blobUrl || getPreviewUrl();
        return (
            <div className="flex justify-center items-center h-full p-2 sm:p-3 md:p-4 bg-gray-50">
                <img
                    src={previewUrl}
                    alt={fileName || "Resume"}
                    className="max-w-full max-h-full object-contain shadow-lg rounded"
                    onLoad={onImageLoad}
                    onError={onImageError}
                />
            </div>
        );
    };

    // Render appropriate viewer based on file type
    const renderViewer = () => {
        const isPdf = ext === 'pdf';
        const isWord = ['doc', 'docx'].includes(ext);
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);

        if (isPdf) {
            // For PDFs, use simple iframe viewer as primary since react-pdf has worker issues
            return renderSimplePdfViewer();
        } else if (isWord) {
            return renderWordViewer();
        } else if (isImage) {
            return renderImageViewer();
        } else {
            return (
                <div className="py-8 sm:py-12 md:py-16 lg:py-20 text-gray-600 text-center w-full px-4">
                    <p className="text-base sm:text-lg md:text-xl mb-2 sm:mb-4">Preview not available for this file type</p>
                    <button
                        onClick={handleDownload}
                        className="bg-teal-500 px-4 sm:px-6 py-2 sm:py-3 rounded hover:bg-teal-400 text-white flex items-center gap-2 transition text-xs sm:text-sm mx-auto"
                    >
                        <FaDownload className="text-xs sm:text-sm" /> Download File
                    </button>
                </div>
            );
        }
    };

    useEffect(() => {
        setLoading(true);
        setError(null);
        setUseFallback(false);
        setPageNumber(1);
        setNumPages(null);
        setPdfFile(null);

        // Convert base64 to blob URL for better performance
        if (fileUrl?.startsWith('data:')) {
            const blob = convertBase64ToBlob(fileUrl);
            if (blob) {
                const newBlobUrl = URL.createObjectURL(blob);
                setBlobUrl(newBlobUrl);
                setPdfFile(blob);
                setLoading(false);
            } else {
                console.log('Failed to create blob URL');
                setError('Failed to process file. Please try downloading instead.');
                setLoading(false);
            }
            return;
        }

        // For external URLs, set the PDF file directly
        if (fileUrl && ext === 'pdf') {
            setPdfFile(fileUrl);
            setLoading(false);
        }

        return () => {
            // Clean up blob URL when component unmounts
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [fileUrl]);

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center p-2 sm:p-3 md:p-4 overflow-auto scrollbar-hide">
            {/* Header */}
            <div className={`w-full max-w-7xl flex flex-col ${responsive.headerGap} ${responsive.headerPadding} bg-gray-800 rounded-lg`}>
                <div className="flex items-center gap-2 sm:gap-3">
                    {getFileIcon()}
                    <div className="min-w-0 flex-1">
                        <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg truncate">
                            {fileName || "Resume"}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm truncate">{getFileTypeDisplay()}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2 justify-end">
                    <button
                        onClick={handleOpenNewTab}
                        className={`bg-blue-500 rounded hover:bg-blue-400 text-white flex items-center gap-1 sm:gap-2 transition ${responsive.buttonSize}`}
                    >
                        <FaExternalLinkAlt className="text-xs sm:text-sm" />
                        <span className="hidden xs:inline">Open</span>
                    </button>
                    <button
                        onClick={handleDownload}
                        className={`bg-teal-500 rounded hover:bg-teal-400 text-white flex items-center gap-1 sm:gap-2 transition ${responsive.buttonSize}`}
                    >
                        <FaDownload className="text-xs sm:text-sm" />
                        <span className="hidden xs:inline">Download</span>
                    </button>
                    <button
                        onClick={onClose}
                        className={`bg-red-600 rounded hover:bg-red-500 text-white transition ${responsive.buttonSize} flex items-center justify-center`}
                    >
                        <FaTimes className="text-xs sm:text-sm" />
                    </button>
                </div>
            </div>

            {/* Viewer Content */}
            <div className="w-full max-w-7xl flex-1 bg-white rounded-lg shadow-2xl overflow-hidden min-h-[50vh] flex flex-col mt-2 sm:mt-3 md:mt-4">
                {loading && !error && (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-20 text-gray-600 w-full">
                        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mb-2 sm:mb-4"></div>
                        <div className="text-sm sm:text-base text-center">Loading document preview...</div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 text-center">This may take a few moments</div>
                    </div>
                )}

                {error && (
                    <div className="py-8 sm:py-12 md:py-16 lg:py-20 text-center w-full px-3 sm:px-4">
                        <p className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-red-500">Unable to preview document</p>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6 text-center">
                            {error}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center">
                            <button
                                onClick={handleOpenNewTab}
                                className="bg-blue-500 px-4 sm:px-6 py-2 rounded hover:bg-blue-400 text-white flex items-center gap-2 transition text-xs sm:text-sm"
                            >
                                <FaExternalLinkAlt className="text-xs sm:text-sm" />
                                <span className="hidden xs:inline">Open in New Tab</span>
                                <span className="xs:hidden">Open</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                className="bg-teal-500 px-4 sm:px-6 py-2 rounded hover:bg-teal-400 text-white flex items-center gap-2 transition text-xs sm:text-sm"
                            >
                                <FaDownload className="text-xs sm:text-sm" />
                                <span className="hidden xs:inline">Download File</span>
                                <span className="xs:hidden">Download</span>
                            </button>
                        </div>
                    </div>
                )}

                {!loading && !error && renderViewer()}
            </div>
        </div>
    );
}