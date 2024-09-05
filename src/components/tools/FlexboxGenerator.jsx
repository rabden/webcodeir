import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const FlexboxGenerator = ({ isMobile }) => {
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');
  const [flexWrap, setFlexWrap] = useState('nowrap');
  const [gap, setGap] = useState(10);
  const [itemCount, setItemCount] = useState(3);

  const flexboxStyle = {
    display: 'flex',
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    gap: `${gap}px`,
    minHeight: isMobile ? '150px' : '200px',
    backgroundColor: '#1e1e1e',
    padding: '10px',
    borderRadius: '8px',
  };

  const itemStyle = {
    minWidth: isMobile ? '40px' : '50px',
    minHeight: isMobile ? '40px' : '50px',
    backgroundColor: '#4299e1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    borderRadius: '4px',
    padding: '5px',
    fontSize: isMobile ? '12px' : '14px',
  };

  const cssCode = `
.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}`;

  return (
    <div className="space-y-4">
      <h3 className={`text-${isMobile ? 'xl' : '2xl'} font-semibold text-white`}>Flexbox Generator</h3>
      <div style={flexboxStyle} className="mb-4">
        {Array.from({ length: itemCount }, (_, i) => (
          <div key={i} style={itemStyle}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
        <Select value={flexDirection} onValueChange={setFlexDirection}>
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Flex Direction" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="row">Row</SelectItem>
            <SelectItem value="column">Column</SelectItem>
            <SelectItem value="row-reverse">Row Reverse</SelectItem>
            <SelectItem value="column-reverse">Column Reverse</SelectItem>
          </SelectContent>
        </Select>
        <Select value={justifyContent} onValueChange={setJustifyContent}>
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Justify Content" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="flex-start">Flex Start</SelectItem>
            <SelectItem value="flex-end">Flex End</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="space-between">Space Between</SelectItem>
            <SelectItem value="space-around">Space Around</SelectItem>
            <SelectItem value="space-evenly">Space Evenly</SelectItem>
          </SelectContent>
        </Select>
        <Select value={alignItems} onValueChange={setAlignItems}>
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Align Items" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="stretch">Stretch</SelectItem>
            <SelectItem value="flex-start">Flex Start</SelectItem>
            <SelectItem value="flex-end">Flex End</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="baseline">Baseline</SelectItem>
          </SelectContent>
        </Select>
        <Select value={flexWrap} onValueChange={setFlexWrap}>
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Flex Wrap" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="nowrap">No Wrap</SelectItem>
            <SelectItem value="wrap">Wrap</SelectItem>
            <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Gap: {gap}px</label>
        <Slider
          value={[gap]}
          onValueChange={(value) => setGap(value[0])}
          max={50}
          step={1}
          className="bg-gray-800"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Item Count: {itemCount}</label>
        <Slider
          value={[itemCount]}
          onValueChange={(value) => setItemCount(value[0])}
          min={1}
          max={10}
          step={1}
          className="bg-gray-800"
        />
      </div>
      <Button onClick={() => navigator.clipboard.writeText(cssCode)} className="bg-blue-600 text-white hover:bg-blue-700">
        Copy CSS
      </Button>
      <pre className={`bg-gray-900 p-4 rounded text-white text-${isMobile ? 'xs' : 'sm'} overflow-x-auto`}>
        {cssCode}
      </pre>
    </div>
  );
};

export default FlexboxGenerator;