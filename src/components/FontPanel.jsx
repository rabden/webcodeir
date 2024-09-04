import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

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
    <div className="w-full h-full p-6 overflow-y-auto bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Popular Google Fonts</h2>
      </div>
      <ul className="space-y-6">
        {fonts.map((font) => (
          <li key={font.name} className="p-6 rounded-lg bg-gray-800 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white" style={{ fontFamily: font.name }}>{font.name}</h3>
              <button
                onClick={() => toggleFont(font.name)}
                className="p-2 rounded hover:bg-gray-700 transition-colors"
              >
                {expandedFont === font.name ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
              </button>
            </div>
            <p className="text-gray-300 mb-4" style={{ fontFamily: font.name }}>{font.sample}</p>
            {expandedFont === font.name && (
              <div className="mt-4 space-y-4">
                {['link', 'import', 'font-family'].map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-gray-400">{type}:</span>
                    <button
                      onClick={() => copyToClipboard(
                        type === 'link' 
                          ? `<link href="https://fonts.googleapis.com/css?family=${font.name.replace(' ', '+')}" rel="stylesheet">`
                          : type === 'import'
                          ? `@import url('https://fonts.googleapis.com/css?family=${font.name.replace(' ', '+')}');`
                          : `font-family: '${font.name}', sans-serif;`,
                        font.name,
                        type
                      )}
                      className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center space-x-2"
                    >
                      {copiedStates[font.name + type] ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FontPanel;