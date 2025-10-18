import mongoose, { Schema } from 'mongoose';

const ProjectSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	image: { type: String },
	techStack: { type: [String], default: [] }
});

export default mongoose.model('Project', ProjectSchema);
