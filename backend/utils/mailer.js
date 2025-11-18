import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

export const sendMail = async (to, subject, html) => {
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASS,
		},
	});

	await transporter.sendMail({ from: process.env.EMAIL, to, subject, html });
};
