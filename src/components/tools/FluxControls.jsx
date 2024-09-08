import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const FluxControls = ({ state, setState }) => {
  const updateFluxParam = (param, value) => {
    setState(prevState => ({
      ...prevState,
      fluxParams: { ...prevState.fluxParams, [param]: value }
    }));
  };

  return (
    <div className="space-y-4">
      <Input
        value={state.prompts.FLUX}
        onChange={(e) => setState(prevState => ({
          ...prevState,
          prompts: { ...prevState.prompts, FLUX: e.target.value }
        }))}
        placeholder="Enter prompt"
        className="flex-grow h-12"
      />
      <div className="space-y-2">
        <Label htmlFor="seed">Seed: {state.fluxParams.seed}</Label>
        <Slider
          id="seed"
          value={[state.fluxParams.seed]}
          onValueChange={(value) => updateFluxParam('seed', value[0])}
          max={4294967295}
          step={1}
          className="flex-grow"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="randomize-seed"
          checked={state.fluxParams.randomize_seed}
          onCheckedChange={(checked) => updateFluxParam('randomize_seed', checked)}
        />
        <Label htmlFor="randomize-seed">Randomize seed</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="width">Width: {state.fluxParams.width}</Label>
        <Slider
          id="width"
          value={[state.fluxParams.width]}
          onValueChange={(value) => updateFluxParam('width', value[0])}
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
          onValueChange={(value) => updateFluxParam('height', value[0])}
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
          onValueChange={(value) => updateFluxParam('num_inference_steps', value[0])}
          min={1}
          max={50}
          step={1}
          className="flex-grow"
        />
      </div>
    </div>
  );
};

export default FluxControls;