/*
  # Update Room RLS Policies to Remove Auth Requirements

  1. Changes
    - Make rooms accessible without authentication
    - Update RLS policies to allow public access
    
  2. Security
    - Enable RLS on rooms table
    - Add policies for public access
*/

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Room owners can create rooms" ON rooms;
DROP POLICY IF EXISTS "Room owners can delete their rooms" ON rooms;
DROP POLICY IF EXISTS "Room owners can update their rooms" ON rooms;
DROP POLICY IF EXISTS "Users can view available rooms" ON rooms;
DROP POLICY IF EXISTS "Users can create rooms" ON rooms;
DROP POLICY IF EXISTS "Users can view rooms they have access to" ON rooms;

-- Create new public access policies
CREATE POLICY "Anyone can create rooms"
ON rooms FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can view rooms"
ON rooms FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can update rooms"
ON rooms FOR UPDATE
TO public
USING (true)
WITH CHECK (true);