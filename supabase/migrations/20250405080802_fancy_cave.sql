/*
  # Update team names to match frontend

  1. Changes
    - Update existing team names to match the frontend team list
    - Ensure all required teams exist
    
  2. Security
    - No security changes needed
    - Maintains existing RLS policies
*/

-- First, delete existing teams to avoid conflicts
DELETE FROM teams;

-- Insert teams with correct names
INSERT INTO teams (name, color, logo) VALUES
  ('Mumbai', '#1E88E5', 'https://example.com/mumbai.png'),
  ('Chennai', '#FDD835', 'https://example.com/chennai.png'),
  ('Bangalore', '#D32F2F', 'https://example.com/bangalore.png'),
  ('Kolkata', '#7B1FA2', 'https://example.com/kolkata.png'),
  ('Delhi', '#1976D2', 'https://example.com/delhi.png'),
  ('Punjab', '#C62828', 'https://example.com/punjab.png'),
  ('Rajasthan', '#E91E63', 'https://example.com/rajasthan.png'),
  ('Hyderabad', '#FF6F00', 'https://example.com/hyderabad.png'),
  ('Gujarat', '#2E7D32', 'https://example.com/gujarat.png'),
  ('Lucknow', '#00ACC1', 'https://example.com/lucknow.png');