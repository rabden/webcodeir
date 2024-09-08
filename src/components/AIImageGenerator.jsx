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
import { Wand2, MoreVertical, Download, Link, Image, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const MAX_SEED = 4294967295;
const API_KEY = "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";

const modelEndpoints = {
  SD3: "stabilityai/stable-diffusion-3-medium-diffusers",
  FLUX: "black-forest-labs/FLUX.1-schnell",
  HENTAI: "stablediffusionapi/explicit-freedom-nsfw-wai"
};

const AIImageGenerator = () => {
  const [results, setResults] = useState({ SD3: [], FLUX: [], HENTAI: [] });
  const [loading, setLoading] = useState({ SD3: false, FLUX: false, HENTAI: false });
  const [prompts, setPrompts] = useState({ SD3: '', FLUX: '', HENTAI: '' });
  const [fluxParams, setFluxParams] = useState({
    seed: 0,
    randomize_seed: true,
    width: 1024,
    height: 1024,
    num_inference_steps: 4
  });
  const [isFluxSettingsOpen, setIsFluxSettingsOpen] = useState(false);
  const { toast } = useToast();

  const generateImage = async (model) => {
    setLoading(prev => ({ ...prev, [model]: true }));
    let data = { inputs: prompts[model] };
    if (model === 'FLUX') {
      data.parameters = {
        seed: fluxParams.randomize_seed ? Math.floor(Math.random() * MAX_SEED) : fluxParams.seed,
        width: fluxParams.width,
        height: fluxParams.height,
        num_inference_steps: fluxParams.num_inference_steps
      };
    }
    
    setResults(prev => ({
      ...prev,
      [model]: [{ loading: true, seed: data.parameters?.seed, prompt: prompts[model] }, ...prev[model]]
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
      if (model === 'FLUX') setFluxParams(prev => ({ ...prev, seed: response[1] }));
    } catch (error) {
      console.error('Error:', error);
      setResults(prev => ({ 
        ...prev, 
        [model]: prev[model].map((item, index) => 
          index === 0 ? { error: 'Error generating image. Please try again.', seed: data.parameters?.seed, prompt: prompts[model] } : item
        )
      }));
    }
    setLoading(prev => ({ ...prev, [model]: false }));
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

  const renderInputs = (model) => (
    <div className="space-y-4">
      <Input
        value={prompts[model]}
        onChange={(e) => setPrompts(prev => ({ ...prev, [model]: e.target.value }))}
        placeholder="Enter prompt"
        className="h-12"
      />
      {model === 'FLUX' && (
        <Collapsible open={isFluxSettingsOpen} onOpenChange={setIsFluxSettingsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              FLUX Settings
              {isFluxSettingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {renderSlider("Seed", fluxParams.seed, (value) => setFluxParams(prev => ({ ...prev, seed: value })), 0, MAX_SEED, 1)}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="randomize-seed"
                checked={fluxParams.randomize_seed}
                onCheckedChange={(checked) => setFluxParams(prev => ({ ...prev, randomize_seed: checked }))}
              />
              <label htmlFor="randomize-seed" className="text-sm text-gray-400">Randomize seed</label>
            </div>
            {renderSlider("Width", fluxParams.width, (value) => setFluxParams(prev => ({ ...prev, width: value })), 256, 2048, 8)}
            {renderSlider("Height", fluxParams.height, (value) => setFluxParams(prev => ({ ...prev, height: value })), 256, 2048, 8)}
            {renderSlider("Inference Steps", fluxParams.num_inference_steps, (value) => setFluxParams(prev => ({ ...prev, num_inference_steps: value })), 1, 50, 1)}
          </CollapsibleContent>
        </Collapsible>
      )}
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
        <Tabs defaultValue="SD3">
          <TabsList>
            <TabsTrigger value="SD3">SD3</TabsTrigger>
            <TabsTrigger value="FLUX">FLUX</TabsTrigger>
            <TabsTrigger value="HENTAI">hent.ai</TabsTrigger>
          </TabsList>
          {['SD3', 'FLUX', 'HENTAI'].map(model => (
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