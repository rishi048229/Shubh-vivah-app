// Validation helper functions

export const getPasswordError = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password))
    return "Password must contain an uppercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  if (/\s/.test(password)) return "Password cannot contain spaces";
  return null;
};
