import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const MediaQueryHelper = () => {
  const [queries, setQueries] = useState([
    { type: 'min-width', value: 768, unit: 'px', active: true }
  ]);
  const [orientation, setOrientation] = useState('');
  const [customFeatures, setCustomFeatures] = useState('');

  const addQuery = () => {
    setQueries([...queries, { type: 'min-width', value: 0, unit: 'px', active: true }]);
  };

  const updateQuery = (index, key, value) => {
    const updatedQueries = queries.map((q, i) => 
      i === index ? { ...q, [key]: value } : q
    );
    setQueries(updatedQueries);
  };

  const removeQuery = (index) => {
    setQueries(queries.filter((_, i) => i !== index));
  };

  const generateMediaQuery = () => {
    let query = '@media ';
    const conditions = queries
      .filter(q => q.active)
      .map(q => `(${q.type}: ${q.value}${q.unit})`)
      .join(' and ');
    
    if (conditions) query += conditions;
    if (orientation) query += (conditions ? ' and ' : '') + `(orientation: ${orientation})`;
    if (customFeatures.trim()) query += (conditions || orientation ? ' and ' : '') + customFeatures.trim();
    
    return query + ' {\n  /* Your styles here */\n}';
  };

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold text-white">Media Query Helper</h3>
      {queries.map((query, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Checkbox
            id={`query-${index}`}
            checked={query.active}
            onCheckedChange={(checked) => updateQuery(index, 'active', checked)}
            className="bg-gray-800 border-gray-600"
          />
          <Select value={query.type} onValueChange={(value) => updateQuery(index, 'type', value)}>
            <SelectTrigger className="w-32 bg-gray-700 text-white border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="min-width">min-width</SelectItem>
              <SelectItem value="max-width">max-width</SelectItem>
              <SelectItem value="min-height">min-height</SelectItem>
              <SelectItem value="max-height">max-height</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={query.value}
            onChange={(e) => updateQuery(index, 'value', e.target.value)}
            className="w-24 bg-gray-700 text-white border-gray-600"
          />
          <Select value={query.unit} onValueChange={(value) => updateQuery(index, 'unit', value)}>
            <SelectTrigger className="w-20 bg-gray-700 text-white border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="px">px</SelectItem>
              <SelectItem value="em">em</SelectItem>
              <SelectItem value="rem">rem</SelectItem>
              <SelectItem value="%">%</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => removeQuery(index)} variant="destructive" size="sm">Remove</Button>
        </div>
      ))}
      <Button onClick={addQuery} variant="outline" size="sm">Add Query</Button>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-white">Orientation</Label>
        <Select value={orientation} onValueChange={setOrientation}>
          <SelectTrigger className="bg-gray-700 text-white border-gray-600">
            <SelectValue placeholder="Select Orientation" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="">None</SelectItem>
            <SelectItem value="portrait">Portrait</SelectItem>
            <SelectItem value="landscape">Landscape</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-white">Custom Features</Label>
        <Input
          value={customFeatures}
          onChange={(e) => setCustomFeatures(e.target.value)}
          placeholder="e.g., (color), (hover: hover)"
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <Button onClick={() => navigator.clipboard.writeText(generateMediaQuery())} className="w-full bg-blue-600 text-white hover:bg-blue-700">
        Copy Media Query
      </Button>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto whitespace-pre-wrap">
        {generateMediaQuery()}
      </pre>
    </div>
  );
};

export default MediaQueryHelper;