import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage.tsx';
import TeamSelection from './components/TeamSelection.tsx';
import AuctionRoom from './components/AuctionRoom.tsx';
import AuctioneerDashboard from './components/AuctioneerDashboard.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/select-team" element={<TeamSelection />} />
        <Route path="/auction" element={<AuctionRoom />} />
        <Route path="/auctioneer" element={<AuctioneerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;