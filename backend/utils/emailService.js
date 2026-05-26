// import nodemailer from 'nodemailer';

// // Create transporter
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     service: process.env.EMAIL_SERVICE,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });
// };

// // Send verification email
// export const sendVerificationEmail = async (email, name, otp) => {
//   try {
//     const transporter = createTransporter();
    
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Verify Your Email - CryptoMarket',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #1EB980; text-align: center;">Welcome to CryptoMarket!</h2>
//           <p>Hello ${name},</p>
//           <p>Thank you for registering with CryptoMarket. To complete your registration, please use the verification code below:</p>
//           <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
//             ${otp}
//           </div>
//           <p>This code will expire in 30 minutes.</p>
//           <p>If you did not request this, please ignore this email.</p>
//           <p>Regards,<br>The CryptoMarket Team</p>
//         </div>
//       `
//     };
    
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//     throw new Error('Failed to send verification email');
//   }
// };

// // Send password reset email
// export const sendPasswordResetEmail = async (email, name, resetUrl) => {
//   try {
//     const transporter = createTransporter();
    
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Reset Your Password - CryptoMarket',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #1EB980; text-align: center;">Password Reset</h2>
//           <p>Hello ${name},</p>
//           <p>You have requested to reset your password. Click the button below to reset it:</p>
//           <div style="text-align: center; margin: 25px 0;">
//             <a href="${resetUrl}" style="background-color: #1EB980; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
//           </div>
//           <p>This link will expire in 1 hour.</p>
//           <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
//           <p>Regards,<br>The CryptoMarket Team</p>
//         </div>
//       `
//     };
    
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error('Error sending password reset email:', error);
//     throw new Error('Failed to send password reset email');
//   }
// };

import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail', // Defaults to Gmail if not provided
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send OTP verification email
export const sendVerificationEmail = async (email, name, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"CryptoMarket" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code - CryptoMarket',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1EB980; text-align: center;">OTP Verification</h2>
          <p>Hello ${name},</p>
          <p>Use the OTP code below to verify your email address:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Regards,<br>The CryptoMarket Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"CryptoMarket" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - CryptoMarket',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1EB980; text-align: center;">Password Reset</h2>
          <p>Hello ${name},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" style="background-color: #1EB980; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Regards,<br>The CryptoMarket Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};
