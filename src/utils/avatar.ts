/**
 * Returns a reliable avatar URL.
 * - If the user has uploaded a photo, returns that.
 * - Otherwise returns a gender-specific illustrated avatar from a reliable CDN.
 * - Falls back to an initial-based avatar if gender is unknown.
 *
 * The backend stores gender as Java enum strings like "MALE", "FEMALE",
 * or sometimes lowercase "male", "female".
 */
export const getAvatarUrl = (
  photoUrl: string | null | undefined,
  gender?: string | null,
  name?: string | null
): string => {
  // 1. User has a real profile photo
  if (photoUrl && photoUrl.trim() !== "") {
    return photoUrl;
  }

  // 2. Gender-based illustrated avatars (reliable CDN)
  const g = (gender || "").toUpperCase().trim();
  if (g === "MALE" || g === "M") {
    return "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"; // male illustration
  }
  if (g === "FEMALE" || g === "F") {
    return "https://cdn-icons-png.flaticon.com/512/4140/4140047.png"; // female illustration
  }

  // 3. Initial-based avatar for unknown gender
  if (name && name.trim() !== "") {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name.trim()
    )}&background=C21807&color=fff&bold=true&rounded=true&size=128`;
  }

  // 4. Generic person icon
  return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
};
