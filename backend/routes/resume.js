import express from 'express';
import Resume from '../models/Resume.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import upload from '../middleware/cloudinaryUpload.js';

const router = express.Router();

function sanitizeFileName(name) {
	// Remove any path information and sanitize
	const baseName = name.replace(/^.*[\\/]/, '');
	// Replace spaces and special characters, but keep the extension
	const nameWithoutExt = baseName.includes('.')
		? baseName.split('.').slice(0, -1).join('.')
		: baseName;
	const ext = baseName.includes('.')
		? baseName.split('.').pop()
		: '';

	const sanitized = nameWithoutExt
		.replace(/[^a-zA-Z0-9\s_-]/g, '')
		.trim();

	return ext ? `${sanitized}.${ext}` : sanitized;
}


// Upload or update resume (admin)
router.post('/', authMiddleware, (req, res, next) => {
	upload.single('file')(req, res, function (err) {
		if (err) {
			if (err.code === 'LIMIT_FILE_SIZE') {
				return res.status(400).json({ msg: 'File size should not exceed 10MB' });
			}
			if (err.message.includes('Invalid file type')) {
				return res.status(400).json({ msg: err.message });
			}
			return res.status(500).json({ msg: 'Upload error', error: err.message });
		}
		next();
	});
}, async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ msg: 'File required' });

		const originalName = req.file.originalname;
		const fileExtension = originalName.includes('.')
			? originalName.split('.').pop().toLowerCase()
			: getExtensionFromMimetype(req.file.mimetype);

		// Sanitize the filename
		const sanitizedFileName = sanitizeFileName(originalName);

		let fileUrl = req.file.path;
		fileUrl = fileUrl.replace('http://', 'https://');

		if (req.file.resource_type === 'raw') {
			fileUrl = req.file.secure_url || req.file.url;
		}

		let resume = await Resume.findOne();
		if (resume) {
			resume.fileUrl = fileUrl;
			resume.fileType = req.file.mimetype;
			resume.fileName = sanitizedFileName;
			resume.fileExtension = fileExtension;
			resume.resourceType = req.file.resource_type;
			await resume.save();
		} else {
			resume = new Resume({
				fileUrl: fileUrl,
				fileType: req.file.mimetype,
				fileName: sanitizedFileName, 
				fileExtension: fileExtension,
				resourceType: req.file.resource_type
			});
			await resume.save();
		}

		res.status(200).json({
			msg: 'Resume uploaded successfully',
			resume: {
				fileUrl: resume.fileUrl,
				fileType: resume.fileType,
				fileName: resume.fileName,
				fileExtension: resume.fileExtension,
				resourceType: resume.resourceType
			}
		});
	} catch (err) {
		console.error('Upload error:', err);
		res.status(500).json({ msg: 'Server error', error: err.message });
	}
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

// Update the GET route to include fileExtension
router.get('/', async (req, res) => {
	try {
		const resume = await Resume.findOne();
		if (!resume) return res.status(404).json({ msg: 'Resume not found' });

		res.status(200).json({
			fileUrl: resume.fileUrl,
			fileType: resume.fileType,
			fileName: resume.fileName,
			fileExtension: resume.fileExtension,
			resourceType: resume.resourceType
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Server error' });
	}
});

// Delete resume (admin)
router.delete('/', authMiddleware, async (req, res) => {
	try {
		const resume = await Resume.findOne();
		if (!resume) return res.status(404).json({ msg: 'Resume not found' });

		await Resume.deleteOne();
		res.status(200).json({ msg: 'Resume deleted successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Server error' });
	}
});

export default router;