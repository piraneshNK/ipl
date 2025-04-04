
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import PlayerCard from '@/components/PlayerCard';
import { players as originalPlayers } from '@/data/players';
import { teams } from '@/data/teams';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Pause } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import PlayerList, { AuctionPlayer } from '@/components/PlayerList';

const AuctioneerControl = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roomCode = searchParams.get('room');
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [timer, setTimer] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentHighestBid, setCurrentHighestBid] = useState(originalPlayers[0].basePrice);
  const [highestBidder, setHighestBidder] = useState<string | null>(null);
  const [teamBudgets, setTeamBudgets] = useState(() => {
    return teams.map(team => ({
      ...team,
      remainingBudget: team.budget,
      playersBought: 0,
      playersList: []
    }));
  });

  // Sample auction player data
  const auctionPlayers: AuctionPlayer[] = [
    { id: 1, name: "MOHIT RATHEE", basePrice: 0.30, status: "Sold", team: "RCB", soldPrice: 0.30 },
    { id: 2, name: "VIGNESH PUTHUR", basePrice: 0.30, status: "Sold", team: "MI", soldPrice: 0.30 },
    { id: 3, name: "ASHOK SHARMA", basePrice: 0.30, status: "Sold", team: "RR", soldPrice: 0.30 },
    { id: 4, name: "RAJ LIMBANI", basePrice: 0.30, status: "Unsold" },
    { id: 5, name: "ABHINANDAN SINGH", basePrice: 0.30, status: "Sold", team: "RCB", soldPrice: 0.30 },
    { id: 6, name: "LUNGI NGIDI", basePrice: 1.00, status: "Sold", team: "RCB", soldPrice: 1.00 },
    { id: 7, name: "OTTNEIL BAARTMAN", basePrice: 0.75, status: "Unsold" },
    { id: 8, name: "KULWANT KHEJROLIYA", basePrice: 0.30, status: "Sold", team: "GT", soldPrice: 0.30 },
    { id: 9, name: "SHIVAM MAVI", basePrice: 0.75, status: "Unsold" },
    { id: 10, name: "LIZAAD WILLIAMS", basePrice: 0.75, status: "Sold", team: "MI", soldPrice: 0.75 }
  ];

  const currentPlayer = originalPlayers[currentPlayerIndex];

  const goToNextPlayer = () => {
    if (highestBidder) {
      const updatedTeamBudgets = teamBudgets.map(team => {
        if (team.shortName === highestBidder) {
          return {
            ...team,
            remainingBudget: team.remainingBudget - currentHighestBid,
            playersBought: team.playersBought + 1,
            playersList: [...team.playersList, currentPlayer]
          };
        }
        return team;
      });
      setTeamBudgets(updatedTeamBudgets);
    }
    
    if (currentPlayerIndex < originalPlayers.length - 1) {
      const nextPlayer = originalPlayers[currentPlayerIndex + 1];
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setCurrentHighestBid(nextPlayer.basePrice);
      setHighestBidder(null);
      setTimer(10);
      setIsTimerRunning(false);
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const formatPrice = (price: number) => {
    if (price >= 100) {
      return `₹${(price / 100).toFixed(2)} Cr`;
    }
    return `₹${price} L`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={`RPL Auctioneer Control: ${roomCode}`} showBackButton={true} />
      
      <main className="flex-1 bg-gray-100">
        <div className="page-container py-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Current Player</h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Time Left:</span>
                      <span className="auction-timer bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold">
                        {timer}s
                      </span>
                    </div>
                    <Button 
                      onClick={toggleTimer} 
                      variant="outline" 
                      size="icon"
                      className={isTimerRunning ? "bg-red-100 hover:bg-red-200" : "bg-green-100 hover:bg-green-200"}
                    >
                      {isTimerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
                
                <PlayerCard 
                  player={currentPlayer} 
                  currentBid={currentHighestBid}
                  highestBidTeam={highestBidder ? highestBidder : undefined}
                />
                
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={goToNextPlayer}
                    className="flex items-center gap-1"
                  >
                    Next Player <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Player List</h2>
                <PlayerList players={auctionPlayers} />
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Teams Summary</h2>
                
                <div className="space-y-4">
                  {teamBudgets.map((team) => (
                    <div key={team.id} className="border-b pb-3 last:border-b-0">
                      <div className={`${team.colorClass} ${team.textColorClass} px-3 py-2 rounded-lg mb-2`}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{team.name}</span>
                          <span className="text-sm">Budget: {formatPrice(team.remainingBudget)}</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p>Players bought: {team.playersBought}</p>
                        {team.playersList.length > 0 && (
                          <div className="mt-1">
                            <p className="font-medium">Players:</p>
                            <ul className="list-disc pl-5 mt-1">
                              {team.playersList.map((player, idx) => (
                                <li key={idx}>
                                  {player.name} ({player.role})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuctioneerControl;
