import dotenv from 'dotenv'
dotenv.config()
import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
	Brevo.TransactionalEmailsApiApiKeys.apiKey,
	process.env.BREVO_API_KEY
);

export const sendMail = async ({ to, subject, html }) => {
	try {
		const emailData = {
			sender: {
				name: "Surya",
				email: process.env.MAIL_FROM
			},
			to: [{ email: to }],
			subject,
			htmlContent: html,
		};

		await apiInstance.sendTransacEmail(emailData);

	} catch (error) {
		console.log("BREVO ERROR:", error.response?.body || error);
	}
};
