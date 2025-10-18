import express from 'express';
import Skill from '../models/Skill.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all skills (public)
router.get('/', async (req, res) => {
	const skills = await Skill.find();
	res.status(200).json(skills);
});

// Add skill (admin)
router.post('/', authMiddleware, async (req, res) => {
	const { name, level } = req.body;
	const skill = new Skill({ name, level });
	await skill.save();
	res.status(200).json(skill);
});

// Update skill
router.put('/:id', authMiddleware, async (req, res) => {
	const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.status(200).json(skill);
});

// Delete skill
router.delete('/:id', authMiddleware, async (req, res) => {
	await Skill.findByIdAndDelete(req.params.id);
	res.status(200).json({ msg: 'Skill deleted' });
});

export default router;
