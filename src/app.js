import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js'
import formRoute from './routes/formRoutes.js'
import paymentRoute from './routes/paymentRoutes.js'
import webhookRouter from './routes/webHookRoutes.js'
import planRoute from './routes/planRoute.js'

dotenv.config()
const app = express();
app.use("/stripe_webhooks", webhookRouter);

app.use(cors());
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/form',formRoute)
app.use('/api/plans',planRoute)
app.use('/api/checkout',paymentRoute)


export default app;