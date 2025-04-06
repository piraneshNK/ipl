/*
  # Add teams with unique names

  1. Changes
    - Add unique constraint on team names
    - Insert initial team data
    
  2. Data
    - Adds 10 IPL teams with their respective colors and logos
*/

-- First, ensure we have a unique constraint on the name column
ALTER TABLE teams ADD CONSTRAINT teams_name_key UNIQUE (name);

-- Clear existing teams to avoid conflicts
DELETE FROM teams;

-- Insert teams with their data
INSERT INTO teams (name, color, logo, max_budget)
VALUES 
  ('Mumbai', '#004BA0', 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100', 100.00),
  ('Chennai', '#F9CD05', 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824e4?auto=format&fit=crop&q=80&w=100', 100.00),
  ('Bangalore', '#EC1C24', 'https://images.unsplash.com/photo-1630395822970-acd6a691d97e?auto=format&fit=crop&q=80&w=100', 100.00),
  ('Kolkata', '#3A225D', 'https://images.unsplash.com/photo-1630395822970-acd6a691d97e?auto=format&fit=crop&q=80&w=100', 100.00),
  ('Delhi', '#282968', 'https://images.unsplash.com/photo-1630395822970-acd6a691d97e?auto=format&fit=crop&q=80&w=100', 100.00),
  ('Punjab', '#ED1B24', 'https://images.unsplash.com/photo-1630395822970-acd6a691d97e?auto=format&fit=crop&q=80&w=100', 100.00),
  ('Rajasthan', '#254AA5', 'https://images.unsplash.com/photo-1630395822970-acd6a691d97e?auto=format&fit=crop&q=80&w=100', 100.00),
  ('Hyderabad', '#F7A721', 'https://images.unsplash.com/photo-1630395822970-acd6a691d97e?auto=format&fit=crop&q=80&w=100', 100.00),
  ('Gujarat', '#1B2133', 'https://images.unsplash.com/photo-1630395822970-acd6a691d97e?auto=format&fit=crop&q=80&w=100', 100.00),
  ('Lucknow', '#A7D5F6', 'https://images.unsplash.com/photo-1630395822970-acd6a691d97e?auto=format&fit=crop&q=80&w=100', 100.00);