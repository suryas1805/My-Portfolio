import express from 'express';
import Enquiry from '../models/Enquiry.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sendMail } from '../utils/mailer.js';

const router = express.Router();

// Create enquiry (public)
router.post('/', async (req, res) => {
	const { name, email, message } = req.body;
	const enquiry = new Enquiry({ name, email, message });
	await enquiry.save();

	// Send mail to admin
	try {
		await sendMail(
			process.env.EMAIL,
			'New Portfolio Enquiry',
			`
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
		);
	} catch (err) {
		console.error(err);
	}

	res.json({ msg: 'Enquiry sent' });
});

// Get all enquiries (admin)
router.get('/', authMiddleware, async (req, res) => {
	const enquiries = await Enquiry.find().sort({ createdAt: -1 });
	res.json(enquiries);
});

// Reply to enquiry (admin)
router.post('/:id/reply', authMiddleware, async (req, res) => {
	const { replyMessage } = req.body;
	const enquiry = await Enquiry.findById(req.params.id);
	if (!enquiry) return res.status(404).json({ msg: 'Enquiry not found' });

	try {
		await sendMail(enquiry.email, 'Reply to your enquiry', replyMessage);
		enquiry.replied = true;
		await enquiry.save();
		res.json({ msg: 'Reply sent' });
	} catch (err) {
		res.status(500).json({ msg: 'Error sending mail' });
	}
});

export default router;
