import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
	fileUrl: {
		type: String,
		required: true,
	},
	fileType: {
		type: String,
		required: true,
	},
	fileName: {
		type: String,
		required: true,
	},
	fileExtension: {
		type: String,
		required: true,
	},
	resourceType: {
		type: String,
		default: 'base64',
	},
	fileSize: {
		type: Number,
		required: false,
	},
	uploadedAt: {
		type: Date,
		default: Date.now,
	}
}, {
	timestamps: true
});

const Resume = mongoose.model('Resume', ResumeSchema);

export default Resume;