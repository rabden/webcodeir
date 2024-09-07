import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from 'lucide-react';

const AIImageGenerator = ({ onClose, isMobile }) => {
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
    <div className={`fixed inset-y-4 right-4 ${isMobile ? 'left-4' : 'w-96'} bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg overflow-hidden`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">AI Image Generator</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </div>
      <div className="p-4 flex space-x-2">
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
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
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