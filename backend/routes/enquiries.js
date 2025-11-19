import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import Enquiry from '../models/Enquiry.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sendMail } from '../utils/mailer.js';
import { adminNotificationTemplate, adminReplyTemplate, userAutoReplyTemplate } from '../utils/emailTemplates.js';

const router = express.Router();

// Create enquiry (public)
router.post('/', async (req, res) => {
	const { name, email, message } = req.body;
	const enquiry = new Enquiry({ name, email, message });
	await enquiry.save();

	try {
		// Email to YOU
		await sendMail({
			to: process.env.ADMIN_EMAIL,
			subject: `New Portfolio enquiry from ${name}`,
			html: adminNotificationTemplate(name, email, message)
		});

		// Auto reply to USER
		await sendMail({
			to: email,
			subject: 'Thank You for Contacting Me!',
			html: userAutoReplyTemplate(name)
		});

		return res.json({ success: true, msg: "Enquiry sent" });
	} catch (err) {
		console.error("Enquiry error:", err);
		return res.status(500).json({ success: false, msg: "Server error" });
	}
});


// Get all enquiries (admin)
router.get('/', authMiddleware, async (req, res) => {
	const enquiries = await Enquiry.find().sort({ createdAt: -1 });
	res.json(enquiries);
});

// Reply enquiry (admin)
router.post('/:id/reply', authMiddleware, async (req, res) => {
	const { reply } = req.body;
	const enquiry = await Enquiry.findById(req.params.id);
	if (!enquiry) return res.status(404).json({ success: false, msg: 'Enquiry not found' });

	enquiry.replied = true;
	enquiry.replyMessage = reply
	await enquiry.save();

	try {
		await sendMail({
			to: enquiry.email,
			subject: 'Response to Your Enquiry',
			html: adminReplyTemplate(enquiry.name, reply)
		});


		res.json({ success: true, msg: 'Reply sent' });
	} catch (err) {
		console.log("Enquiry reply error:", err)
		res.status(500).json({ success: false, msg: 'Error sending mail' });
	}
});


export default router;
