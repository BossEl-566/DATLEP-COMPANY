import express from 'express';
import { Router } from 'express';
import { loginUser, resetUserPassword, userForgotPassword, userRegistration, verifyUserForgotPassword, verifyUserOtp } from '../controllers/auth.controller';


const router: Router = express.Router();

// User Registration Route
router.post('/user-registration', userRegistration);
router.post('/verify-user-otp', verifyUserOtp);
router.post('/login-user', loginUser)
router.post('/forgot-password-user', userForgotPassword);
router.post('/verify-forgot-password-otp', verifyUserForgotPassword);
router.post('/reset-password-user', resetUserPassword);


export default router;