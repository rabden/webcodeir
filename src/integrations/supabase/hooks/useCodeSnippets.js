import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### code_snippets

| name       | type                        | format | required |
|------------|---------------------------|--------|----------|
| id         | uuid                      | string | true     |
| user_id    | uuid                      | string | false    |
| title      | text                      | string | false    |
| html_code  | text                      | string | false    |
| css_code   | text                      | string | false    |
| js_code    | text                      | string | false    |
| created_at | timestamp without time zone | string | false    |
| updated_at | timestamp without time zone | string | false    |

Note: 
- id is the Primary Key and has a default value of extensions.uuid_generate_v4()
- created_at and updated_at have default values of now()
*/

export const useCodeSnippets = () => useQuery({
    queryKey: ['code_snippets'],
    queryFn: () => fromSupabase(supabase.from('code_snippets').select('*')),
});

export const useCodeSnippet = (id) => useQuery({
    queryKey: ['code_snippets', id],
    queryFn: () => fromSupabase(supabase.from('code_snippets').select('*').eq('id', id).single()),
});

export const useAddCodeSnippet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newSnippet) => fromSupabase(supabase.from('code_snippets').insert([newSnippet])),
        onSuccess: () => {
            queryClient.invalidateQueries('code_snippets');
        },
    });
};

export const useUpdateCodeSnippet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('code_snippets').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('code_snippets');
        },
    });
};

export const useDeleteCodeSnippet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('code_snippets').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('code_snippets');
        },
    });
};