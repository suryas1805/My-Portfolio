import mongoose, { Schema } from 'mongoose';

const SkillSchema = new Schema({
	name: { type: String, required: true },
	level: { type: String },
	image: String
});

export default mongoose.model('Skill', SkillSchema);
