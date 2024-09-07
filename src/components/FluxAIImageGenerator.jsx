import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const FluxAIImageGenerator = ({ onClose, isMobile }) => {
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState('landscape_4_3');
  const [numInferenceSteps, setNumInferenceSteps] = useState(28);
  const [guidanceScale, setGuidanceScale] = useState(3.5);
  const [numImages, setNumImages] = useState(1);
  const [enableSafetyChecker, setEnableSafetyChecker] = useState(true);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://fal.run/fal-ai/flux/dev', {
        method: 'POST',
        headers: {
          'Authorization': 'Key 0f7ccc67-180a-4e34-a55c-a8c943103f86:d9a7113cbe3a04d8391e25223a2919a9',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          image_size: imageSize,
          num_inference_steps: numInferenceSteps,
          guidance_scale: guidanceScale,
          num_images: numImages,
          enable_safety_checker: enableSafetyChecker,
        }),
      });

      const data = await response.json();
      if (data.images && data.images.length > 0) {
        setGeneratedImage(data.images[0].url);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className={`fixed inset-0 bg-gray-800 z-50 flex flex-col ${isMobile ? 'p-4' : 'md:inset-y-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[900px] md:rounded-lg'} overflow-hidden`}>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Flux AI Image Generator</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 flex flex-col md:flex-row">
        <div className="md:w-1/2 md:pr-4 space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your image prompt here..."
            className="bg-gray-700 text-white border-gray-600"
          />
          <Select value={imageSize} onValueChange={setImageSize}>
            <SelectTrigger className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select Image Size" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              <SelectItem value="square_hd">Square HD</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="portrait_4_3">Portrait 4:3</SelectItem>
              <SelectItem value="portrait_16_9">Portrait 16:9</SelectItem>
              <SelectItem value="landscape_4_3">Landscape 4:3</SelectItem>
              <SelectItem value="landscape_16_9">Landscape 16:9</SelectItem>
            </SelectContent>
          </Select>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Inference Steps: {numInferenceSteps}</label>
            <Slider
              value={[numInferenceSteps]}
              onValueChange={(value) => setNumInferenceSteps(value[0])}
              min={1}
              max={50}
              step={1}
              className="bg-gray-800"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Guidance Scale: {guidanceScale}</label>
            <Slider
              value={[guidanceScale]}
              onValueChange={(value) => setGuidanceScale(value[0])}
              min={1}
              max={10}
              step={0.1}
              className="bg-gray-800"
            />
          </div>
          <Input
            type="number"
            value={numImages}
            onChange={(e) => setNumImages(parseInt(e.target.value))}
            min={1}
            max={4}
            className="bg-gray-700 text-white border-gray-600"
          />
          <div className="flex items-center space-x-2">
            <Switch
              id="safety-checker"
              checked={enableSafetyChecker}
              onCheckedChange={setEnableSafetyChecker}
            />
            <label htmlFor="safety-checker" className="text-sm font-medium text-white">
              Enable Safety Checker
            </label>
          </div>
          <Button onClick={generateImage} disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
            {isLoading ? 'Generating...' : 'Generate Image'}
          </Button>
        </div>
        <div className="md:w-1/2 md:pl-4 mt-4 md:mt-0">
          {generatedImage ? (
            <img src={generatedImage} alt="Generated" className="w-full rounded-lg" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-lg">
              <p className="text-white text-lg">Generated image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FluxAIImageGenerator;