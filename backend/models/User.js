import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	contact: {
		phone_number: String,
		alt_phone_number: String,
		city: String,
		state: String,
	},
	image: String,
	designation: String,
	social_links: {
		linkedIn: String,
	},
	summary: String
});

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
