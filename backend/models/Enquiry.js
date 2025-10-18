import mongoose, { Schema } from 'mongoose';

const EnquirySchema = new Schema(
	{
		name: String,
		email: String,
		message: String,
		replied: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export default mongoose.model('Enquiry', EnquirySchema);
