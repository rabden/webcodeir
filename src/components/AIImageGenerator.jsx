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
    inputs: '',
    negative_prompt: '',
    seed: 0,
    randomize_seed: true,
    width: 1024,
    height: 1024,
    guidance_scale: 5,
    num_inference_steps: 28,
  });

  const [fluxParams, setFluxParams] = useState({
    inputs: '',
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

  const renderInputs = (params, updateParam, model) => (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor={`${model}-prompt`}>Prompt:</Label>
          <Input id={`${model}-prompt`} value={params.inputs} onChange={(e) => updateParam('inputs', e.target.value)} />
        </div>
        {model === 'StableDiffusion' && (
          <div>
            <Label htmlFor="sd-negative-prompt">Negative prompt:</Label>
            <Input id="sd-negative-prompt" value={params.negative_prompt} onChange={(e) => updateParam('negative_prompt', e.target.value)} />
          </div>
        )}
        <div>
          <Label htmlFor={`${model}-seed`}>Seed:</Label>
          <Input type="number" id={`${model}-seed`} value={params.seed} onChange={(e) => updateParam('seed', parseInt(e.target.value))} min={0} max={4294967295} />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id={`${model}-randomize-seed`} checked={params.randomize_seed} onCheckedChange={(checked) => updateParam('randomize_seed', checked)} />
          <Label htmlFor={`${model}-randomize-seed`}>Randomize seed</Label>
        </div>
        <div>
          <Label htmlFor={`${model}-width`}>Width: {params.width}</Label>
          <Slider id={`${model}-width`} min={256} max={1024} step={8} value={[params.width]} onValueChange={([value]) => updateParam('width', value)} />
        </div>
        <div>
          <Label htmlFor={`${model}-height`}>Height: {params.height}</Label>
          <Slider id={`${model}-height`} min={256} max={1024} step={8} value={[params.height]} onValueChange={([value]) => updateParam('height', value)} />
        </div>
        {model === 'StableDiffusion' && (
          <div>
            <Label htmlFor="sd-guidance-scale">Guidance scale: {params.guidance_scale}</Label>
            <Slider id="sd-guidance-scale" min={1} max={20} step={0.1} value={[params.guidance_scale]} onValueChange={([value]) => updateParam('guidance_scale', value)} />
          </div>
        )}
        <div>
          <Label htmlFor={`${model}-inference-steps`}>Number of inference steps: {params.num_inference_steps}</Label>
          <Slider id={`${model}-inference-steps`} min={1} max={model === 'StableDiffusion' ? 100 : 50} step={1} value={[params.num_inference_steps]} onValueChange={([value]) => updateParam('num_inference_steps', value)} />
        </div>
      </div>
      <Button onClick={() => generateImage(model)} className="mt-4">Generate Image</Button>
    </>
  );

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
            {renderInputs(stableDiffusionParams, updateStableDiffusionParam, 'StableDiffusion')}
            {stableDiffusionResult && (
              <div className="mt-4">
                {typeof stableDiffusionResult === 'string' ? (
                  <p>{stableDiffusionResult}</p>
                ) : (
                  <>
                    <img src={stableDiffusionResult.imageUrl} alt="Generated image" className="max-w-full h-auto" />
                    <p>Used seed: {stableDiffusionResult.seed}</p>
                    <Button onClick={() => downloadImage(stableDiffusionResult.imageUrl, 'stable_diffusion_image.png')} className="mt-2">Download Image</Button>
                  </>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="FLUX">
            {renderInputs(fluxParams, updateFluxParam, 'FLUX')}
            {fluxResult && (
              <div className="mt-4">
                {typeof fluxResult === 'string' ? (
                  <p>{fluxResult}</p>
                ) : (
                  <>
                    <img src={fluxResult.imageUrl} alt="Generated image" className="max-w-full h-auto" />
                    <p>Used seed: {fluxResult.seed}</p>
                    <Button onClick={() => downloadImage(fluxResult.imageUrl, 'flux_image.png')} className="mt-2">Download Image</Button>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default AIImageGenerator;