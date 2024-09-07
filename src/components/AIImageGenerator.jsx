import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from 'lucide-react';

const AIImageGenerator = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [seed, setSeed] = useState(0);
  const [randomizeSeed, setRandomizeSeed] = useState(true);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [numInferenceSteps, setNumInferenceSteps] = useState(4);
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
      let currentSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed;
      const result = await query({
        inputs: prompt,
        parameters: {
          seed: currentSeed,
          width: width,
          height: height,
          num_inference_steps: numInferenceSteps
        }
      });
      const imageUrl = URL.createObjectURL(result);
      setGeneratedImages(prevImages => [imageUrl, ...prevImages]);
      setSeed(currentSeed);
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-4 bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg overflow-hidden md:inset-10 lg:inset-20">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">AI Image Generator</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex-grow flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-4 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Prompt</label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter image description"
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Seed: {seed}</label>
            <Slider
              value={[seed]}
              onValueChange={(value) => setSeed(value[0])}
              min={0}
              max={1000000}
              step={1}
              className="bg-gray-700"
              disabled={randomizeSeed}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="randomizeSeed"
              checked={randomizeSeed}
              onCheckedChange={setRandomizeSeed}
            />
            <label htmlFor="randomizeSeed" className="text-sm font-medium text-white">
              Randomize seed
            </label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Width: {width}</label>
            <Slider
              value={[width]}
              onValueChange={(value) => setWidth(value[0])}
              min={256}
              max={2048}
              step={64}
              className="bg-gray-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Height: {height}</label>
            <Slider
              value={[height]}
              onValueChange={(value) => setHeight(value[0])}
              min={256}
              max={2048}
              step={64}
              className="bg-gray-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Number of inference steps: {numInferenceSteps}</label>
            <Slider
              value={[numInferenceSteps]}
              onValueChange={(value) => setNumInferenceSteps(value[0])}
              min={1}
              max={50}
              step={1}
              className="bg-gray-700"
            />
          </div>
          <Button onClick={generateImage} disabled={isLoading} className="w-full bg-blue-600 text-white hover:bg-blue-700">
            {isLoading ? 'Generating...' : 'Generate Image'}
          </Button>
        </div>
        <div className="w-full md:w-2/3 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img src={imageUrl} alt={`Generated image ${index + 1}`} className="w-full rounded-lg" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AIImageGenerator;