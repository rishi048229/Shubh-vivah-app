import api from "./api";

/**
 * Settings DTO matching backend's SettingsDto
 * Backend base path: /settings
 */
export interface UserSettings {
  userId?: number;

  // Privacy
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  showDistance: boolean;
  profileVisible: boolean;
  photosRequireConnection: boolean;

  // Match Preferences
  minAge?: number;
  maxAge?: number;
  maxDistanceKm?: number;
  maritalStatus?: string[];
  religions?: string[];
  communities?: string[];
  professions?: string[];
  educationLevels?: string[];
  lifestylePreferences?: string[];

  // Notifications
  notifyNewMessage: boolean;
  notifyConnectionRequest: boolean;
  notifyConnectionAccepted: boolean;
}

/**
 * GET /settings — Get current user's settings
 */
export async function getSettings(): Promise<UserSettings> {
  const res = await api.get("/settings");
  return res.data;
}

/**
 * PUT /settings — Update current user's settings
 */
export async function updateSettings(
  data: Partial<UserSettings>,
): Promise<string> {
  const res = await api.put("/settings", data);
  return res.data;
}

/**
 * DELETE /settings/delete-account — Permanently delete account
 */
export async function deleteAccount(): Promise<string> {
  const res = await api.delete("/settings/delete-account");
  return res.data;
}
