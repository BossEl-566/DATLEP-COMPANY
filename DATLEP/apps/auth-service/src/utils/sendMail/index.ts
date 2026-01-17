import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Render EJS template
const renderEmailTemplate = async (templateName: string, data: any): Promise<string> => {
    const templatePath = path.join(
        process.cwd(),
        'apps',
        'auth-service',
        'src',
        'utils',
        'email-templates',
        `${templateName}.ejs`
    );
    return ejs.renderFile(templatePath, data);
};

// Send an email using nodemailer
export const sendEmail = async (
    to: string, 
    subject: string, 
    templateName: string, 
    data: Record<string, any>
): Promise<boolean> => {
    try {
        // Always include the email in the template data
        const templateData = {
            ...data,
            email: to, // Add email to template data
        };

        const html = await renderEmailTemplate(templateName, templateData);
        
        await transporter.sendMail({
            from: `DATLEP <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });
        
        console.log(`Email sent successfully to ${to}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

// Specialized email sending functions
export const sendOtpEmail = async (
    to: string,
    name: string,
    otp: string,
    templateName: 'user-activation-mail' | 'forgot-password-mail'
): Promise<boolean> => {
    const activationLink = `http://localhost:3000/activate?email=${to}&otp=${otp}`;
    
    return await sendEmail(
        to,
        templateName === 'forgot-password-mail' 
            ? "Reset Your DATLEP Password" 
            : "Verify Your DATLEP Account",
        templateName,
        { 
            name, 
            email: to, 
            otp, 
            activationLink 
        }
    );
};

export const sendPasswordResetConfirmation = async (
    to: string,
    name: string
): Promise<boolean> => {
    return await sendEmail(
        to,
        "Password Reset Successful | DATLEP",
        "password-reset-confirmation",
        { 
            name, 
            email: to 
        }
    );
};