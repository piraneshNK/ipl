import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Users, Timer } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { Player } from '../types';

const PLAYERS: Player[] = [
  { id: 1, name: 'MOHIT RATHEE', role: 'Bowler', basePrice: 0.30, status: 'sold', soldTo: 'RCB', soldAmount: 0.30 },
  { id: 2, name: 'VIGNESH PUTHUR', role: 'Bowler', basePrice: 0.30, status: 'sold', soldTo: 'MI', soldAmount: 0.30 },
  // ... Add more players from your list
];

const Auction = () => {
  const { currentRoom, currentTeam } = useStore();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const [timer, setTimer] = useState(30);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!currentRoom) return;

      const { data, error } = await supabase
        .from('room_teams')
        .select('*')
        .eq('room_id', currentRoom.id);

      if (error) {
        toast.error('Failed to fetch teams');
        return;
      }

      setTeams(data || []);
    };

    fetchTeams();
  }, [currentRoom]);

  const currentPlayer = PLAYERS[currentPlayerIndex];

  const handleBid = (amount: number) => {
    if (!currentTeam) {
      toast.error('Please select a team first');
      return;
    }

    setCurrentBid(currentBid + amount);
  };

  const handleSold = async () => {
    try {
      const { error } = await supabase
        .from('player_teams')
        .insert({
          room_id: currentRoom?.id,
          player_id: currentPlayer.id,
          team_id: currentTeam?.id,
          sold_amount: currentBid
        });

      if (error) {
        toast.error('Failed to record sale');
        return;
      }

      setCurrentPlayerIndex(prev => prev + 1);
      setCurrentBid(0);
      setTimer(30);
      toast.success('Player sold!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to record sale');
    }
  };

  const handleUnsold = () => {
    setCurrentPlayerIndex(prev => prev + 1);
    setCurrentBid(0);
    setTimer(30);
    toast.info('Player unsold');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Player List */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-4 text-left">No.</th>
                <th className="p-4 text-left">Player Name</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-right">Base Price (₹ Cr)</th>
                <th className="p-4 text-right">Status</th>
                <th className="p-4 text-right">Sold To</th>
                <th className="p-4 text-right">Amount (₹ Cr)</th>
              </tr>
            </thead>
            <tbody>
              {PLAYERS.map((player, index) => (
                <tr 
                  key={player.id}
                  className={`border-b border-gray-700/50 ${
                    index === currentPlayerIndex ? 'bg-purple-900/20' : ''
                  }`}
                >
                  <td className="p-4">{player.id}</td>
                  <td className="p-4 font-medium">{player.name}</td>
                  <td className="p-4">{player.role}</td>
                  <td className="p-4 text-right">{player.basePrice.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      player.status === 'sold' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                    }`}>
                      {player.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">{player.soldTo || '-'}</td>
                  <td className="p-4 text-right">{player.soldAmount?.toFixed(2) || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Current Player and Bidding */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Current Player</h2>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-yellow-500">₹{currentBid}Cr</div>
                <div className="bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Timer className="w-5 h-5 text-gray-400" />
                  <span className="text-xl font-semibold">{timer}s</span>
                </div>
              </div>
            </div>

            {currentPlayer && (
              <div>
                <h3 className="text-2xl font-semibold mb-2">{currentPlayer.name}</h3>
                <p className="text-gray-400 mb-1">Role: {currentPlayer.role}</p>
                <p className="text-gray-400">Base Price: ₹{currentPlayer.basePrice}Cr</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Bidding Controls */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-6">Bidding Controls</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[0.05, 0.10, 0.20, 0.50].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleBid(amount)}
                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors"
                  >
                    +₹{amount}Cr
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleSold}
                  className="px-4 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium transition-colors"
                >
                  Sold
                </button>
                <button
                  onClick={handleUnsold}
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors"
                >
                  Unsold
                </button>
              </div>
            </div>

            {/* Teams Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-6">Teams Status</h2>
              <div className="space-y-4">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl"
                  >
                    <div>
                      <h3 className="font-semibold">{team.name}</h3>
                      <p className="text-sm text-gray-400">₹{team.remaining_budget}Cr left</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{team.players?.length || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;