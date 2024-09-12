import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from 'lucide-react';

const AIImageGeneratorResult = ({ results }) => {
  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        {!result.loading && !result.error && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDownload(result.imageUrl)}
            className="text-white hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  ));
};

export default AIImageGeneratorResult;