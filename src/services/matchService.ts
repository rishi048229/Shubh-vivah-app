import api from "./api";
import { MatchProfile as UIMatchProfile } from "@/types/connections";
import { getAvatarUrl } from "@/utils/avatar";

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

/* ================= HOME WIDGETS ================= */

export async function getNearbyMatches(): Promise<MatchProfile[]> {
  const res = await api.get("/matches/home/nearby");
  return res.data;
}

export async function getBestMatches(): Promise<MatchProfile[]> {
  const res = await api.get("/matches/home/best");
  return res.data;
}

export async function getNewMatches(): Promise<MatchProfile[]> {
  const res = await api.get("/matches/home/new");
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
 * POST /matches/reject/:fromUserId — Reject connection request
 */
export async function rejectRequest(fromUserId: number): Promise<void> {
  await api.post(`/matches/reject/${fromUserId}`);
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
 * GET /matches/matched — Get matched users list
 */
export async function getMatchedUsers(): Promise<UserRelation[]> {
  const res = await api.get("/matches/matched");
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
export async function getBlockedUsers(): Promise<MatchProfile[]> {
  const res = await api.get("/matches/blocked");
  return res.data;
}

/**
 * GET /matches/requests/received — Get pending received requests
 */
export async function getReceivedRequests(): Promise<UserRelation[]> {
  const res = await api.get("/matches/requests/received");
  return res.data;
}

/* ================= SEARCH ================= */

/**
 * Search profiles by name
 */
export async function searchProfiles(
  query: string,
  filters?: { minAge?: number; maxAge?: number; city?: string; religion?: string }
): Promise<UIMatchProfile[]> {
  try {
    const params: any = {};
    // Only include query if non-empty; backend returns 400 for empty query string
    if (query && query.trim() !== "") {
      params.query = query.trim();
    }
    if (filters?.minAge) params.minAge = filters.minAge;
    if (filters?.maxAge) params.maxAge = filters.maxAge;
    if (filters?.city && filters.city !== "Any" && filters.city !== "") params.city = filters.city;
    if (filters?.religion && filters.religion !== "Any" && filters.religion !== "") params.religion = filters.religion;

    const res = await api.get(`/matches/explore/search`, { params });
    
    // Map DTO to frontend MatchProfile
    return res.data.map((p: any) => ({
      id: String(p.userId),
      name: p.fullName,
      age: p.age,
      location: p.distanceText ? `${p.city}, ${p.distanceText}` : p.city,
      city: p.city,
      state: "",
      distance: p.distanceKm || 0,
      matchPercentage: p.matchScore || 0,
      matchReasons: p.religion ? [p.religion] : [],
      imageUri: getAvatarUrl(p.profilePhotoUrl, p.gender, p.fullName),
      profession: p.occupation || "",
      education: p.education || "",
      religion: p.religion || "",
      caste: p.caste || "",
      verified: true,
      onlineStatus: "recently_active",
      maritalStatus: "Never Married",
    }));
  } catch (error: any) {
    // Log full details including backend response body
    const status = error?.response?.status;
    const responseData = error?.response?.data;
    console.warn("Search profiles issue:", status, responseData || error?.message);
    return [];
  }
}

export async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    if (!query || query.trim() === "") return [];
    const res = await api.get(`/matches/explore/suggestions`, {
      params: { query: query.trim() }
    });
    return res.data || [];
  } catch (error) {
    console.warn("Error fetching search suggestions:", error);
    return [];
  }
}
