import React, { useState } from 'react';
import { ChevronDown, Copy } from 'lucide-react';

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

  const toggleFont = (fontName) => {
    setExpandedFont(expandedFont === fontName ? null : fontName);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You might want to add a toast notification here
  };

  return (
    <div className="bg-[#1e1e1e] text-white p-4">
      <h2 className="text-xl mb-4">Some popular fonts from Google Fonts</h2>
      {fonts.map((font) => (
        <div key={font.name} className="mb-4 border-b border-gray-700 pb-4">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleFont(font.name)}>
            <h3 className="text-lg font-bold" style={{ fontFamily: font.name }}>{font.name}</h3>
            <ChevronDown className={`w-5 h-5 transition-transform ${expandedFont === font.name ? 'transform rotate-180' : ''}`} />
          </div>
          <p className="my-2" style={{ fontFamily: font.name }}>{font.sample}</p>
          {expandedFont === font.name && (
            <div className="mt-2 space-y-2">
              <button className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white" onClick={() => copyToClipboard(`<link href="https://fonts.googleapis.com/css?family=${font.name.replace(' ', '+')}" rel="stylesheet">`)}>
                <Copy className="w-4 h-4" />
                <span>Copy &lt;link&gt;</span>
              </button>
              <button className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white" onClick={() => copyToClipboard(`@import url('https://fonts.googleapis.com/css?family=${font.name.replace(' ', '+')}');`)}>
                <Copy className="w-4 h-4" />
                <span>Copy @import</span>
              </button>
              <button className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white" onClick={() => copyToClipboard(`font-family: '${font.name}', sans-serif;`)}>
                <Copy className="w-4 h-4" />
                <span>Copy font-family</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FontPanel;