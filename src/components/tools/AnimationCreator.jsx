import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AnimationCreator = () => {
  const [duration, setDuration] = useState(1);
  const [timingFunction, setTimingFunction] = useState('ease');
  const [delay, setDelay] = useState(0);
  const [iterationCount, setIterationCount] = useState('infinite');
  const [direction, setDirection] = useState('normal');
  const [fillMode, setFillMode] = useState('none');
  const [keyframes, setKeyframes] = useState(`
  0% { transform: translateX(0); }
  50% { transform: translateX(100px); }
  100% { transform: translateX(0); }
  `);

  const animationStyle = {
    width: '50px',
    height: '50px',
    backgroundColor: '#4299e1',
    animation: `move ${duration}s ${timingFunction} ${delay}s ${iterationCount} ${direction} ${fillMode}`,
  };

  const cssCode = `
@keyframes move {
${keyframes}
}

.animated-element {
  animation: move ${duration}s ${timingFunction} ${delay}s ${iterationCount} ${direction} ${fillMode};
}`;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-white">Animation Creator</h3>
      <div className="h-32 bg-gray-700 rounded flex items-center justify-center">
        <div style={animationStyle} className="rounded"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Duration: {duration}s</label>
          <Slider
            value={[duration]}
            onValueChange={(value) => setDuration(value[0])}
            min={0.1}
            max={10}
            step={0.1}
          />
        </div>
        <Select value={timingFunction} onValueChange={setTimingFunction}>
          <SelectTrigger>
            <SelectValue placeholder="Timing Function" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="ease">Ease</SelectItem>
            <SelectItem value="ease-in">Ease In</SelectItem>
            <SelectItem value="ease-out">Ease Out</SelectItem>
            <SelectItem value="ease-in-out">Ease In Out</SelectItem>
          </SelectContent>
        </Select>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Delay: {delay}s</label>
          <Slider
            value={[delay]}
            onValueChange={(value) => setDelay(value[0])}
            min={0}
            max={5}
            step={0.1}
          />
        </div>
        <Select value={iterationCount} onValueChange={setIterationCount}>
          <SelectTrigger>
            <SelectValue placeholder="Iteration Count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 time</SelectItem>
            <SelectItem value="2">2 times</SelectItem>
            <SelectItem value="3">3 times</SelectItem>
            <SelectItem value="infinite">Infinite</SelectItem>
          </SelectContent>
        </Select>
        <Select value={direction} onValueChange={setDirection}>
          <SelectTrigger>
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="reverse">Reverse</SelectItem>
            <SelectItem value="alternate">Alternate</SelectItem>
            <SelectItem value="alternate-reverse">Alternate Reverse</SelectItem>
          </SelectContent>
        </Select>
        <Select value={fillMode} onValueChange={setFillMode}>
          <SelectTrigger>
            <SelectValue placeholder="Fill Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="forwards">Forwards</SelectItem>
            <SelectItem value="backwards">Backwards</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Keyframes</label>
        <Input
          as="textarea"
          value={keyframes}
          onChange={(e) => setKeyframes(e.target.value)}
          className="h-32 font-mono"
        />
      </div>
      <Button onClick={() => navigator.clipboard.writeText(cssCode)}>
        Copy CSS
      </Button>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto">
        {cssCode}
      </pre>
    </div>
  );
};

export default AnimationCreator;