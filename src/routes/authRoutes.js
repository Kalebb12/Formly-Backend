import express from 'express'
import { forgotPassword, loginUser, logoutUser, passwordReset, registerUser } from '../controllers/authController.js'

const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',logoutUser)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',passwordReset)

export default router