-- Create the generated_images table
CREATE TABLE public.generated_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    seed BIGINT NOT NULL,
    prompt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Create policy for select
CREATE POLICY "Users can view their own generated images"
ON public.generated_images
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for insert
CREATE POLICY "Users can insert their own generated images"
ON public.generated_images
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for delete
CREATE POLICY "Users can delete their own generated images"
ON public.generated_images
FOR DELETE
USING (auth.uid() = user_id);

-- Create an index on user_id for faster queries
CREATE INDEX idx_generated_images_user_id ON public.generated_images(user_id);