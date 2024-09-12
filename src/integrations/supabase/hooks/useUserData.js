import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const useUserData = (userId) => useQuery({
  queryKey: ['user_data', userId],
  queryFn: () => fromSupabase(supabase.from('user_data').select('*').eq('user_id', userId).single()),
  enabled: !!userId,
});

export const useUpdateUserData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, ...updateData }) => fromSupabase(supabase.from('user_data').upsert({ user_id: userId, ...updateData })),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['user_data', variables.userId]);
    },
  });
};

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, file }) => {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/profile.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('profile_images').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl }, error: urlError } = supabase.storage.from('profile_images').getPublicUrl(filePath);
      if (urlError) throw urlError;
      return fromSupabase(supabase.from('user_data').upsert({ user_id: userId, profile_image: publicUrl }));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['user_data', variables.userId]);
    },
  });
};