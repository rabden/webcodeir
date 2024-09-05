import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User, Edit2, X, LogIn } from 'lucide-react';
import GoogleLogin from './GoogleLogin';

const ProfileMenu = ({ user, onUpdateUser, onGoogleLogin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full">
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {user.name ? (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-sm font-semibold">{user.name}</h4>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            {isEditing ? (
              <>
                <Input
                  placeholder="Name"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                />
                <Input
                  placeholder="Avatar URL"
                  value={editedUser.avatarUrl}
                  onChange={(e) => setEditedUser({ ...editedUser, avatarUrl: e.target.value })}
                />
                <div className="flex justify-end space-x-2">
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </>
            ) : (
              <Button onClick={handleEdit} variant="outline" className="w-full">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-500">You are not logged in.</p>
            <GoogleLogin onGoogleLogin={onGoogleLogin} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ProfileMenu;