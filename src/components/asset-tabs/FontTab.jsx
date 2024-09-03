import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const FontTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      searchFonts();
    }
  }, [searchQuery]);

  const searchFonts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=YOUR_GOOGLE_FONTS_API_KEY&sort=popularity&query=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to fetch fonts');
      }
      const data = await response.json();
      setFonts(data.items || []);
    } catch (error) {
      console.error('Error fetching fonts:', error);
      setError('Failed to load fonts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyFontImport = (font) => {
    const importStatement = `@import url('https://fonts.googleapis.com/css2?family=${font.family.replace(' ', '+')}:wght@400;700&display=swap');`;
    navigator.clipboard.writeText(importStatement);
    alert('Font import copied to clipboard!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Google Fonts..."
          className="flex-grow px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchFonts}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        {fonts.map((font) => (
          <div key={font.family} className="bg-gray-800 p-4 rounded">
            <h4 className="text-lg font-semibold text-white mb-2">{font.family}</h4>
            <p className="text-gray-300" style={{ fontFamily: font.family }}>
              The quick brown fox jumps over the lazy dog.
            </p>
            <button
              onClick={() => copyFontImport(font)}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Copy Import
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontTab;