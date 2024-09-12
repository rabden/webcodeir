import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wand2, X, Save, Image } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import AIImageGeneratorSettings from './AIImageGeneratorSettings';
import AIImageGeneratorResult from './AIImageGeneratorResult';
import ImageCollection from './ImageCollection';
import { useSupabaseAuth } from '../integrations/supabase';
import { useSaveImage, useUserImages } from '../integrations/supabase/hooks/useImageCollections';

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
    isFluxSettingsOpen: false
  });
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const { toast } = useToast();
  const { session } = useSupabaseAuth();
  const saveImage = useSaveImage();
  const { data: savedImages, refetch: refetchSavedImages } = useUserImages(session?.user?.id);

  const generateImage = async (model) => {
    if (!session) {
      toast({ title: "Error", description: "Please sign in to generate images.", variant: "destructive" });
      return;
    }

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

  const handleSaveImage = async (image) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to save images.",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveImage.mutateAsync({
        user_id: session.user.id,
        image_url: image.imageUrl,
        prompt: image.prompt,
        seed: image.seed,
      });
      refetchSavedImages();
      toast({
        title: "Image Saved",
        description: "The image has been added to your collection.",
      });
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        title: "Error",
        description: "Failed to save the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleCollection = () => setIsCollectionOpen(!isCollectionOpen);

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
        {state.loading[model] ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <Wand2 className="h-4 w-4" />}
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-800 z-50 flex flex-col md:inset-y-4 md:right-4 md:left-auto md:w-96 md:rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">AI Image Generator</h2>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleCollection}>
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
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
                  {model === 'FLUX' && (
                    <AIImageGeneratorSettings
                      fluxParams={state.fluxParams}
                      setFluxParams={(params) => setState(prev => ({ ...prev, fluxParams: params }))}
                      isFluxSettingsOpen={state.isFluxSettingsOpen}
                      setIsFluxSettingsOpen={(isOpen) => setState(prev => ({ ...prev, isFluxSettingsOpen: isOpen }))}
                      aspectRatios={aspectRatios}
                    />
                  )}
                  <div className="mt-4">
                    <AIImageGeneratorResult 
                      results={state.results[model]} 
                      toast={toast} 
                      onSave={handleSaveImage}
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </ScrollArea>
      {isCollectionOpen && (
        <ImageCollection
          onClose={toggleCollection}
          savedImages={savedImages || []}
          onRemoveImage={refetchSavedImages}
        />
      )}
    </div>
  );
};

export default AIImageGenerator;