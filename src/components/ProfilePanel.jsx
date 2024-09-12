import React, { useState, useEffect } from 'react';
import { useSupabaseAuth, useUserProfile, useAddUserProfile, useUpdateUserProfile } from '../integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';

const ProfilePanel = ({ onClose }) => {
  const { session } = useSupabaseAuth();
  const userId = session?.user?.id;
  const { data: profile, isLoading, error } = useUserProfile(userId);
  const addProfile = useAddUserProfile();
  const updateProfile = useUpdateUserProfile();

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
    if (profile) {
      await updateProfile.mutateAsync({ id: profile.id, ...formData, user_id: userId });
    } else {
      await addProfile.mutateAsync({ ...formData, user_id: userId });
    }
    onClose();
  };

  if (!session) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-white">User Profile</h2>
          <p className="text-white">Please sign in to view and edit your profile.</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white">User Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
        </form>
      </div>
    </div>
  );
};

export default ProfilePanel;