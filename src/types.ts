export interface Team {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
}

export interface Player {
  id: string;
  name: string;
  role: string;
  basePrice: number;
  image: string;
}

export interface Bid {
  team: Team;
  amount: number;
  timestamp: number;
}