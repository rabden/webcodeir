import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import {
    useCodeSnippets,
    useCodeSnippet,
    useAddCodeSnippet,
    useUpdateCodeSnippet,
    useDeleteCodeSnippet
} from './hooks/useCodeSnippets.js';
import {
    useUserProfile,
    useAddUserProfile,
    useUpdateUserProfile,
    useDeleteUserProfile
} from './hooks/useUserProfiles.js';
import {
    useUserData,
    useUpdateUserData,
    useUploadProfileImage
} from './hooks/useUserData.js';

export {
    supabase,
    SupabaseAuthProvider,
    useSupabaseAuth,
    SupabaseAuthUI,
    useCodeSnippets,
    useCodeSnippet,
    useAddCodeSnippet,
    useUpdateCodeSnippet,
    useDeleteCodeSnippet,
    useUserProfile,
    useAddUserProfile,
    useUpdateUserProfile,
    useDeleteUserProfile,
    useUserData,
    useUpdateUserData,
    useUploadProfileImage
};