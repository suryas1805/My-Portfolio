import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import skillRoutes from './routes/skills.js';
import projectRoutes from './routes/projects.js';
import enquiryRoutes from './routes/enquiries.js';
import resumeRoutes from './routes/resume.js';
import { connectDB } from './config/db.js';

connectDB()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['https://suryas1805-portfolio.netlify.app', 'http://localhost:5173'],
    // origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/resume', resumeRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});


