import React from 'react';
import { Link } from 'react-router-dom';
import { useCodeSnippets } from '../integrations/supabase';
import { useSupabaseAuth } from '../integrations/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Code, Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const { session } = useSupabaseAuth();
  const userId = session?.user?.id;
  const { data: savedCodes, isLoading, error } = useCodeSnippets(userId);
  const { toast } = useToast();

  if (isLoading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Welcome to WebCodCraft</h1>
      <div className="mb-12 text-center">
        <Link to="/editor">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
            <Code className="mr-2 h-5 w-5" />
            Open Code Editor
          </Button>
        </Link>
      </div>
      <h2 className="text-3xl font-semibold mb-6 text-gray-700">Your Saved Codes</h2>
      {savedCodes && savedCodes.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg shadow">
          <p className="text-xl text-gray-600 mb-4">You haven't saved any codes yet.</p>
          <Link to="/editor">
            <Button variant="outline" size="lg" className="mt-2">
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Code
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCodes && savedCodes.map((code) => (
            <Card key={code.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">{code.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500">Created: {new Date(code.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 overflow-hidden h-20">
                  <span className="font-semibold">HTML:</span> {code.html_code.substring(0, 50)}...
                </p>
                <p className="text-sm text-gray-600 overflow-hidden h-20">
                  <span className="font-semibold">CSS:</span> {code.css_code.substring(0, 50)}...
                </p>
                <p className="text-sm text-gray-600 overflow-hidden h-20">
                  <span className="font-semibold">JS:</span> {code.js_code.substring(0, 50)}...
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link to={`/editor/${code.id}`}>
                  <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={() => {
                  toast({
                    title: "Not implemented",
                    description: "Delete functionality is not yet implemented.",
                    variant: "destructive",
                  });
                }} className="bg-red-500 hover:bg-red-600 text-white">
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