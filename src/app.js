import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js'

dotenv.config()
const app = express();
app.use(cors());
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)

export default app;