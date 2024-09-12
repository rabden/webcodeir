import React, { useState, useEffect } from 'react';
import { useSupabaseAuth, SupabaseAuthUI, useUserProfile, useAddUserProfile, useUpdateUserProfile } from '../integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const ProfilePanel = ({ onClose }) => {
  const { session, loading, logout } = useSupabaseAuth();
  const userId = session?.user?.id;
  const { data: profile, isLoading, error } = useUserProfile(userId);
  const addProfile = useAddUserProfile();
  const updateProfile = useUpdateUserProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profile) {
        await updateProfile.mutateAsync({ id: profile.id, ...formData, user_id: userId });
        toast({ title: "Profile updated successfully", type: "success" });
      } else {
        await addProfile.mutateAsync({ ...formData, user_id: userId });
        toast({ title: "Profile created successfully", type: "success" });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({ title: "Error saving profile", description: error.message, type: "error" });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white">User Profile</h2>
        {!session ? (
          <div>
            <p className="text-white mb-4">Please sign in or sign up to view and edit your profile.</p>
            <SupabaseAuthUI />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                value={session.user.email}
                readOnly
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="full_name" className="text-white">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="bio" className="text-white">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="avatar_url" className="text-white">Avatar URL</Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {profile ? 'Update Profile' : 'Create Profile'}
            </Button>
            <Button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 text-white mt-4">
              Sign Out
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePanel;