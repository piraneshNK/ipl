import React, { useState } from 'react';
import { samplePlayer, formatPrice, teams } from '../data';
import { Timer, DollarSign, Users } from 'lucide-react';

export default function AuctionRoom() {
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentBid, setCurrentBid] = useState(samplePlayer.basePrice);
  
  const bidIncrements = [
    500000,  // 5L
    1000000, // 10L
    2500000, // 25L
    5000000, // 50L
    10000000 // 1Cr
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Current Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Current Player</h2>
                <div className="flex items-center gap-2 text-red-500">
                  <Timer className="w-6 h-6" />
                  <span className="text-xl font-bold">{timeLeft}s</span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={samplePlayer.image}
                  alt={samplePlayer.name}
                  className="w-48 h-48 object-cover rounded-lg"
                />
                
                <div>
                  <h3 className="text-3xl font-bold mb-2">{samplePlayer.name}</h3>
                  <p className="text-gray-600 mb-4">{samplePlayer.role}</p>
                  <p className="text-xl mb-2">
                    Base Price: {formatPrice(samplePlayer.basePrice)}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    Current Bid: {formatPrice(currentBid)}
                  </p>
                  
                  <div className="mt-6 flex flex-wrap gap-3">
                    {bidIncrements.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setCurrentBid(currentBid + amount)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        +{formatPrice(amount)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bid History */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Bid History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Team</th>
                      <th className="text-left py-2">Bid Amount</th>
                      <th className="text-left py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.slice(0, 3).map((team, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{team.name}</td>
                        <td className="py-2">{formatPrice(currentBid - (index * 1000000))}</td>
                        <td className="py-2">{10 - index}s ago</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Right Column - Team Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Team Statistics</h3>
            <div className="space-y-4">
              {teams.map((team) => (
                <div key={team.id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{team.name}</span>
                    <span className="text-green-600 font-bold">
                      {formatPrice(800000000)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: '80%' }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Players: 8/25
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}