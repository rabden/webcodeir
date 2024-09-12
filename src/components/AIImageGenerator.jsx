import React, { useState } from 'react';
import { X, MoreVertical, Copy, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import AIImageGeneratorSettings from './AIImageGeneratorSettings';
import AIImageGeneratorResult from './AIImageGeneratorResult';
import ImageCollection from './ImageCollection';
import { useSupabaseAuth } from '../integrations/supabase';
import { useImageGenerationLimit } from '../hooks/useImageGenerationLimit';
import { useAddGeneratedImage } from '../integrations/supabase/hooks/useGeneratedImages';

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

const AIImageGenerator = ({ onClose }) => {
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
    isFluxSettingsOpen: false,
    isCollectionOpen: false,
  });
  const { toast } = useToast();
  const { session } = useSupabaseAuth();
  const { generationCount, canGenerate, incrementCount, lastResetTime } = useImageGenerationLimit(session?.user?.id);
  const addGeneratedImage = useAddGeneratedImage();

  const generateImage = async (model) => {
    if (!canGenerate) {
      toast({
        title: "Generation Limit Reached",
        description: "You've reached the maximum number of generations for the current period.",
        type: "error"
      });
      return;
    }

    const success = await incrementCount();
    if (!success) {
      toast({
        title: "Generation Failed",
        description: "Unable to increment generation count. Please try again later.",
        type: "error"
      });
      return;
    }

    setState(prev => ({ 
      ...prev, 
      loading: { ...prev.loading, [model]: true },
      results: {
        ...prev.results,
        [model]: [{ loading: true, seed: prev.fluxParams.seed, prompt: prev.prompts[model] }, ...prev.results[model]]
      }
    }));

    try {
      const response = await queryModel(model, {
        inputs: state.prompts[model],
        parameters: {
          seed: state.fluxParams.randomize_seed ? Math.floor(Math.random() * MAX_SEED) : state.fluxParams.seed,
          ...aspectRatios[state.fluxParams.aspectRatio],
          num_inference_steps: state.fluxParams.num_inference_steps
        }
      });
      const imageUrl = URL.createObjectURL(response[0]);
      const newImage = { 
        imageUrl, 
        seed: response[1], 
        prompt: state.prompts[model] 
      };
      setState(prev => ({ 
        ...prev, 
        results: { 
          ...prev.results, 
          [model]: [newImage, ...prev.results[model].slice(1)]
        },
        fluxParams: { ...prev.fluxParams, seed: response[1] }
      }));
      await saveGeneratedImage(newImage);
    } catch (error) {
      console.error('Error:', error);
      setState(prev => ({ 
        ...prev, 
        results: { 
          ...prev.results, 
          [model]: [{ error: 'Error generating image. Please try again.', seed: prev.fluxParams.seed, prompt: prev.prompts[model] }, ...prev.results[model].slice(1)]
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

  const saveGeneratedImage = async (image) => {
    if (session?.user?.id) {
      try {
        await addGeneratedImage.mutateAsync({
          user_id: session.user.id,
          image_url: image.imageUrl,
          seed: image.seed,
          prompt: image.prompt
        });
      } catch (error) {
        console.error('Error saving generated image:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 z-50 flex flex-col md:inset-y-4 md:right-4 md:left-auto md:w-96 md:rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">AI Image Generator</h2>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setState(prev => ({ ...prev, isCollectionOpen: !prev.isCollectionOpen }))}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          <AIImageGeneratorSettings
            fluxParams={state.fluxParams}
            setFluxParams={(params) => setState(prev => ({ ...prev, fluxParams: params }))}
            isFluxSettingsOpen={state.isFluxSettingsOpen}
            setIsFluxSettingsOpen={(isOpen) => setState(prev => ({ ...prev, isFluxSettingsOpen: isOpen }))}
            aspectRatios={aspectRatios}
          />
          <div className="flex space-x-2 mb-4">
            <Input
              value={state.prompts.FLUX}
              onChange={(e) => setState(prev => ({ ...prev, prompts: { ...prev.prompts, FLUX: e.target.value } }))}
              placeholder="Enter prompt"
              className="flex-grow"
            />
            <Button
              onClick={() => generateImage('FLUX')}
              disabled={state.loading.FLUX}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {state.loading.FLUX ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <Wand2 className="h-4 w-4" />}
            </Button>
          </div>
          <AIImageGeneratorResult 
            results={state.results.FLUX} 
            toast={toast} 
          />
        </div>
      </ScrollArea>
      {state.isCollectionOpen && (
        <ImageCollection
          onClose={() => setState(prev => ({ ...prev, isCollectionOpen: false }))}
          userId={session?.user?.id}
        />
      )}
    </div>
  );
};

export default AIImageGenerator;