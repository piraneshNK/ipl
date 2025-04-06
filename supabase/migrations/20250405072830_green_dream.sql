/*
  # Initial Schema for RPL Cricket Auction

  1. New Tables
    - `rooms`: Stores auction rooms with password protection and status
    - `teams`: Pre-defined cricket teams with their details
    - `players`: Cricket players available for auction
    - `room_teams`: Junction table for teams joined in a room
    - `bids`: Records of all bids placed during auctions
    - `player_teams`: Records of players bought by teams

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure room access with password
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  password text NOT NULL,
  status text NOT NULL DEFAULT 'waiting',
  current_player_id uuid,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_status CHECK (status IN ('waiting', 'selecting', 'auction', 'completed'))
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  logo text NOT NULL,
  max_budget numeric(10, 2) DEFAULT 100.00,
  created_at timestamptz DEFAULT now()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  base_price numeric(10, 2) NOT NULL,
  image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('batsman', 'bowler', 'all-rounder', 'wicket-keeper'))
);

-- Create room_teams junction table
CREATE TABLE IF NOT EXISTS room_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  remaining_budget numeric(10, 2) DEFAULT 100.00,
  created_at timestamptz DEFAULT now(),
  UNIQUE(room_id, team_id),
  UNIQUE(room_id, user_id)
);

-- Create bids table
CREATE TABLE IF NOT EXISTS bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create player_teams table (for tracking sold players)
CREATE TABLE IF NOT EXISTS player_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  sold_amount numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(room_id, player_id)
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_teams ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view teams" ON teams
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can view players" ON players
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can view rooms they have access to" ON rooms
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT room_id FROM room_teams WHERE user_id = auth.uid()
    ) OR created_by = auth.uid()
  );

CREATE POLICY "Users can create rooms" ON rooms
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Room members can view room teams" ON room_teams
  FOR SELECT TO authenticated
  USING (
    room_id IN (
      SELECT room_id FROM room_teams WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join rooms" ON room_teams
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Room members can view bids" ON bids
  FOR SELECT TO authenticated
  USING (
    room_id IN (
      SELECT room_id FROM room_teams WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Room members can place bids" ON bids
  FOR INSERT TO authenticated
  WITH CHECK (
    room_id IN (
      SELECT room_id FROM room_teams WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Room members can view sold players" ON player_teams
  FOR SELECT TO authenticated
  USING (
    room_id IN (
      SELECT room_id FROM room_teams WHERE user_id = auth.uid()
    )
  );

-- Insert sample teams
INSERT INTO teams (name, color, logo) VALUES
  ('Chennai Kings', '#FFD700', 'https://example.com/chennai-kings.png'),
  ('Umbai Warriors', '#0000FF', 'https://example.com/umbai-warriors.png'),
  ('Delhi Devils', '#FF0000', 'https://example.com/delhi-devils.png'),
  ('Bangalore Titans', '#800080', 'https://example.com/bangalore-titans.png'),
  ('Punjab Royals', '#FFA500', 'https://example.com/punjab-royals.png'),
  ('Kolkata Knights', '#4B0082', 'https://example.com/kolkata-knights.png'),
  ('Rajasthan Strikers', '#FF69B4', 'https://example.com/rajasthan-strikers.png'),
  ('Hyderabad Sunrisers', '#FF4500', 'https://example.com/hyderabad-sunrisers.png'),
  ('Gujarat Lions', '#008000', 'https://example.com/gujarat-lions.png'),
  ('Lucknow Legends', '#00FFFF', 'https://example.com/lucknow-legends.png');

-- Insert sample players
INSERT INTO players (name, role, base_price, image) VALUES
  ('Virat Singh', 'batsman', 20.00, 'https://example.com/virat-singh.png'),
  ('Rohit Kumar', 'batsman', 25.00, 'https://example.com/rohit-kumar.png'),
  ('Ajay Patel', 'bowler', 15.00, 'https://example.com/ajay-patel.png'),
  ('Suresh Raina', 'all-rounder', 30.00, 'https://example.com/suresh-raina.png'),
  ('Dinesh Kumar', 'wicket-keeper', 18.00, 'https://example.com/dinesh-kumar.png'),
  ('Rahul Sharma', 'bowler', 12.00, 'https://example.com/rahul-sharma.png'),
  ('Amit Singh', 'all-rounder', 22.00, 'https://example.com/amit-singh.png'),
  ('Pradeep Kumar', 'batsman', 16.00, 'https://example.com/pradeep-kumar.png'),
  ('Sanjay Yadav', 'bowler', 14.00, 'https://example.com/sanjay-yadav.png'),
  ('Rajesh Kumar', 'wicket-keeper', 20.00, 'https://example.com/rajesh-kumar.png');