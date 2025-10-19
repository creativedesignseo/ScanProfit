/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier for each product
      - `upc` (text, unique) - Barcode/UPC code
      - `title` (text) - Product title/name
      - `description` (text) - Short product description
      - `category` (text) - Product category
      - `amazon_price` (decimal) - Price in Amazon (USD)
      - `walmart_price` (decimal) - Price in Walmart (USD)
      - `average_price` (decimal) - Average price (editable by user)
      - `image_url` (text, nullable) - Product image URL
      - `scanned_by` (uuid, foreign key) - Employee who scanned the product
      - `created_at` (timestamptz) - When the product was scanned
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `products` table
    - Add policy for authenticated users to read all products
    - Add policy for authenticated users to insert their own scans
    - Add policy for authenticated users to update their own scans
    - Add policy for authenticated users to delete their own scans
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upc text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  amazon_price decimal(10,2) NOT NULL DEFAULT 0,
  walmart_price decimal(10,2) NOT NULL DEFAULT 0,
  average_price decimal(10,2) NOT NULL DEFAULT 0,
  image_url text,
  scanned_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = scanned_by);

CREATE POLICY "Authenticated users can update own scans"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() = scanned_by)
  WITH CHECK (auth.uid() = scanned_by);

CREATE POLICY "Authenticated users can delete own scans"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid() = scanned_by);

CREATE INDEX IF NOT EXISTS idx_products_upc ON products(upc);
CREATE INDEX IF NOT EXISTS idx_products_scanned_by ON products(scanned_by);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
