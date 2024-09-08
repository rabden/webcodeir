import React, { useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Wand2, MoreVertical, Download, Link, Image, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { generateImage, copyToClipboard, downloadImage } from './aiImageHelpers';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const MAX_SEED = 4294967295;
const API_KEY = "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";

const AIImageGenerator = ({ state, setState }) => {
  const { toast } = useToast();

  const handleGenerateImage = useCallback((model) => {
    generateImage(model, state, setState, API_KEY, MAX_SEED);
  }, [state, setState]);

  const renderInputs = (model) => {
    if (model === 'FLUX') {
      return (
        <div className="space-y-4">
          <Input
            value={state.prompts[model]}
            onChange={(e) => setState(prevState => ({
              ...prevState,
              prompts: { ...prevState.prompts, [model]: e.target.value }
            }))}
            placeholder="Enter prompt"
            className="flex-grow h-12"
          />
          <div className="space-y-2">
            <Label htmlFor="seed">Seed: {state.fluxParams.seed}</Label>
            <Slider
              id="seed"
              value={[state.fluxParams.seed]}
              onValueChange={(value) => setState(prevState => ({
                ...prevState,
                fluxParams: { ...prevState.fluxParams, seed: value[0] }
              }))}
              max={MAX_SEED}
              step={1}
              className="flex-grow"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="randomize-seed"
              checked={state.fluxParams.randomize_seed}
              onCheckedChange={(checked) => setState(prevState => ({
                ...prevState,
                fluxParams: { ...prevState.fluxParams, randomize_seed: checked }
              }))}
            />
            <Label htmlFor="randomize-seed">Randomize seed</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="width">Width: {state.fluxParams.width}</Label>
            <Slider
              id="width"
              value={[state.fluxParams.width]}
              onValueChange={(value) => setState(prevState => ({
                ...prevState,
                fluxParams: { ...prevState.fluxParams, width: value[0] }
              }))}
              min={256}
              max={1024}
              step={64}
              className="flex-grow"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height: {state.fluxParams.height}</Label>
            <Slider
              id="height"
              value={[state.fluxParams.height]}
              onValueChange={(value) => setState(prevState => ({
                ...prevState,
                fluxParams: { ...prevState.fluxParams, height: value[0] }
              }))}
              min={256}
              max={1024}
              step={64}
              className="flex-grow"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inference-steps">Inference steps: {state.fluxParams.num_inference_steps}</Label>
            <Slider
              id="inference-steps"
              value={[state.fluxParams.num_inference_steps]}
              onValueChange={(value) => setState(prevState => ({
                ...prevState,
                fluxParams: { ...prevState.fluxParams, num_inference_steps: value[0] }
              }))}
              min={1}
              max={50}
              step={1}
              className="flex-grow"
            />
          </div>
        </div>
      );
    } else {
      return (
        <Input
          value={state.prompts[model]}
          onChange={(e) => setState(prevState => ({
            ...prevState,
            prompts: { ...prevState.prompts, [model]: e.target.value }
          }))}
          placeholder="Enter prompt"
          className="flex-grow h-12"
        />
      );
    }
  };

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
                  <DropdownMenuItem onClick={() => copyToClipboard(result.imageUrl, toast)}>
                    <Link className="mr-2 h-4 w-4" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyToClipboard(`<img src="${result.imageUrl}" alt="Generated image" />`, toast)}>
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
                <Button
                  onClick={() => handleGenerateImage(model)}
                  disabled={state.loading[model]}
                  className="w-full h-12"
                >
                  {state.loading[model] ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Wand2 className="w-6 h-6 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
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