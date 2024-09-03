import React, { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const FontTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(false);

  const popularFonts = [
    'Lato', 'Open Sans', 'Roboto', 'Merriweather', 'Montserrat', 'Raleway',
    'Oswald', 'Poppins', 'Playfair Display', 'Nunito', 'Source Sans Pro',
    'Ubuntu', 'Titillium Web', 'Rubik', 'Work Sans', 'Fira Sans', 'Noto Sans'
  ];

  const searchFonts = () => {
    setLoading(true);
    setTimeout(() => {
      const filteredFonts = popularFonts.filter(font => 
        font.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFonts(filteredFonts);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    setFonts(popularFonts);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white">Popular fonts from <span className="text-blue-400">Google Fonts</span>.</h2>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search fonts..."
          className="flex-grow px-4 py-2 rounded bg-[#3a3a3a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchFonts}
          className="px-4 py-2 bg-[#3a3a3a] text-white rounded hover:bg-[#4a4a4a] transition-colors"
        >
          Search
        </button>
      </div>
      {loading ? (
        <p className="text-white">Loading fonts...</p>
      ) : (
        <div className="space-y-2">
          {fonts.map((font) => (
            <div key={font} className="bg-[#2d2d2d] p-4 rounded">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: font }}>{font}</h3>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-300 mt-2" style={{ fontFamily: font }}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          ))}
        </div>
      )}
      {!loading && fonts.length === 0 && (
        <p className="text-white text-center">No fonts found. Try a different search query.</p>
      )}
    </div>
  );
};

export default FontTab;