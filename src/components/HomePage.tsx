import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Lock, Settings } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [isAuctioneer, setIsAuctioneer] = useState(false);

  const handleCreateRoom = () => {
    if (roomName && roomPassword) {
      navigate(isAuctioneer ? '/auctioneer' : '/select-team');
    }
  };

  const handleJoinRoom = () => {
    if (roomName && roomPassword) {
      navigate('/select-team');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            RPL Auction Game 2025
          </h1>
          <p className="text-xl mb-12 text-gray-300">
            Join private rooms, select your team, and bid live on RPL players with real-time updates.
          </p>
          
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full px-4 py-2 bg-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Room Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    placeholder="Enter room password"
                    className="w-full px-4 py-2 bg-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auctioneer"
                  checked={isAuctioneer}
                  onChange={(e) => setIsAuctioneer(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="auctioneer" className="text-sm text-gray-200 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Join as Auctioneer
                </label>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
            <button
              onClick={handleCreateRoom}
              disabled={!roomName || !roomPassword}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Trophy size={24} />
              Create Room
            </button>
            
            <button
              onClick={handleJoinRoom}
              disabled={!roomName || !roomPassword || isAuctioneer}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Users size={24} />
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}