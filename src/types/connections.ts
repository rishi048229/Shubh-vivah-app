/**
 * Type definitions for Connections/Explore Matches feature
 */

export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  city: string;
  state: string;
  distance: number; // in km
  matchPercentage: number;
  matchReasons: string[];
  imageUri: string;
  profession: string;
  education: string;
  religion: string;
  caste: string;
  verified: boolean;
  onlineStatus: "online" | "recently_active" | "offline";
  lastSeen?: string;
  income?: string;
  manglikStatus?: "yes" | "no" | "anshik";
  maritalStatus: string;
  occupation?: string; // Mapped from profession in some places
  height?: string;
  bio?: string;
}

export interface FilterState {
  ageRange: [number, number];
  distanceRadius: number;
  states: string[];
  cities: string[];
  religions: string[];
  castes: string[];
  educationLevels: string[];
  communities: string[]; // Added community
  manglikStatus?: "yes" | "no" | "any";
  maritalStatus: string[];
  lifestylePreferences: string[];
  minHeight?: number; // in inches
  minIncome?: number; // LPA
  professions: string[];
}

export type SortOption = "nearby" | "newest" | "best_match" | "recently_active";

export interface SearchSuggestion {
  type: "recent" | "city" | "profession" | "preference";
  label: string;
  icon?: string;
}

export const DEFAULT_FILTERS: FilterState = {
  ageRange: [21, 35],
  distanceRadius: 50,
  states: [],
  cities: [],
  religions: [],
  castes: [],
  educationLevels: [],
  communities: [], // Added default
  manglikStatus: "any",
  maritalStatus: [],
  lifestylePreferences: [],
  minHeight: 0,
  minIncome: 0,
  professions: [],
};
