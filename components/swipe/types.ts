export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  profession: string;
  matchPercentage: number;
  image: any; // Allow number (require) or string (URI)
  isPremium: boolean;
  isKundaliMatched: boolean;
  bio?: string;
}
