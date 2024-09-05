import React from 'react';
import { Button } from "@/components/ui/button";
import { LogIn } from 'lucide-react';

const GoogleLogin = ({ onGoogleLogin }) => {
  const handleGoogleLogin = () => {
    // In a real application, you would implement the actual Google OAuth flow here
    // For this example, we'll simulate a successful login with mock data
    const mockGoogleUser = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatarUrl: 'https://example.com/avatar.jpg'
    };
    onGoogleLogin(mockGoogleUser);
  };

  return (
    <Button onClick={handleGoogleLogin} className="w-full">
      <LogIn className="mr-2 h-4 w-4" />
      Login with Google
    </Button>
  );
};

export default GoogleLogin;