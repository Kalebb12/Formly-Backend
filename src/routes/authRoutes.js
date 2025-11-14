import express from 'express'
import { forgotPassword,verifyEmail ,getUser ,loginUser, logoutUser, passwordReset, registerUser } from '../controllers/authController.js'
import { protect } from '../middleware/protect.js'

const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',logoutUser)
router.post('/verify-email',verifyEmail)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',passwordReset)
router.get("/me",protect,getUser)

export default router 