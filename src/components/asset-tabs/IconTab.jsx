import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import * as Icons from 'lucide-react';

const IconTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      searchIcons();
    }
  }, [searchQuery]);

  const searchIcons = () => {
    setLoading(true);
    setError(null);
    try {
      const filteredIcons = Object.keys(Icons)
        .filter(iconName => iconName.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 30);
      setIcons(filteredIcons);
    } catch (error) {
      console.error('Error searching icons:', error);
      setError('Failed to search icons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyIconTag = (iconName) => {
    const iconTag = `<${iconName} />`;
    navigator.clipboard.writeText(iconTag);
    alert('Icon tag copied to clipboard!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Lucide icons..."
          className="flex-grow px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchIcons}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-6 gap-4">
        {icons.map((iconName) => {
          const IconComponent = Icons[iconName];
          return (
            <div key={iconName} className="flex flex-col items-center">
              <IconComponent className="text-3xl text-white mb-2" />
              <span className="text-xs text-gray-300 mb-1 truncate w-full text-center">{iconName}</span>
              <button
                onClick={() => copyIconTag(iconName)}
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                Copy Tag
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconTab;