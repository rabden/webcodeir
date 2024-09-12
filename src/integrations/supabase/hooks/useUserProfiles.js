import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw error;
    return data;
};

export const useUserProfile = (userId) => useQuery({
    queryKey: ['user_profiles', userId],
    queryFn: () => fromSupabase(supabase.from('user_profiles').select('*').eq('user_id', userId).single()),
    enabled: !!userId,
});

export const useAddUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProfile) => fromSupabase(supabase.from('user_profiles').insert([newProfile])),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['user_profiles', variables.user_id]);
        },
        onError: (error) => {
            console.error('Error adding user profile:', error);
            throw error;
        },
    });
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user_profiles').update(updateData).eq('id', id)),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['user_profiles', variables.user_id]);
        },
        onError: (error) => {
            console.error('Error updating user profile:', error);
            throw error;
        },
    });
};

export const useDeleteUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user_profiles').delete().eq('id', id)),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries('user_profiles');
        },
        onError: (error) => {
            console.error('Error deleting user profile:', error);
            throw error;
        },
    });
};