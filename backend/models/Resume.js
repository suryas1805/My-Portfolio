import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
	fileUrl: {
		type: String,
		required: true
	},
	fileType: {
		type: String,
		required: true
	},
	fileName: {
		type: String,
		required: true
	},
	fileExtension: {
		type: String,
		required: true
	},
	resourceType: {
		type: String,
		enum: ['image', 'raw', 'auto'],
		default: 'auto'
	}
}, {
	timestamps: true
});

export default mongoose.model('Resume', resumeSchema);