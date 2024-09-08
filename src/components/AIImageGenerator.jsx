import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Wand2, MoreVertical, Download, Link, Image, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const MAX_SEED = 4294967295;
const API_KEY = "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";

const AIImageGenerator = () => {
  const [results, setResults] = useState({ StableDiffusion: [], FLUX: [] });
  const [loading, setLoading] = useState({ StableDiffusion: false, FLUX: false });
  const [prompts, setPrompts] = useState({ StableDiffusion: '', FLUX: '' });
  const [fluxParams, setFluxParams] = useState({
    seed: 0,
    randomize_seed: true,
    width: 1024,
    height: 1024,
    num_inference_steps: 4
  });
  const { toast } = useToast();

  const generateImage = async (model) => {
    setLoading(prev => ({ ...prev, [model]: true }));
    let data = {
      inputs: prompts[model],
      parameters: {
        seed: fluxParams.randomize_seed ? Math.floor(Math.random() * MAX_SEED) : fluxParams.seed,
        width: fluxParams.width,
        height: fluxParams.height,
        num_inference_steps: fluxParams.num_inference_steps
      }
    };
    
    setResults(prev => ({
      ...prev,
      [model]: [{ loading: true, seed: data.parameters.seed, prompt: prompts[model] }, ...prev[model]]
    }));

    try {
      const response = await queryModel(model, data);
      const imageUrl = URL.createObjectURL(response[0]);
      setResults(prev => ({ 
        ...prev, 
        [model]: prev[model].map((item, index) => 
          index === 0 ? { imageUrl, seed: response[1], prompt: prompts[model] } : item
        )
      }));
      setFluxParams(prev => ({ ...prev, seed: response[1] }));
    } catch (error) {
      console.error('Error:', error);
      setResults(prev => ({ 
        ...prev, 
        [model]: prev[model].map((item, index) => 
          index === 0 ? { error: 'Error generating image. Please try again.', seed: data.parameters.seed, prompt: prompts[model] } : item
        )
      }));
    }
    setLoading(prev => ({ ...prev, [model]: false }));
  };

  const queryModel = async (model, data) => {
    const modelEndpoints = {
      StableDiffusion: "stabilityai/stable-diffusion-3-medium-diffusers",
      FLUX: "black-forest-labs/FLUX.1-schnell"
    };
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelEndpoints[model]}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return [result, data.parameters.seed];
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  const downloadImage = (imageUrl, fileName) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderInputs = (model) => (
    <div className="space-y-4">
      <Input
        value={prompts[model]}
        onChange={(e) => setPrompts(prev => ({ ...prev, [model]: e.target.value }))}
        placeholder="Enter prompt"
        className="h-12"
      />
      {model === 'FLUX' && renderFluxControls()}
      <Button
        onClick={() => generateImage(model)}
        disabled={loading[model]}
        className="w-full h-12"
      >
        {loading[model] ? <Loader2 className="h-6 w-6 animate-spin" /> : <Wand2 className="h-6 w-6 mr-2" />}
        Generate
      </Button>
    </div>
  );

  const renderFluxControls = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Slider
          value={[fluxParams.seed]}
          onValueChange={(value) => setFluxParams(prev => ({ ...prev, seed: value[0] }))}
          max={MAX_SEED}
          step={1}
          disabled={fluxParams.randomize_seed}
        />
        <span className="text-sm text-gray-400 w-16 text-right">{fluxParams.seed}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="randomize-seed"
          checked={fluxParams.randomize_seed}
          onCheckedChange={(checked) => setFluxParams(prev => ({ ...prev, randomize_seed: checked }))}
        />
        <label htmlFor="randomize-seed" className="text-sm text-gray-400">Randomize seed</label>
      </div>
      {['width', 'height'].map(param => (
        <div key={param} className="flex items-center space-x-2">
          <Slider
            value={[fluxParams[param]]}
            onValueChange={(value) => setFluxParams(prev => ({ ...prev, [param]: value[0] }))}
            min={256}
            max={2048}
            step={8}
          />
          <span className="text-sm text-gray-400 w-16 text-right">{fluxParams[param]}px</span>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Slider
          value={[fluxParams.num_inference_steps]}
          onValueChange={(value) => setFluxParams(prev => ({ ...prev, num_inference_steps: value[0] }))}
          min={1}
          max={50}
          step={1}
        />
        <span className="text-sm text-gray-400 w-16 text-right">{fluxParams.num_inference_steps}</span>
      </div>
    </div>
  );

  const renderResult = useCallback((model) => {
    return results[model].map((result, index) => (
      <Card key={index} className="mb-4">
        <CardContent className="p-0">
          {result.loading ? (
            <div className="w-full h-64 flex items-center justify-center bg-gray-200">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : result.error ? (
            <div className="w-full h-64 flex items-center justify-center bg-gray-200">
              <p className="text-red-500">{result.error}</p>
            </div>
          ) : (
            <img src={result.imageUrl} alt="Generated image" className="w-full h-auto rounded-t-lg" />
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4">
          <div>
            <p className="text-sm text-gray-500">Seed: {result.seed}</p>
            <p className="text-sm text-gray-500">Prompt: {result.prompt}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {!result.loading && !result.error && (
                <>
                  <DropdownMenuItem onClick={() => downloadImage(result.imageUrl, `${model.toLowerCase()}_image_${index}.png`)}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyToClipboard(result.imageUrl)}>
                    <Link className="mr-2 h-4 w-4" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyToClipboard(`<img src="${result.imageUrl}" alt="Generated image" />`)}>
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
  }, [results]);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">AI Image Generators</h2>
        <Tabs defaultValue="StableDiffusion">
          <TabsList>
            <TabsTrigger value="StableDiffusion">Stable Diffusion 3</TabsTrigger>
            <TabsTrigger value="FLUX">FLUX</TabsTrigger>
          </TabsList>
          {['StableDiffusion', 'FLUX'].map(model => (
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