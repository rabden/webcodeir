import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const AIImageGenerator = () => {
  const [stableDiffusionParams, setStableDiffusionParams] = useState({
    prompt: '',
    negative_prompt: '',
    seed: 0,
    randomize_seed: true,
    width: 1024,
    height: 1024,
    guidance_scale: 5,
    num_inference_steps: 28,
  });

  const [fluxParams, setFluxParams] = useState({
    prompt: '',
    seed: 0,
    randomize_seed: true,
    width: 1024,
    height: 1024,
    num_inference_steps: 4,
  });

  const [stableDiffusionResult, setStableDiffusionResult] = useState(null);
  const [fluxResult, setFluxResult] = useState(null);

  const updateStableDiffusionParam = (key, value) => {
    setStableDiffusionParams(prev => ({ ...prev, [key]: value }));
  };

  const updateFluxParam = (key, value) => {
    setFluxParams(prev => ({ ...prev, [key]: value }));
  };

  const generateImage = async (model) => {
    let data, queryFunction, setResult;

    if (model === 'StableDiffusion') {
      data = { ...stableDiffusionParams };
      if (data.randomize_seed) {
        data.seed = Math.floor(Math.random() * 4294967295);
      }
      queryFunction = queryStableDiffusion;
      setResult = setStableDiffusionResult;
    } else {
      data = { ...fluxParams };
      if (data.randomize_seed) {
        data.seed = Math.floor(Math.random() * 4294967295);
      }
      queryFunction = queryFLUX;
      setResult = setFluxResult;
    }

    setResult('Generating image...');

    try {
      const response = await queryFunction(data);
      const imageUrl = URL.createObjectURL(response);
      setResult({ imageUrl, seed: data.seed });
    } catch (error) {
      setResult('Error generating image. Please try again.');
      console.error('Error:', error);
    }
  };

  const queryStableDiffusion = async (data) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium-diffusers",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return await response.blob();
  };

  const queryFLUX = async (data) => {
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
    return await response.blob();
  };

  const downloadImage = (imageUrl, fileName) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">AI Image Generators</h2>
        <Tabs defaultValue="StableDiffusion">
          <TabsList>
            <TabsTrigger value="StableDiffusion">Stable Diffusion 3</TabsTrigger>
            <TabsTrigger value="FLUX">FLUX</TabsTrigger>
          </TabsList>
          <TabsContent value="StableDiffusion">
            <div className="space-y-4">
              <div>
                <Label htmlFor="sd-prompt">Prompt:</Label>
                <Input id="sd-prompt" value={stableDiffusionParams.prompt} onChange={(e) => updateStableDiffusionParam('prompt', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="sd-negative-prompt">Negative prompt:</Label>
                <Input id="sd-negative-prompt" value={stableDiffusionParams.negative_prompt} onChange={(e) => updateStableDiffusionParam('negative_prompt', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="sd-seed">Seed:</Label>
                <Input type="number" id="sd-seed" value={stableDiffusionParams.seed} onChange={(e) => updateStableDiffusionParam('seed', parseInt(e.target.value))} min={0} max={4294967295} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sd-randomize-seed" checked={stableDiffusionParams.randomize_seed} onCheckedChange={(checked) => updateStableDiffusionParam('randomize_seed', checked)} />
                <Label htmlFor="sd-randomize-seed">Randomize seed</Label>
              </div>
              <div>
                <Label htmlFor="sd-width">Width: {stableDiffusionParams.width}</Label>
                <Slider id="sd-width" min={256} max={1024} step={8} value={[stableDiffusionParams.width]} onValueChange={([value]) => updateStableDiffusionParam('width', value)} />
              </div>
              <div>
                <Label htmlFor="sd-height">Height: {stableDiffusionParams.height}</Label>
                <Slider id="sd-height" min={256} max={1024} step={8} value={[stableDiffusionParams.height]} onValueChange={([value]) => updateStableDiffusionParam('height', value)} />
              </div>
              <div>
                <Label htmlFor="sd-guidance-scale">Guidance scale: {stableDiffusionParams.guidance_scale}</Label>
                <Slider id="sd-guidance-scale" min={1} max={20} step={0.1} value={[stableDiffusionParams.guidance_scale]} onValueChange={([value]) => updateStableDiffusionParam('guidance_scale', value)} />
              </div>
              <div>
                <Label htmlFor="sd-inference-steps">Number of inference steps: {stableDiffusionParams.num_inference_steps}</Label>
                <Slider id="sd-inference-steps" min={1} max={100} step={1} value={[stableDiffusionParams.num_inference_steps]} onValueChange={([value]) => updateStableDiffusionParam('num_inference_steps', value)} />
              </div>
              <Button onClick={() => generateImage('StableDiffusion')}>Generate Image</Button>
              {stableDiffusionResult && (
                <div>
                  {typeof stableDiffusionResult === 'string' ? (
                    <p>{stableDiffusionResult}</p>
                  ) : (
                    <>
                      <img src={stableDiffusionResult.imageUrl} alt="Generated image" className="max-w-full h-auto" />
                      <p>Used seed: {stableDiffusionResult.seed}</p>
                      <Button onClick={() => downloadImage(stableDiffusionResult.imageUrl, 'stable_diffusion_image.png')}>Download Image</Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="FLUX">
            <div className="space-y-4">
              <div>
                <Label htmlFor="flux-prompt">Prompt:</Label>
                <Input id="flux-prompt" value={fluxParams.prompt} onChange={(e) => updateFluxParam('prompt', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="flux-seed">Seed:</Label>
                <Input type="number" id="flux-seed" value={fluxParams.seed} onChange={(e) => updateFluxParam('seed', parseInt(e.target.value))} min={0} max={4294967295} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="flux-randomize-seed" checked={fluxParams.randomize_seed} onCheckedChange={(checked) => updateFluxParam('randomize_seed', checked)} />
                <Label htmlFor="flux-randomize-seed">Randomize seed</Label>
              </div>
              <div>
                <Label htmlFor="flux-width">Width: {fluxParams.width}</Label>
                <Slider id="flux-width" min={256} max={1024} step={8} value={[fluxParams.width]} onValueChange={([value]) => updateFluxParam('width', value)} />
              </div>
              <div>
                <Label htmlFor="flux-height">Height: {fluxParams.height}</Label>
                <Slider id="flux-height" min={256} max={1024} step={8} value={[fluxParams.height]} onValueChange={([value]) => updateFluxParam('height', value)} />
              </div>
              <div>
                <Label htmlFor="flux-inference-steps">Number of inference steps: {fluxParams.num_inference_steps}</Label>
                <Slider id="flux-inference-steps" min={1} max={50} step={1} value={[fluxParams.num_inference_steps]} onValueChange={([value]) => updateFluxParam('num_inference_steps', value)} />
              </div>
              <Button onClick={() => generateImage('FLUX')}>Generate Image</Button>
              {fluxResult && (
                <div>
                  {typeof fluxResult === 'string' ? (
                    <p>{fluxResult}</p>
                  ) : (
                    <>
                      <img src={fluxResult.imageUrl} alt="Generated image" className="max-w-full h-auto" />
                      <p>Used seed: {fluxResult.seed}</p>
                      <Button onClick={() => downloadImage(fluxResult.imageUrl, 'flux_image.png')}>Download Image</Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default AIImageGenerator;