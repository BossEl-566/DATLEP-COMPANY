import express from 'express';
import { Router } from 'express';
import { userRegistration } from '../controllers/auth.controller';


const router: Router = express.Router();

// User Registration Route
router.post('/user-registration', userRegistration);

export default router;