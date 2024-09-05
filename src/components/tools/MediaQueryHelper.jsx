import React, { useState } from 'react';

const MediaQueryHelper = () => {
  const [minWidth, setMinWidth] = useState(768);
  const [maxWidth, setMaxWidth] = useState(1024);
  const [orientation, setOrientation] = useState('');

  const generateMediaQuery = () => {
    let query = '@media ';
    const conditions = [];

    if (minWidth > 0) conditions.push(`(min-width: ${minWidth}px)`);
    if (maxWidth > 0) conditions.push(`(max-width: ${maxWidth}px)`);
    if (orientation) conditions.push(`(orientation: ${orientation})`);

    query += conditions.join(' and ');
    return query + ' {\n  /* Your styles here */\n}';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Media Query Helper</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <label className="text-white mr-2">Min Width (px):</label>
          <input
            type="number"
            value={minWidth}
            onChange={(e) => setMinWidth(Math.max(0, parseInt(e.target.value)))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="flex items-center">
          <label className="text-white mr-2">Max Width (px):</label>
          <input
            type="number"
            value={maxWidth}
            onChange={(e) => setMaxWidth(Math.max(0, parseInt(e.target.value)))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <select
          value={orientation}
          onChange={(e) => setOrientation(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="">No Orientation</option>
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>
      <pre className="bg-gray-900 p-4 rounded text-white text-sm overflow-x-auto">
        {generateMediaQuery()}
      </pre>
    </div>
  );
};

export default MediaQueryHelper;