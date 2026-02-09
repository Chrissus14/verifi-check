-- Allow users to update their own vehicles
CREATE POLICY "Users can update their own vehicles"
ON public.vehicles
FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own vehicles
CREATE POLICY "Users can delete their own vehicles"
ON public.vehicles
FOR DELETE
TO public
USING (auth.uid() = user_id);
