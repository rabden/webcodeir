import React from 'react';
import { useSupabaseAuth } from '../integrations/supabase';
import { SupabaseAuthUI } from '../integrations/supabase';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '../integrations/supabase/supabase';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ProfilePanel = ({ onClose }) => {
  const { session, logout } = useSupabaseAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Signed out successfully",
        type: "success"
      });
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        type: "error"
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const { error } = await supabase.rpc('delete_user');
        if (error) throw error;
        await logout();
        toast({
          title: "Account deleted successfully",
          type: "success"
        });
        onClose();
      } catch (error) {
        console.error('Error deleting account:', error);
        toast({
          title: "Error deleting account",
          description: error.message,
          type: "error"
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white">User Profile</h2>
        {!session ? (
          <div>
            <p className="text-white mb-4">Please sign in or sign up to view your profile.</p>
            <SupabaseAuthUI />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-white">Email: {session.user.email}</p>
            <Button onClick={handleSignOut} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Sign Out
            </Button>
            <Button onClick={handleDeleteAccount} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Delete Account
            </Button>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Email Rate Limit</AlertTitle>
              <AlertDescription>
                If you see an "email rate limit exceeded" error, it means too many emails have been sent recently. 
                Please wait a few minutes before trying again or contact support if the issue persists.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePanel;