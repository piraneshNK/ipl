/*
  # Fix Room RLS Policies

  1. Changes
    - Add created_by column to rooms table if not exists
    - Update RLS policies for rooms table to properly handle room creation
    
  2. Security
    - Enable RLS on rooms table
    - Add policies for authenticated users to create and manage rooms
*/

-- Add created_by column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'rooms' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE rooms ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Update RLS policies
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Room owners can create rooms" ON rooms;
DROP POLICY IF EXISTS "Room owners can delete their rooms" ON rooms;
DROP POLICY IF EXISTS "Room owners can update their rooms" ON rooms;
DROP POLICY IF EXISTS "Users can view available rooms" ON rooms;

-- Create new policies
CREATE POLICY "Room owners can create rooms"
ON rooms FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room owners can delete their rooms"
ON rooms FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Room owners can update their rooms"
ON rooms FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view available rooms"
ON rooms FOR SELECT
TO authenticated
USING (true);