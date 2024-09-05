import React, { useState } from 'react';

const GridGenerator = () => {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(10);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gap: `${gap}px`,
    height: '200px',
    backgroundColor: '#2d3748',
  };

  const itemStyle = {
    backgroundColor: '#4299e1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  };

  const cssCode = `
.grid-container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${gap}px;
}`;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Grid Generator</h3>
      <div style={gridStyle} className="rounded">
        {Array.from({ length: columns * rows }, (_, i) => (
          <div key={i} style={itemStyle}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <label className="text-white mr-2">Columns:</label>
          <input
            type="number"
            value={columns}
            onChange={(e) => setColumns(Math.max(1, parseInt(e.target.value)))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="flex items-center">
          <label className="text-white mr-2">Rows:</label>
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Math.max(1, parseInt(e.target.value)))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="flex items-center">
          <label className="text-white mr-2">Gap (px):</label>
          <input
            type="number"
            value={gap}
            onChange={(e) => setGap(Math.max(0, parseInt(e.target.value)))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
      </div>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto">
        {cssCode}
      </pre>
    </div>
  );
};

export default GridGenerator;