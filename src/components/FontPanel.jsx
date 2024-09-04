import React, { useState, useEffect } from 'react';
import { X, Search, Copy, Check } from 'lucide-react';

const fonts = [
  { name: 'Lato', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Open Sans', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Roboto', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Merriweather', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Montserrat', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Raleway', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Lora', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Poppins', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Playfair Display', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Source Sans Pro', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Nunito', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Oswald', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Quicksand', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Fira Sans', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Cabin', sample: 'The quick brown fox jumps over the lazy dog' },
];

const FontPanel = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  const [filteredFonts, setFilteredFonts] = useState(fonts);

  useEffect(() => {
    const results = fonts.filter(font =>
      font.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFonts(results);
  }, [searchTerm]);

  const copyToClipboard = (text, fontName, type) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [fontName + type]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [fontName + type]: false });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl h-full max-h-[90vh] bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
        <div className="p-6 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-3xl font-bold text-white">Font Library</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="p-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search fonts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFonts.map((font) => (
            <div key={font.name} className="bg-gray-700 rounded-lg p-6 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: font.name }}>{font.name}</h3>
              <p className="text-gray-300 mb-4" style={{ fontFamily: font.name }}>{font.sample}</p>
              <div className="mt-auto space-y-2">
                {['link', 'import', 'font-family'].map((type) => (
                  <button
                    key={type}
                    onClick={() => copyToClipboard(
                      type === 'link' 
                        ? `<link href="https://fonts.googleapis.com/css?family=${font.name.replace(' ', '+')}" rel="stylesheet">`
                        : type === 'import'
                        ? `@import url('https://fonts.googleapis.com/css?family=${font.name.replace(' ', '+')}');`
                        : `font-family: '${font.name}', sans-serif;`,
                      font.name,
                      type
                    )}
                    className="w-full px-3 py-2 rounded bg-gray-600 hover:bg-gray-500 text-sm transition-colors flex items-center justify-center space-x-2"
                  >
                    {copiedStates[font.name + type] ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-white" />
                        <span className="text-white">Copy {type}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FontPanel;