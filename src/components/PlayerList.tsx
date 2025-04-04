
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface AuctionPlayer {
  id: number;
  name: string;
  basePrice: number; // in crores
  status: 'Sold' | 'Unsold' | 'RTM' | '-';
  team?: string;
  soldPrice?: number;
}

interface PlayerListProps {
  players: AuctionPlayer[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  const formatPrice = (price: number) => {
    return `₹${price} Cr`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">No.</TableHead>
            <TableHead>Player Name</TableHead>
            <TableHead>Base Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">{player.id}</TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell>{formatPrice(player.basePrice)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-sm ${
                  player.status === 'Sold' ? 'bg-green-100 text-green-800' : 
                  player.status === 'Unsold' ? 'bg-red-100 text-red-800' :
                  player.status === 'RTM' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {player.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlayerList;
