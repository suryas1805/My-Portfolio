import express from 'express';
import Resume from '../models/Resume.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for memory storage (NO CLOUDINARY)
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const allowedTypes = [
			'image/jpeg',
			'image/jpg',
			'image/png',
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		];

		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error('Invalid file type. Only JPG, PNG, PDF, and DOCX are allowed.'), false);
		}
	}
});

function sanitizeFileName(name) {
	const baseName = name.replace(/^.*[\\/]/, '');
	const nameWithoutExt = baseName.includes('.')
		? baseName.split('.').slice(0, -1).join('.')
		: baseName;
	const ext = baseName.includes('.')
		? baseName.split('.').pop()
		: '';

	const sanitized = nameWithoutExt
		.replace(/[^a-zA-Z0-9\s_-]/g, '_')
		.replace(/\s+/g, '_')
		.trim();

	return ext ? `${sanitized}.${ext}` : sanitized;
}

function getExtensionFromMimetype(mimetype) {
	const extensionMap = {
		'image/jpeg': 'jpg',
		'image/jpg': 'jpg',
		'image/png': 'png',
		'application/pdf': 'pdf',
		'application/msword': 'doc',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
	};
	return extensionMap[mimetype] || 'file';
}

// Upload or update resume (COMPLETELY CLOUDINARY-FREE)
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ msg: 'File required' });
		}

		const originalName = req.file.originalname;
		const fileExtension = originalName.includes('.')
			? originalName.split('.').pop().toLowerCase()
			: getExtensionFromMimetype(req.file.mimetype);

		const sanitizedFileName = sanitizeFileName(originalName);

		// Store file as Base64 in MongoDB (NO CLOUDINARY AT ALL)
		const base64Data = req.file.buffer.toString('base64');
		const fileUrl = `data:${req.file.mimetype};base64,${base64Data}`;

		let resume = await Resume.findOne();
		if (resume) {
			resume.fileUrl = fileUrl;
			resume.fileType = req.file.mimetype;
			resume.fileName = sanitizedFileName;
			resume.fileExtension = fileExtension;
			resume.resourceType = 'base64';
			resume.fileSize = req.file.size;
			await resume.save();
		} else {
			resume = new Resume({
				fileUrl: fileUrl,
				fileType: req.file.mimetype,
				fileName: sanitizedFileName,
				fileExtension: fileExtension,
				resourceType: 'base64',
				fileSize: req.file.size
			});
			await resume.save();
		}

		res.status(200).json({
			msg: 'Resume uploaded successfully',
			resume: {
				fileUrl: 'Stored as Base64 in database',
				fileType: resume.fileType,
				fileName: resume.fileName,
				fileExtension: resume.fileExtension,
				resourceType: resume.resourceType,
				fileSize: resume.fileSize
			}
		});
	} catch (err) {
		console.error('Upload error:', err);
		res.status(500).json({ msg: 'Server error', error: err.message });
	}
});

// Get resume
router.get('/', async (req, res) => {
	try {
		const resume = await Resume.findOne();
		if (!resume) {
			return res.status(404).json({ msg: 'Resume not found' });
		}

		res.status(200).json({
			fileUrl: resume.fileUrl,
			fileType: resume.fileType,
			fileName: resume.fileName,
			fileExtension: resume.fileExtension,
			resourceType: resume.resourceType,
			fileSize: resume.fileSize
		});
	} catch (err) {
		console.error('Error fetching resume:', err);
		res.status(500).json({ msg: 'Server error' });
	}
});

// Delete resume
router.delete('/', authMiddleware, async (req, res) => {
	try {
		const resume = await Resume.findOne();
		if (!resume) {
			return res.status(404).json({ msg: 'Resume not found' });
		}

		await Resume.deleteOne();
		res.status(200).json({ msg: 'Resume deleted successfully' });
	} catch (err) {
		console.error('Error deleting resume:', err);
		res.status(500).json({ msg: 'Server error' });
	}
});

export default router;