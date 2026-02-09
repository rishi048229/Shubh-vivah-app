import api from "./api";

export interface MatchmakingDto {
  userId: number;
  fullName: string;
  age: number;
  city: string;
  religion: string;
  occupation: string;
  matchScore: number;
}

export interface MatchFilters {
  minAge?: number;
  maxAge?: number;
  religion?: string;
  city?: string;
  maritalStatus?: string;
  search?: string;
}

export const matchmakingService = {
  /**
   * Get AI-suggested matches based on user profile
   * Returns matches with score >= 40
   */
  getMatches: async (filters?: MatchFilters): Promise<MatchmakingDto[]> => {
    const params = new URLSearchParams();

    if (filters?.minAge) params.append("minAge", filters.minAge.toString());
    if (filters?.maxAge) params.append("maxAge", filters.maxAge.toString());
    if (filters?.religion) params.append("religion", filters.religion);
    if (filters?.city) params.append("city", filters.city);

    const queryString = params.toString();
    const url = queryString ? `/matches?${queryString}` : "/matches";

    const response = await api.get<MatchmakingDto[]>(url);
    return response.data;
  },

  /**
   * Browse all profiles (test endpoint - no auth required for own profile)
   * Use this for testing search and filter functionality
   */
  browseProfiles: async (filters?: MatchFilters): Promise<MatchmakingDto[]> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.minAge) params.append("minAge", filters.minAge.toString());
    if (filters?.maxAge) params.append("maxAge", filters.maxAge.toString());
    if (filters?.religion) params.append("religion", filters.religion);
    if (filters?.city) params.append("city", filters.city);

    const queryString = params.toString();
    const url = queryString
      ? `/api/test/browse-profiles?${queryString}`
      : "/api/test/browse-profiles";

    const response = await api.get<MatchmakingDto[]>(url);
    return response.data;
  },

  /**
   * Manual search with user-defined filters
   * Returns all matches regardless of score
   */
  searchMatches: async (filters: MatchFilters): Promise<MatchmakingDto[]> => {
    const params = new URLSearchParams();

    if (filters.minAge) params.append("minAge", filters.minAge.toString());
    if (filters.maxAge) params.append("maxAge", filters.maxAge.toString());
    if (filters.religion) params.append("religion", filters.religion);
    if (filters.city) params.append("city", filters.city);
    if (filters.maritalStatus)
      params.append("maritalStatus", filters.maritalStatus);

    const queryString = params.toString();
    const url = queryString
      ? `/matches/search?${queryString}`
      : "/matches/search";

    const response = await api.get<MatchmakingDto[]>(url);
    return response.data;
  },
};
