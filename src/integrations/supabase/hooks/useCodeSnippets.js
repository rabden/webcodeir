import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useCodeSnippets = (userId) => useQuery({
    queryKey: ['code_snippets', userId],
    queryFn: () => fromSupabase(supabase.from('code_snippets').select('*').eq('user_id', userId)),
    enabled: !!userId,
});

export const useCodeSnippet = (id) => useQuery({
    queryKey: ['code_snippets', id],
    queryFn: () => fromSupabase(supabase.from('code_snippets').select('*').eq('id', id).single()),
});

export const useAddCodeSnippet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newSnippet) => fromSupabase(supabase.from('code_snippets').insert([newSnippet])),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['code_snippets', variables.user_id]);
        },
    });
};

export const useUpdateCodeSnippet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('code_snippets').update(updateData).eq('id', id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['code_snippets', variables.user_id]);
        },
    });
};

export const useDeleteCodeSnippet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('code_snippets').delete().eq('id', id)),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['code_snippets']);
        },
    });
};