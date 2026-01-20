import express from 'express';
import { Router } from 'express';
import { createShop, getLoggedInSeller, getUser, loginUser, paystackSetup, refreshSellerToken, refreshToken, registerSeller, resetUserPassword, sellerLogin, skipPaymentSetup, userForgotPassword, userRegistration, verifySeller, verifyUserForgotPassword, verifyUserOtp } from '../controllers/auth.controller';
import isUserAuthenticated from '../../../../packages/middleware/isUserAuthenticated';
import isSellerAuthenticated from '../../../../packages/middleware/isSellerAuthenticated';


const router: Router = express.Router();

// User Registration Route
router.get('/logged-in-seller', isSellerAuthenticated, getLoggedInSeller);
router.post('/seller-refresh-token', refreshSellerToken);
router.post('/user-registration', userRegistration);
router.post('/verify-user-otp', verifyUserOtp);
router.post('/login-user', loginUser);
router.post('/refresh-token', refreshToken);
router.get('/logged-in-user', isUserAuthenticated, getUser);
router.post('/forgot-password-user', userForgotPassword);
router.post('/verify-forgot-password-otp', verifyUserForgotPassword);
router.post('/reset-password-user', resetUserPassword);
router.post('/seller-registration', registerSeller);
router.post('/verify-seller-otp', verifySeller);
router.post('/create-shop', createShop);
router.post('/skip-seller-payment', skipPaymentSetup )
router.post('/paystack-webhook', paystackSetup );
router.post('/seller-login', sellerLogin);



export default router;