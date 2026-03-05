import api from "./api";

// ========================
// TYPES
// ========================

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface RegisterResponse {
  userId: number;
  message: string;
  isVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  token: string;
  message: string;
}

export interface VerifyOtpRequest {
  userId: number;
  otp: string;
}

export interface PasswordResponse {
  message: string;
  token?: string;
}

export interface ResendOtpResponse {
  userId: number;
  message: string;
}

// ========================
// AUTH API CALLS
// ========================

/**
 * POST /auth/register
 * Creates a new user account and sends OTP for email verification.
 */
export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const res = await api.post("/auth/register", data);
  return res.data;
}

/**
 * POST /auth/login
 * Authenticates user with email + password. Returns JWT token.
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

/**
 * POST /auth/verify-registration-otp
 * Verifies the OTP sent during registration to activate the account.
 */
export async function verifyRegistrationOtp(
  userId: number,
  otp: string
): Promise<RegisterResponse> {
  const res = await api.post("/auth/verify-registration-otp", { userId, otp });
  return res.data;
}

/**
 * POST /auth/verify-login-otp
 * Verifies OTP during login (if OTP-based login is enforced).
 */
export async function verifyLoginOtp(
  userId: number,
  otp: string
): Promise<LoginResponse> {
  const res = await api.post("/auth/verify-login-otp", { userId, otp });
  return res.data;
}

/**
 * POST /auth/forgot-password
 * Sends a password reset token/email to the user.
 */
export async function forgotPassword(
  email: string
): Promise<PasswordResponse> {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
}

/**
 * POST /auth/reset-password
 * Resets the user's password using the reset token.
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<PasswordResponse> {
  const res = await api.post("/auth/reset-password", { token, newPassword });
  return res.data;
}

/**
 * POST /otp/send/{userId}
 * Manually trigger OTP generation for a user.
 */
export async function sendOtp(userId: number): Promise<string> {
  const res = await api.post(`/otp/send/${userId}`);
  return res.data;
}

/**
 * POST /otp/resend
 * Resend OTP to the user's email.
 */
export async function resendOtp(
  email: string
): Promise<ResendOtpResponse> {
  const res = await api.post("/otp/resend", { email });
  return res.data;
}
