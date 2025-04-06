/*
  # Update room_teams RLS policies

  1. Changes
    - Drop existing insert policy that was too restrictive
    - Add new insert policy that allows users to join rooms if:
      - They are authenticated
      - The room exists
      - They haven't already joined the room
      - The team hasn't been taken

  2. Security
    - Maintains existing select policy
    - Adds more specific insert policy with proper checks
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can join rooms" ON room_teams;

-- Create new insert policy with proper checks
CREATE POLICY "Users can join rooms" ON room_teams
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User must be authenticated
    auth.uid() IS NOT NULL
    -- User must be the one joining
    AND auth.uid() = user_id
    -- Room must exist
    AND EXISTS (
      SELECT 1 FROM rooms 
      WHERE id = room_id
    )
    -- User hasn't already joined this room
    AND NOT EXISTS (
      SELECT 1 FROM room_teams rt
      WHERE rt.room_id = room_teams.room_id
      AND rt.user_id = auth.uid()
    )
    -- Team hasn't been taken in this room
    AND NOT EXISTS (
      SELECT 1 FROM room_teams rt
      WHERE rt.room_id = room_teams.room_id
      AND rt.team_id = room_teams.team_id
    )
  );