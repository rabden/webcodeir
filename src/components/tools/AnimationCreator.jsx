import React, { useState } from 'react';

const AnimationCreator = () => {
  const [duration, setDuration] = useState(1);
  const [timingFunction, setTimingFunction] = useState('ease');
  const [delay, setDelay] = useState(0);
  const [iterationCount, setIterationCount] = useState('infinite');
  const [direction, setDirection] = useState('normal');
  const [fillMode, setFillMode] = useState('none');

  const animationStyle = {
    width: '50px',
    height: '50px',
    backgroundColor: '#4299e1',
    animation: `move ${duration}s ${timingFunction} ${delay}s ${iterationCount} ${direction} ${fillMode}`,
  };

  const keyframes = `
@keyframes move {
  0% { transform: translateX(0); }
  50% { transform: translateX(100px); }
  100% { transform: translateX(0); }
}`;

  const cssCode = `
.animated-element {
  animation: move ${duration}s ${timingFunction} ${delay}s ${iterationCount} ${direction} ${fillMode};
}

${keyframes}`;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Animation Creator</h3>
      <div className="h-16 bg-gray-700 rounded flex items-center">
        <div style={animationStyle} className="rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <label className="text-white mr-2">Duration (s):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Math.max(0.1, parseFloat(e.target.value)))}
            step="0.1"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <select
          value={timingFunction}
          onChange={(e) => setTimingFunction(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="linear">Linear</option>
          <option value="ease">Ease</option>
          <option value="ease-in">Ease In</option>
          <option value="ease-out">Ease Out</option>
          <option value="ease-in-out">Ease In Out</option>
        </select>
        <div className="flex items-center">
          <label className="text-white mr-2">Delay (s):</label>
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(Math.max(0, parseFloat(e.target.value)))}
            step="0.1"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <select
          value={iterationCount}
          onChange={(e) => setIterationCount(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="1">1 time</option>
          <option value="2">2 times</option>
          <option value="3">3 times</option>
          <option value="infinite">Infinite</option>
        </select>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="normal">Normal</option>
          <option value="reverse">Reverse</option>
          <option value="alternate">Alternate</option>
          <option value="alternate-reverse">Alternate Reverse</option>
        </select>
        <select
          value={fillMode}
          onChange={(e) => setFillMode(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="none">None</option>
          <option value="forwards">Forwards</option>
          <option value="backwards">Backwards</option>
          <option value="both">Both</option>
        </select>
      </div>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto">
        {cssCode}
      </pre>
    </div>
  );
};

export default AnimationCreator;