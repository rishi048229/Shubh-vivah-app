import api from "./api";

/**
 * Match profile DTO matching backend's MatchmakingDto / ExploreProfileDto
 * Backend base path: /matches
 */
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

/* ================= EXPLORE ================= */

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

/* ================= FULL PROFILE ================= */

/**
 * GET /matches/profile/:userId — View full profile
 */
export async function viewFullProfile(userId: number): Promise<any> {
  const res = await api.get(`/matches/profile/${userId}`);
  return res.data;
}

/* ================= ACTIONS ================= */

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

/* ================= REQUESTS ================= */

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

/* ================= LISTS ================= */

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

/* ================= SEARCH (stub — backend has no search endpoint yet) ================= */

/**
 * Search profiles — currently returns empty array since backend
 * MatchmakingController has no search endpoint.
 * TODO: Add search endpoint to backend when needed.
 */
export async function searchProfiles(
  _query?: string,
  _filters?: {
    minAge?: number;
    maxAge?: number;
    city?: string;
    religion?: string;
    community?: string;
    maritalStatus?: string;
  },
): Promise<MatchProfile[]> {
  // Backend has no /matches/search endpoint — return empty for now
  console.warn("searchProfiles: Backend search endpoint not yet implemented");
  return [];
}

export async function getSearchSuggestions(_query: string): Promise<string[]> {
  // Backend has no suggestions endpoint — return empty for now
  return [];
}
