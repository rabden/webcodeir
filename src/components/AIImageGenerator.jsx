import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, MoreVertical, Download, Link, Image, Loader2, Settings, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import * as monaco from 'monaco-editor';

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
    isFluxSettingsOpen: false
  });
  const { toast } = useToast();

  useEffect(() => {
    // Set up Monaco Editor auto-completion
    monaco.languages.registerCompletionItemProvider('plaintext', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = [
          { label: 'realistic', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'realistic' },
          { label: 'photorealistic', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'photorealistic' },
          { label: 'high quality', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'high quality' },
          { label: 'detailed', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'detailed' },
          { label: 'cinematic', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'cinematic' },
          { label: 'portrait', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'portrait' },
          { label: 'landscape', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'landscape' },
          { label: 'sci-fi', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'sci-fi' },
          { label: 'fantasy', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'fantasy' },
        ];

        return { suggestions: suggestions.map(s => ({ ...s, range })) };
      }
    });
  }, []);

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
        className="bg-blue-600 hover:bg-blue-700"
      >
        {state.loading[model] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
      </Button>
    </div>
  );

  const renderFluxSettings = () => (
    <Collapsible open={state.isFluxSettingsOpen} onOpenChange={(open) => setState(prev => ({ ...prev, isFluxSettingsOpen: open }))}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="mb-2">
          {state.isFluxSettingsOpen ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
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
          <div className="flex-1">
            <label className="text-sm font-medium text-white">Aspect Ratio</label>
            <Select 
              value={state.fluxParams.aspectRatio} 
              onValueChange={(value) => setState(prev => ({ ...prev, fluxParams: { ...prev.fluxParams, aspectRatio: value } }))}
            >
              <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                {Object.keys(aspectRatios).map((ratio) => (
                  <SelectItem key={ratio} value={ratio}>{ratio}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
      </CollapsibleContent>
    </Collapsible>
  );

  const renderResult = useCallback((model) => {
    return state.results[model].map((result, index) => (
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 text-white border-gray-700">
              {!result.loading && !result.error && (
                <>
                  <DropdownMenuItem onClick={() => window.open(result.imageUrl, '_blank')} className="hover:bg-gray-700">
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyToClipboard(result.imageUrl)} className="hover:bg-gray-700">
                    <Link className="mr-2 h-4 w-4" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyToClipboard(`<img src="${result.imageUrl}" alt="Generated image" />`)} className="hover:bg-gray-700">
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
        <h2 className="text-2xl font-bold text-white">AI Image Generators</h2>
        <Tabs defaultValue="FLUX" className="bg-gray-900 p-4 rounded-lg">
          <TabsList className="bg-gray-800 mb-4">
            <TabsTrigger value="FLUX" className="data-[state=active]:bg-blue-600">FLUX</TabsTrigger>
            <TabsTrigger value="SD3" className="data-[state=active]:bg-blue-600">SD3</TabsTrigger>
          </TabsList>
          {['FLUX', 'SD3'].map(model => (
            <TabsContent key={model} value={model}>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">{model} Image Generator</h3>
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