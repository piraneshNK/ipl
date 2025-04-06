import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Plus, Gamepad2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export default function Home() {
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setCurrentRoom = useStore((state) => state.setCurrentRoom);

  const handleCreateRoom = async () => {
    if (!roomName || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { data: newRoom, error } = await supabase
        .from('rooms')
        .insert({
          name: roomName,
          password,
          status: 'waiting'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating room:', error);
        toast.error('Error creating room. Please try again.');
        return;
      }
      
      setCurrentRoom(newRoom);
      navigate('/select-team');
      toast.success('Room created! Share the details with your friends to join.');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error creating room');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomName || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { data: room, error } = await supabase
        .from('rooms')
        .select()
        .eq('name', roomName)
        .eq('password', password)
        .single();

      if (error || !room) {
        toast.error('Room not found or incorrect password');
        return;
      }

      setCurrentRoom(room);
      navigate('/select-team');
      toast.success('Welcome to the auction room!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error joining room');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-pink-600 rounded-full blur opacity-75"></div>
            <div className="relative bg-gray-800 rounded-full p-4 inline-block">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
            RPL Auction
          </h2>
          <p className="text-lg text-gray-300">
            Create or join a room to start the auction
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <Gamepad2 className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Room Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCreateRoom}
              className="group relative px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-medium text-white hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
            >
              <span className="flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                Create Room
              </span>
            </button>

            <button
              onClick={handleJoinRoom}
              className="group relative px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium text-white hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              <span className="flex items-center justify-center">
                <Users className="w-5 h-5 mr-2" />
                Join Room
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}