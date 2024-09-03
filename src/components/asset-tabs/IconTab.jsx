import React, { useState } from 'react';
import { Search } from 'lucide-react';

const IconTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [icons, setIcons] = useState([]);

  const searchIcons = async () => {
    try {
      const response = await fetch(`https://api.iconify.design/search?query=${searchQuery}&limit=30`);
      const data = await response.json();
      setIcons(data.icons);
    } catch (error) {
      console.error('Error fetching icons:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search icons..."
          className="flex-grow px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchIcons}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {icons.map((icon) => (
          <div key={icon.name} className="flex flex-col items-center">
            <img src={`https://api.iconify.design/${icon.prefix}:${icon.name}.svg`} alt={icon.name} className="w-12 h-12" />
            <span className="text-xs text-gray-300 mt-1 truncate w-full text-center">{icon.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconTab;