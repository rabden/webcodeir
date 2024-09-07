import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const AIImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return result;
  }

  const generateImage = async () => {
    setIsLoading(true);
    try {
      const result = await query({ "inputs": prompt });
      const imageUrl = URL.createObjectURL(result);
      setGeneratedImages(prevImages => [...prevImages, imageUrl]);
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">AI Image Generator</h3>
      <div className="flex space-x-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter image description"
          className="flex-grow bg-gray-700 text-white border-gray-600"
        />
        <Button onClick={generateImage} disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
      </div>
      <ScrollArea className="h-[400px] w-full rounded border border-gray-700">
        <div className="space-y-4 p-4">
          {generatedImages.map((imageUrl, index) => (
            <div key={index} className="relative">
              <img src={imageUrl} alt={`Generated image ${index + 1}`} className="w-full rounded-lg" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AIImageGenerator;