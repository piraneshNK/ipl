import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

function Admin() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Teams Management</h2>
          <p className="text-gray-400 mb-4">Manage teams, their budgets, and settings</p>
          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            Manage Teams
          </button>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Players Management</h2>
          <p className="text-gray-400 mb-4">Add, edit, or remove players from the system</p>
          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            Manage Players
          </button>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Room Settings</h2>
          <p className="text-gray-400 mb-4">Configure auction rooms and their parameters</p>
          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            Room Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;