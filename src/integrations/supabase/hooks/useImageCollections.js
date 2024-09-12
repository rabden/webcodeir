import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useUserImages = (userId) => useQuery({
    queryKey: ['user_images', userId],
    queryFn: () => fromSupabase(supabase.from('generated_images').select('*').eq('user_id', userId)),
    enabled: !!userId,
});

export const useSaveImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newImage) => fromSupabase(supabase.from('generated_images').insert([newImage])),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['user_images', variables.user_id]);
        },
    });
};

export const useDeleteImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('generated_images').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries(['user_images']);
        },
    });
};