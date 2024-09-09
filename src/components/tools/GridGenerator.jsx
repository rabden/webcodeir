import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const GridGenerator = () => {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(10);
  const [templateColumns, setTemplateColumns] = useState('1fr 1fr 1fr');
  const [templateRows, setTemplateRows] = useState('1fr 1fr 1fr');
  const [customSizes, setCustomSizes] = useState(false);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: templateColumns,
    gridTemplateRows: templateRows,
    gap: `${gap}px`,
    minHeight: '200px',
    backgroundColor: '#1e1e1e',
    padding: '10px',
    borderRadius: '8px',
  };

  const itemStyle = {
    backgroundColor: '#4299e1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    borderRadius: '4px',
    padding: '10px',
  };

  const cssCode = `
.grid-container {
  display: grid;
  grid-template-columns: ${templateColumns};
  grid-template-rows: ${templateRows};
  gap: ${gap}px;
}`;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-white">Grid Generator</h3>
      <div style={gridStyle}>
        {Array.from({ length: columns * rows }, (_, i) => (
          <div key={i} style={itemStyle}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white">Columns: {columns}</Label>
          <Slider
            value={[columns]}
            onValueChange={(value) => {
              setColumns(value[0]);
              if (!customSizes) {
                setTemplateColumns('1fr '.repeat(value[0]).trim());
              }
            }}
            min={1}
            max={12}
            step={1}
            className="bg-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white">Rows: {rows}</Label>
          <Slider
            value={[rows]}
            onValueChange={(value) => {
              setRows(value[0]);
              if (!customSizes) {
                setTemplateRows('1fr '.repeat(value[0]).trim());
              }
            }}
            min={1}
            max={12}
            step={1}
            className="bg-gray-800"
          />
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
        <div className="flex items-center space-x-2">
          <Checkbox
            id="customSizes"
            checked={customSizes}
            onCheckedChange={setCustomSizes}
          />
          <Label htmlFor="customSizes" className="text-sm font-medium text-white">
            Custom Grid Sizes
          </Label>
        </div>
        {customSizes && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">Grid Template Columns</Label>
              <Input
                value={templateColumns}
                onChange={(e) => setTemplateColumns(e.target.value)}
                placeholder="e.g., 1fr 2fr 1fr"
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">Grid Template Rows</Label>
              <Input
                value={templateRows}
                onChange={(e) => setTemplateRows(e.target.value)}
                placeholder="e.g., auto 1fr 2fr"
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
          </>
        )}
      </div>
      <Button onClick={() => navigator.clipboard.writeText(cssCode)} className="bg-blue-600 text-white hover:bg-blue-700">
        Copy CSS
      </Button>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto">
        {cssCode}
      </pre>
    </div>
  );
};

export default GridGenerator;