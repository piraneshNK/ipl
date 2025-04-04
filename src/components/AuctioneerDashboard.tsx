import React, { useState } from 'react';
import { samplePlayers, teams, formatPrice } from '../data';
import { Settings, Play, Pause, SkipForward, Users, DollarSign } from 'lucide-react';

export default function AuctioneerDashboard() {
  const [isPaused, setIsPaused] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Auction Controls</h2>
                <Settings className="w-6 h-6 text-gray-500" />
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${
                    isPaused
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white transition`}
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  {isPaused ? 'Resume Auction' : 'Pause Auction'}
                </button>

                <button
                  onClick={() => setCurrentPlayerIndex((prev) => prev + 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  <SkipForward className="w-5 h-5" />
                  Next Player
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Current Player</h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={samplePlayers[currentPlayerIndex].image}
                    alt={samplePlayers[currentPlayerIndex].name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xl font-semibold">
                      {samplePlayers[currentPlayerIndex].name}
                    </h4>
                    <p className="text-gray-600">
                      {samplePlayers[currentPlayerIndex].role}
                    </p>
                    <p className="text-green-600 font-semibold">
                      Base: {formatPrice(samplePlayers[currentPlayerIndex].basePrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Player Queue */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Upcoming Players</h3>
              <div className="space-y-3">
                {samplePlayers.slice(currentPlayerIndex + 1).map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{player.name}</h4>
                      <p className="text-sm text-gray-600">{player.role}</p>
                    </div>
                    <span className="ml-auto text-green-600 font-semibold">
                      {formatPrice(player.basePrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Team Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Team Statistics</h3>
                <Users className="w-6 h-6 text-gray-500" />
              </div>

              <div className="space-y-4">
                {teams.map((team) => (
                  <div key={team.id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{team.name}</span>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-bold">
                          {formatPrice(800000000)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Players: 8/25</span>
                      <span>|</span>
                      <span>Budget: 80%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: '80%' }}
                      ></div>
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
}