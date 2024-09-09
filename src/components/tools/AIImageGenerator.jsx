import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, MoreVertical, Download, Link, Image, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const MAX_SEED = 4294967295;
const API_KEY = "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";

const modelEndpoints = {
  FLUX: "black-forest-labs/FLUX.1-schnell",
  SD3: "stabilityai/stable-diffusion-3-medium-diffusers"
};

const aspectRatios = {
  "1:1": { width: 2048, height: 2048 },
  "16:9": { width: 2048, height: 1152 },
  "9:16": { width: 1152, height: 2048 },
  "4:3": { width: 2048, height: 1536 },
  "3:4": { width: 1536, height: 2048 },
  "2:3": { width: 1365, height: 2048 },
  "3:2": { width: 2048, height: 1365 },
};

const AIImageGenerator = () => {
  const [state, setState] = useState({
    results: { FLUX: [], SD3: [] },
    loading: { FLUX: false, SD3: false },
    prompts: { FLUX: '', SD3: '' },
    fluxParams: {
      seed: 0,
      randomize_seed: true,
      aspectRatio: "1:1",
      num_inference_steps: 4
    },
  });
  const { toast } = useToast();

  const generateImage = async (model) => {
    setState(prev => ({ ...prev, loading: { ...prev.loading, [model]: true } }));
    let data = { inputs: state.prompts[model] };
    if (model === 'FLUX') {
      const { width, height } = aspectRatios[state.fluxParams.aspectRatio];
      data.parameters = {
        seed: state.fluxParams.randomize_seed ? Math.floor(Math.random() * MAX_SEED) : state.fluxParams.seed,
        width,
        height,
        num_inference_steps: state.fluxParams.num_inference_steps
      };
    }
    
    setState(prev => ({
      ...prev,
      results: {
        ...prev.results,
        [model]: [{ loading: true, seed: data.parameters?.seed, prompt: state.prompts[model] }, ...prev.results[model]]
      }
    }));

    try {
      const response = await queryModel(model, data);
      const imageUrl = URL.createObjectURL(response[0]);
      setState(prev => ({ 
        ...prev, 
        results: { 
          ...prev.results, 
          [model]: prev.results[model].map((item, index) => 
            index === 0 ? { imageUrl, seed: response[1], prompt: state.prompts[model] } : item
          )
        },
        fluxParams: model === 'FLUX' ? { ...prev.fluxParams, seed: response[1] } : prev.fluxParams
      }));
    } catch (error) {
      console.error('Error:', error);
      setState(prev => ({ 
        ...prev, 
        results: { 
          ...prev.results, 
          [model]: prev.results[model].map((item, index) => 
            index === 0 ? { error: 'Error generating image. Please try again.', seed: data.parameters?.seed, prompt: state.prompts[model] } : item
          )
        }
      }));
    }
    setState(prev => ({ ...prev, loading: { ...prev.loading, [model]: false } }));
  };

  const queryModel = async (model, data) => {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelEndpoints[model]}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return [result, data.parameters?.seed];
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Copied to clipboard" });
  };

  const renderInputs = (model) => (
    <div className="flex space-x-2 mb-4">
      <Input
        value={state.prompts[model]}
        onChange={(e) => setState(prev => ({ ...prev, prompts: { ...prev.prompts, [model]: e.target.value } }))}
        placeholder="Enter prompt"
        className="flex-grow"
      />
      <Button
        onClick={() => generateImage(model)}
        disabled={state.loading[model]}
        size="icon"
      >
        {state.loading[model] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
      </Button>
    </div>
  );

  const renderFluxSettings = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Seed: {state.fluxParams.seed}</label>
        <Slider
          value={[state.fluxParams.seed]}
          onValueChange={(value) => setState(prev => ({ ...prev, fluxParams: { ...prev.fluxParams, seed: value[0] } }))}
          max={MAX_SEED}
          step={1}
          className="bg-gray-800"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="randomize-seed"
          checked={state.fluxParams.randomize_seed}
          onCheckedChange={(checked) => setState(prev => ({ ...prev, fluxParams: { ...prev.fluxParams, randomize_seed: checked } }))}
        />
        <label htmlFor="randomize-seed" className="text-sm text-gray-400">Randomize seed</label>
      </div>
      <Select 
        value={state.fluxParams.aspectRatio} 
        onValueChange={(value) => setState(prev => ({ ...prev, fluxParams: { ...prev.fluxParams, aspectRatio: value } }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select aspect ratio" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(aspectRatios).map((ratio) => (
            <SelectItem key={ratio} value={ratio}>{ratio}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Inference Steps: {state.fluxParams.num_inference_steps}</label>
        <Slider
          value={[state.fluxParams.num_inference_steps]}
          onValueChange={(value) => setState(prev => ({ ...prev, fluxParams: { ...prev.fluxParams, num_inference_steps: value[0] } }))}
          min={1}
          max={50}
          step={1}
          className="bg-gray-800"
        />
      </div>
    </div>
  );

  const renderResult = useCallback((model) => {
    return state.results[model].map((result, index) => (
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
                  <DropdownMenuItem onClick={() => window.open(result.imageUrl, '_blank')}>
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
  }, [state.results]);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">AI Image Generators</h2>
        <Tabs defaultValue="FLUX">
          <TabsList>
            <TabsTrigger value="FLUX">FLUX</TabsTrigger>
            <TabsTrigger value="SD3">SD3</TabsTrigger>
          </TabsList>
          {['FLUX', 'SD3'].map(model => (
            <TabsContent key={model} value={model}>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{model} Image Generator</h3>
                {renderInputs(model)}
                {model === 'FLUX' && renderFluxSettings()}
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