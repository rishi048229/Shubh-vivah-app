export const getAvatarUrl = (
  photoUrl: string | null | undefined,
  gender?: string | null,
  name?: string | null
): string => {
  if (photoUrl && photoUrl.trim() !== "") {
    return photoUrl;
  }

  const normalizedGender = gender?.toLowerCase().trim();

  // If we know gender, use cute illustration fallbacks
  if (normalizedGender === "male") {
    return "https://avatar.iran.liara.run/public/boy";
  } else if (normalizedGender === "female") {
    return "https://avatar.iran.liara.run/public/girl";
  }

  // If we don't know gender, provide an initial-based avatar or a generic placeholder
  if (name && name.trim() !== "") {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&color=fff&rounded=true`;
  }

  return "https://cdn-icons-png.flaticon.com/512/847/847969.png"; // generic person icon
};
