import express from 'express';
import { Router } from 'express';
import { createShop, getUser, loginUser, refreshToken, registerSeller, resetUserPassword, userForgotPassword, userRegistration, verifySeller, verifyUserForgotPassword, verifyUserOtp } from '../controllers/auth.controller';
import isAuthenticated from '../../../../packages/middleware/isAuthenticated';


const router: Router = express.Router();

// User Registration Route
router.post('/user-registration', userRegistration);
router.post('/verify-user-otp', verifyUserOtp);
router.post('/login-user', loginUser);
router.post('/refresh-token', refreshToken);
router.get('/logged-in-user', isAuthenticated, getUser);
router.post('/forgot-password-user', userForgotPassword);
router.post('/verify-forgot-password-otp', verifyUserForgotPassword);
router.post('/reset-password-user', resetUserPassword);
router.post('/seller-registration', registerSeller);
router.post('/verify-seller-otp', verifySeller);
router.post('/create-shop', createShop);


export default router;