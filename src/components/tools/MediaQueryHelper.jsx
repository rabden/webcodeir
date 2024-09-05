import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const MediaQueryHelper = () => {
  const [minWidth, setMinWidth] = useState(768);
  const [maxWidth, setMaxWidth] = useState(1024);
  const [orientation, setOrientation] = useState('');
  const [useMinWidth, setUseMinWidth] = useState(true);
  const [useMaxWidth, setUseMaxWidth] = useState(true);
  const [useOrientation, setUseOrientation] = useState(false);
  const [customFeatures, setCustomFeatures] = useState('');

  const generateMediaQuery = () => {
    let query = '@media ';
    const conditions = [];

    if (useMinWidth && minWidth > 0) conditions.push(`(min-width: ${minWidth}px)`);
    if (useMaxWidth && maxWidth > 0) conditions.push(`(max-width: ${maxWidth}px)`);
    if (useOrientation && orientation) conditions.push(`(orientation: ${orientation})`);
    if (customFeatures.trim()) conditions.push(customFeatures.trim());

    query += conditions.join(' and ');
    return query + ' {\n  /* Your styles here */\n}';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-white">Media Query Helper</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useMinWidth"
            checked={useMinWidth}
            onCheckedChange={setUseMinWidth}
          />
          <label htmlFor="useMinWidth" className="text-sm font-medium text-white">
            Use Min Width
          </label>
        </div>
        {useMinWidth && (
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={minWidth}
              onChange={(e) => setMinWidth(Math.max(0, parseInt(e.target.value)))}
              className="w-24"
            />
            <span className="text-white">px</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useMaxWidth"
            checked={useMaxWidth}
            onCheckedChange={setUseMaxWidth}
          />
          <label htmlFor="useMaxWidth" className="text-sm font-medium text-white">
            Use Max Width
          </label>
        </div>
        {useMaxWidth && (
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={maxWidth}
              onChange={(e) => setMaxWidth(Math.max(0, parseInt(e.target.value)))}
              className="w-24"
            />
            <span className="text-white">px</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useOrientation"
            checked={useOrientation}
            onCheckedChange={setUseOrientation}
          />
          <label htmlFor="useOrientation" className="text-sm font-medium text-white">
            Use Orientation
          </label>
        </div>
        {useOrientation && (
          <Select value={orientation} onValueChange={setOrientation}>
            <SelectTrigger>
              <SelectValue placeholder="Select Orientation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Custom Features</label>
          <Input
            value={customFeatures}
            onChange={(e) => setCustomFeatures(e.target.value)}
            placeholder="e.g., (color), (hover: hover)"
          />
        </div>
      </div>
      <Button onClick={() => navigator.clipboard.writeText(generateMediaQuery())}>
        Copy Media Query
      </Button>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto">
        {generateMediaQuery()}
      </pre>
    </div>
  );
};

export default MediaQueryHelper;