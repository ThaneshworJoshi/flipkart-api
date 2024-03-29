const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const ACCESS_TOKEN_EXP_MINUTES = process.env.JWT_ACCESS_EXPIRATION_MINUTES || 1;
const REFRESH_TOKEN_EXP_DAYS = process.env.JWT_REFRESH_EXPIRATION_DAYS || 5;

const RESET_PASSWORD_EXP_MINUTES = process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES || 30;
const VERIFY_EMAIL_EXPIRATION_MINUTES = process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES || 30;

export const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'reset-password',
  VERIFY_EMAIL: 'verify-email',
};

export default {
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXP_MINUTES,
  REFRESH_TOKEN_EXP_DAYS,
  RESET_PASSWORD_EXP_MINUTES,
  VERIFY_EMAIL_EXPIRATION_MINUTES,
};
