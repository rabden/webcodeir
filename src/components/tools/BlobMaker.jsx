import React, { useState, useEffect } from 'react';

const BlobMaker = () => {
  const [points, setPoints] = useState(5);
  const [randomness, setRandomness] = useState(5);
  const [size, setSize] = useState(200);
  const [color, setColor] = useState('#FF0066');
  const [path, setPath] = useState('');

  useEffect(() => {
    generateBlob();
  }, [points, randomness, size]);

  const generateBlob = () => {
    const angle = 360 / points;
    const coords = [];
    for (let i = 0; i < points; i++) {
      const thisAngle = angle * i;
      const randomValue = 1 - (Math.random() * randomness) / 10;
      const x = size / 2 + (size / 2) * randomValue * Math.cos((Math.PI * thisAngle) / 180);
      const y = size / 2 + (size / 2) * randomValue * Math.sin((Math.PI * thisAngle) / 180);
      coords.push([x, y]);
    }
    const blobPath = `M ${coords[0][0]},${coords[0][1]} ${coords
      .map((coord, index) => {
        const nextCoord = coords[(index + 1) % points];
        const x = (coord[0] + nextCoord[0]) / 2;
        const y = (coord[1] + nextCoord[1]) / 2;
        return `Q ${coord[0]},${coord[1]} ${x},${y}`;
      })
      .join(' ')} Z`;
    setPath(blobPath);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <path d={path} fill={color} />
        </svg>
      </div>
      <div className="flex space-x-4">
        <input
          type="range"
          min="3"
          max="20"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value))}
          className="w-full"
        />
        <input
          type="range"
          min="1"
          max="10"
          value={randomness}
          onChange={(e) => setRandomness(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="flex space-x-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12"
        />
        <button
          onClick={generateBlob}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Regenerate
        </button>
      </div>
      <textarea
        value={path}
        readOnly
        className="w-full p-2 rounded bg-gray-700 text-white"
        rows="3"
      />
    </div>
  );
};

export default BlobMaker;