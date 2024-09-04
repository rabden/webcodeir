import React, { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';

const fonts = [
  { name: 'Lato', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Open Sans', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Roboto', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Merriweather', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Montserrat', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Raleway', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Lora', sample: 'The quick brown fox jumps over the lazy dog' },
];

const FontPanel = () => {
  const [expandedFont, setExpandedFont] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});

  const toggleFont = (fontName) => {
    setExpandedFont(expandedFont === fontName ? null : fontName);
  };

  const copyToClipboard = (text, fontName, type) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [fontName + type]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [fontName + type]: false });
    }, 2000);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Popular Google Fonts</h2>
      {fonts.map((font) => (
        <div key={font.name} className="mb-6 border-b border-gray-700 pb-6 last:border-b-0 last:pb-0">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => toggleFont(font.name)}
          >
            <h3 className="text-xl font-bold" style={{ fontFamily: font.name }}>{font.name}</h3>
            <ChevronDown className={`w-5 h-5 transition-transform ${expandedFont === font.name ? 'transform rotate-180' : ''}`} />
          </div>
          <p className="my-3 text-gray-300" style={{ fontFamily: font.name }}>{font.sample}</p>
          {expandedFont === font.name && (
            <div className="mt-4 space-y-3">
              {['link', 'import', 'font-family'].map((type) => (
                <button
                  key={type}
                  className="flex items-center space-x-2 text-sm bg-gray-800 hover:bg-gray-700 transition-colors px-3 py-2 rounded-md w-full"
                  onClick={() => copyToClipboard(
                    type === 'link' 
                      ? `<link href="https://fonts.googleapis.com/css?family=${font.name.replace(' ', '+')}" rel="stylesheet">`
                      : type === 'import'
                      ? `@import url('https://fonts.googleapis.com/css?family=${font.name.replace(' ', '+')}');`
                      : `font-family: '${font.name}', sans-serif;`,
                    font.name,
                    type
                  )}
                >
                  {copiedStates[font.name + type] ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copiedStates[font.name + type] ? 'Copied!' : `Copy ${type}`}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FontPanel;