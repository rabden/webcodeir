// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import {
    useCodeSnippets,
    useCodeSnippet,
    useAddCodeSnippet,
    useUpdateCodeSnippet,
    useDeleteCodeSnippet
} from './hooks/useCodeSnippets.js';

// Export all the imported functions and objects
export {
    supabase,
    SupabaseAuthProvider,
    useSupabaseAuth,
    SupabaseAuthUI,
    useCodeSnippets,
    useCodeSnippet,
    useAddCodeSnippet,
    useUpdateCodeSnippet,
    useDeleteCodeSnippet
};