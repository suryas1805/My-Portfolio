import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((error) => {
            console.log('Error while connecting DB:', error)
            process.exit(1)
        });
}