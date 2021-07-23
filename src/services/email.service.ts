import nodemailer from 'nodemailer';
import { emailConfig } from '../config/email';
import logger from '../utils/logger';

export const transport = nodemailer.createTransport(emailConfig.smtp);
//TODO uncomment
// transport
//   .verify()
//   .then(() => logger.info('Connected to email server'))
//   .catch(() => logger.warn('Unable to connect to email server'));

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
export const sendEmail = async (to: string, subject: string, text: string) => {
  const msg = { from: emailConfig.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = 'Reset Password';
  const resetPasswrodUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user, To reset your password, click on this link ${resetPasswrodUrl}
    If you did not request any password reset, then ignore this email`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export const sendVerificationEmail = async (to: string, token: string) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;

  const text = `Dear user,
    To verify your email, click on this link: ${verificationEmailUrl}
    If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};
