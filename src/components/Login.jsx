import React from 'react';
import { Button } from "@/components/ui/button";
import { Github } from 'lucide-react';

const Login = () => {
  const handleGithubLogin = () => {
    // TODO: Implement GitHub OAuth login
    console.log('GitHub login clicked');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">Login to WebCodeCraft</h1>
        <p className="text-center text-gray-500 mb-6">Access your saved codes across devices</p>
        <Button onClick={handleGithubLogin} className="w-full flex items-center justify-center">
          <Github className="mr-2 h-4 w-4" />
          Login with GitHub
        </Button>
      </div>
    </div>
  );
};

export default Login;