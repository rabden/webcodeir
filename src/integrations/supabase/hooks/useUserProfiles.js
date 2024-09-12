import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    try {
        const { data, error } = await query;
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Supabase query error:', error);
        return null;
    }
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
    retry: false,
    onError: (error) => {
        console.error('Error fetching user profile:', error);
    }
});

export const useAddUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newProfile) => {
            const result = await fromSupabase(supabase.from('user_profiles').insert([newProfile]));
            if (!result) throw new Error('Failed to add user profile');
            return result;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['user_profiles', variables.user_id]);
        },
        onError: (error) => {
            console.error('Error adding user profile:', error);
        }
    });
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updateData }) => {
            const result = await fromSupabase(supabase.from('user_profiles').update(updateData).eq('id', id));
            if (!result) throw new Error('Failed to update user profile');
            return result;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['user_profiles', variables.user_id]);
        },
        onError: (error) => {
            console.error('Error updating user profile:', error);
        }
    });
};

export const useDeleteUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const result = await fromSupabase(supabase.from('user_profiles').delete().eq('id', id));
            if (!result) throw new Error('Failed to delete user profile');
            return result;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries('user_profiles');
        },
        onError: (error) => {
            console.error('Error deleting user profile:', error);
        }
    });
};