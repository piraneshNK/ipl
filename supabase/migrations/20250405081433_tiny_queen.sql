/*
  # Update Teams Table RLS Policies

  1. Changes
    - Add INSERT policy for teams table
    - Update existing SELECT policy
    
  2. Security
    - Allow public access to insert teams
    - Maintain public read access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view teams" ON teams;

-- Create new policies
CREATE POLICY "Anyone can access teams"
ON teams
FOR ALL
TO public
USING (true)
WITH CHECK (true);