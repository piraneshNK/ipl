export interface Team {
  id: string;
  name: string;
  color: string;
  budget: number;
  players: Player[];
  ready: boolean;
}

export interface Player {
  id: number;
  name: string;
  role: string;
  basePrice: number;
  status: 'unsold' | 'sold';
  soldTo?: string;
  soldAmount?: number;
}

export interface Room {
  id: string;
  name: string;
  password: string;
  status: 'waiting' | 'selecting' | 'auction' | 'completed';
  teams: Team[];
  currentPlayerIndex: number;
}

export interface Bid {
  id: string;
  playerId: string;
  teamId: string;
  amount: number;
  timestamp: string;
}