import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const MAX_SEED = 4294967295;
const API_KEY = "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";

const AIImageGenerator = () => {
  const [results, setResults] = useState({ StableDiffusion: null, FLUX: null, Hent: null });
  const [loading, setLoading] = useState({ StableDiffusion: false, FLUX: false, Hent: false });

  const generateImage = async (model) => {
    setLoading(prev => ({ ...prev, [model]: true }));
    const data = getModelData(model);
    try {
      const response = await queryModel(model, data);
      const imageUrl = URL.createObjectURL(response);
      setResults(prev => ({ ...prev, [model]: { imageUrl, seed: data.seed } }));
    } catch (error) {
      console.error('Error:', error);
      setResults(prev => ({ ...prev, [model]: 'Error generating image. Please try again.' }));
    }
    setLoading(prev => ({ ...prev, [model]: false }));
  };

  const queryModel = async (model, data) => {
    const modelEndpoints = {
      StableDiffusion: "stabilityai/stable-diffusion-3-medium-diffusers",
      FLUX: "black-forest-labs/FLUX.1-schnell",
      Hent: "stablediffusionapi/explicit-freedom-nsfw-wai"
    };
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelEndpoints[model]}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return await response.blob();
  };

  const getModelData = useCallback((model) => {
    return {
      inputs: document.getElementById(`${model.toLowerCase()}-prompt`).value,
      seed: Math.floor(Math.random() * MAX_SEED),
    };
  }, []);

  const downloadImage = (imageUrl, fileName) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderInputs = (model) => (
    <>
      <Input id={`${model.toLowerCase()}-prompt`} placeholder="Enter prompt" className="mb-4" />
      <Button onClick={() => generateImage(model)} disabled={loading[model]}>
        {loading[model] ? 'Generating...' : 'Generate Image'}
      </Button>
    </>
  );

  const renderResult = (model) => {
    const result = results[model];
    if (typeof result === 'string') return <p>{result}</p>;
    if (!result) return null;
    return (
      <>
        <img src={result.imageUrl} alt="Generated image" className="max-w-full h-auto mb-2" />
        <p>Used seed: {result.seed}</p>
        <Button onClick={() => downloadImage(result.imageUrl, `${model.toLowerCase()}_image.png`)} className="mt-2">
          Download Image
        </Button>
      </>
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">AI Image Generators</h2>
        <Tabs defaultValue="StableDiffusion">
          <TabsList>
            <TabsTrigger value="StableDiffusion">Stable Diffusion 3</TabsTrigger>
            <TabsTrigger value="FLUX">FLUX</TabsTrigger>
            <TabsTrigger value="Hent">Hent</TabsTrigger>
          </TabsList>
          {['StableDiffusion', 'FLUX', 'Hent'].map(model => (
            <TabsContent key={model} value={model}>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{model} Image Generator</h3>
                {renderInputs(model)}
                <div className="mt-4">
                  {renderResult(model)}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default AIImageGenerator;