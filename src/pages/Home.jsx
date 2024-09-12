import React from 'react';
import { Link } from 'react-router-dom';
import { useCodeSnippets } from '../integrations/supabase';
import { useSupabaseAuth } from '../integrations/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const { session } = useSupabaseAuth();
  const userId = session?.user?.id;
  const { data: savedCodes, isLoading, error } = useCodeSnippets(userId);
  const { toast } = useToast();

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to WebCodCraft</h1>
      <div className="mb-8">
        <Link to="/editor">
          <Button size="lg">Open Code Editor</Button>
        </Link>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Your Saved Codes</h2>
      {savedCodes && savedCodes.length === 0 ? (
        <p className="text-gray-500">You haven't saved any codes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCodes && savedCodes.map((code) => (
            <Card key={code.id}>
              <CardHeader>
                <CardTitle>{code.title}</CardTitle>
                <CardDescription>Created: {new Date(code.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">HTML: {code.html_code.substring(0, 50)}...</p>
                <p className="text-sm text-gray-500">CSS: {code.css_code.substring(0, 50)}...</p>
                <p className="text-sm text-gray-500">JS: {code.js_code.substring(0, 50)}...</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link to={`/editor/${code.id}`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={() => {
                  // Implement delete functionality
                  toast({
                    title: "Not implemented",
                    description: "Delete functionality is not yet implemented.",
                    variant: "destructive",
                  });
                }}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;