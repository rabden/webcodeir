import React from 'react';
import { Button } from "@/components/ui/button";
import { LogIn } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleLogin = ({ onGoogleLogin }) => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
        headers: {
          Authorization: `Bearer ${codeResponse.access_token}`,
          Accept: 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          const googleUser = {
            name: data.name,
            email: data.email,
            avatarUrl: data.picture
          };
          onGoogleLogin(googleUser);
        })
        .catch((err) => console.log("Error fetching user data:", err));
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  return (
    <Button onClick={() => login()} className="w-full">
      <LogIn className="mr-2 h-4 w-4" />
      Login with Google
    </Button>
  );
};

export default GoogleLogin;