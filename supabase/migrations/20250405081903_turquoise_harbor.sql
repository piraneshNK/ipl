/*
  # Fix RLS policies for room_teams table

  1. Changes
    - Drop existing policies
    - Create new policies for public access to room_teams
    - Allow anyone to insert and view room_teams data
    
  2. Security
    - Enable RLS on room_teams table
    - Add policies for public access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can join rooms" ON room_teams;
DROP POLICY IF EXISTS "Room members can view room teams" ON room_teams;

-- Create new policies for public access
CREATE POLICY "Anyone can view room teams"
ON room_teams FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can join rooms"
ON room_teams FOR INSERT
TO public
WITH CHECK (
  -- Room must exist
  EXISTS (
    SELECT 1 FROM rooms 
    WHERE id = room_id
  )
  -- User hasn't already joined this room
  AND NOT EXISTS (
    SELECT 1 FROM room_teams rt
    WHERE rt.room_id = room_teams.room_id
    AND rt.user_id = room_teams.user_id
  )
  -- Team hasn't been taken in this room
  AND NOT EXISTS (
    SELECT 1 FROM room_teams rt
    WHERE rt.room_id = room_teams.room_id
    AND rt.team_id = room_teams.team_id
  )
);