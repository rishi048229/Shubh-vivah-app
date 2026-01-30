export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  profession: string;
  matchPercentage: number;
  image: string;
  isPremium: boolean;
  isKundaliMatched: boolean;
  bio?: string;
}
