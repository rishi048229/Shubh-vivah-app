import api from "./api";
import { MatchProfile as UIMatchProfile } from "@/types/connections";

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

/* ================= SEARCH ================= */

/**
 * Search profiles by name
 */
export async function searchProfiles(
  query: string,
): Promise<UIMatchProfile[]> {
  try {
    const res = await api.get(`/matches/explore/search`, {
      params: { query },
    });
    
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
      imageUri: p.profilePhotoUrl || "https://randomuser.me/api/portraits/women/1.jpg",
      profession: p.occupation || "",
      education: p.education || "",
      religion: p.religion || "",
      caste: p.caste || "",
      verified: true,
      onlineStatus: "recently_active",
      maritalStatus: "Never Married",
    }));
  } catch (error) {
    console.error("Failed to search profiles:", error);
    return [];
  }
}

export async function getSearchSuggestions(_query: string): Promise<string[]> {
  // Backend has no suggestions endpoint — return empty for now
  return [];
}
