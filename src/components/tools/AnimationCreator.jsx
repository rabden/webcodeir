import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const AnimationCreator = () => {
  const [animation, setAnimation] = useState({
    name: 'myAnimation',
    duration: 1,
    timingFunction: 'ease',
    delay: 0,
    iterationCount: 'infinite',
    direction: 'normal',
    fillMode: 'none',
    keyframes: [
      { percentage: 0, properties: { transform: 'translateX(0)' } },
      { percentage: 100, properties: { transform: 'translateX(100px)' } }
    ]
  });

  const updateAnimation = (key, value) => {
    setAnimation(prev => ({ ...prev, [key]: value }));
  };

  const updateKeyframe = (index, key, value) => {
    setAnimation(prev => {
      const newKeyframes = [...prev.keyframes];
      newKeyframes[index] = { ...newKeyframes[index], [key]: value };
      return { ...prev, keyframes: newKeyframes };
    });
  };

  const addKeyframe = () => {
    setAnimation(prev => ({
      ...prev,
      keyframes: [...prev.keyframes, { percentage: 0, properties: {} }]
    }));
  };

  const removeKeyframe = (index) => {
    setAnimation(prev => ({
      ...prev,
      keyframes: prev.keyframes.filter((_, i) => i !== index)
    }));
  };

  const generateCSS = () => {
    const keyframesCSS = animation.keyframes.map(kf => 
      `  ${kf.percentage}% { ${Object.entries(kf.properties).map(([prop, value]) => `${prop}: ${value};`).join(' ')} }`
    ).join('\n');

    return `
@keyframes ${animation.name} {
${keyframesCSS}
}

.animated-element {
  animation: ${animation.name} ${animation.duration}s ${animation.timingFunction} ${animation.delay}s ${animation.iterationCount} ${animation.direction} ${animation.fillMode};
}`;
  };

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold text-white">Animation Creator</h3>
      <div className="space-y-2">
        <Label>Animation Name</Label>
        <Input
          value={animation.name}
          onChange={(e) => updateAnimation('name', e.target.value)}
          className="w-full bg-gray-700 text-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Duration: {animation.duration}s</Label>
          <Slider
            value={[animation.duration]}
            onValueChange={(value) => updateAnimation('duration', value[0])}
            min={0.1}
            max={10}
            step={0.1}
            className="bg-gray-700"
          />
        </div>
        <div className="space-y-2">
          <Label>Delay: {animation.delay}s</Label>
          <Slider
            value={[animation.delay]}
            onValueChange={(value) => updateAnimation('delay', value[0])}
            min={0}
            max={5}
            step={0.1}
            className="bg-gray-700"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select value={animation.timingFunction} onValueChange={(value) => updateAnimation('timingFunction', value)}>
          <SelectTrigger className="bg-gray-700 text-white">
            <SelectValue placeholder="Timing Function" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="ease">Ease</SelectItem>
            <SelectItem value="ease-in">Ease In</SelectItem>
            <SelectItem value="ease-out">Ease Out</SelectItem>
            <SelectItem value="ease-in-out">Ease In Out</SelectItem>
          </SelectContent>
        </Select>
        <Select value={animation.iterationCount} onValueChange={(value) => updateAnimation('iterationCount', value)}>
          <SelectTrigger className="bg-gray-700 text-white">
            <SelectValue placeholder="Iteration Count" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="1">1 time</SelectItem>
            <SelectItem value="2">2 times</SelectItem>
            <SelectItem value="3">3 times</SelectItem>
            <SelectItem value="infinite">Infinite</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select value={animation.direction} onValueChange={(value) => updateAnimation('direction', value)}>
          <SelectTrigger className="bg-gray-700 text-white">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="reverse">Reverse</SelectItem>
            <SelectItem value="alternate">Alternate</SelectItem>
            <SelectItem value="alternate-reverse">Alternate Reverse</SelectItem>
          </SelectContent>
        </Select>
        <Select value={animation.fillMode} onValueChange={(value) => updateAnimation('fillMode', value)}>
          <SelectTrigger className="bg-gray-700 text-white">
            <SelectValue placeholder="Fill Mode" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="forwards">Forwards</SelectItem>
            <SelectItem value="backwards">Backwards</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Keyframes</Label>
        {animation.keyframes.map((kf, index) => (
          <div key={index} className="flex space-x-2 items-center">
            <Input
              type="number"
              value={kf.percentage}
              onChange={(e) => updateKeyframe(index, 'percentage', parseInt(e.target.value))}
              className="w-20 bg-gray-700 text-white"
            />
            <span className="text-white">%</span>
            <Input
              value={Object.entries(kf.properties).map(([prop, value]) => `${prop}: ${value}`).join('; ')}
              onChange={(e) => updateKeyframe(index, 'properties', Object.fromEntries(e.target.value.split(';').map(prop => prop.trim().split(':'))))}
              className="flex-grow bg-gray-700 text-white"
            />
            <Button onClick={() => removeKeyframe(index)} variant="destructive" size="sm">Remove</Button>
          </div>
        ))}
        <Button onClick={addKeyframe} variant="outline" size="sm">Add Keyframe</Button>
      </div>
      <Button onClick={() => navigator.clipboard.writeText(generateCSS())} className="w-full bg-blue-600 text-white hover:bg-blue-700">
        Copy CSS
      </Button>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto whitespace-pre-wrap">
        {generateCSS()}
      </pre>
    </div>
  );
};

export default AnimationCreator;