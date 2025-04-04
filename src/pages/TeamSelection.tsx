
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import TeamCard from '@/components/TeamCard';
import { Button } from '@/components/ui/button';
import { teams } from '@/data/teams';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TeamSelection = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState('');
  const [isAuctioneer, setIsAuctioneer] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode');
  const roomName = queryParams.get('room');

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
  };

  const handleReady = () => {
    if (isAuctioneer) {
      navigate(`/auctioneer?room=${roomName || roomCode}`);
    } else if (selectedTeam) {
      navigate(`/auction-room?team=${selectedTeam}&room=${roomName || roomCode}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100">
      <Header title="Select Your Role" showBackButton={true} />

      <main className="flex-1">
        <div className="page-container">
          <div className="max-w-md mx-auto mb-8">
            {!roomName && (
              <div className="mb-4">
                <label htmlFor="roomCode" className="block text-sm font-medium mb-2 text-gray-700">
                  Enter Room Code
                </label>
                <Input
                  id="roomCode"
                  placeholder="Enter your room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <Tabs defaultValue="player" className="mb-8 max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="player" onClick={() => setIsAuctioneer(false)}>Join as Team</TabsTrigger>
              <TabsTrigger value="auctioneer" onClick={() => setIsAuctioneer(true)}>Join as Auctioneer</TabsTrigger>
            </TabsList>
            <TabsContent value="player">
              <h2 className="text-2xl font-bold my-6 text-center">Choose Your RPL Franchise</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    selected={selectedTeam === team.id}
                    onClick={() => handleTeamSelect(team.id)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="auctioneer">
              <div className="py-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Join as Auctioneer</h2>
                <p className="text-gray-600 mb-6">As an auctioneer, you'll control the auction process, manage the player list, and oversee team budgets.</p>
                <div className="bg-amber-100 p-4 rounded-lg mb-6">
                  <p className="text-amber-800 font-medium">You'll be able to:</p>
                  <ul className="list-disc text-left pl-5 text-amber-700 mt-2">
                    <li>Control the auction timer</li>
                    <li>Move to the next player</li>
                    <li>View all team budgets and purchased players</li>
                    <li>Manage the player queue</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-8">
            <Button
              onClick={handleReady}
              disabled={(isAuctioneer ? false : !selectedTeam) || (!roomName && !roomCode)}
              className="px-8 py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              I'm Ready
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamSelection;
