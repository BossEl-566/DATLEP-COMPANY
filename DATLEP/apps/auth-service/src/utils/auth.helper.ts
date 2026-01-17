import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../../../packages/error-handler';
import redis from '../../../../packages/libs/redis';
import { User } from '@datlep/database';
import { sendEmail } from './sendMail';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data: any, userType: 'user' | 'seller') => {
    const { name, email, password, phone_number, country } = data;

    if (!name || !email || !password || (userType === 'seller' && (!phone_number || !country))) {
        throw new ValidationError('Missing required registration fields');
    }
    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format');
    }
}

export const checkOtpRestriction = async (email: string, next: Function) => {
    if(await redis.get(`otp_lock:${email}`)) {
        throw new ValidationError('Account is temporarily locked due to multiple failed OTP attempts! Try again after 30 minutes.');
    }
    if(await redis.get(`otp_spam_lock:${email}`)) {
        throw new ValidationError('Too many OTP requests! Please wait 1 hour before requesting a new OTP.');
    }
    if(await redis.get(`otp_cooldown:${email}`)) {
        throw new ValidationError('OTP recently sent! Please wait a minute before requesting a new OTP.');
    }
};

export const trackOtpRequest = async (email: string, next: Function) => {
    const otpRequestsKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestsKey)) || '0');

    if(otpRequests >= 2){
        await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600); // 1 hour lock 
        throw new ValidationError('Too many OTP requests! Please wait 1 hour before requesting a new OTP.');   
    }

    await redis.set(otpRequestsKey, otpRequests + 1, 'EX', 3600); // count resets after 1 hour
};

export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const activationLink = `http://localhost:3000/activate?email=${email}&otp=${otp}`;

    // Send OTP + link in email
    await sendEmail(email, "Verify your Email", template, { 
        name, 
        email, // Make sure email is passed
        otp, 
        activationLink 
    });

    // Save OTP in Redis
    await redis.set(`otp:${email}`, otp, 'EX', 300); // OTP valid 5 minutes
    await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60); // 1 minute cooldown
};

export const verifyOtp = async (email: string, otp: string, next: Function) => {
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) {
        throw new ValidationError('Invalid or expired OTP');
    }

    const failedAttemptsKey = `otp_failed_attempts:${email}`;
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || '0');

    if (storedOtp !== otp) {
        if (failedAttempts >= 2) {
            await redis.set(`otp_lock:${email}`, 'locked', 'EX', 1800);
            await redis.del(`otp:${email}`, failedAttemptsKey);
            throw new ValidationError('Account locked due to multiple failed OTP attempts! Try again after 30 minutes.');
        }
        await redis.set(failedAttemptsKey, failedAttempts + 1, 'EX', 300);
        throw new ValidationError(`Incorrect OTP. You have ${2 - failedAttempts} attempts left.`);
    };
    await redis.del(`otp:${email}`, failedAttemptsKey);
}

export const handleForgotPassword = async (
    req: Request, 
    res: Response, 
    next: NextFunction, 
    userType: 'user' | 'seller'
) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new ValidationError('Email is required');
        }  
        
        // Find user/seller in DB
        const user = await User.findOne({ email }).lean();
        if (!user) {
            throw new ValidationError(`${userType} with this email does not exist`);
        }

        // Check OTP restrictions - these will throw errors if restrictions exist
        await checkOtpRestriction(email, next);
        await trackOtpRequest(email, next);
        await sendOtp(user.name, email, 'forgot-password-mail');
        
        res.status(200).json({
            message: 'OTP sent to email for password reset'
        });
    } catch (error) {
        // Pass the error to the error handling middleware
        return next(error);   
    }
};

export const verifyForgotPasswordOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            throw new ValidationError("Email and OTP are required");
        }
        await verifyOtp(email, otp, next);
        res.status(200).json({
            message: 'OTP verified successfully'
        });
    } catch (error) {
        return next(error); 
    }
};