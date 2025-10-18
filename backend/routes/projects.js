import express from 'express';
import Project from '../models/Project.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';
import upload from '../middleware/cloudinaryUpload.js';

const router = express.Router();

// Get all projects (public)
router.get('/', async (req, res) => {
	try {
		const projects = await Project.find();
		res.json(projects);
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Server error' });
	}
});

// Add project
router.post('/', authMiddleware, (req, res, next) => {
	upload.single('image')(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			if (err.code === 'LIMIT_FILE_SIZE') {
				return res.status(400).json({ msg: 'Image size should not exceed 10MB' });
			}
			return res.status(400).json({ msg: err.message });
		} else if (err) {
			return res.status(500).json({ msg: 'Upload error', error: err });
		}
		next();
	});
}, async (req, res) => {
	try {
		const { title, description, techStack } = req.body;

		// Ensure HTTPS URL for images
		const imageUrl = req.file ? req.file.path.replace('http://', 'https://') : null;

		const project = new Project({
			title,
			description,
			techStack: typeof techStack === 'string' ? techStack.split(',') : techStack,
			image: imageUrl,
		});
		await project.save();
		res.status(201).json(project);
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Server error', error: err.message });
	}
});

// Update project
router.put('/:id', authMiddleware, (req, res, next) => {
	upload.single('image')(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			if (err.code === 'LIMIT_FILE_SIZE') {
				return res.status(400).json({ msg: 'Image size should not exceed 10MB' });
			}
			return res.status(400).json({ msg: err.message });
		} else if (err) {
			return res.status(500).json({ msg: 'Upload error', error: err.message });
		}
		next();
	});
}, async (req, res) => {
	try {
		const data = { ...req.body };

		// Handle techStack conversion
		if (data.techStack && typeof data.techStack === 'string') {
			data.techStack = data.techStack.split(',');
		}

		// Update image URL with HTTPS if new image is uploaded
		if (req.file) {
			data.image = req.file.path.replace('http://', 'https://');
		}

		const project = await Project.findByIdAndUpdate(
			req.params.id,
			data,
			{ new: true }
		);

		if (!project) {
			return res.status(404).json({ msg: 'Project not found' });
		}

		res.json(project);
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Server error', error: err.message });
	}
});

// Delete project
router.delete('/:id', authMiddleware, async (req, res) => {
	try {
		const project = await Project.findByIdAndDelete(req.params.id);
		if (!project) {
			return res.status(404).json({ msg: 'Project not found' });
		}
		res.json({ msg: 'Project deleted successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Server error' });
	}
});

export default router;