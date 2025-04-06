import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import SelectTeam from './pages/SelectTeam';
import Auction from './pages/Auction';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/select-team" element={<SelectTeam />} />
          <Route path="/auction" element={<Auction />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1F2937',
              color: '#fff',
              border: '1px solid #374151'
            }
          }}
        />
      </div>
    </Router>
  );
}

export default App;