import React, { useState } from 'react';

const FlexboxGenerator = () => {
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');

  const flexboxStyle = {
    display: 'flex',
    flexDirection,
    justifyContent,
    alignItems,
    height: '200px',
    backgroundColor: '#2d3748',
  };

  const itemStyle = {
    width: '50px',
    height: '50px',
    backgroundColor: '#4299e1',
    margin: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  };

  const cssCode = `
.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
}`;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Flexbox Generator</h3>
      <div style={flexboxStyle} className="rounded">
        {[1, 2, 3].map((num) => (
          <div key={num} style={itemStyle}>
            {num}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <select
          value={flexDirection}
          onChange={(e) => setFlexDirection(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="row">Flex Direction: Row</option>
          <option value="column">Flex Direction: Column</option>
          <option value="row-reverse">Flex Direction: Row Reverse</option>
          <option value="column-reverse">Flex Direction: Column Reverse</option>
        </select>
        <select
          value={justifyContent}
          onChange={(e) => setJustifyContent(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="flex-start">Justify Content: Flex Start</option>
          <option value="flex-end">Justify Content: Flex End</option>
          <option value="center">Justify Content: Center</option>
          <option value="space-between">Justify Content: Space Between</option>
          <option value="space-around">Justify Content: Space Around</option>
        </select>
        <select
          value={alignItems}
          onChange={(e) => setAlignItems(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="stretch">Align Items: Stretch</option>
          <option value="flex-start">Align Items: Flex Start</option>
          <option value="flex-end">Align Items: Flex End</option>
          <option value="center">Align Items: Center</option>
          <option value="baseline">Align Items: Baseline</option>
        </select>
      </div>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto">
        {cssCode}
      </pre>
    </div>
  );
};

export default FlexboxGenerator;