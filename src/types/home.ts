import { MatchProfile } from "./connections";

export interface ContextHeroProps {
  userName: string;
  userAvatar: string;
  contextText: string;
  location?: string;
}

export interface QuickActionItem {
  id: string;
  label: string;
  icon: string; // Ionicons name
  route?: string;
  action?: () => void;
}

export interface MatchInsightProps {
  reasons: string[];
  expanded?: boolean;
}

export interface SpotlightProfile extends MatchProfile {
  insightText: string;
  matchExplanation: string;
}

export interface DiscoveryRowProps {
  title: string;
  items: MatchProfile[];
  variant?: "standard" | "compact";
}

export interface InterestedStackProps {
  count: number;
  avatars: string[];
  label: string;
}

export interface ProfileCompletionProps {
  percentage: number;
  missingFields: string[];
}
