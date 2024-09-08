import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const MAX_SEED = 4294967295;
const API_KEY = "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";

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

  const [hentParams, setHentParams] = useState({
    inputs: '',
    seed: 0,
    randomize_seed: true,
    width: 1024,
    height: 1024,
    num_inference_steps: 28,
  });

  const [stableDiffusionResult, setStableDiffusionResult] = useState(null);
  const [fluxResult, setFluxResult] = useState(null);
  const [hentResult, setHentResult] = useState(null);

  const updateParam = (setter, key, value) => {
    setter(prev => ({ ...prev, [key]: value }));
  };

  const generateImage = async (model) => {
    const { data, queryFunction, setResult } = model === 'StableDiffusion'
      ? { data: stableDiffusionParams, queryFunction: queryStableDiffusion, setResult: setStableDiffusionResult }
      : model === 'FLUX'
      ? { data: fluxParams, queryFunction: queryFLUX, setResult: setFluxResult }
      : { data: hentParams, queryFunction: queryHent, setResult: setHentResult };

    if (data.randomize_seed) {
      data.seed = Math.floor(Math.random() * MAX_SEED);
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
        headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          inputs: data.inputs,
          negative_prompt: data.negative_prompt,
          seed: data.seed,
          width: data.width,
          height: data.height,
          guidance_scale: data.guidance_scale,
          num_inference_steps: data.num_inference_steps,
        }),
      }
    );
    return await response.blob();
  };

  const queryFLUX = async (data) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          inputs: data.inputs,
          seed: data.seed,
          width: data.width,
          height: data.height,
          num_inference_steps: data.num_inference_steps,
        }),
      }
    );
    return await response.blob();
  };

  const queryHent = async (data) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stablediffusionapi/explicit-freedom-nsfw-wai",
      {
        headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          inputs: data.inputs,
          seed: data.seed,
          width: data.width,
          height: data.height,
          num_inference_steps: data.num_inference_steps,
        }),
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
        <InputField label="Prompt:" id={`${model}-prompt`} value={params.inputs} onChange={(e) => updateParam('inputs', e.target.value)} />
        {model === 'StableDiffusion' && (
          <InputField label="Negative prompt:" id="sd-negative-prompt" value={params.negative_prompt} onChange={(e) => updateParam('negative_prompt', e.target.value)} />
        )}
        <InputField label="Seed:" id={`${model}-seed`} type="number" value={params.seed} onChange={(e) => updateParam('seed', parseInt(e.target.value))} min={0} max={MAX_SEED} />
        <CheckboxField id={`${model}-randomize-seed`} label="Randomize seed" checked={params.randomize_seed} onCheckedChange={(checked) => updateParam('randomize_seed', checked)} />
        <SliderField label="Width:" id={`${model}-width`} value={params.width} onChange={(value) => updateParam('width', value)} min={256} max={model === 'FLUX' ? 2048 : 1024} step={8} />
        <SliderField label="Height:" id={`${model}-height`} value={params.height} onChange={(value) => updateParam('height', value)} min={256} max={model === 'FLUX' ? 2048 : 1024} step={8} />
        {model === 'StableDiffusion' && (
          <SliderField label="Guidance scale:" id="sd-guidance-scale" value={params.guidance_scale} onChange={(value) => updateParam('guidance_scale', value)} min={1} max={20} step={0.1} />
        )}
        <SliderField label="Number of inference steps:" id={`${model}-inference-steps`} value={params.num_inference_steps} onChange={(value) => updateParam('num_inference_steps', value)} min={1} max={model === 'FLUX' ? 50 : 100} step={1} />
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
            <TabsTrigger value="Hent">Hent</TabsTrigger>
          </TabsList>
          <TabsContent value="StableDiffusion">
            {renderInputs(stableDiffusionParams, (key, value) => updateParam(setStableDiffusionParams, key, value), 'StableDiffusion')}
            <ResultDisplay result={stableDiffusionResult} downloadImage={downloadImage} fileName="stable_diffusion_image.png" />
          </TabsContent>
          <TabsContent value="FLUX">
            {renderInputs(fluxParams, (key, value) => updateParam(setFluxParams, key, value), 'FLUX')}
            <ResultDisplay result={fluxResult} downloadImage={downloadImage} fileName="flux_image.png" />
          </TabsContent>
          <TabsContent value="Hent">
            {renderInputs(hentParams, (key, value) => updateParam(setHentParams, key, value), 'Hent')}
            <ResultDisplay result={hentResult} downloadImage={downloadImage} fileName="hent_image.png" />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

const InputField = ({ label, id, ...props }) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} {...props} />
  </div>
);

const CheckboxField = ({ id, label, ...props }) => (
  <div className="flex items-center space-x-2">
    <Checkbox id={id} {...props} />
    <Label htmlFor={id}>{label}</Label>
  </div>
);

const SliderField = ({ label, id, value, onChange, ...props }) => (
  <div>
    <Label htmlFor={id}>{label} {value}</Label>
    <Slider id={id} value={[value]} onValueChange={([value]) => onChange(value)} {...props} />
  </div>
);

const ResultDisplay = ({ result, downloadImage, fileName }) => (
  result && (
    <div className="mt-4">
      {typeof result === 'string' ? (
        <p>{result}</p>
      ) : (
        <>
          <img src={result.imageUrl} alt="Generated image" className="max-w-full h-auto" />
          <p>Used seed: {result.seed}</p>
          <Button onClick={() => downloadImage(result.imageUrl, fileName)} className="mt-2">Download Image</Button>
        </>
      )}
    </div>
  )
);

export default AIImageGenerator;