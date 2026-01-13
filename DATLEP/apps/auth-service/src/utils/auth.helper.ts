import crypto from 'crypto';
import { ValidationError } from '../../../../packages/error-handler';
import redis from '../../../../packages/libs/redis';

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
        return next(new ValidationError('Account is temporarily locked due to multiple failed OTP attempts! Try again after 30 minutes.'));
    }
    // if(await redis.get(`otp_spam_lock:${email}`)) {
    //     return next(new ValidationError('Too many OTP requests! Please wait 1 hour before requesting a new OTP.'));
    // }
    if(await redis.get(`otp_cooldown:${email}`)) {
        return next(new ValidationError('OTP recently sent! Please wait a minute before requesting a new OTP.'));
    }
 };

export const trackOtpRequest = async (email: string, next: Function) => {
    const otpRequestsKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestsKey)) || '0');

    // if(otpRequests >= 2){
    //     await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600); // 1 hour lock 
    //  return next(new ValidationError('Too many OTP requests! Please wait 1 hour before requesting a new OTP.'));   
    // }

    await redis.set(otpRequestsKey, otpRequests + 1, 'EX', 3600); // count resets after 1 hour
};

 export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const activationLink = `http://localhost:3000/activate?email=${email}&otp=${otp}`;

    // Send OTP + link in email
    await sendEmail(email, "Verify your Email", template, { name, otp, activationLink });

    // Save OTP in Redis
    await redis.set(`otp:${email}`, otp, 'EX', 300); // OTP valid 5 minutes
    await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60); // 1 minute cooldown
};