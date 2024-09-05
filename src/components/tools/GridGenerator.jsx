import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const GridGenerator = () => {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(10);
  const [templateColumns, setTemplateColumns] = useState('1fr 1fr 1fr');
  const [templateRows, setTemplateRows] = useState('1fr 1fr 1fr');

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: templateColumns,
    gridTemplateRows: templateRows,
    gap: `${gap}px`,
    minHeight: '200px',
    backgroundColor: '#2d3748',
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
          <label className="text-sm font-medium text-white">Columns: {columns}</label>
          <Slider
            value={[columns]}
            onValueChange={(value) => {
              setColumns(value[0]);
              setTemplateColumns('1fr '.repeat(value[0]).trim());
            }}
            min={1}
            max={12}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Rows: {rows}</label>
          <Slider
            value={[rows]}
            onValueChange={(value) => {
              setRows(value[0]);
              setTemplateRows('1fr '.repeat(value[0]).trim());
            }}
            min={1}
            max={12}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Gap: {gap}px</label>
          <Slider
            value={[gap]}
            onValueChange={(value) => setGap(value[0])}
            max={50}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Grid Template Columns</label>
          <Input
            value={templateColumns}
            onChange={(e) => setTemplateColumns(e.target.value)}
            placeholder="e.g., 1fr 2fr 1fr"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Grid Template Rows</label>
          <Input
            value={templateRows}
            onChange={(e) => setTemplateRows(e.target.value)}
            placeholder="e.g., auto 1fr 2fr"
          />
        </div>
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

export default GridGenerator;