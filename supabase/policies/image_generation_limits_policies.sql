-- Enable Row Level Security
ALTER TABLE image_generation_limits ENABLE ROW LEVEL SECURITY;

-- Policy for selecting rows
CREATE POLICY "Users can view their own image generation limits"
ON image_generation_limits
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for inserting rows
CREATE POLICY "Users can insert their own image generation limits"
ON image_generation_limits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for updating rows
CREATE POLICY "Users can update their own image generation limits"
ON image_generation_limits
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy for deleting rows (optional, depending on your requirements)
CREATE POLICY "Users can delete their own image generation limits"
ON image_generation_limits
FOR DELETE
USING (auth.uid() = user_id);