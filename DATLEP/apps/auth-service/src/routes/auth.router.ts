import express from 'express';
import { Router } from 'express';
import { loginUser, userRegistration, verifyUserOtp } from '../controllers/auth.controller';


const router: Router = express.Router();

// User Registration Route
router.post('/user-registration', userRegistration);
router.post('/verify-user-otp', verifyUserOtp);
router.post('/login-user', loginUser)


export default router;