import api from "./api";

/**
 * Determine if identifier is email or mobile
 */
function buildAuthBody(identifier: string) {
  const trimmed = identifier.trim();
  if (trimmed.includes("@")) {
    return { email: trimmed };
  }
  return { mobile: trimmed.replace(/\s+/g, "") };
}

/**
 * POST /auth/send-otp
 * Creates user if not exists, sends OTP (printed to backend console)
 */
export async function sendOtp(identifier: string): Promise<string> {
  const body = buildAuthBody(identifier);
  const res = await api.post("/auth/send-otp", body);
  return res.data; // "OTP sent ✅"
}

/**
 * POST /auth/verify-otp
 */
export async function verifyOtp(
  identifier: string,
  otp: string,
): Promise<string> {
  const body = { ...buildAuthBody(identifier), otp };
  const res = await api.post("/auth/verify-otp", body);
  return res.data; // "OTP verified ✅"
}

/**
 * POST /auth/set-password
 */
export async function setPassword(
  identifier: string,
  password: string,
  confirmPassword: string,
): Promise<string> {
  const body = { ...buildAuthBody(identifier), password, confirmPassword };
  const res = await api.post("/auth/set-password", body);
  return res.data; // "Password set"
}

/**
 * POST /auth/login
 * Returns { email/mobile, token }
 */
export async function login(
  identifier: string,
  password: string,
): Promise<{ token: string; email?: string; mobile?: string }> {
  const body = { ...buildAuthBody(identifier), password };
  const res = await api.post("/auth/login", body);
  return res.data;
}

/**
 * POST /auth/forgotpassword
 */
export async function forgotPassword(identifier: string): Promise<string> {
  const body = buildAuthBody(identifier);
  const res = await api.post("/auth/forgotpassword", body);
  return res.data;
}

/**
 * POST /auth/resetpassotp
 */
export async function verifyResetOtp(
  identifier: string,
  otp: string,
): Promise<string> {
  const body = { ...buildAuthBody(identifier), otp };
  const res = await api.post("/auth/resetpassotp", body);
  return res.data;
}

/**
 * POST /auth/resetpassword
 */
export async function resetPassword(
  identifier: string,
  password: string,
  confirmPassword: string,
): Promise<string> {
  const body = { ...buildAuthBody(identifier), password, confirmPassword };
  const res = await api.post("/auth/resetpassword", body);
  return res.data;
}
