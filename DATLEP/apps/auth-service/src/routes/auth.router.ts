import express from 'express';
import { Router } from 'express';
import { bespokeForgotPassword, createShop, getLoggedInSeller, getUser, loginBespokeCreator, loginUser, paystackSetup, refreshBespokeToken, refreshSellerToken, refreshToken,registerSeller, resetBespokePassword, resetUserPassword, sellerLogin, sendBespokeCreatorOtp, skipPaymentSetup, updateBespokeCreator, userForgotPassword, userRegistration, verifyBespokeCreatorOtp, verifyBespokeForgotPassword, verifySeller, verifyUserForgotPassword, verifyUserOtp } from '../controllers/auth.controller';
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
router.post("/verify-bespoke-otp", verifyBespokeCreatorOtp);
router.post("/send-bespoke-otp", sendBespokeCreatorOtp);
router.put("/update-bespoke-creator", updateBespokeCreator);
router.post("/login-bespoke", loginBespokeCreator);
router.post("/bespoke-refresh-token", refreshBespokeToken);
router.post("/forgot-password-bespoke", bespokeForgotPassword);
router.post("/verify-bespoke-forgot-password", verifyBespokeForgotPassword);
router.post("/reset-bespoke-password", resetBespokePassword);



export default router;