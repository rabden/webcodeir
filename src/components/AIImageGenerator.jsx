import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Wand2, MoreVertical, Download, Link, Image, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const MAX_SEED = 4294967295;
const API_KEY = "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";

const modelEndpoints = {
  FLUX: "black-forest-labs/FLUX.1-schnell",
  SD3: "stabilityai/stable-diffusion-3-medium-diffusers",
  HENTAI: "stablediffusionapi/explicit-freedom-nsfw-wai"
};

const AIImageGenerator = () => {
  const [state, setState] = useState({
    results: { FLUX: [], SD3: [], HENTAI: [] },
    loading: { FLUX: false, SD3: false, HENTAI: false },
    prompts: { FLUX: '', SD3: '', HENTAI: '' },
    fluxParams: {
      seed: 0,
      randomize_seed: true,
      width: 1024,
      height: 1024,
      num_inference_steps: 4
    },
    isFluxSettingsOpen: false,
    progress: { FLUX: 0, SD3: 0, HENTAI: 0 }
  });
  const { toast } = useToast();

  const generateImage = async (model) => {
    setState(prev => ({ ...prev, loading: { ...prev.loading, [model]: true }, progress: { ...prev.progress, [model]: 0 } }));
    let data = { inputs: state.prompts[model] };
    if (model === 'FLUX') {
      data.parameters = {
        seed: state.fluxParams.randomize_seed ? Math.floor(Math.random() * MAX_SEED) : state.fluxParams.seed,
        width: state.fluxParams.width,
        height: state.fluxParams.height,
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
        fluxParams: model === 'FLUX' ? { ...prev.fluxParams, seed: response[1] } : prev.fluxParams,
        progress: { ...prev.progress, [model]: 100 }
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
        },
        progress: { ...prev.progress, [model]: 0 }
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

  const downloadImage = (imageUrl, fileName) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        <Wand2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderFluxSettings = () => (
    <Collapsible open={state.isFluxSettingsOpen} onOpenChange={(open) => setState(prev => ({ ...prev, isFluxSettingsOpen: open }))}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between mb-2">
          FLUX Settings
          {state.isFluxSettingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4">
        {renderSlider("Seed", state.fluxParams.seed, (value) => setState(prev => ({ ...prev, fluxParams: { ...prev.fluxParams, seed: value } })), 0, MAX_SEED, 1)}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="randomize-seed"
            checked={state.fluxParams.randomize_seed}
            onCheckedChange={(checked) => setState(prev => ({ ...prev, fluxParams: { ...prev.fluxParams, randomize_seed: checked } }))}
          />
          <label htmlFor="randomize-seed" className="text-sm text-gray-400">Randomize seed</label>
        </div>
        {renderSlider("Width", state.fluxParams.width, (value) => setState(prev => ({ ...prev, fluxParams: { ...prev.fluxParams, width: value } })), 256, 2048, 8)}
        {renderSlider("Height", state.fluxParams.height, (value) => setState(prev => ({ ...prev, fluxParams: { ...prev.fluxParams, height: value } })), 256, 2048, 8)}
        {renderSlider("Inference Steps", state.fluxParams.num_inference_steps, (value) => setState(prev => ({ ...prev, fluxParams: { ...prev.fluxParams, num_inference_steps: value } })), 1, 50, 1)}
      </CollapsibleContent>
    </Collapsible>
  );

  const renderSlider = (name, value, onChange, min, max, step) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium text-white">{name}</label>
        <span className="text-sm text-gray-400">{value}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(newValue) => onChange(newValue[0])}
        min={min}
        max={max}
        step={step}
        className="bg-gray-800"
      />
    </div>
  );

  const renderResult = useCallback((model) => {
    return state.results[model].map((result, index) => (
      <Card key={index} className="mb-4">
        <CardContent className="p-0">
          {result.loading ? (
            <div className="w-full h-64 flex items-center justify-center bg-gray-200">
              <Progress value={state.progress[model]} className="w-1/2" />
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
  }, [state.results, state.progress]);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">AI Image Generators</h2>
        <Tabs defaultValue="FLUX">
          <TabsList>
            <TabsTrigger value="FLUX">FLUX</TabsTrigger>
            <TabsTrigger value="SD3">SD3</TabsTrigger>
            <TabsTrigger value="HENTAI">hent.ai</TabsTrigger>
          </TabsList>
          {['FLUX', 'SD3', 'HENTAI'].map(model => (
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