import React, { useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Wand2, MoreVertical, Download, Link, Image, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const MAX_SEED = 4294967295;
const API_KEY = "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";

const AIImageGenerator = ({ state, setState }) => {
  const { toast } = useToast();

  const generateImage = async (model) => {
    setState(prevState => ({
      ...prevState,
      loading: { ...prevState.loading, [model]: true }
    }));
    const data = {
      inputs: state.prompts[model],
      seed: Math.floor(Math.random() * MAX_SEED),
    };
    
    // Add a placeholder result immediately
    setState(prevState => ({
      ...prevState,
      results: {
        ...prevState.results,
        [model]: [{ loading: true, seed: data.seed, prompt: state.prompts[model] }, ...prevState.results[model]]
      }
    }));

    try {
      const response = await queryModel(model, data);
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setState(prevState => ({ 
        ...prevState,
        results: {
          ...prevState.results,
          [model]: prevState.results[model].map((item, index) => 
            index === 0 ? { imageUrl, seed: data.seed, prompt: state.prompts[model], blob: imageBlob } : item
          )
        }
      }));
    } catch (error) {
      console.error('Error:', error);
      setState(prevState => ({ 
        ...prevState,
        results: {
          ...prevState.results,
          [model]: prevState.results[model].map((item, index) => 
            index === 0 ? { error: 'Error generating image. Please try again.', seed: data.seed, prompt: state.prompts[model] } : item
          )
        }
      }));
    }
    setState(prevState => ({
      ...prevState,
      loading: { ...prevState.loading, [model]: false }
    }));
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
    return response;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  const downloadImage = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderInputs = (model) => (
    <div className="flex items-center space-x-2 mb-4">
      <Input
        value={state.prompts[model]}
        onChange={(e) => setState(prevState => ({
          ...prevState,
          prompts: { ...prevState.prompts, [model]: e.target.value }
        }))}
        placeholder="Enter prompt"
        className="flex-grow h-12"
      />
      <Button
        onClick={() => generateImage(model)}
        disabled={state.loading[model]}
        className="h-12 w-12 p-0"
      >
        <Wand2 className="h-6 w-6" />
      </Button>
    </div>
  );

  const renderResult = (model) => {
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
                  <DropdownMenuItem onClick={() => downloadImage(result.blob, `${model.toLowerCase()}_image_${index}.png`)}>
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