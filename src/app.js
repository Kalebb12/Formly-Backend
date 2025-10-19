import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js'

dotenv.config()
const app = express();
app.use(cors());
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
connectDB()

export default app;