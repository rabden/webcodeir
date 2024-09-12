import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const fetchGeneratedImages = async (userId) => {
  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const addGeneratedImage = async (newImage) => {
  const { data, error } = await supabase
    .from('generated_images')
    .insert([newImage])
    .select();

  if (error) throw error;
  return data[0];
};

const deleteGeneratedImage = async (imageId) => {
  const { error } = await supabase
    .from('generated_images')
    .delete()
    .eq('id', imageId);

  if (error) throw error;
};

export const useGeneratedImages = (userId) => {
  return useQuery({
    queryKey: ['generatedImages', userId],
    queryFn: () => fetchGeneratedImages(userId),
    enabled: !!userId,
  });
};

export const useAddGeneratedImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addGeneratedImage,
    onSuccess: (newImage) => {
      queryClient.invalidateQueries(['generatedImages', newImage.user_id]);
    },
  });
};

export const useDeleteGeneratedImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGeneratedImage,
    onSuccess: (_, imageId) => {
      queryClient.invalidateQueries('generatedImages');
    },
  });
};