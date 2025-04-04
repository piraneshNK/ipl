
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import PlayerCard from '@/components/PlayerCard';
import BidButton from '@/components/BidButton';
import TeamBudget from '@/components/TeamBudget';
import BidHistory from '@/components/BidHistory';
import { players } from '@/data/players';
import { teams } from '@/data/teams';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const AuctionRoom = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedTeamId = searchParams.get('team');
  const roomCode = searchParams.get('room');
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [timer, setTimer] = useState(10);
  const [currentHighestBid, setCurrentHighestBid] = useState(players[0].basePrice);
  const [highestBidder, setHighestBidder] = useState<string | null>(null);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [teamBudgets, setTeamBudgets] = useState(() => {
    return teams.map(team => ({
      ...team,
      remainingBudget: team.budget,
      playersBought: 0,
      playersList: []
    }));
  });

  const selectedTeam = teams.find(team => team.id === selectedTeamId) || teams[0];
  const currentPlayer = players[currentPlayerIndex];

  const placeBid = (amount: number) => {
    const newBid = {
      teamName: selectedTeam.name,
      teamShortName: selectedTeam.shortName,
      amount,
      timestamp: new Date()
    };
    
    setBidHistory([newBid, ...bidHistory]);
    setCurrentHighestBid(amount);
    setHighestBidder(selectedTeam.shortName);
    
    setTimer(10);
  };

  const goToNextPlayer = () => {
    if (highestBidder) {
      const bidderTeam = teamBudgets.find(team => team.shortName === highestBidder);
      if (bidderTeam) {
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
    }
    
    if (currentPlayerIndex < players.length - 1) {
      const nextPlayer = players[currentPlayerIndex + 1];
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setCurrentHighestBid(nextPlayer.basePrice);
      setHighestBidder(null);
      setBidHistory([]);
      setTimer(10);
    }
  };

  const getBidOptions = () => {
    const baseIncrement = currentHighestBid < 100 ? 5 : 10;
    const options = [
      currentHighestBid + baseIncrement,
      currentHighestBid + baseIncrement * 2,
      currentHighestBid + baseIncrement * 5,
      currentHighestBid + baseIncrement * 10
    ];
    return options;
  };

  const bidOptions = getBidOptions();

  const isMyTeamHighestBidder = highestBidder === selectedTeam.shortName;

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={`IPL Auction Room: ${roomCode}`} showBackButton={true} />
      
      <main className="flex-1 bg-gray-100">
        <div className="page-container">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Current Player</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Time Left:</span>
                    <span className="auction-timer glow-animation bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                      {timer}s
                    </span>
                  </div>
                </div>
                
                <PlayerCard 
                  player={currentPlayer} 
                  currentBid={currentHighestBid}
                  highestBidTeam={highestBidder ? highestBidder : undefined}
                />
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Place Bid</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {bidOptions.map((amount, index) => (
                      <BidButton 
                        key={index}
                        amount={amount}
                        onClick={() => placeBid(amount)}
                        disabled={isMyTeamHighestBidder}
                      />
                    ))}
                  </div>
                  
                  {isMyTeamHighestBidder && (
                    <p className="text-green-600 mt-2 text-center font-medium">
                      You are the highest bidder!
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Bid History</h2>
                  <Button 
                    variant="outline"
                    onClick={goToNextPlayer}
                    className="flex items-center gap-1"
                  >
                    Next Player <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {bidHistory.length > 0 ? (
                  <BidHistory bids={bidHistory} />
                ) : (
                  <p className="text-gray-500 text-center py-4">No bids placed yet</p>
                )}
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Teams Budget</h2>
                
                <div className="space-y-3">
                  {teamBudgets.map((team) => (
                    <TeamBudget
                      key={team.id}
                      teamName={team.name}
                      teamShortName={team.shortName}
                      colorClass={team.colorClass}
                      textColorClass={team.textColorClass}
                      totalBudget={team.budget}
                      remainingBudget={team.remainingBudget}
                      playersBought={team.playersBought}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuctionRoom;
