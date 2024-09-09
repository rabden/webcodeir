import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const FlexboxGenerator = () => {
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');
  const [flexWrap, setFlexWrap] = useState('nowrap');
  const [gap, setGap] = useState(10);
  const [itemCount, setItemCount] = useState(3);
  const [customItemSizes, setCustomItemSizes] = useState(false);
  const [itemSizes, setItemSizes] = useState(Array(itemCount).fill('1'));

  const flexboxStyle = {
    display: 'flex',
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    gap: `${gap}px`,
    minHeight: '200px',
    backgroundColor: '#1e1e1e',
    padding: '10px',
    borderRadius: '8px',
  };

  const itemStyle = (size) => ({
    minWidth: '50px',
    minHeight: '50px',
    flex: size,
    backgroundColor: '#4299e1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    borderRadius: '4px',
    padding: '10px',
  });

  const cssCode = `
.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}

${customItemSizes ? itemSizes.map((size, index) => `
.item-${index + 1} {
  flex: ${size};
}`).join('\n') : ''}`;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-white">Flexbox Generator</h3>
      <div style={flexboxStyle} className="mb-4">
        {Array.from({ length: itemCount }, (_, i) => (
          <div key={i} style={itemStyle(customItemSizes ? itemSizes[i] : '1')}>
            Item {i + 1}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
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
        <Label className="text-sm font-medium text-white">Gap: {gap}px</Label>
        <Slider
          value={[gap]}
          onValueChange={(value) => setGap(value[0])}
          max={50}
          step={1}
          className="bg-gray-800"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-white">Item Count: {itemCount}</Label>
        <Slider
          value={[itemCount]}
          onValueChange={(value) => {
            setItemCount(value[0]);
            setItemSizes(prev => {
              const newSizes = [...prev];
              while (newSizes.length < value[0]) newSizes.push('1');
              return newSizes.slice(0, value[0]);
            });
          }}
          min={1}
          max={10}
          step={1}
          className="bg-gray-800"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="customSizes"
          checked={customItemSizes}
          onCheckedChange={setCustomItemSizes}
        />
        <Label htmlFor="customSizes" className="text-sm font-medium text-white">
          Custom Item Sizes
        </Label>
      </div>
      {customItemSizes && (
        <div className="grid grid-cols-5 gap-2">
          {itemSizes.map((size, index) => (
            <Input
              key={index}
              type="text"
              value={size}
              onChange={(e) => setItemSizes(prev => {
                const newSizes = [...prev];
                newSizes[index] = e.target.value;
                return newSizes;
              })}
              className="bg-gray-800 text-white border-gray-700"
              placeholder={`Item ${index + 1}`}
            />
          ))}
        </div>
      )}
      <Button onClick={() => navigator.clipboard.writeText(cssCode)} className="bg-blue-600 text-white hover:bg-blue-700">
        Copy CSS
      </Button>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto">
        {cssCode}
      </pre>
    </div>
  );
};

export default FlexboxGenerator;