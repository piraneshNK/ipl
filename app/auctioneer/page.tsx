
'use client'

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AuctioneerPage() {
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, []);

  async function fetchPlayers() {
    const { data, error } = await supabase.from('players').select('*').limit(300);
    if (!error && data) {
      setPlayers(data);
      setCurrentPlayer(data[0]);
    }
  }

  async function handleSold(playerId, teamName, price) {
    await supabase.from('players').update({ sold_to: teamName, sold_price: price }).eq('id', playerId);
    nextPlayer();
  }

  function nextPlayer() {
    setCurrentPlayer(prev => {
      const nextIndex = players.findIndex(p => p.id === prev?.id) + 1;
      return players[nextIndex] || null;
    });
    setTimer(30);
  }

  async function togglePause(teamName) {
    const { data: team } = await supabase.from('teams').select('*').eq('name', teamName).single();
    if (team) {
      await supabase.from('teams').update({ paused: !team.paused }).eq('id', team.id);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Auctioneer Panel</h1>
      {currentPlayer && (
        <div className="border p-4 rounded shadow">
          <p className="text-lg font-semibold">{currentPlayer.name}</p>
          <p>Base Price: {currentPlayer.base_price}</p>
          <p>Role: {currentPlayer.role}</p>
          <p className="text-red-500 font-bold">Timer: {timer}s</p>
        </div>
      )}
      <button onClick={() => handleSold(currentPlayer.id, 'CSK', '1 Cr')} className="bg-green-600 text-white px-4 py-2 rounded">
        Sold to CSK
      </button>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {["CSK", "MI", "RCB", "RR", "KKR", "SRH", "DC", "LSG"].map(team => (
          <button key={team} onClick={() => togglePause(team)} className="bg-yellow-400 text-black px-2 py-1 rounded">
            Toggle {team} Pause
          </button>
        ))}
      </div>
    </div>
  );
}
