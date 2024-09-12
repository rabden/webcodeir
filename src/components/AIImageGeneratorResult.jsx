import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Download, Link, Image, Loader2 } from 'lucide-react';

const AIImageGeneratorResult = ({ results, toast }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  return results.map((result, index) => (
    <Card key={index} className="mb-4 bg-gray-800 border-gray-700">
      <CardContent className="p-0">
        {result.loading ? (
          <div className="w-full h-64 flex items-center justify-center bg-gray-700">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : result.error ? (
          <div className="w-full h-64 flex items-center justify-center bg-gray-700">
            <p className="text-red-500">{result.error}</p>
          </div>
        ) : (
          <img src={result.imageUrl} alt="Generated image" className="w-full h-auto rounded-t-lg" />
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 bg-gray-900">
        <div>
          <p className="text-sm text-gray-400">Seed: {result.seed}</p>
          <p className="text-sm text-gray-400">Prompt: {result.prompt}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 text-white border-gray-700">
            {!result.loading && !result.error && (
              <>
                <DropdownMenuItem onClick={() => window.open(result.imageUrl, '_blank')} className="hover:bg-gray-700">
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyToClipboard(result.imageUrl)} className="hover:bg-gray-700">
                  <Link className="mr-2 h-4 w-4" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyToClipboard(`<img src="${result.imageUrl}" alt="Generated image" />`)} className="hover:bg-gray-700">
                  <Image className="mr-2 h-4 w-4" />
                  <span>Copy Image Tag</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  ));
};

export default AIImageGeneratorResult;