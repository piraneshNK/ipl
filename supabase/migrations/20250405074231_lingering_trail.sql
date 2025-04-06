/*
  # Fix rooms table RLS policies

  1. Changes
    - Update INSERT policy for rooms table to properly handle room creation
    - Add DELETE policy for room owners
    - Add UPDATE policy for room owners

  2. Security
    - Only authenticated users can create rooms
    - Only room owners can delete their rooms
    - Only room owners can update their rooms
    - Existing SELECT policy remains unchanged
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "Users can create rooms" ON rooms;

-- Create new insert policy that properly sets created_by
CREATE POLICY "Users can create rooms"
ON rooms
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = created_by
);

-- Add policy for room owners to delete their rooms
CREATE POLICY "Room owners can delete their rooms"
ON rooms
FOR DELETE
TO authenticated
USING (
  auth.uid() = created_by
);

-- Add policy for room owners to update their rooms
CREATE POLICY "Room owners can update their rooms"
ON rooms
FOR UPDATE
TO authenticated
USING (
  auth.uid() = created_by
)
WITH CHECK (
  auth.uid() = created_by
);