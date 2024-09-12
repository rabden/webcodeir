import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase';
import { SupabaseAuthUI } from '../integrations/supabase';
import { useUserData, useUpdateUserData, useUploadProfileImage } from '../integrations/supabase/hooks/useUserData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '../integrations/supabase/supabase';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ProfilePanel = ({ onClose }) => {
  const { session, logout } = useSupabaseAuth();
  const { toast } = useToast();
  const { data: userData, isLoading } = useUserData(session?.user?.id);
  const updateUserData = useUpdateUserData();
  const uploadProfileImage = useUploadProfileImage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setEmail(userData.email || '');
    }
  }, [userData]);

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

  const handleUpdateProfile = async () => {
    try {
      await updateUserData.mutateAsync({ userId: session.user.id, name, email });
      toast({
        title: "Profile updated successfully",
        type: "success"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        type: "error"
      });
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await uploadProfileImage.mutateAsync({ userId: session.user.id, file });
        toast({
          title: "Profile image uploaded successfully",
          type: "success"
        });
      } catch (error) {
        console.error('Error uploading profile image:', error);
        toast({
          title: "Error uploading profile image",
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
        ) : isLoading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={userData?.profile_image_url || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div className="flex items-center space-x-2 text-blue-500 hover:text-blue-400">
                    <Upload size={16} />
                    <span>Upload new image</span>
                  </div>
                </Label>
              </div>
            </div>
            <div>
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
            <Button onClick={handleUpdateProfile} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Update Profile
            </Button>
            <Button onClick={handleSignOut} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Sign Out
            </Button>
            <Button onClick={handleDeleteAccount} className="w-full bg-red-800 hover:bg-red-900 text-white">
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