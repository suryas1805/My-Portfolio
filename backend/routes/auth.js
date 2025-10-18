import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

		const isMatch = await user.comparePassword(password);
		if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});

		const userWithoutPassword = user.toObject()
		delete userWithoutPassword.password

		res.status(200).json({ success: true, message: 'Login successful', data: { token, user: userWithoutPassword } });
	} catch (err) {
		res.status(500).json({ msg: 'Internal Server error' });
	}
});

// Register admin
router.post('/register', async (req, res) => {
	try {
		const existing = await User.findOne({ email: req.body.email });
		if (existing) return res.status(400).json({ msg: 'Email already exists' });

		const newUser = new User(req.body);
		await newUser.save();
		res.status(201).json({
			success: true,
			message: "Registration successful"
		});
	} catch (err) {
		res.status(500).json({ msg: 'Internal Server error' });
	}
});

// about me
router.get('/me', authMiddleware, async (req, res) => {
	try {
		const user = req.user

		res.status(200).json({
			success: true,
			message: "Registration successful",
			user
		});
	} catch (err) {
		res.status(500).json({ msg: 'Internal Server error' });
	}
});

//logout 
router.post('/logout', authMiddleware, async (req, res) => {
	try {
		res.status(200).json({ msg: 'Logout successful' })
	} catch (error) {
		res.status(500).json({ msg: 'Internal Server error' });
	}
})

export default router;
