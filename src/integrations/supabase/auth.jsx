import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase.js';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Github, Mail } from "lucide-react";

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  return (
    <SupabaseAuthProviderInner>
      {children}
    </SupabaseAuthProviderInner>
  );
}

export const SupabaseAuthProviderInner = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      queryClient.invalidateQueries('user');
    });

    getSession();

    return () => {
      authListener.subscription.unsubscribe();
      setLoading(false);
    };
  }, [queryClient]);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    queryClient.invalidateQueries('user');
    setLoading(false);
  };

  return (
    <SupabaseAuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  return useContext(SupabaseAuthContext);
};

export const SupabaseAuthUI = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSignUpSuccess(false);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });
    if (error) setError(error.message);
    else {
      setSignUpSuccess(true);
      console.log('Signed up successfully', data);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else {
      console.log('Signed in successfully', data);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setError(null);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });
    if (error) setError(error.message);
    else {
      console.log(`${provider} sign in initiated`, data);
    }
  };

  const renderForm = () => (
    <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
      {isSignUp && (
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
    </form>
  );

  return (
    <div className="space-y-4">
      {renderForm()}
      <div className="flex items-center justify-between">
        <hr className="w-full" />
        <span className="px-2 text-gray-500">or</span>
        <hr className="w-full" />
      </div>
      <div className="space-y-2">
        <Button onClick={() => handleOAuthSignIn('github')} className="w-full flex items-center justify-center" variant="outline">
          <Github className="mr-2 h-4 w-4" />
          Sign {isSignUp ? 'up' : 'in'} with GitHub
        </Button>
        <Button onClick={() => handleOAuthSignIn('google')} className="w-full flex items-center justify-center" variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Sign {isSignUp ? 'up' : 'in'} with Google
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {signUpSuccess && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Please check your email for a confirmation link to complete the sign-up process.
          </AlertDescription>
        </Alert>
      )}
      <p className="text-center">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </Button>
      </p>
    </div>
  );
};