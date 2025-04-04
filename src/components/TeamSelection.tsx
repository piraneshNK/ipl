import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teams } from '../data';
import { Check } from 'lucide-react';

export default function TeamSelection() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Select Your Team
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`relative cursor-pointer transform transition hover:scale-105 ${
                selectedTeam === team.id
                  ? 'ring-4 ring-blue-500 ring-opacity-50'
                  : ''
              }`}
            >
              <div
                className="rounded-lg p-6 h-full"
                style={{
                  background: `linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor})`
                }}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-24 h-24 mb-4 rounded-full bg-white p-2"
                  />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {team.name}
                  </h3>
                  <p className="text-white opacity-90">{team.shortName}</p>
                </div>
                
                {selectedTeam === team.id && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/auction')}
            disabled={!selectedTeam}
            className={`px-8 py-3 rounded-lg font-bold text-white ${
              selectedTeam
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Ready to Bid
          </button>
        </div>
      </div>
    </div>
  );
}