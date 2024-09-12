import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### user_profiles

| name       | type                        | format | required |
|------------|---------------------------|--------|----------|
| id         | uuid                      | string | true     |
| user_id    | uuid                      | string | true     |
| username   | text                      | string | false    |
| full_name  | text                      | string | false    |
| bio        | text                      | string | false    |
| avatar_url | text                      | string | false    |
| created_at | timestamp without time zone | string | false    |
| updated_at | timestamp without time zone | string | false    |

Note: 
- id is the Primary Key and has a default value of extensions.uuid_generate_v4()
- user_id is a Foreign Key referencing auth.users.id
- created_at and updated_at have default values of now()
*/

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
    });
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user_profiles').update(updateData).eq('id', id)),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['user_profiles', variables.user_id]);
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
    });
};