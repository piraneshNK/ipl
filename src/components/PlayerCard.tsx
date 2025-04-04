
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Player } from '@/data/players';
import { User } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  currentBid?: number;
  highestBidTeam?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, currentBid, highestBidTeam }) => {
  const formatPrice = (price: number) => {
    if (price >= 100) {
      return `${(price / 100).toFixed(2)} Cr`;
    }
    return `${price} L`;
  };

  const basePrice = formatPrice(player.basePrice);
  const currentBidFormatted = currentBid ? formatPrice(currentBid) : basePrice;

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4">
          <h3 className="text-xl font-bold text-white">{player.name}</h3>
          <div className="flex justify-between items-center">
            <p className="text-white text-sm">{player.country}</p>
            <div className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-semibold">
              {player.role}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex items-start gap-4">
        <div className="h-24 w-24 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          <User className="h-12 w-12 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm text-gray-500">Base Price</p>
              <p className="font-medium">₹ {basePrice}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Bid</p>
              <p className="font-bold text-blue-600">₹ {currentBidFormatted}</p>
            </div>
          </div>
          
          {highestBidTeam && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Highest Bidder</p>
              <p className="font-semibold">{highestBidTeam}</p>
            </div>
          )}
          
          {player.stats && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {player.stats.runs !== undefined && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">Runs</p>
                  <p className="font-semibold">{player.stats.runs}</p>
                </div>
              )}
              {player.stats.wickets !== undefined && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">Wickets</p>
                  <p className="font-semibold">{player.stats.wickets}</p>
                </div>
              )}
              {player.stats.average !== undefined && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">Avg</p>
                  <p className="font-semibold">{player.stats.average}</p>
                </div>
              )}
              {player.stats.strikeRate !== undefined && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">SR</p>
                  <p className="font-semibold">{player.stats.strikeRate}</p>
                </div>
              )}
              {player.stats.economy !== undefined && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">Econ</p>
                  <p className="font-semibold">{player.stats.economy}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
