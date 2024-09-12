import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw error;
    return data;
};

export const useGeneratedImages = (userId) => useQuery({
    queryKey: ['generated_images', userId],
    queryFn: () => fromSupabase(supabase.from('generated_images').select('*').eq('user_id', userId).order('created_at', { ascending: false })),
    enabled: !!userId,
});

export const useAddGeneratedImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newImage) => fromSupabase(supabase.from('generated_images').insert([newImage])),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['generated_images', variables.user_id]);
        },
    });
};

export const useDeleteGeneratedImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('generated_images').delete().eq('id', id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['generated_images']);
        },
    });
};