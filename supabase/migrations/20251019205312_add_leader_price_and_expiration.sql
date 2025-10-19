/*
  # Add leader price and expiration date to products table

  1. Changes
    - Add `leader_price` column (numeric) to store custom pricing set by employees
    - Add `expiration_date` column (date) to track product expiration dates
  
  2. Notes
    - Both fields are optional (nullable)
    - leader_price defaults to 0
    - expiration_date is null by default
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'leader_price'
  ) THEN
    ALTER TABLE products ADD COLUMN leader_price numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'expiration_date'
  ) THEN
    ALTER TABLE products ADD COLUMN expiration_date date;
  END IF;
END $$;