import { create } from 'zustand';
import { Room, Team, Player, Bid } from '../types';

interface Store {
  currentRoom: Room | null;
  currentTeam: Team | null;
  currentPlayer: Player | null;
  currentBids: Bid[];
  setCurrentRoom: (room: Room | null) => void;
  setCurrentTeam: (team: Team | null) => void;
  setCurrentPlayer: (player: Player | null) => void;
  setCurrentBids: (bids: Bid[]) => void;
  addBid: (bid: Bid) => void;
}

export const useStore = create<Store>((set) => ({
  currentRoom: null,
  currentTeam: null,
  currentPlayer: null,
  currentBids: [],
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setCurrentTeam: (team) => set({ currentTeam: team }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setCurrentBids: (bids) => set({ currentBids: bids }),
  addBid: (bid) => set((state) => ({ 
    currentBids: [...state.currentBids, bid] 
  })),
}));