/*
  # Fix scanned_by column to support employee identifiers

  1. Changes
    - Drop foreign key constraint to auth.users
    - Drop policies that depend on scanned_by
    - Change scanned_by column type from uuid to text
    - Recreate simplified policies for authenticated users
  
  2. Security
    - All authenticated users can manage products
    - This supports an employee-based inventory system
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update own scans" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete own scans" ON products;

-- Drop foreign key constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_scanned_by_fkey;

-- Change column type
ALTER TABLE products ALTER COLUMN scanned_by TYPE text USING scanned_by::text;

-- Recreate policies for all authenticated users
CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);