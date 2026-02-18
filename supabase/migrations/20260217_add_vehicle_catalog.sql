-- Table to store custom brands and sub-brands added by each user
CREATE TABLE IF NOT EXISTS public.vehicle_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brand text NOT NULL,
  sub_brand text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, brand, sub_brand)
);

ALTER TABLE public.vehicle_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own catalog"
ON public.vehicle_catalog
FOR ALL
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
