import api from "./api";

export interface MatchProfile {
  userId: number;
  fullName: string;
  age: number;
  city: string;
  religion?: string;
  matchScore: number;
  profilePhotoUrl: string;
  photos: string[];
  distanceKm: number | null;
  distanceText: string | null;
  occupation?: string;
  education?: string;
  caste?: string;
  maritalStatus?: string;
}

export interface UserRelation {
  id: number;
  fromUserId: number;
  toUserId: number;
  type: "LIKE" | "SHORTLIST" | "BLOCK" | "MATCH" | "REQUEST" | "REPORT";
  reportReason?: string;
}

/**
 * GET /matches/explore/next — Get next explore profile
 */
export async function exploreNext(): Promise<MatchProfile | null> {
  const res = await api.get("/matches/explore/next");
  return res.data;
}

/**
 * GET /matches/explore/previous — Get previous explore profile
 */
export async function explorePrevious(): Promise<MatchProfile | null> {
  const res = await api.get("/matches/explore/previous");
  return res.data;
}

/**
 * GET /matches/profile/:userId — View full profile
 */
export async function viewFullProfile(userId: number): Promise<any> {
  const res = await api.get(`/matches/profile/${userId}`);
  return res.data;
}

/**
 * POST /matches/explore/like/:userId
 */
export async function likeUser(userId: number): Promise<string> {
  const res = await api.post(`/matches/explore/like/${userId}`);
  return res.data;
}

/**
 * POST /matches/explore/shortlist/:userId
 */
export async function shortlistUser(userId: number): Promise<string> {
  const res = await api.post(`/matches/explore/shortlist/${userId}`);
  return res.data;
}

/**
 * POST /matches/explore/block/:userId
 */
export async function blockUser(userId: number): Promise<string> {
  const res = await api.post(`/matches/explore/block/${userId}`);
  return res.data;
}

/**
 * POST /matches/explore/unblock/:userId
 */
export async function unblockUser(userId: number): Promise<string> {
  const res = await api.post(`/matches/explore/unblock/${userId}`);
  return res.data;
}

/**
 * POST /matches/request/:toUserId — Send connection request
 */
export async function sendRequest(toUserId: number): Promise<void> {
  await api.post(`/matches/request/${toUserId}`);
}

/**
 * POST /matches/accept/:fromUserId — Accept connection request (creates MATCH)
 */
export async function acceptRequest(fromUserId: number): Promise<void> {
  await api.post(`/matches/accept/${fromUserId}`);
}

/**
 * POST /matches/report/:userId?reason= — Report user
 */
export async function reportUser(
  userId: number,
  reason: string,
): Promise<string> {
  const res = await api.post(
    `/matches/report/${userId}?reason=${encodeURIComponent(reason)}`,
  );
  return res.data;
}

/**
 * GET /matches/liked — Get liked users list
 */
export async function getLikedUsers(): Promise<UserRelation[]> {
  const res = await api.get("/matches/liked");
  return res.data;
}

/**
 * GET /matches/shortlisted — Get shortlisted users list
 */
export async function getShortlistedUsers(): Promise<UserRelation[]> {
  const res = await api.get("/matches/shortlisted");
  return res.data;
}

/**
 * GET /matches/blocked — Get blocked users list
 */
export async function getBlockedUsers(): Promise<UserRelation[]> {
  const res = await api.get("/matches/blocked");
  return res.data;
}

/**
 * GET /matches/search?query=... — Search profiles
 */
export async function searchProfiles(
  query?: string,
  filters?: {
    minAge?: number;
    maxAge?: number;
    city?: string;
    religion?: string;
    community?: string;
    maritalStatus?: string;
  },
): Promise<MatchProfile[]> {
  const params = new URLSearchParams();
  if (query) params.append("query", query);
  if (filters?.minAge) params.append("minAge", filters.minAge.toString());
  if (filters?.maxAge) params.append("maxAge", filters.maxAge.toString());
  if (filters?.city) params.append("city", filters.city);
  if (filters?.religion) params.append("religion", filters.religion);
  if (filters?.community) params.append("caste", filters.community); // Map community to caste
  if (filters?.maritalStatus)
    params.append("maritalStatus", filters.maritalStatus);

  const res = await api.get(`/matches/search?${params.toString()}`);
  return res.data;
}

export async function getSearchSuggestions(query: string): Promise<string[]> {
  const res = await api.get(
    `/matches/search/suggestions?query=${encodeURIComponent(query)}`,
  );
  return res.data;
}
