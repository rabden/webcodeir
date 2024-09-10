import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, X } from 'lucide-react';

const AIImageGeneratorSettings = ({ fluxParams, setFluxParams, isFluxSettingsOpen, setIsFluxSettingsOpen, aspectRatios }) => {
  return (
    <Collapsible open={isFluxSettingsOpen} onOpenChange={setIsFluxSettingsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="mb-2">
          {isFluxSettingsOpen ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="text-sm font-medium text-white">Inference Steps: {fluxParams.num_inference_steps}</label>
            <Slider
              value={[fluxParams.num_inference_steps]}
              onValueChange={(value) => setFluxParams({ ...fluxParams, num_inference_steps: value[0] })}
              min={1}
              max={50}
              step={1}
              className="bg-gray-800"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-white">Aspect Ratio</label>
            <Select 
              value={fluxParams.aspectRatio} 
              onValueChange={(value) => setFluxParams({ ...fluxParams, aspectRatio: value })}
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
          <label className="text-sm font-medium text-white">Seed: {fluxParams.seed}</label>
          <Slider
            value={[fluxParams.seed]}
            onValueChange={(value) => setFluxParams({ ...fluxParams, seed: value[0] })}
            max={4294967295}
            step={1}
            className="bg-gray-800"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="randomize-seed"
            checked={fluxParams.randomize_seed}
            onCheckedChange={(checked) => setFluxParams({ ...fluxParams, randomize_seed: checked })}
          />
          <label htmlFor="randomize-seed" className="text-sm text-gray-400">Randomize seed</label>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AIImageGeneratorSettings;