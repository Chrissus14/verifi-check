-- Add vehicle_type and traction columns to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vehicle_type TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS traction TEXT;
